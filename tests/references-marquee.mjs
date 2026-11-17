/**
 * Referans şeridi sağlamlık testi — 1, 2, 3, 6 ve 15 logoyla; çok yatay / kare / yüksek logolar,
 * orijinal ve tek renk modları; masaüstü + mobil; normal ve "hareketi azalt".
 * Geçici referans kayıtları ve logoları oluşturur, mevcut referansları geçici olarak gizler,
 * sonunda HER ŞEYİ eski haline getirir (Firestore + Cloudinary).
 * İçerik her istekte taze okunsun diye DEV sunucusuna karşı çalışır:
 *   node --env-file=.env tests/references-marquee.mjs [http://localhost:3000]
 */
import { createHash } from "node:crypto";
import { mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { chromium } from "playwright";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../scripts/_firebase.mjs";

const BASE = process.argv[2] || "http://localhost:3000";
const OUT = "tests/screenshots/references";
mkdirSync(OUT, { recursive: true });
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
const db = getFirestore(initAdminApp());
const PREFIX = "e2e-marquee-";

/* ---- tek renkli, ortasında koyu şerit olan PNG üretimi (bağımlılıksız) ---- */
function crc(buf) {
  let c = ~0;
  for (const b of buf) { c ^= b; for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1)); }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const sum = Buffer.alloc(4); sum.writeUInt32BE(crc(body));
  return Buffer.concat([len, body, sum]);
}
function png(w, h, [r, g, b]) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1);
    for (let x = 0; x < w; x++) {
      const edge = x < w * 0.08 || x > w * 0.92 || y < h * 0.08 || y > h * 0.92;
      const i = row + 1 + x * 4;
      raw[i] = edge ? 20 : r; raw[i + 1] = edge ? 30 : g; raw[i + 2] = edge ? 60 : b; raw[i + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
async function cloudinary(action, params, file) {
  const signed = { ...params, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.keys(signed).sort().map((k) => `${k}=${signed[k]}`).join("&");
  const form = new FormData();
  if (file) form.append("file", new Blob([file], { type: "image/png" }), "logo.png");
  for (const [k, v] of Object.entries(signed)) form.append(k, v);
  form.append("api_key", KEY);
  form.append("signature", createHash("sha1").update(toSign + SECRET).digest("hex"));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/${action}`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary ${action}: ${JSON.stringify(data).slice(0, 200)}`);
  return data;
}

const SHAPES = [
  { key: "yatay", w: 640, h: 96, color: [240, 132, 24] },   // çok yatay (≈6.7:1)
  { key: "kare", w: 300, h: 300, color: [40, 110, 200] },
  { key: "yuksek", w: 140, h: 420, color: [30, 150, 90] },  // yüksek (1:3)
];
const uploaded = [];
const created = [];
const hiddenOriginals = [];
let fail = 0;
const log = (ok, msg) => { if (!ok) fail++; console.log(`${ok ? "✓" : "✗"} ${msg}`); };

try {
  // 1) logolar
  const logos = {};
  for (const s of SHAPES) {
    const up = await cloudinary("upload", { public_id: `bai/references/${PREFIX}${s.key}`, overwrite: "true" }, png(s.w, s.h, s.color));
    uploaded.push(up.public_id);
    logos[s.key] = { public_id: up.public_id, url: up.secure_url, width: up.width, height: up.height, format: up.format };
  }
  const browser = await chromium.launch();
  /** Bir durum: n görünür referans; 2 genişlik × 2 hareket modu */
  async function runCase(n, label, tag, real = false) {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      for (const reduce of [false, true]) {
        const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: reduce ? "reduce" : "no-preference", isMobile: w < 768, hasTouch: w < 768 });
        const p = await ctx.newPage();
        const errors = [];
        p.on("pageerror", (e) => errors.push(e.message.slice(0, 80)));
        p.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 80)));
        await p.goto(BASE + "/", { waitUntil: "load" });
        const region = p.locator('[role="region"][aria-label="Birlikte çalıştığımız işletmeler"]');
        await region.scrollIntoViewIfNeeded();
        await p.waitForTimeout(900);
        // Görünür alandaki logolar yüklensin (şerit dışındakiler tembel yüklenir)
        const inView = (el) => { const b = el.getBoundingClientRect(); return b.right > 0 && b.left < innerWidth && b.width > 0; };
        await p.waitForFunction(() => [...document.querySelectorAll('[role="region"] img')].filter((i) => { const b = i.getBoundingClientRect(); return b.right > 0 && b.left < innerWidth && b.width > 0; }).every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(() => undefined);
        void inView;
        const r = await region.evaluate((el) => {
          const track = el.firstElementChild;
          const [first, second] = track.children;
          const vis = (x) => x.offsetParent !== null && x.getBoundingClientRect().width > 0;
          const items = [...first.children].filter(vis);
          const onScreen = (x) => { const b = x.getBoundingClientRect(); return b.right > 0 && b.left < innerWidth; };
          const plates = [...first.querySelectorAll("li")].filter((li) => vis(li) && onScreen(li)).map((li) => {
            const img = li.querySelector("img");
            if (!img) return { ok: true, noLogo: true };
            const box = img.parentElement.parentElement.getBoundingClientRect();
            const card = li.getBoundingClientRect();
            const nat = img.naturalWidth / img.naturalHeight;
            // object-contain: çizilen görsel alanı
            const cw = img.clientWidth, ch = img.clientHeight;
            const dw = Math.min(cw, ch * nat), dh = Math.min(ch, cw / nat);
            return { ok: img.complete && img.naturalWidth > 0 && dw > 12 && dh > 10 && box.left >= card.left - 1 && box.right <= card.right + 1, dw: Math.round(dw), dh: Math.round(dh), cardW: Math.round(card.width), cardH: Math.round(card.height) };
          });
          const sec = el.closest("section");
          return {
            regionW: Math.round(el.clientWidth),
            firstW: Math.round(first.getBoundingClientRect().width),
            secondVisible: vis(second),
            secondW: Math.round(second.getBoundingClientRect().width),
            animation: getComputedStyle(track).animationName,
            playState: getComputedStyle(track).animationPlayState,
            visibleItems: items.length,
            realItems: [...first.children].filter((li) => vis(li) && li.getAttribute("aria-hidden") !== "true").length,
            plates,
            cardSizes: [...new Set(plates.filter((x) => x.cardW).map((x) => `${x.cardW}×${x.cardH}`))],
            clipped: [...first.children].filter((li) => vis(li) && (li.getBoundingClientRect().left < el.getBoundingClientRect().left - 1 || li.getBoundingClientRect().right > el.getBoundingClientRect().right + 1)).length,
            trackBottom: Math.round(track.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom),
            pageOverflow: document.documentElement.scrollWidth > innerWidth + 1,
            titled: el.querySelectorAll("[title], [aria-description], [aria-describedby]").length,
            names: [...first.querySelectorAll("li:not([aria-hidden])")].map((li) => (li.querySelector("img")?.getAttribute("alt") ?? li.textContent).trim()),
            // Başlığın (h2) ardından açıklama paragrafı basılmamış olmalı
            description: sec.querySelector("h2").nextElementSibling ? 1 : 0,
            headingBox: Math.round(sec.querySelector("h2").getBoundingClientRect().height),
          };
        });
        const issues = [];
        if (r.pageOverflow) issues.push("yatay taşma");
        if (r.titled) issues.push(`${r.titled} öğede title/aria açıklaması`);
        if (r.realItems !== n) issues.push(`gerçek öğe ${r.realItems}`);
        if (r.plates.some((x) => !x.ok)) issues.push(`logo kutusu ${JSON.stringify(r.plates.filter((x) => !x.ok))}`);
        if (r.cardSizes.length > 1) issues.push(`kart boyutları farklı ${r.cardSizes}`);
        if (r.description !== 0) issues.push("başlığın altında açıklama öğesi basılmış");
        // Görsel denge: çizilen logo alanları arasında en çok ~3 kat fark (çok yatay ↔ yüksek)
        const areas = r.plates.filter((x) => x.dw).map((x) => x.dw * x.dh);
        if (areas.length > 1 && Math.max(...areas) / Math.min(...areas) > (real ? 4.5 : 3.2)) issues.push(`logo alanları dengesiz ${areas}`);
        if (errors.length) issues.push(`konsol: ${errors[0]}`);
        if (reduce) {
          if (r.animation !== "none") issues.push(`animasyon ${r.animation}`);
          if (r.secondVisible) issues.push("kopya liste görünür");
          if (r.visibleItems !== n) issues.push(`görünen ${r.visibleItems}`);
          if (r.clipped) issues.push(`${r.clipped} kart alanın dışında (kırpılıyor)`);
        } else {
          if (r.animation !== "marquee" || r.playState !== "running") issues.push(`animasyon ${r.animation}/${r.playState}`);
          if (r.firstW < r.regionW) issues.push(`şerit dar (${r.firstW} < ${r.regionW}): boşluk`);
          if (r.firstW !== r.secondW) issues.push(`iki yarı eşit değil ${r.firstW}/${r.secondW}`);
          if (w >= 768) {
            await region.hover();
            await p.waitForTimeout(150);
            const paused = await region.evaluate((el) => getComputedStyle(el.firstElementChild).animationPlayState);
            if (paused !== "paused") issues.push(`hover'da durmadı (${paused})`);
          }
        }
        const sizes = r.plates.filter((x) => x.dw).slice(0, 3).map((x) => `${x.dw}×${x.dh}`).join(" ");
        log(!issues.length, `${label} · ${w}px · ${reduce ? "hareketi azalt" : "normal"} → ${issues.length ? issues.join("; ") : `şerit ${r.firstW}px / alan ${r.regionW}px, kart ${r.cardSizes[0] ?? "-"}, logolar ${sizes}`}`);
        if (true) await region.screenshot({ path: `${OUT}/serit-${tag}-${w}${reduce ? "-azalt" : ""}.png` }).catch(() => undefined);
        if (n === 15 || real) await p.locator("section", { has: region }).screenshot({ path: `${OUT}/bolum-${tag}-${w}-azalt.png` }).catch(() => undefined);
        await ctx.close();
      }
    }
  }
  // 1b) GERÇEK referans logolarıyla (kayıtlara dokunmadan)
  const realCount = (await db.collection("references").get()).docs.filter((d) => !d.id.startsWith(PREFIX) && d.data().isActive !== false).length;
  await runCase(realCount, `gerçek ${realCount} logo`, "gercek", true);

  // 2) mevcut referansları gizle
  for (const d of (await db.collection("references").get()).docs) {
    if (d.id.startsWith(PREFIX)) { await d.ref.delete(); continue; }
    if (d.data().isActive !== false) { hiddenOriginals.push(d.id); await d.ref.update({ isActive: false }); }
  }
  // 3) 15 geçici kayıt (başta hepsi gizli); logosuz, tek renk ve bağlantılı örnekler dahil
  for (let i = 0; i < 15; i++) {
    const shape = SHAPES[i % 3];
    const id = `${PREFIX}${String(i + 1).padStart(2, "0")}`;
    const name = i === 4 ? "E2E Uzun Adlı Referans Sanayi ve Ticaret" : `E2E Referans ${i + 1}`;
    await db.collection("references").doc(id).set({
      name,
      logo: i === 5 ? null : { ...logos[shape.key], alt: name },
      logoMode: i === 7 ? "mono" : "original",
      url: i % 4 === 0 ? "https://example.com" : "",
      description: "",
      isActive: false,
      order: 100 + i,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    created.push(id);
  }

  for (const n of [1, 2, 3, 6, 15]) {
    for (const [i, id] of created.entries()) await db.collection("references").doc(id).update({ isActive: i < n });
    await runCase(n, `${String(n).padStart(2)} logo`, String(n));
  }
  await browser.close();
} finally {
  // Temizlik: geçici kayıtlar + logolar silinir, mevcut referanslar yeniden görünür
  for (const id of created) await db.collection("references").doc(id).delete().catch(() => undefined);
  for (const id of hiddenOriginals) await db.collection("references").doc(id).update({ isActive: true });
  for (const id of uploaded) await cloudinary("destroy", { public_id: id, invalidate: "true" }).catch((e) => console.log("silinemedi", id, e.message));
  const left = (await db.collection("references").get()).docs.filter((d) => d.id.startsWith(PREFIX)).length;
  const active = (await db.collection("references").get()).docs.filter((d) => d.data().isActive !== false).length;
  log(left === 0 && active === hiddenOriginals.length, `temizlik: geçici kayıt ${left}, görünür referans ${active}/${hiddenOriginals.length}, silinen logo ${uploaded.length}`);
}
console.log(fail ? `HATA: ${fail}` : "TÜMÜ OK");
process.exit(fail ? 1 : 0);
