/**
 * Admin oturum sabitleri.
 *
 * Bu dosya firebase-admin IMPORT ETMEZ — hem server modülleri
 * (lib/admin-session.ts, API route) hem de proxy.ts tarafından
 * güvenle kullanılabilir.
 */

/** httpOnly admin oturum çerezinin adı */
export const SESSION_COOKIE_NAME = "admin_session";

/** Oturum süresi: 5 gün (Firebase session cookie üst sınırı 14 gündür) */
export const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;

/** Admin yetkisinin taşındığı Firebase Auth custom claim adı */
export const ADMIN_CLAIM = "admin";
