import { chromium } from "playwright";
// /hizmetler kartları: yığın (yapışkan) düzeninde her kart, her sekmesiyle görünür alana sığıyor mu;
// liste düzeninde dört bölüm de açık mı; sekmeler klavyeyle çalışıyor mu; yatay taşma var mı.
//   node tests/service-cards.mjs [BASE]
const BASE = process.argv[2] || "http://localhost:3100";
const OUT = "tests/screenshots/service-cards";
import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
let fail = 0;
const VIEWPORTS = [
  [1920, 1080], [1440, 900], [1440, 789], [1366, 768], [1280, 800], [1280, 720], [1280, 704], [1280, 650],
  [1024, 1366], [1024, 900], [1024, 768], [768, 1024], [430, 932], [390, 844], [320, 640],
];
for (const [w, h] of VIEWPORTS) {
  const mobile = w < 768;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile });
  const p = await ctx.newPage();
  const errors = [];
  p.on("console", (m) => ["error", "warning"].includes(m.type()) && errors.push(m.text().slice(0, 160)));
  p.on("pageerror", (e) => errors.push("pageerror " + e.message));
  await p.goto(BASE + "/hizmetler", { waitUntil: "load" });
  await p.waitForTimeout(900);
  const r = await p.evaluate(async () => {
    const cards = [...document.querySelectorAll("article")];
    const stick = (el) => el.parentElement;
    const stacked = getComputedStyle(stick(cards[0])).position === "sticky";
    const rows = [];
    for (const card of cards) {
      const top = parseFloat(getComputedStyle(stick(card)).top) || 0;
      const tabs = [...card.querySelectorAll('[role="tab"]')];
      const visibleTabs = tabs.filter((t) => t.offsetParent !== null);
      const panels = [...card.querySelectorAll(".svc-panel")];
      let maxH = card.offsetHeight;
      const perTab = [];
      if (stacked) {
        for (const t of visibleTabs) {
          t.click();
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          perTab.push(card.offsetHeight);
          maxH = Math.max(maxH, card.offsetHeight);
          const shown = panels.filter((x) => x.offsetParent !== null).length;
          if (shown !== 1) perTab.push(`!${shown} panel`);
        }
        visibleTabs[0]?.click();
        await new Promise((r) => requestAnimationFrame(r));
      }
      rows.push({
        title: card.querySelector("h2").textContent.trim(),
        top,
        maxH,
        avail: innerHeight - top,
        fits: !stacked || maxH <= innerHeight - top,
        tabs: visibleTabs.length,
        openPanels: panels.filter((x) => x.offsetParent !== null).length,
        panels: panels.length,
        heights: [...new Set(perTab)],
        overflowX: card.scrollWidth > card.clientWidth + 1,
        smallTap: visibleTabs.filter((t) => t.offsetHeight < 44).length,
      });
    }
    return { stacked, rows, pageOverflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  const bad = r.rows.filter((x) => !x.fits || x.overflowX || x.smallTap || (r.stacked ? x.tabs !== x.panels || x.heights.length > 1 : x.openPanels !== x.panels || x.tabs !== 0));
  const worst = r.rows.reduce((a, x) => (x.avail - x.maxH < a.avail - a.maxH ? x : a));
  if (bad.length || r.pageOverflow || errors.length) fail++;
  console.log(
    `${w}×${h} ${r.stacked ? "YIĞIN" : "liste"} · ${r.rows.length} kart · en dar: "${worst.title}" kart ${worst.maxH}px / alan ${Math.round(worst.avail)}px` +
      `${r.pageOverflow ? " · YATAY TAŞMA" : ""}${errors.length ? ` · KONSOL ${errors[0]}` : ""} ${bad.length ? "HATA " + JSON.stringify(bad.map((x) => ({ t: x.title, maxH: x.maxH, avail: x.avail, tabs: x.tabs, open: x.openPanels, h: x.heights }))) : "OK"}`,
  );
  if ([[1440, 900], [1280, 704], [390, 844], [768, 1024]].some(([a, c]) => a === w && c === h)) {
    await p.locator("article").nth(1).scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/kart-${w}x${h}.png` });
  }
  // Klavye: sekmeler ok tuşlarıyla gezilir (yalnız yığın düzeninde)
  if (r.stacked) {
    const first = p.locator("article").first().locator('[role="tab"]').first();
    await first.focus();
    await p.keyboard.press("ArrowRight");
    const sel = await p.locator("article").first().locator('[role="tab"][aria-selected="true"]').textContent();
    const focused = await p.evaluate(() => document.activeElement?.textContent);
    const panelRole = await p.locator("article").first().locator(".svc-panel:visible").getAttribute("role");
    if (sel !== focused || panelRole !== "tabpanel") { fail++; console.log(`  klavye sekme HATA: seçili "${sel}" odak "${focused}" rol ${panelRole}`); }
  }
  await ctx.close();
}
// JS kapalı: yığın kapalı, tüm bölümler açık
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(BASE + "/hizmetler");
  const r = await p.evaluate(() => {
    const cards = [...document.querySelectorAll("article")];
    return {
      sticky: cards.filter((c) => getComputedStyle(c.parentElement).position === "sticky").length,
      hiddenPanels: [...document.querySelectorAll(".svc-panel")].filter((x) => x.offsetParent === null).length,
      visibleTabs: [...document.querySelectorAll('[role="tab"]')].filter((x) => x.offsetParent !== null).length,
      titles: [...document.querySelectorAll(".svc-panel-title")].filter((x) => x.getBoundingClientRect().width > 2).length,
      panels: document.querySelectorAll(".svc-panel").length,
    };
  });
  const ok = r.sticky === 0 && r.hiddenPanels === 0 && r.visibleTabs === 0 && r.titles === r.panels;
  if (!ok) fail++;
  console.log(`JS kapalı 1440×900: ${JSON.stringify(r)} ${ok ? "OK" : "HATA"}`);
  await ctx.close();
}
await b.close();
console.log(fail ? `HATA: ${fail}` : "TÜMÜ OK");
process.exit(fail ? 1 : 0);
