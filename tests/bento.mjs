import { chromium } from "playwright";
// Ana sayfa hizmet bento'su + hero→sonraki bölüm geçişi + referans şeridi: genişlik × taşma / dokunma hedefi / ekran görüntüsü
const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "tests/screenshots/services8";
const b = await chromium.launch();
let fail = 0;
for (const w of [320, 375, 390, 768, 1024, 1440]) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: mobile ? 800 : 900 }, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  await p.goto(BASE + "/");
  await p.waitForTimeout(1200);
  const ul = p.locator("ul:has(a[href^='/hizmetler#'])").first();
  await ul.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  const r = await ul.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const items = [...el.children].map((li) => li.getBoundingClientRect());
    const rows = [...new Set(items.map((i) => Math.round(i.top)))].length;
    // ızgaradaki boş hücre: kartların toplam alanı / kap alanı
    const area = items.reduce((a, i) => a + i.width * i.height, 0);
    // Bağlantının ::after'ı kartın tamamını kaplıyorsa dokunma hedefi karttır
    const target = (a) => (getComputedStyle(a, "::after").position === "absolute" ? a.closest("li").getBoundingClientRect() : a.getBoundingClientRect());
    const links = [...el.querySelectorAll("a")].map(target).filter((x) => x.width < 44 || x.height < 44).length;
    const over = [...el.querySelectorAll("*")].filter((n) => n.getBoundingClientRect().right > box.right + 1 && getComputedStyle(n).position !== "absolute").length;
    return { cards: items.length, rows, fill: Math.round((area / (box.width * box.height)) * 100), smallTargets: links, overflowEls: over, pageOverflow: document.documentElement.scrollWidth > innerWidth };
  });
  const ok = r.cards === 8 && !r.smallTargets && !r.pageOverflow && !r.overflowEls;
  if (!ok) fail++;
  console.log(`${w}: ${JSON.stringify(r)} ${ok ? "OK" : "HATA"}`);
  await ul.screenshot({ path: `${OUT}/bento-${w}.png` });
  await p.evaluate(() => scrollTo(0, 0));
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/hero-gecis-${w}.png`, fullPage: false, clip: undefined });
  await ctx.close();
}
await b.close();
console.log(fail ? `HATA: ${fail}` : "TÜMÜ OK");
process.exit(fail ? 1 : 0);
