#!/usr/bin/env node
/**
 * İçerik taraması — Firestore'daki tüm metin alanlarında ve üretim HTML'inde bir terimi arar.
 *   node --env-file=.env scripts/tools/scan-terms.mjs teknopark [--html=http://localhost:3100]
 * Her eşleşmeyi cümlesiyle yazar (salt okuma).
 */
import process from "node:process";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../_firebase.mjs";

const term = (process.argv[2] ?? "teknopark").toLocaleLowerCase("tr");
const html = process.argv.find((a) => a.startsWith("--html="))?.split("=")[1];
const db = getFirestore(initAdminApp());
const sentences = (s) => s.split(/(?<=[.!?])\s+|\n+/).filter((x) => x.toLocaleLowerCase("tr").includes(term));
const hits = [];
function walk(v, path) {
  if (typeof v === "string") for (const s of sentences(v)) hits.push(`${path}: ${s.trim().slice(0, 260)}`);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === "object" && !("_seconds" in v)) for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
}
for (const c of await db.listCollections()) for (const d of (await c.get()).docs) walk(d.data(), `${c.id}/${d.id}`);
console.log(`== Firestore (${hits.length})`);
hits.forEach((h) => console.log("  " + h));
if (html) {
  const routes = ["/", "/hizmetler", "/projeler", "/projeler/baseline", "/projeler/bukira", "/projeler/gymbot", "/projeler/dukan", "/projeler/isletmelere-ozel-yazilim", "/projeler/chatekg", "/hakkimizda", "/iletisim", "/aydinlatma-metni", "/gizlilik-politikasi", "/cerez-politikasi", "/sitemap.xml", "/robots.txt", "/manifest.webmanifest"];
  for (const r of routes) {
    const t = await (await fetch(html + r)).text();
    const txt = t.replace(/\\u003c/g, "<");
    const found = [...txt.matchAll(new RegExp(`[^.>"{}]{0,140}${term}[^.<"{}]{0,140}`, "gi"))].map((m) => m[0].trim());
    const uniq = [...new Set(found)];
    console.log(`== ${r} (${found.length})`);
    uniq.forEach((u) => console.log("  " + u));
  }
}
process.exit(0);
