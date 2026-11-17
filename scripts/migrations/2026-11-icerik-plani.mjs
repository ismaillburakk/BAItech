#!/usr/bin/env node
/**
 * İçerik planının uygulanması — Kasım 2026 (docs/icerik-plani/ICERIK-PLANI.md + kurucu kararları)
 *  1. Hero, Site Ayarları (footer cümlesi, şirket unvanı, geo koordinatları, CTA, varsayılan metadata)
 *  2. Sayfalar: ana sayfa, hizmetler (kart etiketleri + proje süreci), projeler, hakkımızda
 *     (kuruluş paragrafı, ilkeler, Ar-Ge), iletişim (form ipucu + proje türü seçenekleri)
 *  3. Hizmetler: soru başlığı, kime uygun, ne teslim edilir, süreç, nasıl başlanır, beyan cümlesi
 *  4. Projeler: vaka bölümleri, öne çıkanlar, not, durum, ilgili hizmetler, metadata
 *  5. SSS: 18 → 17 (4 soru birleşti, 3 yeni soru), yeniden sıralama
 *  6. Görsel alt metinleri: GymBot "yapay zeka" ifadesi
 *  7. Proje galerisi: İşletmelere Özel Yazılım'da firma adlı sekmeler kalkar (görselleri Cloudinary'den silinir)
 *  8. Referanslar: yedi firma, sıra, boş açıklama, logolar (scripts/seed-data/references → bai/references/<id>)
 *
 * Metnin tek kaynağı scripts/seed-data/icerik.mjs'dir (seed de aynı dosyayı okur).
 * İdempotent: yalnızca farklı olan alanı yazar; ikinci çalıştırma "yapılacak bir şey yok" der.
 * DİKKAT: Bu alanlar panelden sonradan değiştirildiyse, yeniden çalıştırmak plan metnine geri döndürür —
 * önce --dry-run ile bakın.
 *   node --env-file=.env scripts/migrations/2026-11-icerik-plani.mjs --dry-run
 *   node --env-file=.env scripts/migrations/2026-11-icerik-plani.mjs
 */
import process from "node:process";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../_firebase.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { destroyImage, uploadImage } from "../_cloudinary.mjs";
import { ALT_REPLACEMENTS, FAQ, FAQ_REMOVED, GALLERY_RULES, HERO, PAGES, PROJECTS, REFERENCES, SERVICES, SETTINGS } from "../seed-data/icerik.mjs";

const LOGO_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../seed-data/references");

const DRY = process.argv.includes("--dry-run");
const db = getFirestore(initAdminApp());
const now = FieldValue.serverTimestamp();
const batch = db.batch();
let changes = 0;
const short = (v) => (typeof v === "string" ? v : JSON.stringify(v)).slice(0, 320);
/** Anahtar sırasından bağımsız karşılaştırma (panel kaydı nesne anahtarlarını farklı sırada yazabilir) */
const stable = (v) =>
  JSON.stringify(v, (_, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.entries(x).sort(([a], [b]) => a.localeCompare(b))) : x));
function change(ref, path, before, after) {
  if (stable(before) === stable(after)) return false;
  changes++;
  console.log(`\n${DRY ? "[deneme]" : "[yazıldı]"} ${ref.path} › ${path}\n  eski: ${short(before ?? "(yok)")}\n  yeni: ${short(after)}`);
  return true;
}
/** Düz alan kümesi: yalnızca değişenleri `upd` içine koyar */
function diffInto(ref, upd, current, target, prefix = "") {
  for (const [k, v] of Object.entries(target)) if (change(ref, prefix + k, current?.[k], v)) upd[prefix + k] = v;
}
const commit = (ref, upd) => Object.keys(upd).length && batch.update(ref, { ...upd, updatedAt: now });

// 1 — hero
{
  const ref = db.collection("hero").doc("main");
  const d = (await ref.get()).data();
  const upd = {};
  diffInto(ref, upd, d, HERO);
  commit(ref, upd);
}

// 1 — site ayarları
{
  const ref = db.collection("siteSettings").doc("main");
  const d = (await ref.get()).data();
  const upd = {};
  diffInto(ref, upd, d.brand, SETTINGS.brand, "brand.");
  diffInto(ref, upd, d.contact, SETTINGS.contact, "contact.");
  diffInto(ref, upd, d.cta, SETTINGS.cta, "cta.");
  diffInto(ref, upd, d.seo, SETTINGS.seo, "seo.");
  const stats = (d.stats ?? []).map((s, i) => (SETTINGS.statLabels[i] ? { ...s, label: SETTINGS.statLabels[i] } : s));
  if (change(ref, "stats", d.stats, stats)) upd.stats = stats;
  commit(ref, upd);
}

// 2 — sayfalar
for (const [slug, page] of Object.entries(PAGES)) {
  const ref = db.collection("pages").doc(slug);
  const d = (await ref.get()).data();
  const upd = {};
  diffInto(ref, upd, d.fields, page.fields, "fields.");
  diffInto(ref, upd, d.seo, page.seo, "seo.");
  for (const key of page.remove)
    if (d.fields?.[key] !== undefined) {
      changes++;
      console.log(`\n${DRY ? "[deneme]" : "[yazıldı]"} ${ref.path} › fields.${key}\n  eski: ${short(d.fields[key])}\n  yeni: (alan kaldırıldı)`);
      upd[`fields.${key}`] = FieldValue.delete();
    }
  commit(ref, upd);
}

// 3 — hizmetler
for (const [slug, s] of Object.entries(SERVICES)) {
  const ref = db.collection("services").doc(slug);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`  services/${slug} yok — atlandı`);
    continue;
  }
  const upd = {};
  diffInto(ref, upd, snap.data(), s);
  commit(ref, upd);
}

// 4 — projeler
for (const [slug, p] of Object.entries(PROJECTS)) {
  const q = await db.collection("projects").where("slug", "==", slug).limit(1).get();
  if (q.empty) {
    console.log(`  projects/${slug} yok — atlandı`);
    continue;
  }
  const doc = q.docs[0];
  const { seo, ...rest } = p;
  const upd = {};
  diffInto(doc.ref, upd, doc.data(), rest);
  diffInto(doc.ref, upd, doc.data().seo, seo, "seo.");
  commit(doc.ref, upd);
}

// 5 — SSS
for (const [order, f] of FAQ.entries()) {
  const ref = db.collection("faq").doc(f.id);
  const snap = await ref.get();
  const target = { question: f.question, answer: f.answer, order };
  if (!snap.exists) {
    change(ref, "(yeni soru)", null, target);
    batch.set(ref, { ...target, isActive: true, createdAt: now, updatedAt: now });
    continue;
  }
  const upd = {};
  diffInto(ref, upd, snap.data(), target);
  commit(ref, upd);
}
for (const id of FAQ_REMOVED) {
  const ref = db.collection("faq").doc(id);
  const snap = await ref.get();
  if (!snap.exists) continue;
  changes++;
  console.log(`\n${DRY ? "[deneme]" : "[silindi]"} ${ref.path}\n  eski: ${short(snap.data().question)}\n  yeni: (birleştirildi, kayıt silindi)`);
  batch.delete(ref);
}

// 6 — görsel alt metinleri (hero telefonları, hizmet görselleri, proje galerileri)
const fixAlt = (alt) => ALT_REPLACEMENTS.reduce((a, [from, to]) => (typeof a === "string" ? a.replaceAll(from, to) : a), alt);
const fixImages = (images) => (images ?? []).map((im) => (im?.alt ? { ...im, alt: fixAlt(im.alt) } : im));
{
  const ref = db.collection("hero").doc("main");
  const d = (await ref.get()).data();
  const phones = fixImages(d.phones);
  if (change(ref, "phones[].alt", d.phones?.map((p) => p.alt), phones.map((p) => p.alt))) batch.update(ref, { phones });
}
for (const doc of (await db.collection("services").get()).docs) {
  const images = fixImages(doc.data().images);
  if (change(doc.ref, "images[].alt", doc.data().images?.map((p) => p.alt), images.map((p) => p.alt))) batch.update(doc.ref, { images });
}
for (const doc of (await db.collection("projects").get()).docs) {
  const d = doc.data();
  const gallery = (d.gallery ?? []).map((t) => ({ ...t, images: fixImages(t.images) }));
  const alts = (g) => (g ?? []).flatMap((t) => (t.images ?? []).map((im) => im.alt));
  if (change(doc.ref, "gallery[].images[].alt", alts(d.gallery), alts(gallery))) batch.update(doc.ref, { gallery });
  if (d.coverImage?.alt && change(doc.ref, "coverImage.alt", d.coverImage.alt, fixAlt(d.coverImage.alt)))
    batch.update(doc.ref, { coverImage: { ...d.coverImage, alt: fixAlt(d.coverImage.alt) } });
}

// 7 — proje galerisi kuralları (firma adlı sekmeler kalkar; kaldırılan sekmelerin görselleri Cloudinary'den silinir)
const orphaned = [];
for (const [slug, rule] of Object.entries(GALLERY_RULES)) {
  const q = await db.collection("projects").where("slug", "==", slug).limit(1).get();
  if (q.empty) continue;
  const doc = q.docs[0];
  const before = doc.data().gallery ?? [];
  const removed = before.filter((t) => rule.removeTabLabels.includes(t.label));
  const after = before
    .filter((t) => !rule.removeTabLabels.includes(t.label))
    .map((t) => ({
      ...t,
      label: rule.renameTabs[t.label] ?? t.label,
      images: (t.images ?? []).map((im) => ({ ...im, alt: rule.altReplacements.reduce((a, [from, to]) => (a ?? "").replaceAll(from, to), im.alt) })),
    }));
  const view = (g) => g.map((t) => `${t.label}: ${t.images.map((im) => im.alt).join(" | ")}`);
  if (change(doc.ref, "gallery (sekme ve alt metinleri)", view(before), view(after))) {
    batch.update(doc.ref, { gallery: after, updatedAt: now });
    orphaned.push(...removed.flatMap((t) => (t.images ?? []).map((im) => im.public_id)));
  }
}

// 8 — referanslar: tam liste, sıra, boş açıklama, alt metin = firma adı; logolar bai/references/<id>
for (const [order, r] of REFERENCES.entries()) {
  const ref = db.collection("references").doc(r.id);
  const snap = await ref.get();
  const cur = snap.exists ? snap.data() : null;
  const targetId = `bai/references/${r.id}`;
  let logo = cur?.logo ?? null;
  if (r.logoFile && logo?.public_id !== targetId) {
    changes++;
    console.log(`\n${DRY ? "[deneme]" : "[yüklendi]"} ${ref.path} › logo\n  eski: ${logo?.public_id ?? "(logo yok)"}\n  yeni: ${targetId} ← ${r.logoFile}`);
    if (!DRY) {
      if (logo?.public_id) orphaned.push(logo.public_id);
      logo = await uploadImage(path.join(LOGO_DIR, r.logoFile), targetId);
    } else logo = { public_id: targetId };
  }
  if (logo) logo = { ...logo, alt: r.name };
  const target = { name: r.name, url: r.url, description: "", logoMode: "original", isActive: true, order, logo };
  if (!cur) {
    change(ref, "(yeni referans)", null, { name: r.name, url: r.url, order });
    batch.set(ref, { ...target, createdAt: now, updatedAt: now });
    continue;
  }
  const upd = {};
  diffInto(ref, upd, cur, target);
  commit(ref, upd);
}
// Listede olmayan kayıtların da açıklaması boşaltılır (sitede hiçbir yerde gösterilmez)
for (const doc of (await db.collection("references").get()).docs) {
  if (REFERENCES.some((r) => r.id === doc.id)) continue;
  if (doc.data().description && change(doc.ref, "description", doc.data().description, "")) batch.update(doc.ref, { description: "", updatedAt: now });
}

if (!DRY && changes) await batch.commit();
if (!DRY) for (const id of orphaned) {
  await destroyImage(id).catch((e) => console.log(`  ! Cloudinary'den silinemedi: ${id} (${e.message})`));
  console.log(`[silindi] Cloudinary ${id}`);
}
console.log(`\n${changes} değişiklik — ${DRY ? "deneme, hiçbir şey yazılmadı" : changes ? "tamamlandı" : "yapılacak bir şey yok"}.`);
process.exit(0);
