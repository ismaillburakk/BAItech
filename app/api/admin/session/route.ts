/**
 * Admin oturum API'si.
 *
 * POST   → client'ın Firebase Auth girişinden aldığı ID token'ı Admin SDK ile
 *          doğrular; `admin: true` custom claim'i yoksa REDDEDER; varsa uzun
 *          ömürlü httpOnly session cookie üretir.
 * DELETE → refresh token'ları iptal eder + cookie'yi siler.
 */
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { ADMIN_CLAIM, SESSION_COOKIE_NAME, SESSION_DURATION_MS } from "@/lib/constants";

export const runtime = "nodejs";

/** Girişten sonra token'ın en fazla ne kadar "bayat" olabileceği (sn) */
const MAX_AUTH_AGE_SECONDS = 5 * 60;

export async function POST(request: NextRequest) {
  let idToken: unknown;
  try {
    ({ idToken } = (await request.json()) as { idToken?: unknown });
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  if (typeof idToken !== "string" || idToken.length === 0) {
    return NextResponse.json({ error: "idToken alanı zorunludur." }, { status: 400 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);

    // Yetki: yalnızca admin custom claim'i taşıyan hesaplar
    if (decoded[ADMIN_CLAIM] !== true) {
      return NextResponse.json(
        { error: "Bu hesabın yönetim paneli yetkisi yok." },
        { status: 403 },
      );
    }

    if (Date.now() / 1000 - decoded.auth_time > MAX_AUTH_AGE_SECONDS) {
      return NextResponse.json(
        { error: "Giriş isteği zaman aşımına uğradı. Lütfen yeniden giriş yapın." },
        { status: 401 },
      );
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_MS / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Kimlik doğrulanamadı. Lütfen yeniden giriş yapın." }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionCookie) {
    try {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    } catch {
      // Cookie zaten geçersiz — sessizce temizle
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
