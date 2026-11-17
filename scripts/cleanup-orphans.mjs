#!/usr/bin/env node
/**
 * Öksüz görsel temizliği — Cloudinary'deki bai/ klasöründe olup hiçbir
 * Firestore dokümanında referansı olmayan görselleri bulur.
 *
 *   npm run cleanup-orphans            → yalnız listeler (dry-run)
 *   npm run cleanup-orphans -- --apply → listelenenleri siler
 *   (--no-grace: son 1 saatte yüklenenleri de dahil et — panelde açık düzenleme yokken)
 *
 * Panel normalde kaydet/vazgeç/sil akışlarında öksüz bırakmaz; bu script
 * yarıda kesilen yüklemeler (sekme kapatma, ağ kopması) için bakım aracıdır.
 * Son 1 saatte yüklenenler, panelde süren bir düzenlemeye ait olabileceği
 * için dokunulmaz.
 */
import process from "node:process";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "./_firebase.mjs";

const APPLY = process.argv.includes("--apply");
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const AUTH = "Basic " + Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString("base64");
const API = `https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload`;
const GRACE_MS = process.argv.includes("--no-grace") ? 0 : 60 * 60 * 1000;

const db = getFirestore(initAdminApp());
const referenced = new Set();
function collect(value) {
  if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object") {
    if (typeof value.public_id === "string") referenced.add(value.public_id);
    Object.values(value).forEach(collect);
  }
}
for (const col of ["projects", "services", "references", "faq", "hero", "teamMembers", "pages", "siteSettings"]) {
  const snap = await db.collection(col).get();
  snap.forEach((d) => collect(d.data()));
}

const assets = [];
let cursor;
do {
  const url = `${API}?prefix=bai/&max_results=500${cursor ? `&next_cursor=${cursor}` : ""}`;
  const res = await fetch(url, { headers: { Authorization: AUTH } });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  assets.push(...data.resources);
  cursor = data.next_cursor;
} while (cursor);

const now = Date.now();
const orphans = assets.filter((a) => !referenced.has(a.public_id) && now - new Date(a.created_at).getTime() > GRACE_MS);
const recent = assets.filter((a) => !referenced.has(a.public_id) && now - new Date(a.created_at).getTime() <= GRACE_MS);
console.log(`Cloudinary bai/: ${assets.length} görsel · Firestore referansı: ${referenced.size} · öksüz: ${orphans.length}${recent.length ? ` (+${recent.length} son 1 saatte yüklenen, atlandı)` : ""}`);
orphans.forEach((a) => console.log(`  - ${a.public_id} (${a.created_at})`));

if (APPLY && orphans.length) {
  for (let i = 0; i < orphans.length; i += 100) {
    const qs = orphans.slice(i, i + 100).map((a) => `public_ids[]=${encodeURIComponent(a.public_id)}`).join("&");
    const res = await fetch(`${API}?${qs}&invalidate=true`, { method: "DELETE", headers: { Authorization: AUTH } });
    console.log(res.ok ? `✓ ${Math.min(100, orphans.length - i)} görsel silindi` : `✗ silme hatası: ${await res.text()}`);
  }
} else if (orphans.length) {
  console.log("Silmek için: npm run cleanup-orphans -- --apply");
}
process.exit(0);
