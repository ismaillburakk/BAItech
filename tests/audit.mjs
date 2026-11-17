/**
 * Mobil + SEO denetimi (Playwright, gerçek cihaz emülasyonu).
 * - Viewport'lar: 320, 375, 390, 430, 768, 1024 (+1440)
 * - Yatay taşma, <44px dokunma hedefi, <16px form input fontu
 * - Tek h1, başlık hiyerarşisi atlaması, title/description uzunluğu,
 *   canonical, hreflang, OG/Twitter, JSON-LD parse, görsel alt metni
 * Çıktı: tests/screenshots/audit/*.png + konsola rapor (JSON)
 */
import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const BASE = process.env.SITE_URL ?? "http://localhost:3100";
const ROUTES = [
  "/",
  "/hizmetler",
  "/projeler",
  "/projeler/baseline",
  "/projeler/bukira",
  "/projeler/gymbot",
  "/projeler/dukan",
  "/projeler/isletmelere-ozel-yazilim",
  "/projeler/chatekg",
  "/hakkimizda",
  "/iletisim",
  "/aydinlatma-metni",
  "/gizlilik-politikasi",
  "/cerez-politikasi",
  "/olmayan-sayfa-404",
  "/admin/login",
];
const VIEWPORTS = [
  { name: "320", viewport: { width: 320, height: 640 }, mobile: true },
  { name: "375-iphone-se", ...devices["iPhone SE"] },
  { name: "390-iphone-14", ...devices["iPhone 14"] },
  { name: "430-iphone-14-pro-max", ...devices["iPhone 14 Pro Max"] },
  { name: "768-ipad-mini", ...devices["iPad Mini"] },
  { name: "820-ipad-air", viewport: { width: 820, height: 1180 }, mobile: true },
  { name: "1024", viewport: { width: 1024, height: 768 } },
  { name: "1440", viewport: { width: 1440, height: 900 } },
];
const OUT = "tests/screenshots/audit";
mkdirSync(OUT, { recursive: true });

const report = { overflow: [], touch: [], inputs: [], seo: [], errors: [], cls: [], lightbox: [] };
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const { name, mobile, ...opts } = vp;
  const ctx = await browser.newContext({ ...opts, ...(mobile ? { isMobile: true, hasTouch: true } : {}) });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => report.errors.push(`${name} ${page.url()} pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && report.errors.push(`${name} ${page.url()} console: ${m.text().slice(0, 200)}`));
  for (const route of ROUTES) {
    await page.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__cls += e.value))).observe({ type: "layout-shift", buffered: true });
    });
    const res = await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(300);
    const cls = await page.evaluate(() => window.__cls);
    if (cls > 0.1) report.cls.push(`${name} ${route}: CLS ${cls.toFixed(3)}`);
    if (route === "/projeler/dukan" && mobile) {
      await page.getByRole("button", { name: /^Büyüt:/ }).first().click();
      await page.getByRole("dialog").waitFor();
      await page.waitForTimeout(500); // açılış (zoom-in) animasyonu bitsin
      const small = await page.evaluate(() =>
        [...document.querySelectorAll('[role="dialog"] button')].map((b) => [b.textContent.trim() || b.getAttribute("aria-label") || "x", b.getBoundingClientRect()]).filter(([, r]) => r.height < 44 || r.width < 44).map(([t, r]) => `${t} ${Math.round(r.width)}x${Math.round(r.height)}`),
      );
      const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (small.length || o > 0) report.lightbox.push(`${name}: ${small.join(", ")} ${o > 0 ? `taşma +${o}` : ""}`);
      await page.screenshot({ path: `${OUT}/${name}-lightbox.png` });
      await page.keyboard.press("Escape");
    }
    const r = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflow = doc.scrollWidth - doc.clientWidth;
      const wide = [];
      if (overflow > 0) {
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.right > doc.clientWidth + 1 && b.width > 0 && getComputedStyle(el).position !== "fixed") {
            wide.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} → ${Math.round(b.right)}`);
            if (wide.length > 4) break;
          }
        }
      }
      // Dokunma hedefleri: görünür, etkileşimli, metin içi olmayan
      const small = [];
      for (const el of document.querySelectorAll("a[href], button, summary, input, select, textarea, [role=button]")) {
        const s = getComputedStyle(el);
        if (s.visibility === "hidden" || s.display === "none" || el.closest("[aria-hidden=true]")) continue;
        let b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        const after = getComputedStyle(el, "::after");
        if (after.position === "absolute" && after.content !== "none") {
          // after:absolute after:inset-0 → tıklama alanı en yakın konumlu atadır (kart)
          let host = el.parentElement;
          while (host && getComputedStyle(host).position === "static") host = host.parentElement;
          if (host) b = host.getBoundingClientRect();
        }
        if (el.matches("a") && el.closest("p, li.prose, .prose-legal, dd, label")) continue; // metin içi bağlantı (WCAG 2.5.8 istisnası)
        if (el.classList.contains("sr-only") || s.position === "absolute" && b.width < 2) continue;
        if (b.height < 44 || b.width < 24) small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
      }
      const inputs = [...document.querySelectorAll("input, textarea, select")]
        .filter((el) => el.type !== "checkbox" && el.type !== "hidden")
        .map((el) => [el.name || el.id, parseFloat(getComputedStyle(el).fontSize)])
        .filter(([, fs]) => fs < 16);
      const h1 = [...document.querySelectorAll("h1")].map((h) => h.textContent.trim());
      const levels = [...document.querySelectorAll("main h1, main h2, main h3, main h4, main h5, main h6")].map((h) => +h.tagName[1]);
      const skips = [];
      for (let i = 1; i < levels.length; i++) if (levels[i] - levels[i - 1] > 1) skips.push(`${levels[i - 1]}→${levels[i]}`);
      const meta = (sel, attr = "content") => document.querySelector(sel)?.getAttribute(attr) ?? null;
      const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          const j = JSON.parse(s.textContent);
          return (j["@graph"] ?? (Array.isArray(j) ? j : [j])).map((x) => [x["@type"]].flat().join("+"));
        } catch {
          return ["PARSE_ERROR"];
        }
      });
      const noAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length;
      return {
        overflow,
        wide,
        small,
        inputs,
        h1,
        skips,
        title: document.title,
        description: meta('meta[name="description"]'),
        canonical: meta('link[rel="canonical"]', "href"),
        hreflang: meta('link[rel="alternate"][hreflang="tr-TR"]', "href"),
        ogTitle: meta('meta[property="og:title"]'),
        ogImage: meta('meta[property="og:image"]'),
        twitter: meta('meta[name="twitter:card"]'),
        robots: meta('meta[name="robots"]'),
        ld: ld.flat(),
        noAlt,
      };
    });
    const tag = `${name} ${route}`;
    if (r.overflow > 0) report.overflow.push(`${tag}: +${r.overflow}px ${r.wide.join(" | ")}`);
    if (r.small.length) report.touch.push(`${tag}: ${r.small.slice(0, 6).join(" ; ")}${r.small.length > 6 ? ` (+${r.small.length - 6})` : ""}`);
    if (r.inputs.length) report.inputs.push(`${tag}: ${JSON.stringify(r.inputs)}`);
    if (name === "1440") {
      report.seo.push({
        route,
        status: res?.status(),
        title: r.title,
        titleLen: [...r.title].length,
        descLen: r.description ? [...r.description].length : 0,
        h1: r.h1,
        skips: r.skips,
        canonical: r.canonical,
        hreflang: r.hreflang,
        og: !!(r.ogTitle && r.ogImage),
        twitter: r.twitter,
        robots: r.robots,
        ld: r.ld,
        imgNoAlt: r.noAlt,
      });
    }
    if (["320", "390-iphone-14", "768-ipad-mini"].includes(name) || (name === "1440" && route === "/")) {
      await page.screenshot({ path: `${OUT}/${name}${route.replace(/\//g, "_") || "_home"}.png`, fullPage: false });
    }
  }
  await ctx.close();
}
await browser.close();
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
