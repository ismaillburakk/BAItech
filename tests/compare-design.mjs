/**
 * Tasarım koruma karşılaştırması: taslak (statik) ↔ yeni site (Firestore'lu).
 * Aynı rotaların tam sayfa ekran görüntülerini reduced-motion ile (animasyonların
 * son hali) alır: tests/screenshots/compare/{route}-{taslak|yeni}-{w}.png
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const TASLAK = process.env.TASLAK_URL ?? "http://localhost:4300";
const YENI = process.env.SITE_URL ?? "http://localhost:3100";
const ROUTES = [
  ["/", "home"],
  ["/hizmetler", "hizmetler"],
  ["/projeler", "projeler"],
  ["/projeler/dukan", "proje-dukan"],
  ["/hakkimizda", "hakkimizda"],
  ["/iletisim", "iletisim"],
];
const WIDTHS = (process.env.WIDTHS ?? "1440,390").split(",").map(Number);
const OUT = "tests/screenshots/compare";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const [route, name] of ROUTES) {
    for (const [label, base] of [["taslak", TASLAK], ["yeni", YENI]]) {
      const url = base + (label === "taslak" && route !== "/" ? route + "/" : route);
      await page.goto(url, { waitUntil: "networkidle" });
      // Görünür alana girince oynayan (whileInView) bölümler ve lazy görseller için sayfayı kaydır
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 120));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/${name}-${label}-${w}.png`, fullPage: true });
    }
  }
  await ctx.close();
}
await browser.close();
console.log("ok");
