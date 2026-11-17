/**
 * Panel + güvenlik + iletişim formu uçtan uca testi (Playwright, gerçek servisler).
 *   node --env-file=.env tests/e2e-panel.mjs        (sunucu: SITE_URL_TEST, varsayılan localhost:3100)
 *
 * Yalnızca TEST verisi oluşturur ve siler; mevcut içerikte yapılan düzenlemeler
 * orijinal değerine döndürülür (görsel değiştirilen yerlerde aynı kaynak dosya
 * aynı alt metinle yeniden yüklenir). Sonda Cloudinary öksüz denetimi yapılır.
 */
import { chromium } from "playwright";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../scripts/_firebase.mjs";

const BASE = process.env.SITE_URL_TEST ?? "http://localhost:3100";
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const CLD_AUTH = "Basic " + Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString("base64");
const FIX = "tests/fixtures";
const ORIG = "taslak/public/img";
const SHOTS = "tests/screenshots/e2e";
mkdirSync(SHOTS, { recursive: true });
writeFileSync(`${FIX}/too-big.png`, randomBytes(11 * 1024 * 1024));

const app = initAdminApp();
const adb = getFirestore(app);
const aauth = getAuth(app);

const results = [];
const ONLY = (process.env.ONLY ?? "").split(",").filter(Boolean);
async function check(group, name, fn) {
  if (ONLY.length && !ONLY.includes(group) && !name.startsWith("Admin girişi")) return;
  try {
    const d = await fn();
    results.push({ group, name, ok: true, detail: d ?? "" });
    console.log(`✓ [${group}] ${name}${d ? ` — ${d}` : ""}`);
  } catch (e) {
    results.push({ group, name, ok: false, detail: e.message.split("\n")[0].slice(0, 300) });
    console.log(`✗ [${group}] ${name} — ${e.message.split("\n").slice(0, process.env.VERBOSE ? 6 : 1).join(" ¦ ").slice(0, 900)}`);
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cldExists(id) {
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/resources/image/upload/${id}`, { headers: { Authorization: CLD_AUTH } });
  return r.status === 200;
}
async function assertDeleted(ids) {
  await sleep(1500);
  const left = [];
  for (const id of ids) if (await cldExists(id)) left.push(id);
  if (left.length) throw new Error(`Cloudinary'de kaldı: ${left.join(", ")}`);
}
/** Public sayfada metin görünene / kaybolana dek yeniden yükle (on-demand revalidate) */
async function waitPublic(page, path, text, present = true, timeout = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    await page.goto(BASE + path, { waitUntil: "domcontentloaded" });
    if ((await page.content()).includes(text) === present) return `${((Date.now() - start) / 1000).toFixed(1)}s`;
    await page.waitForTimeout(1500);
  }
  throw new Error(`${path}: "${text}" ${present ? "görünmedi" : "kaybolmadı"}`);
}
/** Cloudinary'ye giden yüklemeyi bekleyip public_id döndürür */
async function uploadVia(page, locator, files) {
  const list = Array.isArray(files) ? files : [files];
  const waits = list.map(() => page.waitForResponse((r) => r.url().includes("api.cloudinary.com") && r.request().method() === "POST", { timeout: 40000 }));
  await locator.setInputFiles(files);
  const resps = await Promise.all(waits);
  const ids = [];
  for (const r of resps) ids.push((await r.json()).public_id);
  await page.waitForTimeout(300);
  return ids;
}
async function deleteRow(page, listPath, text) {
  await page.goto(BASE + listPath);
  const row = page.locator("li", { hasText: text }).first();
  await row.waitFor({ timeout: 15000 });
  await row.getByRole("button", { name: "Sil" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sil" }).click();
  await row.waitFor({ state: "detached", timeout: 15000 });
}
async function save(page, expectUrl) {
  await page.click('button[type="submit"]');
  if (expectUrl) await page.waitForURL(BASE + expectUrl, { timeout: 25000 });
  else await page.getByRole("status").filter({ hasText: "kaydedildi" }).waitFor({ timeout: 20000 });
}
function publicIdsIn(html) {
  return [...new Set([...html.matchAll(/upload\/[^"]*?\/(bai\/[A-Za-z0-9_/-]+?)(?=["?&\s]|\.|$)/g)].map((m) => m[1]))];
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const pub = await ctx.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(`admin: ${e.message}`));
pub.on("pageerror", (e) => pageErrors.push(`public: ${e.message}`));

/* =========================================================
 * BÖLÜM 2 — GÜVENLİK / YETKİ
 * ========================================================= */
const G = "Güvenlik";
await check(G, "Oturumsuz /admin/* → /admin/login", async () => {
  for (const p of ["/admin", "/admin/projeler/yeni", "/admin/site-ayarlari"]) {
    await page.goto(BASE + p);
    if (!page.url().endsWith("/admin/login")) throw new Error(`${p} → ${page.url()}`);
  }
  return "3 rota";
});
await check(G, "Oturumsuz /api/admin/* → 401", async () => {
  const out = [];
  for (const [p, body] of [
    ["/api/admin/revalidate", null],
    ["/api/admin/cloudinary/delete", { publicIds: ["bai/brand/bai-logo"] }],
  ]) {
    const r = await fetch(BASE + p, { method: "POST", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    if (r.status !== 401) throw new Error(`${p} ${r.status}`);
    out.push(r.status);
  }
  const s = await fetch(`${BASE}/api/admin/session`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken: "sahte" }) });
  if (s.status !== 401) throw new Error(`session sahte token ${s.status}`);
  return `${out.join("/")} · sahte idToken ${s.status}`;
});
await check(G, "Sahte / bozuk session cookie → reddedilir", async () => {
  for (const v of ["sahte", "eyJhbGciOiJSUzI1NiJ9.e30.x"]) {
    await ctx.addCookies([{ name: "admin_session", value: v, domain: "localhost", path: "/" }]);
    await page.goto(`${BASE}/admin`);
    if (!page.url().endsWith("/admin/login")) throw new Error(page.url());
    const r = await page.request.post(`${BASE}/api/admin/revalidate`);
    if (r.status() !== 401) throw new Error(`api ${r.status()}`);
  }
  await ctx.clearCookies();
});

async function restCommit(fields, token, transforms = true, collection = "submissions") {
  const id = `e2e-${randomBytes(6).toString("hex")}`;
  const write = {
    update: { name: `projects/${PID}/databases/(default)/documents/${collection}/${id}`, fields },
    currentDocument: { exists: false },
    ...(transforms ? { updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }] } : {}),
  };
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents:commit?key=${KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ writes: [write] }),
  });
  return { status: r.status, id };
}
const str = (v) => ({ stringValue: v });
const VALID = {
  name: str("E2E Kural Testi"),
  email: str("e2e@example.com"),
  subject: str("Kural testi"),
  message: str("Kural testi mesajı"),
  consent: { booleanValue: true },
  isRead: { booleanValue: false },
};
await check(G, "Firestore rules: anonim içerik yazımı 403 (8 koleksiyon)", async () => {
  for (const c of ["projects", "services", "references", "faq", "hero", "teamMembers", "pages", "siteSettings"]) {
    const { status } = await restCommit({ title: str("hack") }, null, false, c);
    if (status !== 403) throw new Error(`${c} ${status}`);
  }
  return "8/8 reddedildi";
});
await check(G, "Firestore rules: submissions şeması (geçerli=200, proje türü alanı, 12 ihlal=403)", async () => {
  const ok = await restCommit(VALID);
  if (ok.status !== 200) throw new Error(`geçerli kayıt ${ok.status}`);
  await adb.collection("submissions").doc(ok.id).delete();
  const cases = {
    "isRead=true": { ...VALID, isRead: { booleanValue: true } },
    "consent=false": { ...VALID, consent: { booleanValue: false } },
    "fazla alan": { ...VALID, admin: { booleanValue: true } },
    "e-posta eksik": (({ email, ...r }) => (void email, r))(VALID),
    "geçersiz e-posta": { ...VALID, email: str("eposta-degil") },
    "ad 1 karakter": { ...VALID, name: str("A") },
    "ad 121 karakter": { ...VALID, name: str("A".repeat(121)) },
    "mesaj 5001 karakter": { ...VALID, message: str("x".repeat(5001)) },
    "telefon 6 karakter": { ...VALID, phone: str("123456") },
    "proje türü 81 karakter": { ...VALID, topic: str("x".repeat(81)) },
    "proje türü boş": { ...VALID, topic: str("") },
    "proje türü sayı": { ...VALID, topic: { integerValue: "5" } },
  };
  // Yayınlanan kurallar proje türünü (topic) ayrı alan olarak kabul eder
  for (const topic of ["Mobil uygulama", "x".repeat(80)]) {
    const t = await restCommit({ ...VALID, topic: str(topic) });
    if (t.status !== 200) throw new Error(`geçerli proje türü (${topic.length} karakter) ${t.status}`);
    await adb.collection("submissions").doc(t.id).delete();
  }
  const bad = [];
  for (const [n, f] of Object.entries(cases)) {
    const r = await restCommit(f);
    if (r.status !== 403) bad.push(`${n}:${r.status}`);
    if (r.status === 200) await adb.collection("submissions").doc(r.id).delete();
  }
  const clientTime = await restCommit({ ...VALID, createdAt: { timestampValue: "2020-01-01T00:00:00Z" } }, null, false);
  if (clientTime.status !== 403) bad.push(`istemci createdAt:${clientTime.status}`);
  const read = await fetch(`https://firestore.googleapis.com/v1/projects/${PID}/databases/(default)/documents/submissions?key=${KEY}`);
  if (read.status !== 403) bad.push(`anonim okuma:${read.status}`);
  if (bad.length) throw new Error(bad.join(", "));
  return "proje türü (1–80 karakter) kabul; 12 ihlal + istemci createdAt + anonim okuma reddedildi";
});

const NOCLAIM = "e2e-yetkisiz@baitech.com.tr";
const NOCLAIM_PW = `E2e-${randomBytes(9).toString("hex")}`;
await check(G, "Claim'siz Auth kullanıcısı: panele giremez + Firestore yazamaz", async () => {
  const u = await aauth.createUser({ email: NOCLAIM, password: NOCLAIM_PW, emailVerified: true });
  try {
    const p2 = await browser.newPage();
    await p2.goto(`${BASE}/admin/login`);
    await p2.fill('input[name="email"]', NOCLAIM);
    await p2.fill('input[name="password"]', NOCLAIM_PW);
    await p2.click('button[type="submit"]');
    const alert = p2.locator('form [role="alert"]');
    await alert.waitFor({ timeout: 15000 });
    const msg = (await alert.textContent()).trim();
    const cookies = await p2.context().cookies();
    await p2.close();
    if (!msg.includes("yetkisi yok")) throw new Error(msg);
    if (cookies.some((c) => c.name === "admin_session")) throw new Error("session cookie oluştu");
    const sign = await (
      await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: NOCLAIM, password: NOCLAIM_PW, returnSecureToken: true }),
      })
    ).json();
    const w = await restCommit({ title: str("hack") }, sign.idToken, false, "projects");
    if (w.status !== 403) throw new Error(`claim'siz yazma ${w.status}`);
    return `"${msg}" · Firestore 403`;
  } finally {
    await aauth.deleteUser(u.uid);
  }
});

/* ---- Giriş ---- */
await check(G, "Yanlış şifre reddedilir", async () => {
  const p2 = await browser.newPage();
  await p2.goto(`${BASE}/admin/login`);
  await p2.fill('input[name="email"]', EMAIL);
  await p2.fill('input[name="password"]', "yanlis-sifre-123");
  await p2.click('button[type="submit"]');
  await p2.locator('form [role="alert"]').waitFor({ timeout: 15000 });
  const t = (await p2.locator('form [role="alert"]').textContent()).trim();
  if (!t.includes("hatalı")) throw new Error(t);
  await p2.close();
  return t;
});
await check(G, "Admin girişi (claim'li hesap)", async () => {
  await page.goto(`${BASE}/admin/login`);
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE}/admin`, { timeout: 20000 });
  await page.screenshot({ path: `${SHOTS}/01-dashboard.png` });
});
await check(G, "Cloudinary delete: bai/ dışı public_id reddedilir (oturumlu)", async () => {
  const out = [];
  for (const ids of [["sample"], ["other/folder/x"], ["../bai/x".replace("../", "x/")], []]) {
    const r = await page.request.post(`${BASE}/api/admin/cloudinary/delete`, { data: { publicIds: ids } });
    if (r.status() !== 400) throw new Error(`${JSON.stringify(ids)} → ${r.status()}`);
    out.push(r.status());
  }
  return `${out.length} istek 400`;
});

/* =========================================================
 * BÖLÜM 1 — PANEL MODÜLLERİ
 * ========================================================= */

/* ---------- Projeler ---------- */
const P = "Projeler";
const PT = "E2E Test Projesi";
const PSLUG = "e2e-test-projesi";
let projIds = [];
await check(P, "Oluştur: kapak + 2 sekmeli galeri + teknoloji + store linkleri + durum", async () => {
  await page.goto(`${BASE}/admin/projeler/yeni`);
  await page.getByLabel("Başlık *", { exact: true }).fill(PT);
  await page.getByLabel("Alt başlık *", { exact: true }).fill("Uçtan uca test için geçici proje");
  await page.getByLabel("Kategori", { exact: true }).fill("Test Kategorisi");
  await page.getByRole("combobox", { name: /^Durum/ }).selectOption("development");
  await page.getByRole("checkbox", { name: "iOS" }).check();
  await page.getByRole("checkbox", { name: "Web" }).check();
  await page.getByRole("button", { name: "+ Teknoloji ekle" }).click();
  await page.getByLabel("Teknoloji etiketleri 1").fill("E2ETechAlpha");
  await page.getByRole("button", { name: "+ Teknoloji ekle" }).click();
  await page.getByLabel("Teknoloji etiketleri 2").fill("E2ETechBeta");
  await page.getByLabel("App Store", { exact: true }).fill("https://apps.apple.com/tr/app/e2e/id1");
  await page.getByLabel("Google Play", { exact: true }).fill("https://play.google.com/store/apps/details?id=e2e.test");
  await page.getByLabel("Web sitesi", { exact: true }).fill("https://example.com/e2e");
  projIds.push(...(await uploadVia(page, page.locator('[data-testid="image-input"]'), `${FIX}/test-web.png`)));
  await page.getByRole("button", { name: "+ Sekme ekle" }).click();
  await page.getByLabel("Sekme adı").first().fill("E2E Mobil");
  // Yarış durumu: 1. sekme yüklenirken 2. sekme eklenip adlandırılır — hiçbir değişiklik kaybolmamalı
  const pending = uploadVia(page, page.locator('[data-testid="gallery-input"]').first(), [`${FIX}/test-phone-1.png`, `${FIX}/test-phone-2.png`]);
  await page.getByRole("button", { name: "+ Sekme ekle" }).click();
  await page.getByLabel("Sekme adı").nth(1).fill("E2E Web");
  projIds.push(...(await pending));
  await page.waitForTimeout(500);
  if ((await page.getByLabel("Sekme adı").nth(1).inputValue()) !== "E2E Web") throw new Error("yükleme sırasında eklenen sekme kayboldu");
  await page.getByRole("combobox", { name: /^Çerçeve/ }).nth(1).selectOption("web");
  projIds.push(...(await uploadVia(page, page.locator('[data-testid="gallery-input"]').nth(1), `${FIX}/test-web.png`)));
  await page.screenshot({ path: `${SHOTS}/02-proje-form.png`, fullPage: true });
  await save(page, "/admin/projeler");
  await page.getByText(PT).waitFor();
  return `${projIds.length} görsel yüklendi`;
});
await check(P, "Detay sayfası: durum, teknoloji, store butonları, sekmeler, lightbox, og:image=kapak", async () => {
  const t = await waitPublic(pub, `/projeler/${PSLUG}`, PT);
  const html = await pub.content();
  for (const s of ["Geliştirmede", "E2ETechAlpha · E2ETechBeta", "apps.apple.com/tr/app/e2e/id1", "play.google.com/store/apps/details?id=e2e.test", "example.com/e2e"])
    if (!html.includes(s)) throw new Error(`eksik: ${s}`);
  const og = await pub.locator('meta[property="og:image"]').getAttribute("content");
  if (!og.includes(projIds[0])) throw new Error(`og:image kapak değil: ${og}`);
  const tabs = await pub.getByRole("tab").allTextContents();
  if (tabs.join("|") !== "E2E Mobil|E2E Web") throw new Error(`sekmeler: ${tabs}`);
  await pub.getByRole("tab", { name: "E2E Web" }).click();
  await pub.getByRole("button", { name: /^Büyüt:/ }).first().click();
  await pub.getByRole("dialog").waitFor();
  await pub.keyboard.press("Escape");
  await pub.getByRole("tab", { name: "E2E Mobil" }).click();
  await pub.getByRole("button", { name: /^Büyüt:/ }).first().click();
  const d = pub.getByRole("dialog").locator("p").first();
  const before = await d.textContent();
  await pub.keyboard.press("ArrowRight");
  const after = await d.textContent();
  await pub.keyboard.press("Escape");
  if (before === after) throw new Error("lightbox ok tuşu çalışmadı");
  await pub.screenshot({ path: `${SHOTS}/03-proje-public.png` });
  const list = await waitPublic(pub, "/projeler", PT);
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  return `${t}, liste ${list}, sitemap'te ${sm.includes(PSLUG) ? "var" : "yok (1sa ISR)"}`;
});
await check(P, "Düzenle: alt başlık + galeriden görsel çıkar → yansıma + çıkarılan görsel silinir", async () => {
  await page.goto(`${BASE}/admin/projeler`);
  await page.getByRole("link", { name: PT }).first().click();
  await page.getByLabel("Alt başlık *", { exact: true }).waitFor();
  await page.getByLabel("Alt başlık *", { exact: true }).fill("Uçtan uca test için DÜZENLENMİŞ proje");
  // ilk sekmenin 2. görselini kaldır
  const removed = projIds[2];
  await page.locator("li", { has: page.locator(`img[src*="${removed.split("/").pop()}"]`) }).getByRole("button", { name: "Kaldır" }).click();
  await save(page, "/admin/projeler");
  const t = await waitPublic(pub, `/projeler/${PSLUG}`, "DÜZENLENMİŞ");
  await assertDeleted([removed]);
  projIds = projIds.filter((x) => x !== removed);
  return `${t}, ${removed} silindi`;
});
await check(P, "Sil → 404 + tüm görseller (kapak dahil) Cloudinary'den silinir", async () => {
  await deleteRow(page, "/admin/projeler", PT);
  const start = Date.now();
  let st = 200;
  while (Date.now() - start < 25000) {
    st = (await pub.goto(`${BASE}/projeler/${PSLUG}`)).status();
    if (st === 404) break;
    await pub.waitForTimeout(1500);
  }
  if (st !== 404) throw new Error(`HTTP ${st}`);
  await waitPublic(pub, "/projeler", PT, false);
  await assertDeleted(projIds);
  return `404, ${projIds.length} görsel silindi`;
});

/* ---------- Sıralama (ortak) ---------- */
async function reorderCheck(group, listPath, col, publicPath, getVisibleOrder) {
  await check(group, "Sıralama: ↑ ile taşı → tek batch (order 0..n-1) → sitede yansır → geri al", async () => {
    await page.goto(BASE + listPath);
    await page.locator("ul li").first().waitFor();
    const before = (await adb.collection(col).orderBy("order").get()).docs.map((d) => d.id);
    await page.locator("ul li").nth(1).getByRole("button", { name: "Yukarı taşı" }).click();
    await page.getByText("Sıralamak için").waitFor({ timeout: 15000 });
    await sleep(800);
    const docs = (await adb.collection(col).orderBy("order").get()).docs;
    const after = docs.map((d) => d.id);
    const orders = docs.map((d) => d.data().order);
    if (after[0] !== before[1] || after[1] !== before[0]) throw new Error(`sıra değişmedi: ${after.slice(0, 2)}`);
    if (orders.join() !== orders.map((_, i) => i).join()) throw new Error(`order dizisi: ${orders}`);
    const stamps = new Set(docs.map((d) => d.data().updatedAt?.toMillis()));
    let reflect = "";
    if (publicPath) {
      const start = Date.now();
      while (Date.now() - start < 20000) {
        await pub.goto(BASE + publicPath);
        const vis = await getVisibleOrder(pub);
        if (vis[0] === docs[0].data().title || vis[0] === docs[0].data().name || vis[0] === docs[0].data().question) {
          reflect = `sitede ${((Date.now() - start) / 1000).toFixed(1)}s`;
          break;
        }
        await pub.waitForTimeout(1500);
      }
      if (!reflect) throw new Error("sitede sıra yansımadı");
    }
    // geri al
    await page.locator("ul li").nth(1).getByRole("button", { name: "Yukarı taşı" }).click();
    await sleep(1500);
    const restored = (await adb.collection(col).orderBy("order").get()).docs.map((d) => d.id);
    if (restored.join() !== before.join()) throw new Error("geri alınamadı");
    return `${docs.length} doküman, tek yazım zaman damgası: ${stamps.size === 1 ? "evet (batch)" : stamps.size}${reflect ? `, ${reflect}` : ""}`;
  });
}

/* ---------- Hizmetler ---------- */
const H = "Hizmetler";
const ST = "E2E Test Hizmeti";
let svcIds = [];
await check(H, "Oluştur (bento telefon görseli) → /hizmetler + ana sayfa bento", async () => {
  await page.goto(`${BASE}/admin/hizmetler/yeni`);
  await page.getByLabel("Başlık *").fill(ST);
  await page.getByLabel("Kısa açıklama *").fill("E2E kısa açıklama metni");
  await page.getByLabel("Süreç", { exact: true }).fill("E2E süreç ve çıktı metni");
  await page.getByLabel("Kutu görseli").selectOption("phones");
  svcIds = await uploadVia(page, page.locator('[data-testid="gallery-input"]'), `${FIX}/test-phone-1.png`);
  await save(page, "/admin/hizmetler");
  const a = await waitPublic(pub, "/hizmetler", "E2E süreç ve çıktı metni");
  const b = await waitPublic(pub, "/", "E2E kısa açıklama metni");
  if (!(await pub.content()).includes(svcIds[0])) throw new Error("bento görseli ana sayfada yok");
  return `hizmetler ${a}, ana sayfa ${b}`;
});
await check(H, "Düzenle: başlık → yansıma", async () => {
  await page.goto(`${BASE}/admin/hizmetler`);
  await page.getByRole("link", { name: ST }).first().click();
  await page.getByLabel("Başlık *").waitFor();
  await page.getByLabel("Başlık *").fill(`${ST} Düzenlendi`);
  await save(page, "/admin/hizmetler");
  return await waitPublic(pub, "/hizmetler", `${ST} Düzenlendi`);
});
await reorderCheck(H, "/admin/hizmetler", "services", "/hizmetler", async (p) => p.locator("article h2").allTextContents());
await check(H, "Sil → kaybolur + görsel silinir", async () => {
  await deleteRow(page, "/admin/hizmetler", `${ST} Düzenlendi`);
  const t = await waitPublic(pub, "/hizmetler", ST, false);
  await assertDeleted(svcIds);
  return t;
});

/* ---------- SEO/GEO alanları (beyan cümlesi, kapsam, ilgili hizmetler) ---------- */
await check(H, "Kart alanları (soru, kime uygun, teslim maddesi, nasıl başlanır): düzenle → /hizmetler kartında → geri al", async () => {
  await page.goto(`${BASE}/admin/hizmetler/hosting`);
  const f = {
    q: page.getByLabel("Soru cümlesi"),
    a: page.getByLabel("Kime uygun"),
    d: page.getByLabel("Ne teslim edilir 1", { exact: true }),
    s: page.getByLabel("Nasıl başlanır"),
  };
  await f.q.waitFor({ timeout: 15000 });
  const orig = {};
  for (const [k, loc] of Object.entries(f)) orig[k] = await loc.inputValue();
  if (Object.values(orig).some((v) => !v.trim())) throw new Error(`boş alan: ${JSON.stringify(orig)}`);
  for (const [k, loc] of Object.entries(f)) await loc.fill(`${orig[k]} E2EKART${k.toUpperCase()}`);
  await save(page, "/admin/hizmetler");
  const t = await waitPublic(pub, "/hizmetler", "E2EKARTQ");
  const card = pub.locator("article", { has: pub.locator("h2", { hasText: "Hosting" }) });
  const text = await card.evaluate((el) => el.textContent);
  const miss = ["E2EKARTQ", "E2EKARTA", "E2EKARTD", "E2EKARTS"].filter((m) => !text.includes(m));
  // Sekme: "Ne teslim ediyoruz" tıklanınca madde görünür olur (yığın düzeni, 1280×900)
  await card.scrollIntoViewIfNeeded();
  await card.getByRole("tab", { name: "Ne teslim ediyoruz" }).click();
  const shown = await card.getByText("E2EKARTD").isVisible();
  await page.goto(`${BASE}/admin/hizmetler/hosting`);
  await page.getByLabel("Soru cümlesi").waitFor({ timeout: 15000 });
  await page.getByLabel("Soru cümlesi").fill(orig.q);
  await page.getByLabel("Kime uygun").fill(orig.a);
  await page.getByLabel("Ne teslim edilir 1", { exact: true }).fill(orig.d);
  await page.getByLabel("Nasıl başlanır").fill(orig.s);
  await save(page, "/admin/hizmetler");
  await waitPublic(pub, "/hizmetler", "E2EKART", false);
  if (miss.length) throw new Error(`kartta yok: ${miss}`);
  if (!shown) throw new Error("sekme tıklanınca teslim maddesi görünmedi");
  return `4 alan kartta, sekme çalışıyor (${t}), geri alındı`;
});
await check(H, "Beyan cümlesi + kapsam: panelde dolu → düzenle → yalnızca Service schema'sında (kartta görünmez) → geri al", async () => {
  await page.goto(`${BASE}/admin/hizmetler/hosting`);
  const claim = page.getByLabel("Beyan cümlesi");
  await claim.waitFor({ timeout: 15000 });
  const orig = await claim.inputValue();
  if (!orig.startsWith("BAI Technology")) throw new Error(`beyan cümlesi boş/yanlış: ${orig}`);
  if ((await page.getByLabel("Kapsam (hizmet türleri) 1", { exact: true }).inputValue()) !== "Hosting kurulumu") throw new Error("kapsam yüklenmedi");
  await claim.fill(`${orig} E2ECLAIM`);
  await save(page, "/admin/hizmetler");
  const t = await waitPublic(pub, "/hizmetler", "E2ECLAIM");
  const inSchema = (await pub.locator('script[type="application/ld+json"]').allTextContents()).some((x) => x.includes("E2ECLAIM"));
  const inCard = (await pub.locator("main").evaluate((el) => el.innerText)).includes("E2ECLAIM");
  if (!inSchema || inCard) throw new Error(`schema: ${inSchema}, görünür metin: ${inCard}`);
  await page.goto(`${BASE}/admin/hizmetler/hosting`);
  await page.getByLabel("Beyan cümlesi").fill(orig);
  await save(page, "/admin/hizmetler");
  await waitPublic(pub, "/hizmetler", "E2ECLAIM", false);
  return t;
});
await check(P, "Vaka bölümleri: ara başlık + metin düzenle → proje sayfasında görünür başlıkla → geri al", async () => {
  await page.goto(`${BASE}/admin/projeler/baseline`);
  const title = page.getByLabel("Vaka bölümleri 1 başlık");
  const body = page.getByLabel("Vaka bölümleri 1 metin");
  await title.waitFor({ timeout: 15000 });
  const orig = { title: await title.inputValue(), body: await body.inputValue() };
  if (orig.title !== "Kim ne yapıyor" || !orig.body) throw new Error(`beklenmeyen bölüm: ${JSON.stringify(orig)}`);
  await title.fill(`${orig.title} E2EBOLUM`);
  await body.fill(`${orig.body} E2EGOVDE`);
  await save(page, "/admin/projeler");
  const t = await waitPublic(pub, "/projeler/baseline", "E2EGOVDE");
  const heading = await pub.locator("main h3", { hasText: "E2EBOLUM" }).count();
  await page.goto(`${BASE}/admin/projeler/baseline`);
  await page.getByLabel("Vaka bölümleri 1 başlık").waitFor({ timeout: 15000 });
  await page.getByLabel("Vaka bölümleri 1 başlık").fill(orig.title);
  await page.getByLabel("Vaka bölümleri 1 metin").fill(orig.body);
  await save(page, "/admin/projeler");
  await waitPublic(pub, "/projeler/baseline", "E2EGOVDE", false);
  if (heading !== 1) throw new Error(`ara başlık h3 sayısı ${heading}`);
  return `h3 başlık + metin (${t}), geri alındı`;
});
await check(P, "İlgili hizmetler: panelde işaretli → proje sayfası bağlantısı + /hizmetler 'İlgili projeler' → ekle/kaldır geri al", async () => {
  await page.goto(`${BASE}/admin/projeler/baseline`);
  const mobil = page.getByRole("checkbox", { name: "Mobil Uygulama Geliştirme" });
  await mobil.waitFor({ timeout: 15000 });
  if (!(await mobil.isChecked())) throw new Error("Mobil işaretli değil");
  if (await page.getByRole("checkbox", { name: "SEO & Dijital Görünürlük" }).isChecked()) throw new Error("SEO beklenmedik şekilde işaretli");
  await page.getByRole("checkbox", { name: "SEO & Dijital Görünürlük" }).check();
  await save(page, "/admin/projeler");
  const t = await waitPublic(pub, "/projeler/baseline", 'href="/hizmetler#seo"');
  if (!(await waitPublic(pub, "/hizmetler", 'href="/projeler/baseline"'))) throw new Error("İlgili projeler yok");
  await page.goto(`${BASE}/admin/projeler/baseline`);
  await page.getByRole("checkbox", { name: "SEO & Dijital Görünürlük" }).uncheck();
  await save(page, "/admin/projeler");
  await waitPublic(pub, "/projeler/baseline", 'href="/hizmetler#seo"', false);
  return t;
});

/* ---------- Referanslar ---------- */
const R = "Referanslar";
const REF = `E2E Referans ${Date.now() % 100000}`;
let refPng = null;
let refSvg = null;
await check(R, "GIF ve >10MB reddi (yükleme öncesi, ağa çıkmadan)", async () => {
  await page.goto(`${BASE}/admin/referanslar/yeni`);
  let uploaded = 0;
  const onReq = (r) => r.url().includes("api.cloudinary.com") && uploaded++;
  page.on("request", onReq);
  await page.setInputFiles('[data-testid="image-input"]', `${FIX}/invalid.gif`);
  await page.getByText("desteklenmeyen türde").waitFor({ timeout: 5000 });
  await page.setInputFiles('[data-testid="image-input"]', `${FIX}/too-big.png`);
  await page.getByText("sınır 10 MB").waitFor({ timeout: 5000 });
  page.off("request", onReq);
  if (uploaded) throw new Error(`${uploaded} istek Cloudinary'ye gitti`);
  return "ağ isteği yok";
});
await check(R, "PNG logo + VARSAYILAN orijinal mod (seçim yapmadan) + açık plaka önizleme → kaydet → ana sayfada (filtresiz)", async () => {
  await page.fill('input[name="name"]', REF);
  await page.fill('input[name="url"]', "https://example.com");
  if (await page.locator('input[name="description"]').count()) throw new Error("panelde referans açıklaması alanı hâlâ var");
  [refPng] = await uploadVia(page, page.locator('[data-testid="image-input"]'), `${FIX}/test-logo.png`);
  const mode = await page.getByLabel("Görünüm").inputValue();
  if (mode !== "original") throw new Error(`varsayılan görünüm modu: ${mode}`);
  const preview = page.getByText("Sitedeki önizleme").locator("..").locator("div");
  const bg = await preview.evaluate((el) => getComputedStyle(el).backgroundColor);
  if (bg !== "rgb(10, 23, 48)") throw new Error(`önizleme zemini ${bg}`);
  const plate = await preview.locator("span").first().evaluate((el) => getComputedStyle(el).backgroundColor);
  if (plate !== "rgb(238, 242, 248)") throw new Error(`orijinal mod plakası ${plate}`);
  await page.screenshot({ path: `${SHOTS}/04-referans-form.png`, fullPage: true });
  await save(page, "/admin/referanslar");
  const t = await waitPublic(pub, "/", REF);
  const img = pub.locator(`img[src*="${refPng.split("/").pop()}"]`).first();
  const cls = await img.getAttribute("class");
  if (cls.includes("invert")) throw new Error("orijinal modda filtre var");
  const plateBg = await img.evaluate((el) => getComputedStyle(el.parentElement.parentElement).backgroundColor);
  if (plateBg !== "rgb(238, 242, 248)") throw new Error(`sitede orijinal mod plakası ${plateBg}`);
  const saved = (await adb.collection("references").where("name", "==", REF).get()).docs[0]?.data();
  if (saved?.logoMode !== "original") throw new Error(`Firestore logoMode ${saved?.logoMode}`);
  await pub.locator("#referanslar").scrollIntoViewIfNeeded();
  await pub.waitForTimeout(700);
  await pub.screenshot({ path: `${SHOTS}/05-referans-public.png` });
  return t;
});
await check(R, "Düzenle: SVG'ye geçiş + beyaz mod → eski PNG silinir, sitede filtreli SVG", async () => {
  await page.goto(`${BASE}/admin/referanslar`);
  await page.getByRole("link", { name: REF }).first().click();
  await page.getByRole("button", { name: "Değiştir" }).waitFor();
  [refSvg] = await uploadVia(page, page.locator('[data-testid="image-input"]'), `${FIX}/test-logo.svg`);
  await page.getByLabel("Görünüm").selectOption("mono");
  await save(page, "/admin/referanslar");
  const start = Date.now();
  while (Date.now() - start < 25000) {
    await pub.goto(`${BASE}/`);
    if ((await pub.content()).includes(refSvg.split("/").pop())) break;
    await pub.waitForTimeout(1500);
  }
  const cls = await pub.locator(`img[src*="${refSvg.split("/").pop()}"]`).first().getAttribute("class");
  if (!cls.includes("invert")) throw new Error("beyaz modda filtre yok");
  await assertDeleted([refPng]);
  return "PNG silindi, SVG + invert filtre";
});
await reorderCheck(R, "/admin/referanslar", "references", null, null);
const REF2 = `E2E Adressiz ${Date.now() % 100000}`;
let ref2Logo = null;
await check(R, "Web adresi boş + logo addan ÖNCE yüklenir → alt metin = firma adı, açıklama yok; gizle → sitede yok; göster → geri gelir; sil", async () => {
  await page.goto(`${BASE}/admin/referanslar/yeni`);
  [ref2Logo] = await uploadVia(page, page.locator('[data-testid="image-input"]'), `${FIX}/test-logo.svg`);
  await page.fill('input[name="name"]', REF2);
  await save(page, "/admin/referanslar");
  const t = await waitPublic(pub, "/", REF2);
  const doc = (await adb.collection("references").where("name", "==", REF2).get()).docs[0];
  const d = doc.data();
  if (d.url !== "" || d.logo?.alt !== REF2 || d.description !== "" || d.isActive !== true) throw new Error(JSON.stringify({ url: d.url, alt: d.logo?.alt, description: d.description, isActive: d.isActive }));
  const card = pub.locator("li:not([aria-hidden])", { hasText: REF2 }).first();
  if ((await card.locator("a").count()) !== 0) throw new Error("adres boşken kart bağlantı olmuş");
  if ((await card.locator("img").getAttribute("alt")) !== REF2) throw new Error("sitede alt metin firma adı değil");
  if (await card.evaluate((el) => el.hasAttribute("title") || !!el.querySelector("[title]"))) throw new Error("kartta title (açıklama ipucu) var");
  // gizle
  await page.getByRole("link", { name: REF2 }).first().click();
  await page.getByLabel("Sitede göster").waitFor({ timeout: 15000 });
  await page.getByLabel("Sitede göster").uncheck();
  await save(page, "/admin/referanslar");
  await waitPublic(pub, "/", REF2, false);
  // göster
  await page.getByRole("link", { name: REF2 }).first().click();
  await page.getByLabel("Sitede göster").waitFor({ timeout: 15000 });
  await page.getByLabel("Sitede göster").check();
  await save(page, "/admin/referanslar");
  const back = await waitPublic(pub, "/", REF2);
  await deleteRow(page, "/admin/referanslar", REF2);
  await waitPublic(pub, "/", REF2, false);
  await assertDeleted([ref2Logo]);
  return `yansıma ${t} (rebuild yok), gizle/göster ${back}, logo silindi`;
});
await check(R, "Vazgeç → kaydedilmeyen yükleme silinir", async () => {
  await page.goto(`${BASE}/admin/referanslar/yeni`);
  await page.fill('input[name="name"]', "E2E Vazgeç");
  const [id] = await uploadVia(page, page.locator('[data-testid="image-input"]'), `${FIX}/test-logo.png`);
  await page.getByRole("button", { name: "Vazgeç" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Kaydetmeden çık" }).click();
  await page.waitForURL(`${BASE}/admin/referanslar`);
  await assertDeleted([id]);
  return `${id} silindi`;
});
await check(R, "Sil → sitede kaybolur + SVG silinir", async () => {
  await deleteRow(page, "/admin/referanslar", REF);
  const t = await waitPublic(pub, "/", REF, false);
  await assertDeleted([refSvg]);
  return t;
});

/* ---------- Hero ---------- */
const HE = "Hero";
await check(HE, "Başlık (*vurgu*) + açıklama + telefon görseli değiştir → ana sayfa → orijinale döndür", async () => {
  await page.goto(`${BASE}/admin/hero`);
  const title = page.getByLabel("Başlık (H1) *");
  await title.waitFor();
  const origTitle = await title.inputValue();
  const origLead = await page.getByLabel("Açıklama").inputValue();
  const origAlt = await page.getByLabel("Görsel 3 alt metni").inputValue();
  await title.fill("E2E *vurgulu* başlık testi");
  await page.getByLabel("Açıklama").fill("E2E hero açıklaması");
  // 3. telefonu değiştir: kaldır + yenisini ekle (sona eklenir → yine 3. sıra)
  const oldThird = await page.locator("li img").nth(2).getAttribute("src");
  await page.locator("li").nth(2).getByRole("button", { name: "Kaldır" }).click();
  const [newId] = await uploadVia(page, page.locator('[data-testid="gallery-input"]'), `${FIX}/test-phone-2.png`);
  await save(page);
  await waitPublic(pub, "/", "E2E hero açıklaması");
  const grad = await pub.locator("h1 .text-gradient").first().textContent();
  if (!grad.includes("vurgulu")) throw new Error(`vurgu: ${grad}`);
  if (!(await pub.content()).includes(newId)) throw new Error("yeni telefon görseli yok");
  const oldId = oldThird.match(/(bai\/[^?]+)$/)?.[1];
  // orijinale döndür: aynı kaynak dosya + aynı alt metin
  await page.goto(`${BASE}/admin/hero`);
  await title.waitFor();
  await title.fill(origTitle);
  await page.getByLabel("Açıklama").fill(origLead);
  await page.locator("li").nth(2).getByRole("button", { name: "Kaldır" }).click();
  await uploadVia(page, page.locator('[data-testid="gallery-input"]'), `${ORIG}/projects-ss/gymbot/gymbot-01.webp`);
  await page.getByLabel("Görsel 3 alt metni").fill(origAlt);
  await save(page);
  await waitPublic(pub, "/", "E2E hero açıklaması", false);
  await assertDeleted([newId, ...(oldId ? [oldId] : [])]);
  return "yansıdı; başlık/açıklama/görsel+alt orijinal içeriğe döndü";
});

/* ---------- Ekip ---------- */
const E = "Ekip";
let teamId = null;
await check(E, "Ekip boşken Hakkımızda'da bölüm gizli", async () => {
  await pub.goto(`${BASE}/hakkimizda`);
  if ((await pub.content()).includes("Ürünü geliştiren ekip")) throw new Error("bölüm görünüyor");
});
await check(E, "Fotoğraflı üye ekle → bölüm + Person şeması → düzenle → sil (bölüm gizlenir, foto silinir)", async () => {
  await page.goto(`${BASE}/admin/ekip/yeni`);
  await page.getByLabel("Ad Soyad *").fill("E2E Test Üyesi");
  await page.getByLabel("Unvan *").fill("Test Rolü");
  [teamId] = await uploadVia(page, page.locator('[data-testid="image-input"]'), `${FIX}/test-phone-1.png`);
  await save(page, "/admin/ekip");
  await waitPublic(pub, "/hakkimizda", "E2E Test Üyesi");
  const ld = (await pub.locator('script[type="application/ld+json"]').allTextContents()).join();
  if (!ld.includes('"Person"')) throw new Error("Person şeması yok");
  if (!(await pub.content()).includes(teamId)) throw new Error("foto yok");
  await page.getByRole("link", { name: "E2E Test Üyesi" }).first().click();
  await page.getByLabel("Unvan *").waitFor();
  await page.getByLabel("Unvan *").fill("Düzenlenmiş Rol");
  await save(page, "/admin/ekip");
  await waitPublic(pub, "/hakkimizda", "Düzenlenmiş Rol");
  await deleteRow(page, "/admin/ekip", "E2E Test Üyesi");
  await waitPublic(pub, "/hakkimizda", "Ürünü geliştiren ekip", false);
  await assertDeleted([teamId]);
  return "ekle/düzenle/sil + Person + foto temizliği";
});

/* ---------- SSS ---------- */
const S = "SSS";
const Q = `E2E test sorusu ${Date.now() % 10000}?`;
await check(S, "Oluştur → sayfa + FAQPage → düzenle → sil", async () => {
  await page.goto(`${BASE}/admin/sss/yeni`);
  await page.getByLabel("Soru *").fill(Q);
  await page.getByLabel("Cevap *").fill("İlk cevap metni uçtan uca test için.");
  await save(page, "/admin/sss");
  await waitPublic(pub, "/hizmetler", Q);
  const ld1 = (await pub.locator('script[type="application/ld+json"]').allTextContents()).find((x) => x.includes("FAQPage"));
  if (!ld1?.includes(Q)) throw new Error("FAQPage'de yok");
  await page.getByRole("link", { name: Q }).first().click();
  await page.getByLabel("Cevap *").waitFor();
  await page.getByLabel("Cevap *").fill("Düzenlenmiş cevap metni uçtan uca test için.");
  await save(page, "/admin/sss");
  await waitPublic(pub, "/hizmetler", "Düzenlenmiş cevap metni");
  const ld2 = (await pub.locator('script[type="application/ld+json"]').allTextContents()).find((x) => x.includes("FAQPage"));
  if (!ld2?.includes("Düzenlenmiş cevap")) throw new Error("FAQPage güncellenmedi");
  await deleteRow(page, "/admin/sss", Q);
  return await waitPublic(pub, "/hizmetler", Q, false);
});
await reorderCheck(S, "/admin/sss", "faq", "/hizmetler", async (p) => p.locator("details summary h3").allTextContents());

/* ---------- Sayfalar ---------- */
const SA = "Sayfalar";
async function pageEdit(slug, path, locate, marker, label) {
  await check(SA, `${label}: düzenle → ${path} → geri al`, async () => {
    await page.goto(`${BASE}/admin/sayfalar/${slug}`);
    const f = locate(page);
    await f.waitFor({ timeout: 15000 });
    const orig = await f.inputValue();
    const probe = marker.replace(/[\n#]/g, "").trim();
    await f.fill(`${orig} ${marker}`);
    await save(page);
    const t = await waitPublic(pub, path, probe);
    await f.fill(orig);
    await save(page);
    await waitPublic(pub, path, probe, false);
    return t;
  });
}
await pageEdit("anasayfa", "/", (p) => p.locator("section", { hasText: "05 — Neden BAI" }).getByLabel("Adımlar 1", { exact: true }), "E2ESTEP", "Ana Sayfa (Neden BAI adımı)");
await pageEdit("anasayfa", "/", (p) => p.locator("section", { hasText: "04 — Referanslar" }).getByLabel("Başlık"), "E2EREF", "Ana Sayfa (referans başlığı)");
await check(SA, "Ana Sayfa referans açıklaması: boşken öğe basılmaz → doldur → görünür → yeniden boşalt", async () => {
  const para = () => pub.locator('section[aria-labelledby="referanslar"] h2 + p');
  await page.goto(`${BASE}/admin/sayfalar/anasayfa`);
  const f = page.locator("section", { hasText: "04 — Referanslar" }).getByLabel("Açıklama");
  await f.waitFor({ timeout: 15000 });
  if ((await f.inputValue()) !== "") throw new Error(`açıklama boş değil: ${await f.inputValue()}`);
  await pub.goto(`${BASE}/`);
  if ((await para().count()) !== 0) throw new Error("boş açıklama için paragraf basılmış");
  await f.fill("E2EACIKLAMA");
  await save(page);
  await waitPublic(pub, "/", "E2EACIKLAMA");
  if ((await para().count()) !== 1) throw new Error("dolu açıklama görünmedi");
  await f.fill("");
  await save(page);
  await waitPublic(pub, "/", "E2EACIKLAMA", false);
  if ((await para().count()) !== 0) throw new Error("boşaltınca paragraf kaldı");
  return "boş → öğe yok; dolu → görünür; yeniden boş";
});
for (const [slug, path] of [
  ["hakkimizda", "/hakkimizda"],
  ["hizmetler", "/hizmetler"],
  ["projeler", "/projeler"],
  ["iletisim", "/iletisim"],
  ["aydinlatma-metni", "/aydinlatma-metni"],
  ["gizlilik-politikasi", "/gizlilik-politikasi"],
  ["cerez-politikasi", "/cerez-politikasi"],
])
  await pageEdit(slug, path, (p) => p.getByLabel("Başlık (H1)"), "E2EH1", `${slug} (H1)`);
await pageEdit("projeler", "/projeler", (p) => p.getByLabel("Başlık (title)"), "E2ETITLE", "projeler (SEO title)");
// İçerik planıyla gelen yeni alanlar
await pageEdit("hizmetler", "/hizmetler", (p) => p.getByLabel("Süreç adımları 1 metin"), "E2EADIM", "hizmetler (proje süreci adımı)");
await pageEdit("hizmetler", "/hizmetler", (p) => p.getByLabel("“Kime uygun” etiketi"), "E2EETIKET", "hizmetler (kart bölüm etiketi)");
await pageEdit("hakkimizda", "/hakkimizda", (p) => p.getByLabel("Kuruluş paragrafı"), "E2EKURULUS", "hakkimizda (kuruluş paragrafı)");
await pageEdit("hakkimizda", "/hakkimizda", (p) => p.getByLabel("İlkeler 3 metin"), "E2EILKE", "hakkimizda (üçüncü ilke)");
await pageEdit("iletisim", "/iletisim", (p) => p.getByLabel("Form üstü yardımcı metin"), "E2EIPUCU", "iletisim (form ipucu)");
await pageEdit("iletisim", "/iletisim", (p) => p.getByLabel("Proje türü seçenekleri 1", { exact: true }), "E2EKONU", "iletisim (proje türü seçeneği)");
await pageEdit("aydinlatma-metni", "/aydinlatma-metni", (p) => p.getByLabel("Metin (Markdown)"), "\n\n## E2E Markdown Başlığı", "aydinlatma-metni (Markdown gövde)");

/* ---------- Site Ayarları ---------- */
const SE = "Site Ayarları";
await check(SE, "Telefon, e-posta, sosyal link, harita, SEO, logo değiştir → header/footer/iletişim/schema → orijinale döndür", async () => {
  await page.goto(`${BASE}/admin/site-ayarlari`);
  await page.getByLabel("Telefon").waitFor();
  const orig = {
    phone: await page.getByLabel("Telefon").inputValue(),
    email: await page.getByLabel("E-posta", { exact: true }).inputValue(),
    map: await page.getByLabel(/Google Maps embed/).inputValue(),
    desc: await page.getByLabel("Varlık tanımı (Organization.description)").inputValue(),
    logoAlt: await page.getByLabel("Alt metin").first().inputValue(),
  };
  await page.getByLabel("Telefon").fill("+90 500 000 0000");
  await page.getByLabel("E-posta", { exact: true }).fill("e2e-test@baitech.com.tr");
  await page.getByRole("button", { name: "+ Hesap ekle" }).click();
  await page.getByLabel("Platform 1").fill("linkedin");
  await page.getByLabel("Bağlantı 1").fill("https://www.linkedin.com/company/e2e-test");
  await page.getByLabel(/Google Maps embed/).fill("https://www.google.com/maps?q=38.6823,29.4082&output=embed");
  await page.getByLabel("Varlık tanımı (Organization.description)").fill(`${orig.desc} E2EORG`);
  const logoBox = page.locator("section", { hasText: "Marka" }).first();
  const oldLogoSrc = await logoBox.locator("img").first().getAttribute("src");
  const [newLogo] = await uploadVia(page, logoBox.locator('[data-testid="image-input"]'), `${FIX}/test-logo.png`);
  await save(page);
  await waitPublic(pub, "/iletisim", "+90 500 000 0000");
  const html = await pub.content();
  const checks = {
    "footer telefon": html.includes("tel:+905000000000"),
    "e-posta": html.includes("e2e-test@baitech.com.tr"),
    "footer sosyal": html.includes("linkedin.com/company/e2e-test"),
    harita: (await pub.locator("iframe[title='Konum haritası']").count()) === 1,
    "schema sameAs": html.includes('"sameAs":["https://www.linkedin.com/company/e2e-test"'),
    "schema description": html.includes("E2EORG"),
    "header logo": (await pub.locator("header img").first().getAttribute("src")).includes(newLogo.split("/").pop()),
  };
  const miss = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  await pub.screenshot({ path: `${SHOTS}/06-ayarlar-public.png`, fullPage: false });
  // orijinale döndür
  await page.goto(`${BASE}/admin/site-ayarlari`);
  await page.getByLabel("Telefon").waitFor();
  await page.getByLabel("Telefon").fill(orig.phone);
  await page.getByLabel("E-posta", { exact: true }).fill(orig.email);
  await page.getByLabel(/Google Maps embed/).fill(orig.map);
  await page.getByLabel("Varlık tanımı (Organization.description)").fill(orig.desc);
  await page.locator("section", { hasText: "Sosyal medya" }).getByRole("button", { name: "Kaldır" }).click();
  await uploadVia(page, page.locator("section", { hasText: "Marka" }).first().locator('[data-testid="image-input"]'), `${ORIG}/bai-logo.png`);
  await page.getByLabel("Alt metin").first().fill(orig.logoAlt);
  await save(page);
  await waitPublic(pub, "/iletisim", "+90 500 000 0000", false);
  const oldLogoId = oldLogoSrc.match(/(bai\/[A-Za-z0-9_/-]+)$/)?.[1];
  await assertDeleted([newLogo, ...(oldLogoId ? [oldLogoId] : [])]);
  if (miss.length) throw new Error(`yansımadı: ${miss.join(", ")}`);
  return "7 yansıma doğrulandı, orijinale döndürüldü";
});

await check(SE, "Şirket unvanı + konum koordinatları: düzenle → footer + schema (legalName, geo, hasMap) → orijinale döndür", async () => {
  await page.goto(`${BASE}/admin/site-ayarlari`);
  const legal = page.getByLabel("Şirket unvanı");
  const lat = page.getByLabel("Konum — enlem");
  const lng = page.getByLabel("Konum — boylam");
  await legal.waitFor({ timeout: 15000 });
  const orig = { legal: await legal.inputValue(), lat: await lat.inputValue(), lng: await lng.inputValue() };
  if (orig.legal !== "BAI Teknoloji Sanayi ve Ticaret Ltd. Şti." || orig.lat !== "38.6823" || orig.lng !== "29.4082") throw new Error(`beklenmeyen değer: ${JSON.stringify(orig)}`);
  // Geçersiz koordinat kaydedilmez
  await lat.fill("123");
  await page.click('button[type="submit"]');
  await page.getByText(/Konum koordinatlarını kontrol edin/).waitFor({ timeout: 5000 });
  await legal.fill(`${orig.legal} E2EUNVAN`);
  await lat.fill("39.1234");
  await lng.fill("30.5678");
  await save(page);
  await waitPublic(pub, "/iletisim", "E2EUNVAN");
  const html = await pub.content();
  const footer = await pub.locator("footer").innerText();
  const checks = {
    "footer unvan": footer.includes("E2EUNVAN"),
    "schema legalName": html.includes('"legalName":"BAI Teknoloji Sanayi ve Ticaret Ltd. Şti. E2EUNVAN"'),
    "schema geo": html.includes('"latitude":39.1234,"longitude":30.5678'),
    "schema hasMap": html.includes("maps?q=39.1234,30.5678"),
  };
  const miss = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);
  await page.goto(`${BASE}/admin/site-ayarlari`);
  await page.getByLabel("Şirket unvanı").waitFor({ timeout: 15000 });
  await page.getByLabel("Şirket unvanı").fill(orig.legal);
  await page.getByLabel("Konum — enlem").fill(orig.lat);
  await page.getByLabel("Konum — boylam").fill(orig.lng);
  await save(page);
  await waitPublic(pub, "/iletisim", "E2EUNVAN", false);
  if (!(await pub.content()).includes('"latitude":38.6823,"longitude":29.4082')) throw new Error("koordinat orijinale dönmedi");
  if (miss.length) throw new Error(`yansımadı: ${miss.join(", ")}`);
  return "geçersiz koordinat reddedildi; 4 yansıma doğrulandı; 38.6823 / 29.4082 geri yüklendi";
});

/* =========================================================
 * BÖLÜM 3 — İLETİŞİM FORMU (gerçek Resend)
 * ========================================================= */
const F = "İletişim formu";
const SUBJ = `E2E form ${new Date().toISOString().slice(11, 19)}`;
async function firestoreWrites(p, fn) {
  let n = 0;
  const on = (r) => r.url().includes("firestore.googleapis.com") && r.method() === "POST" && /Write|commit/.test(r.url()) && n++;
  p.on("request", on);
  await fn();
  await p.waitForTimeout(1500);
  p.off("request", on);
  return n;
}
async function fillForm(p, { name = "E2E Test Kullanıcısı", email = EMAIL, phone = "0506 356 14 90", subject = SUBJ, message = "Bu mesaj panel uçtan uca testi tarafından gönderildi; test sonunda silinecek." } = {}) {
  await p.getByLabel(/Adınız ve Soyadınız/).fill(name);
  await p.getByLabel(/E-posta Adresiniz/).fill(email);
  await p.getByLabel(/^Telefon/).fill(phone);
  await p.getByLabel(/^Konu/).fill(subject);
  await p.getByLabel(/Mesajınız/).fill(message);
}
const formCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const fp = await formCtx.newPage();
await check(F, "Boş form → 5 hata, odak hata özetinde", async () => {
  await fp.goto(`${BASE}/iletisim`);
  await fp.getByRole("button", { name: "Mesaj Gönder" }).click();
  const t = (await fp.getByText(/Formda \d hata var/).textContent()).trim();
  await fp.waitForTimeout(300);
  const focused = await fp.evaluate(() => document.activeElement?.getAttribute("role"));
  if (focused !== "alert") throw new Error("odak özet kutusunda değil");
  return t;
});
await check(F, "Geçersiz e-posta / kısa ad / geçersiz telefon → alan hataları", async () => {
  await fp.getByLabel(/E-posta Adresiniz/).fill("gecersiz-eposta");
  await fp.getByLabel(/Adınız ve Soyadınız/).fill("A");
  await fp.getByLabel(/^Telefon/).fill("abc");
  await fp.getByRole("button", { name: "Mesaj Gönder" }).click();
  for (const s of ["Geçerli bir e-posta adresi", "en az 2 karakter", "Telefon en az 7 karakter"]) await fp.getByText(s).first().waitFor({ timeout: 4000 });
  const lens = await fp.evaluate(() => [...document.querySelectorAll("form input, form textarea")].map((e) => `${e.name}:${e.maxLength}:${e.type}:${e.autocomplete}`));
  return lens.filter((x) => !x.startsWith("website")).join(" ");
});
await check(F, "KVKK onaysız → hata, Firestore'a yazım YOK", async () => {
  await fp.goto(`${BASE}/iletisim`);
  await fp.waitForTimeout(2600);
  await fillForm(fp);
  const n = await firestoreWrites(fp, () => fp.getByRole("button", { name: "Mesaj Gönder" }).click());
  await fp.getByText("KVKK onayı gerekli").first().waitFor();
  if (n) throw new Error(`${n} yazım isteği`);
  return "0 istek";
});
await check(F, "Honeypot dolu → sahte başarı, yazım YOK", async () => {
  await fp.goto(`${BASE}/iletisim`);
  await fp.waitForTimeout(2600);
  await fillForm(fp, { subject: "E2E honeypot" });
  await fp.evaluate(() => (document.getElementById("cf-website").value = "http://spam"));
  await fp.getByRole("checkbox").click();
  const n = await firestoreWrites(fp, () => fp.getByRole("button", { name: "Mesaj Gönder" }).click());
  await fp.getByText("Yeni mesaj").waitFor();
  if (n) throw new Error(`${n} yazım`);
  return "başarı ekranı, 0 yazım";
});
await check(F, "Çok hızlı doldurma (<2.5 sn) → sahte başarı, yazım YOK", async () => {
  await fp.goto(`${BASE}/iletisim`);
  await fillForm(fp, { subject: "E2E timing" });
  await fp.getByRole("checkbox").click();
  const n = await firestoreWrites(fp, () => fp.getByRole("button", { name: "Mesaj Gönder" }).click());
  if (n) throw new Error(`${n} yazım`);
  return "0 yazım";
});
let subId = null;
let topicPath = null;
const TOPIC = "Mobil uygulama";
await check(F, "Geçerli gönderim (proje türü seçili) → başarı + Firestore + /api/contact-notify", async () => {
  await fp.goto(`${BASE}/iletisim`);
  await fp.waitForTimeout(2600);
  await fillForm(fp);
  // Proje türü seçimi (panelden gelen seçenekler)
  const options = await fp.getByLabel("Proje türü").locator("option").allTextContents();
  if (options.length !== 8 || options[1] !== TOPIC) throw new Error(`proje türü seçenekleri: ${options}`);
  await fp.getByLabel("Proje türü").selectOption(TOPIC);
  await fp.getByRole("checkbox").click();
  const [resp] = await Promise.all([
    fp.waitForResponse((r) => r.url().endsWith("/api/contact-notify"), { timeout: 20000 }),
    fp.getByRole("button", { name: "Mesaj Gönder" }).click(),
  ]);
  await fp.getByText("Yeni mesaj").waitFor({ timeout: 15000 });
  await fp.screenshot({ path: `${SHOTS}/07-form-basari.png` });
  // Kurallar `topic` alanını tanıyorsa alan olarak, tanımıyorsa (kurallar henüz yayınlanmadıysa) konu satırının başında saklanır
  const all = (await adb.collection("submissions").get()).docs.filter((x) => String(x.data().subject ?? "").includes(SUBJ));
  if (all.length !== 1) throw new Error(`Firestore kayıt sayısı ${all.length}`);
  subId = all[0].id;
  const d = all[0].data();
  if (d.isRead !== false || d.consent !== true || !d.phone) throw new Error(JSON.stringify(d));
  // Kurallar yayında: proje türü kendi alanına yazılır, konu satırına eklenmez
  topicPath = d.topic === TOPIC && d.subject === SUBJ ? "alan" : null;
  if (!topicPath) throw new Error(`proje türü kendi alanında değil: ${JSON.stringify({ topic: d.topic, subject: d.subject })}`);
  return `HTTP ${resp.status()}, kayıt ${subId}, topic="${d.topic}", konu satırı değişmedi`;
});
async function resendFor(subject) {
  const r = await fetch("https://api.resend.com/emails?limit=20", { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } });
  const { data } = await r.json();
  return data.filter((e) => e.subject.includes(subject) || (e.subject.startsWith("Mesajınız alındı") && Date.now() - Date.parse(e.created_at.replace(" ", "T").replace(/\+00$/, "Z")) < 120000));
}
await check(F, "Resend: 2 mail (ekibe bildirim reply-to=müşteri, müşteriye onay reply-to=ekip) teslim", async () => {
  let mails = [];
  for (let i = 0; i < 20; i++) {
    mails = await resendFor(SUBJ);
    if (mails.length >= 2 && mails.every((m) => ["delivered", "sent"].includes(m.last_event))) break;
    await sleep(2000);
  }
  const team = mails.find((m) => m.subject.includes(SUBJ));
  const cust = mails.find((m) => m.subject.startsWith("Mesajınız alındı"));
  if (!team || !cust) throw new Error(`bulunan: ${mails.map((m) => m.subject).join(" | ")}`);
  if (team.reply_to?.[0] !== EMAIL) throw new Error(`ekip reply-to ${team.reply_to}`);
  if (cust.to?.[0] !== EMAIL) throw new Error(`müşteri alıcı ${cust.to}`);
  const notified = (await adb.collection("submissions").doc(subId).get()).data().notifiedAt;
  if (!notified) throw new Error("notifiedAt yazılmadı");
  // Ekip bildiriminde proje türü: alan olarak geldiyse "Proje türü" satırında, değilse konu satırında
  const body = await (await fetch(`https://api.resend.com/emails/${team.id}`, { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } })).json();
  if (!String(body.html ?? "").includes(TOPIC)) throw new Error("ekip bildiriminde proje türü yok");
  if (topicPath === "alan" && !body.html.includes("Proje türü")) throw new Error("ekip bildiriminde 'Proje türü' satırı yok");
  return `ekip→${team.to} (${team.last_event}, reply-to ${team.reply_to}) · müşteri→${cust.to} (${cust.last_event}, reply-to ${cust.reply_to})`;
});
await check(F, "notifiedAt kilidi: aynı kayıt için tekrar tetikleme mail üretmez", async () => {
  const before = (await resendFor(SUBJ)).filter((m) => m.subject.includes(SUBJ)).length;
  await Promise.all([1, 2, 3].map(() => fetch(`${BASE}/api/contact-notify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: subId }) })));
  await sleep(4000);
  const after = (await resendFor(SUBJ)).filter((m) => m.subject.includes(SUBJ)).length;
  if (after !== before) throw new Error(`${before} → ${after}`);
  const junk = await fetch(`${BASE}/api/contact-notify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{bozuk" });
  return `3 eşzamanlı istek → yeni mail 0 · bozuk gövde HTTP ${junk.status}`;
});
await check(F, "Proje türü seçilmeden gönderim → kayıt `topic` alanı olmadan yazılır", async () => {
  await fp.getByRole("button", { name: "Yeni mesaj" }).click();
  await fp.waitForTimeout(2600);
  const subj = `E2E konusuz ${Date.now() % 100000}`;
  await fillForm(fp, { subject: subj });
  await fp.getByRole("checkbox").click();
  await Promise.all([fp.waitForResponse((r) => r.url().endsWith("/api/contact-notify"), { timeout: 20000 }), fp.getByRole("button", { name: "Mesaj Gönder" }).click()]);
  await fp.getByText("Yeni mesaj").waitFor({ timeout: 15000 });
  const docs = (await adb.collection("submissions").where("subject", "==", subj).get()).docs;
  if (docs.length !== 1 || "topic" in docs[0].data()) throw new Error(`kayıt ${docs.length}, alanlar ${docs[0] ? Object.keys(docs[0].data()) : "-"}`);
  await docs[0].ref.delete();
  return "kayıt yazıldı, topic alanı yok; test kaydı silindi";
});
await check(F, "Cihaz başına hız sınırı (10 dk'da 3) → 4. gönderim engellenir", async () => {
  await fp.evaluate(() => localStorage.setItem("bai-form-gonderim", JSON.stringify([Date.now(), Date.now(), Date.now()])));
  await fp.goto(`${BASE}/iletisim`);
  await fp.waitForTimeout(2600);
  await fillForm(fp, { subject: "E2E rate" });
  await fp.getByRole("checkbox").click();
  const n = await firestoreWrites(fp, () => fp.getByRole("button", { name: "Mesaj Gönder" }).click());
  await fp.getByText("Kısa sürede çok fazla mesaj").waitFor({ timeout: 5000 });
  if (n) throw new Error(`${n} yazım`);
  return "uyarı gösterildi, 0 yazım";
});
await formCtx.close();

/* ---------- Gelen Kutusu ---------- */
const I = "Gelen Kutusu";
await check(I, "Kayıt düştü + okunmamış rozeti + okundu/okunmadı + sil", async () => {
  await page.goto(`${BASE}/admin/gelen-kutusu`);
  const row = page.locator("li", { hasText: SUBJ });
  await row.waitFor({ timeout: 15000 });
  const badge = await page.locator("aside").first().getByText(/^\d+$/).first().textContent().catch(() => "");
  await row.locator("button").first().click();
  const notified = (await row.locator("dt:has-text('Mail bildirimi') + dd").textContent()).trim();
  if (topicPath === "alan" && !(await row.locator("dt:has-text('Proje türü') + dd").textContent()).includes(TOPIC)) throw new Error("gelen kutusunda proje türü yok");
  await sleep(800);
  if ((await adb.collection("submissions").doc(subId).get()).data().isRead !== true) throw new Error("açınca okundu olmadı");
  await row.getByRole("button", { name: "Okunmadı işaretle" }).click();
  await sleep(800);
  if ((await adb.collection("submissions").doc(subId).get()).data().isRead !== false) throw new Error("okunmadı işaretlenemedi");
  await page.screenshot({ path: `${SHOTS}/08-gelen-kutusu.png`, fullPage: true });
  await row.getByRole("button", { name: "Sil" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Sil" }).click();
  await row.waitFor({ state: "detached" });
  // Arayüz satırı iyimser kaldırır; sunucu commit'ini bekle
  let gone = false;
  for (let i = 0; i < 10 && !gone; i++) {
    await sleep(500);
    gone = !(await adb.collection("submissions").doc(subId).get()).exists;
  }
  if (!gone) throw new Error("silinmedi");
  return `rozet ${badge || "-"}, ${notified}`;
});

/* ---------- Panel mobil + çıkış ---------- */
await check("Panel", "Mobil (390): çekmece menü, taşma yok, tüm modül sayfaları", async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  const bad = [];
  for (const p of ["/admin", "/admin/projeler", "/admin/projeler/baseline", "/admin/hizmetler/web", "/admin/referanslar", "/admin/hero", "/admin/ekip", "/admin/sss", "/admin/sayfalar", "/admin/sayfalar/hakkimizda", "/admin/site-ayarlari", "/admin/gelen-kutusu"]) {
    await page.goto(BASE + p, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 0) bad.push(`${p}+${o}`);
  }
  await page.goto(`${BASE}/admin/projeler/baseline`);
  await page.getByLabel("Başlık *", { exact: true }).waitFor();
  await page.screenshot({ path: `${SHOTS}/09-panel-mobil-form.png`, fullPage: false });
  await page.getByRole("button", { name: "Menüyü aç" }).click();
  await page.getByRole("link", { name: "Referanslar" }).waitFor();
  await page.screenshot({ path: `${SHOTS}/10-panel-mobil-menu.png` });
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1280, height: 900 });
  if (bad.length) throw new Error(bad.join(", "));
  return "12 sayfa";
});
await check("Panel", "Çıkış → oturum + refresh token iptal", async () => {
  await page.goto(`${BASE}/admin`);
  const cookie = (await ctx.cookies()).find((c) => c.name === "admin_session")?.value;
  await page.getByRole("button", { name: "Çıkış Yap" }).click();
  await page.waitForURL(`${BASE}/admin/login`);
  await page.goto(`${BASE}/admin`);
  if (!page.url().endsWith("/admin/login")) throw new Error(page.url());
  // Eski cookie'yi geri koy: iptal edildiği için reddedilmeli
  await ctx.addCookies([{ name: "admin_session", value: cookie, domain: "localhost", path: "/" }]);
  const r = await page.request.post(`${BASE}/api/admin/revalidate`);
  await ctx.clearCookies();
  if (r.status() !== 401) throw new Error(`iptal edilmiş cookie ${r.status()}`);
  return "eski cookie 401";
});

if (pageErrors.length) results.push({ group: "Panel", name: "Sayfa JS hataları", ok: false, detail: pageErrors.slice(0, 5).join(" | ") });
await browser.close();
rmSync(`${FIX}/too-big.png`, { force: true });

// Test verisi kalıntı kontrolü
const leftovers = [];
for (const [col, field, val] of [
  ["projects", "slug", PSLUG],
  ["services", "title", `${ST} Düzenlendi`],
  ["references", "name", REF],
  ["faq", "question", Q],
  ["teamMembers", "name", "E2E Test Üyesi"],
]) if (!(await adb.collection(col).where(field, "==", val).get()).empty) leftovers.push(col);
const subs = await adb.collection("submissions").get();
for (const d of subs.docs) if (String(d.data().subject ?? "").startsWith("E2E") || String(d.data().name ?? "").startsWith("E2E")) {
  await d.ref.delete();
  leftovers.push(`submission ${d.id} (temizlendi)`);
}
results.push({ group: "Temizlik", name: "Firestore'da test verisi kalmadı", ok: leftovers.filter((l) => !l.includes("temizlendi")).length === 0, detail: leftovers.join(", ") });
writeFileSync(`${SHOTS}/results.json`, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} geçti`);
failed.forEach((f) => console.log(`  ✗ [${f.group}] ${f.name}: ${f.detail}`));
process.exit(failed.length ? 1 : 0);
