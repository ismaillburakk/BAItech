/**
 * Davranış testleri (Playwright): JS kapalı SSR, reduced-motion, mobil menü
 * (focus trap + kaydırma kilidi), galeri swipe, yönlendirmeler, 404,
 * robots.txt / sitemap.xml, taşma (320–1024). node tests/behavior.mjs
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.SITE_URL ?? "http://localhost:3100";
const SHOTS = "tests/screenshots/behavior";
mkdirSync(SHOTS, { recursive: true });
const results = [];
async function check(name, fn) {
  try {
    const d = await fn();
    results.push(true);
    console.log(`✓ ${name}${d ? ` — ${d}` : ""}`);
  } catch (e) {
    results.push(false);
    console.log(`✗ ${name} — ${e.message.split("\n")[0].slice(0, 300)}`);
  }
}
const browser = await chromium.launch();

/* ---------- JS kapalı (AI crawler / SEO) ---------- */
await check("JS kapalı: tüm sayfalarda içerik HTML'de ve görünür", async () => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const checks = [
    ["/", ["Yazılımı", "yaşatırız", "BAI Technology", "Geliştirme, yayın ve sonrası", "Baseline", "Ahmet Demir Mimarlık", "Neden BAI Technology?"]],
    // Kartın dört bölümü (sekmelerin tamamı), proje süreci ve kapalı SSS cevapları sunucu HTML'inde
    ["/hizmetler", ["Mobil Uygulama Geliştirme", "Mobil uygulama yaptırmak nasıl bir süreç?", "Kime uygun", "App Store ve Google Play başvurusu ve yayını", "kapsamı görüşmede birlikte daraltıyoruz", "Bir proje nasıl yürür?", "BAI Technology Uşak merkezli bir yazılım firmasıdır", "BAI Technology hosting ve sunucu kurulumu yapıyor mu?", "PyTorch"]],
    ["/hakkimizda", ["2025'te Zafer Teknopark bünyesinde kurulmuş bir yazılım ve yapay zeka firmasıdır", "Nasıl çalışırız?", "Teslimden sonrası", "Ar-Ge ve Yaklaşım"]],
    ["/projeler/gymbot", ["GymBot", "Antrenman ve beslenme takibi uygulaması", "Sırada ne var", "henüz yayında değil", "App Store", "Google Play"]],
    ["/iletisim", ["info@baitech.com.tr", "+90 506 356 1490", "Mesaj Bırakın", "Proje türü", "Hosting / SEO / Bakım"]],
  ];
  const missing = [];
  for (const [path, texts] of checks) {
    await p.goto(BASE + path);
    // Crawler'ın gördüğü: sunucu HTML'indeki metin (kapalı <details> cevapları dahil)
    const body = await p.evaluate(() => document.body.textContent);
    for (const t of texts) if (!body.includes(t)) missing.push(`${path}: ${t}`);
  }
  // Kaydırmayla aydınlanan kimlik metni JS'siz tam opak mı?
  await p.goto(`${BASE}/hakkimizda`);
  const opacity = await p.evaluate(() => {
    const w = document.querySelector("[data-reveal]");
    return w ? getComputedStyle(w).opacity : "1";
  });
  await p.screenshot({ path: `${SHOTS}/nojs-hakkimizda.png` });
  await ctx.close();
  if (missing.length) throw new Error(missing.join(" | "));
  if (opacity !== "1") throw new Error(`reveal opaklığı ${opacity}`);
  return "5 sayfa, kapalı SSS cevapları dahil";
});

/* ---------- prefers-reduced-motion ---------- */
await check("Reduced motion: ilerleme çubuğu yok, header gizlenmez, hero telefonları statik", async () => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.waitForTimeout(500);
  const before = await p.evaluate(() => [...document.querySelectorAll("section img")].slice(0, 3).map((i) => i.getBoundingClientRect().top));
  await p.mouse.wheel(0, 1200);
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => ({
    progress: !!document.querySelector(".fixed.inset-x-0.top-0.z-\\[60\\]"),
    headerY: getComputedStyle(document.querySelector("header")).transform,
    marquee: getComputedStyle(document.querySelector(".marquee-track")).animationName,
  }));
  await p.mouse.wheel(0, -1200);
  await p.waitForTimeout(400);
  const after = await p.evaluate(() => [...document.querySelectorAll("section img")].slice(0, 3).map((i) => i.getBoundingClientRect().top));
  await ctx.close();
  if (r.progress) throw new Error("kaydırma ilerleme çubuğu var");
  if (r.headerY !== "none" && !r.headerY.includes("0, 0)")) throw new Error(`header transform ${r.headerY}`);
  if (r.marquee !== "none") throw new Error(`marquee animasyonu: ${r.marquee}`);
  if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("hero görselleri kaydırmayla hareket etti");
  return "marquee durdu, parallax/scrub kapalı";
});

/* ---------- Mobil menü ---------- */
await check("Mobil menü: açılır, odak menüde kalır, body kilitlenir, Escape kapatır, link gezinir", async () => {
  const ctx = await browser.newContext({ ...devices["iPhone 14"] });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.getByRole("button", { name: "Menüyü aç" }).click();
  const dialog = p.locator("[data-radix-popper-content-wrapper]");
  await dialog.waitFor();
  await p.screenshot({ path: `${SHOTS}/mobil-menu-acik.png` });
  const locked = await p.evaluate(() => getComputedStyle(document.body).overflow === "hidden" || document.body.hasAttribute("data-scroll-locked"));
  for (let i = 0; i < 12; i++) await p.keyboard.press("Tab");
  const inside = await p.evaluate(() => !!document.activeElement?.closest("[data-radix-popper-content-wrapper]"));
  await p.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  await p.getByRole("button", { name: "Menüyü aç" }).click();
  await p.locator("[data-radix-popper-content-wrapper]").getByRole("link", { name: "Projeler" }).click();
  await p.waitForURL(`${BASE}/projeler`);
  await p.waitForTimeout(500);
  const closed = (await p.locator("[data-radix-popper-content-wrapper]").count()) === 0;
  await ctx.close();
  if (!locked) throw new Error("body kaydırma kilidi yok");
  if (!inside) throw new Error("odak menüden çıktı");
  if (!closed) throw new Error("gezinmeden sonra menü açık kaldı");
  return "focus trap + scroll lock + Escape + otomatik kapanma";
});

/* ---------- Galeri swipe ---------- */
await check("Galeri (mobil): lightbox'ta yatay swipe görsel değiştirir, dikey kaydırma serbest", async () => {
  const ctx = await browser.newContext({ ...devices["iPhone 14"] });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/projeler/baseline`);
  const first = p.getByRole("button", { name: /^Büyüt:/ }).first();
  await first.scrollIntoViewIfNeeded();
  await first.tap();
  const desc = p.getByRole("dialog").locator("p").first();
  await desc.waitFor();
  const before = await desc.textContent();
  const box = await p.getByRole("dialog").locator(".touch-pan-y").boundingBox();
  const cdp = await ctx.newCDPSession(p);
  const y = box.y + box.height / 2;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width * 0.8, y }] });
  for (let i = 1; i <= 6; i++)
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width * (0.8 - i * 0.1), y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await p.waitForTimeout(300);
  const after = await desc.textContent();
  const touchAction = await p.getByRole("dialog").locator(".touch-pan-y").evaluate((el) => getComputedStyle(el).touchAction);
  await p.screenshot({ path: `${SHOTS}/galeri-swipe.png` });
  await ctx.close();
  if (before === after) throw new Error(`değişmedi: ${before}`);
  return `${before.split("·").pop().trim()} → ${after.split("·").pop().trim()}, touch-action: ${touchAction}`;
});

/* ---------- Sekmeli galeri ---------- */
await check("Sekmeli galeri (Dukan): sekme değiştirir", async () => {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(`${BASE}/projeler/dukan`);
  await p.getByRole("tab", { name: "Yönetim Paneli" }).click();
  await p.getByRole("button", { name: /Büyüt: Dukan e-ticaret yönetim paneli/ }).first().waitFor();
  await p.close();
});

/* ---------- Yönlendirme, 404, robots, sitemap ---------- */
await check("Eski URL yönlendirmeleri (308)", async () => {
  const out = [];
  for (const [from, to] of [
    ["/projeler/e-ticaret", "/projeler/dukan"],
    ["/projeler/cetin-group-app", "/projeler/isletmelere-ozel-yazilim"],
    ["/projeler/yonetim-sistemleri", "/projeler/isletmelere-ozel-yazilim"],
    ["/hizmetler/", "/hizmetler"],
  ]) {
    const r = await fetch(BASE + from, { redirect: "manual" });
    const loc = r.headers.get("location") ?? "";
    if (![301, 308].includes(r.status) || !loc.endsWith(to)) throw new Error(`${from} → ${r.status} ${loc}`);
    out.push(r.status);
  }
  return out.join(",");
});
await check("404: olmayan sayfa + olmayan proje", async () => {
  const a = await fetch(`${BASE}/olmayan-sayfa`);
  const b = await fetch(`${BASE}/projeler/olmayan-proje`);
  const html = await b.text();
  if (a.status !== 404 || b.status !== 404) throw new Error(`${a.status}/${b.status}`);
  if (!html.includes("bulunamadı")) throw new Error("404 içeriği yok");
  return "404/404";
});
await check("robots.txt: AI crawler'lar açık, /admin ve /api kapalı, sitemap", async () => {
  const t = await (await fetch(`${BASE}/robots.txt`)).text();
  for (const s of ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot", "Google-Extended", "Disallow: /admin", "Disallow: /api/", "Sitemap: https://baitech.com.tr/sitemap.xml"])
    if (!t.includes(s)) throw new Error(`eksik: ${s}`);
});
await check("sitemap.xml: statik + 6 proje + görseller", async () => {
  const t = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = (t.match(/<loc>/g) ?? []).length;
  for (const s of ["/projeler/chatekg", "/hakkimizda", "/aydinlatma-metni", "image:loc"]) if (!t.includes(s)) throw new Error(`eksik: ${s}`);
  if (t.includes("/admin")) throw new Error("admin sitemap'te");
  return `${urls} URL`;
});

/* ---------- Taşma (tüm genişlikler, tüm public rotalar) ---------- */
await check("Yatay taşma yok: 320/375/390/430/768/1024 × 9 rota", async () => {
  const routes = ["/", "/hizmetler", "/projeler", "/projeler/dukan", "/projeler/isletmelere-ozel-yazilim", "/hakkimizda", "/iletisim", "/aydinlatma-metni", "/olmayan"];
  const bad = [];
  for (const w of [320, 375, 390, 430, 768, 1024]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, isMobile: w < 768, hasTouch: w < 1024 });
    const p = await ctx.newPage();
    for (const r of routes) {
      await p.goto(BASE + r, { waitUntil: "networkidle" });
      const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (o > 0) bad.push(`${w}${r}+${o}`);
    }
    await ctx.close();
  }
  if (bad.length) throw new Error(bad.join(", "));
  return "54 kombinasyon temiz";
});

/* ---------- Klavye ---------- */
await check("Klavye: atlama bağlantısı ilk Tab'da görünür, Enter içeriğe taşır", async () => {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/");
  await p.keyboard.press("Tab");
  const r = await p.evaluate(() => ({ t: document.activeElement.textContent.trim(), w: document.activeElement.getBoundingClientRect().width }));
  await p.keyboard.press("Enter");
  await p.waitForTimeout(300);
  const after = await p.evaluate(() => document.activeElement.id || document.activeElement.tagName);
  await p.close();
  if (r.t !== "İçeriğe geç" || r.w < 10) throw new Error(JSON.stringify(r));
  if (after !== "icerik") throw new Error(`odak: ${after}`);
  return "İçeriğe geç → #icerik";
});
await check("Klavye: Tab/Shift+Tab ile ilk 25 odakta odak halkası görünür, gizli öğeye odak yok", async () => {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/");
  const bad = [];
  const seen = [];
  for (let i = 0; i < 25; i++) {
    await p.keyboard.press("Tab");
    const r = await p.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      let ring = (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) >= 1) || /rgb/.test(cs.boxShadow);
      // Kart içi bağlantılar: halka kartın kendisinde (has-focus-visible:ring)
      for (let a = el.parentElement, i = 0; !ring && a && i < 6; a = a.parentElement, i++) ring = /rgb/.test(getComputedStyle(a).boxShadow) && a.matches(":has(:focus-visible)");
      return { name: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30), ring, visible: b.width > 0 && b.height > 0 && cs.visibility !== "hidden" };
    });
    seen.push(r.name);
    if (!r.ring) bad.push(`halka yok: ${r.name}`);
    if (!r.visible) bad.push(`görünmez: ${r.name}`);
  }
  await p.keyboard.press("Shift+Tab");
  const back = await p.evaluate(() => (document.activeElement.textContent || "").trim().slice(0, 30));
  await p.close();
  if (back !== seen[23]) bad.push(`Shift+Tab: ${back} ≠ ${seen[23]}`);
  if (bad.length) throw new Error(bad.slice(0, 5).join(" | "));
  return `${seen.length} odak, Shift+Tab geri`;
});
await check("Klavye: galeri (Enter aç, ←/→, Escape, odak tetikleyiciye döner)", async () => {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(`${BASE}/projeler/bukira`);
  const btn = p.getByRole("button", { name: /^Büyüt:/ }).nth(1);
  await btn.focus();
  await p.keyboard.press("Enter");
  const d = p.getByRole("dialog").locator("p").first();
  await d.waitFor();
  const a = await d.textContent();
  await p.keyboard.press("ArrowRight");
  const b2 = await d.textContent();
  await p.keyboard.press("ArrowLeft");
  const c = await d.textContent();
  await p.keyboard.press("Escape");
  await p.getByRole("dialog").waitFor({ state: "detached" });
  const back = await p.evaluate(() => document.activeElement.getAttribute("aria-label") || "");
  await p.close();
  if (a === b2 || a !== c) throw new Error(`${a} / ${b2} / ${c}`);
  if (!back.startsWith("Büyüt:")) throw new Error(`odak dönüşü: ${back}`);
  return `${a.split("·").pop().trim()} → ${b2.split("·").pop().trim()} → geri`;
});
await check("Klavye: sekmeler (←/→), breadcrumb menüsü, SSS (Enter), proje filtresi", async () => {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(`${BASE}/projeler/dukan`);
  await p.getByRole("tab").first().focus();
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(400);
  const sel = await p.getByRole("tab", { selected: true }).textContent();
  await p.getByRole("button", { name: /Diğer projeler/ }).focus();
  await p.keyboard.press("Enter");
  await p.getByRole("menuitem").first().waitFor();
  await p.keyboard.press("Escape");
  await p.goto(`${BASE}/hizmetler`);
  const sum = p.locator("details summary").nth(2);
  await sum.focus();
  await p.keyboard.press("Enter");
  const open = await p.locator("details").nth(2).evaluate((e) => e.open);
  const firstClosed = !(await p.locator("details").first().evaluate((e) => e.open));
  await p.goto(`${BASE}/projeler`);
  await p.getByRole("button", { name: /^Yapay Zeka/ }).focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(500);
  const shown = await p.getByText(/proje gösteriliyor/).textContent();
  await p.close();
  if (sel.trim() !== "Yönetim Paneli") throw new Error(`sekme: ${sel}`);
  if (!open || !firstClosed) throw new Error("SSS tek-açık davranışı");
  // Yapay zeka filtresi: yalnızca ChatEKG (GymBot'un yapay zeka özellikleri yayında değil)
  if (!shown.startsWith("1")) throw new Error(shown);
  return `sekme=${sel.trim()}, SSS tek açık, filtre "${shown.trim()}"`;
});

/* ---------- JSON-LD istemci geçişleri ---------- */
await check("JSON-LD: istemci tarafı gezinmede birikmez / doğru sayfada", async () => {
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(BASE + "/");
  const types = async () =>
    (await p.locator('script[type="application/ld+json"]').allTextContents()).flatMap((t) => { const j = JSON.parse(t); return j["@graph"] ?? [j].flat(); }).map((x) => [x["@type"]].flat().join("+"));
  const log = [];
  for (const name of ["Hizmetler", "Projeler", "Hakkımızda", "Ana Sayfa"]) {
    await p.locator("header nav").getByRole("link", { name, exact: true }).click();
    await p.waitForTimeout(900);
    const t = await types();
    const org = t.filter((x) => x.startsWith("Organization")).length;
    const faq = t.filter((x) => x === "FAQPage").length;
    log.push(`${name}:${t.length}`);
    if (org !== 1) throw new Error(`${name}: Organization ×${org}`);
    if (name === "Hizmetler" ? faq !== 1 : faq !== 0) throw new Error(`${name}: FAQPage ×${faq}`);
  }
  await p.close();
  return log.join(" ");
});

/* ---------- Çerez / tema ---------- */
await check("Ziyaretçiye çerez yazılmaz; tek (koyu) tema tutarlı", async () => {
  const c = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  for (const r of ["/", "/hizmetler", "/projeler/gymbot", "/iletisim"]) await p.goto(BASE + r);
  const cookies = await c.cookies();
  const scheme = await p.evaluate(() => [document.documentElement.className.includes("dark"), getComputedStyle(document.body).backgroundColor]);
  const light = await browser.newContext({ colorScheme: "light" });
  const lp = await light.newPage();
  await lp.goto(BASE + "/");
  const lbg = await lp.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await light.close();
  await c.close();
  if (cookies.length) throw new Error(`çerezler: ${cookies.map((x) => x.name)}`);
  if (lbg !== scheme[1]) throw new Error(`açık sistem temasında farklı zemin ${lbg}`);
  return `0 çerez, zemin ${scheme[1]} (açık/koyu sistemde aynı)`;
});

await browser.close();
console.log(`\n${results.filter(Boolean).length}/${results.length} geçti`);
process.exit(results.every(Boolean) ? 0 : 1);
