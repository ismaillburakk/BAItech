/**
 * Admin oturumu server-side doğrulama yardımcıları.
 * YALNIZCA server tarafında kullanılır (server-only, firebase-admin'e bağlı).
 */
import "server-only";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { ADMIN_CLAIM, SESSION_COOKIE_NAME } from "@/lib/constants";

export interface AdminSession {
  uid: string;
  email: string | null;
}

/**
 * Geçerli admin oturumunu doğrular; geçersiz/eksik oturumda null döner.
 *
 * - verifySessionCookie(..., true): imza + süre + iptal (revoked) kontrolü
 * - `admin: true` custom claim'i ŞART: Auth'ta kayıtlı olmak tek başına
 *   yetki vermez ("Auth'taki herkes admin" açığı kapalı).
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (decoded[ADMIN_CLAIM] !== true) return null;
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}
