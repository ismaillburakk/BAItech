#!/usr/bin/env node
/**
 * Admin custom claim atama — BAI Teknoloji
 * ==========================================
 * Panel ve Firestore kuralları yetkiyi `admin: true` custom claim'ine
 * bağlar; Firebase Auth'ta kayıtlı olmak TEK BAŞINA yetki vermez.
 *
 * Kullanım (proje kökünden):
 *   npm run set-admin-claim                       → .env'deki ADMIN_EMAIL
 *   npm run set-admin-claim -- kisi@ornek.com     → belirtilen hesap
 *   npm run set-admin-claim -- kisi@ornek.com --revoke   → yetkiyi kaldır
 *
 * Not: Claim değişikliği kullanıcının bir sonraki girişinde (yeni ID token)
 * etkin olur; --revoke ayrıca açık oturumları da sonlandırır.
 */
import process from "node:process";
import { getAuth } from "firebase-admin/auth";
import { fail, initAdminApp } from "./_firebase.mjs";

const args = process.argv.slice(2);
const revoke = args.includes("--revoke");
const email = (args.find((a) => !a.startsWith("--")) ?? process.env.ADMIN_EMAIL ?? "").trim();
if (!email) fail("E-posta belirtilmedi ve ADMIN_EMAIL boş.");

const auth = getAuth(initAdminApp());

let user;
try {
  user = await auth.getUserByEmail(email);
} catch {
  fail(`"${email}" Firebase Auth'ta bulunamadı. Önce Firebase Console > Authentication'dan kullanıcıyı oluşturun.`);
}

const claims = { ...(user.customClaims ?? {}) };
if (revoke) {
  delete claims.admin;
  await auth.setCustomUserClaims(user.uid, claims);
  await auth.revokeRefreshTokens(user.uid);
  console.log(`✓ Admin yetkisi kaldırıldı ve oturumlar sonlandırıldı: ${email}`);
} else {
  claims.admin = true;
  await auth.setCustomUserClaims(user.uid, claims);
  console.log(`✓ admin: true claim'i atandı: ${email} (uid: ${user.uid})`);
}
