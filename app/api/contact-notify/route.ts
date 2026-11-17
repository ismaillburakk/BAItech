/**
 * İletişim formu mail tetikleyicisi — PUBLIC uç nokta, istismara kapalı.
 *
 * Form, Firestore'a BAŞARIYLA yazdıktan sonra buraya yalnızca doküman
 * ID'sini bildirir. Route mail içeriğini istekten DEĞİL Firestore'daki
 * gerçek kayıttan okur:
 *   1) Kayıt var olmalı, 2) 10 dakikadan taze olmalı,
 *   3) Daha önce bildirilmemiş olmalı (notifiedAt kilidi).
 * Yanıt daima sade `{ ok: true }` — iç durum sızdırılmaz.
 */
import { FieldValue, type Transaction } from "firebase-admin/firestore";
import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getSiteSettings } from "@/lib/db/public";
import { sendContactEmails } from "@/lib/email";
import { COLLECTIONS, type FirestoreDoc, type Submission } from "@/types";

export const runtime = "nodejs";

const MAX_AGE_MS = 10 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!process.env.RESEND_API_KEY?.trim()) {
    return NextResponse.json({ ok: true, emailSkipped: true });
  }

  let id: unknown;
  try {
    ({ id } = (await request.json()) as { id?: unknown });
  } catch {
    return NextResponse.json({ ok: true });
  }
  if (typeof id !== "string" || id.length === 0 || id.length > 128) {
    return NextResponse.json({ ok: true });
  }

  try {
    const docRef = adminDb.collection(COLLECTIONS.submissions).doc(id);
    // Kilit transaction içinde: eşzamanlı iki istek aynı kaydı iki kez mailleyemez
    const data = await adminDb.runTransaction(async (tx: Transaction) => {
      const snapshot = await tx.get(docRef);
      if (!snapshot.exists) return null;
      const value = snapshot.data() as FirestoreDoc<Submission> & { notifyLock?: unknown };
      if (value.notifiedAt || value.notifyLock) return null;
      const createdMs = value.createdAt ? value.createdAt.seconds * 1000 : 0;
      if (Date.now() - createdMs > MAX_AGE_MS) return null;
      tx.update(docRef, { notifyLock: FieldValue.serverTimestamp() });
      return value;
    });
    if (!data) return NextResponse.json({ ok: true });

    const settings = await getSiteSettings();
    const result = await sendContactEmails(
      {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        topic: typeof data.topic === "string" ? data.topic : undefined,
        message: data.message,
        createdAtText: new Intl.DateTimeFormat("tr-TR", {
          dateStyle: "long",
          timeStyle: "short",
          timeZone: "Europe/Istanbul",
        }).format(new Date(data.createdAt.seconds * 1000)),
      },
      settings,
    );

    if (result.teamSent || result.customerSent) {
      await docRef.update({ notifiedAt: FieldValue.serverTimestamp(), notifyLock: FieldValue.delete() });
    } else {
      // Gönderim başarısız — kilidi kaldır (10 dk içinde yeniden denenebilir)
      await docRef.update({ notifyLock: FieldValue.delete() });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact-notify] beklenmeyen hata:", error);
    return NextResponse.json({ ok: true });
  }
}
