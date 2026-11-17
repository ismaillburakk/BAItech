/**
 * Firebase Admin SDK — YALNIZCA server tarafı (API route / server component).
 *
 * `server-only` import'u bu modülün yanlışlıkla bir client component'e
 * girmesini derleme hatasıyla engeller; service account anahtarı asla
 * tarayıcıya sızamaz.
 *
 * Kimlik: FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 (service account JSON'unun
 * base64'ü). Bu modülü kullanan her route segment'i `runtime = "nodejs"`.
 */
import "server-only";

import { cert, getApps, initializeApp, type App, type ServiceAccount } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function loadServiceAccount(): ServiceAccount {
  const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
  if (!base64) {
    throw new Error(
      "FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 tanımlı değil — .env dosyasını / Netlify ortam değişkenlerini kontrol edin.",
    );
  }
  try {
    return JSON.parse(Buffer.from(base64, "base64").toString("utf8")) as ServiceAccount;
  } catch {
    throw new Error(
      "FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 çözümlenemedi — değer, service account JSON'unun geçerli base64 kodu olmalı.",
    );
  }
}

const adminApp: App =
  getApps().length > 0 ? getApps()[0] : initializeApp({ credential: cert(loadServiceAccount()) });

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);
