#!/usr/bin/env node
/**
 * Resmi profiller — Kasım 2026
 *  1. siteSettings/main › seo.officialProfiles: alan hiç yoksa altı resmi adres birlikte yazılır;
 *     varsa eksik olanlar sona eklenir (panelde girilenler korunur).
 *  2. siteSettings/main › socials: LinkedIn ve Instagram yoksa eklenir (footer'da görünür).
 *
 * İdempotent.
 *   node --env-file=.env scripts/migrations/2026-11-resmi-profiller.mjs --dry-run
 *   node --env-file=.env scripts/migrations/2026-11-resmi-profiller.mjs
 */
import process from "node:process";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../_firebase.mjs";

const DRY = process.argv.includes("--dry-run");
const db = getFirestore(initAdminApp());

const LINKEDIN = "https://www.linkedin.com/company/bai-teknoloji/";
const INSTAGRAM = "https://www.instagram.com/baitechnology/";
// types/index.ts › DEFAULT_OFFICIAL_PROFILES ile aynı
const OFFICIAL_PROFILES = [
  "https://apps.apple.com/tr/developer/bai-teknoloji-sanayi-ve-ticaret-ltd-%C5%9Fti/id1893507166",
  "https://play.google.com/store/apps/dev?id=8007462759594152372",
  "https://bukira.com.tr",
  LINKEDIN,
  INSTAGRAM,
  "https://www.google.com/search?kgmid=/g/11zc_m6755",
];

const ref = db.collection("siteSettings").doc("main");
const snap = await ref.get();
if (!snap.exists) {
  console.log("siteSettings/main yok — önce seed çalıştırılmalı.");
  process.exit(1);
}
const data = snap.data();
const upd = {};

const current = data.seo?.officialProfiles;
const profiles = Array.isArray(current) ? [...current, ...OFFICIAL_PROFILES.filter((u) => !current.includes(u))] : OFFICIAL_PROFILES;
if (JSON.stringify(profiles) !== JSON.stringify(current)) upd["seo.officialProfiles"] = profiles;

const socials = data.socials ?? [];
const norm = (u) => (u ?? "").replace(/\/$/, "");
const missing = [
  { platform: "linkedin", url: LINKEDIN },
  { platform: "instagram", url: INSTAGRAM },
].filter((n) => !socials.some((s) => norm(s.url) === norm(n.url)));
if (missing.length) upd.socials = [...socials, ...missing];

for (const [k, v] of Object.entries(upd)) console.log(`${DRY ? "[deneme]" : "[yazıldı]"} siteSettings/main › ${k}\n  eski: ${JSON.stringify(k === "socials" ? socials : current ?? "(yok)")}\n  yeni: ${JSON.stringify(v)}`);
if (!DRY && Object.keys(upd).length) await ref.update({ ...upd, updatedAt: FieldValue.serverTimestamp() });
console.log(`\n${Object.keys(upd).length} değişiklik — ${DRY ? "deneme, hiçbir şey yazılmadı" : Object.keys(upd).length ? "tamamlandı" : "yapılacak bir şey yok"}.`);
process.exit(0);
