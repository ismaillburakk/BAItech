/** Script'ler için ortak Firebase Admin başlatıcısı (.env --env-file ile yüklenir). */
import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";

export function fail(message) {
  console.error(`\n✗ ${message}`);
  process.exit(1);
}

export function initAdminApp() {
  const base64 = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64;
  if (!base64) fail("FIREBASE_ADMIN_SERVICE_ACCOUNT_BASE64 bulunamadı (.env).");
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(Buffer.from(base64, "base64").toString("utf8"));
  } catch {
    fail("Service account çözümlenemedi — geçerli base64 kodlu JSON olmalı.");
  }
  return getApps()[0] ?? initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
}
