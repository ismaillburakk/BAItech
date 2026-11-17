import { chromium } from "playwright";
// Ana sayfa bento kartı → /hizmetler#slug: ekranda en üstte görünen kart doğru hizmet mi?
const BASE = process.argv[2] || "http://localhost:3100";
const EXPECTED = Number(process.env.EXPECTED_SERVICES ?? 8);
const b = await chromium.launch();
let fail = 0;
const topCard = (p) =>
  p.evaluate(() => {
    const y = Math.round(innerHeight * 0.45);
    const el = document.elementFromPoint(innerWidth / 2, y);
    return el?.closest("article")?.querySelector("h2")?.textContent?.trim() ?? null;
  });
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto(BASE + "/");
  await p.waitForTimeout(1500);
  const cards = await p.$$eval('a[href^="/hizmetler#"]', (as) => as.map((a) => ({ href: a.getAttribute("href"), title: a.textContent.trim() })));
  if (cards.length !== EXPECTED) {
    fail++;
    console.log(`${vp.width} ana sayfa bento: ${cards.length} kart, beklenen ${EXPECTED} HATA`);
  }
  for (const c of cards) {
    await p.goto(BASE + "/");
    await p.waitForTimeout(800);
    const link = p.locator(`a[href="${c.href}"]`).first();
    await link.scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    await link.click();
    await p.waitForURL((u) => u.pathname === "/hizmetler");
    await p.waitForTimeout(1200);
    const got = await topCard(p);
    const ok = got === c.title;
    if (!ok) fail++;
    console.log(`${vp.width} home→${c.href}: beklenen "${c.title}" görünen "${got}" ${ok ? "OK" : "HATA"}`);
  }
  // Sayfa içi gezinme: aşağı kaydırılmışken üstteki hizmet çipleri
  await p.goto(BASE + "/hizmetler");
  await p.waitForTimeout(800);
  const chips = await p.$$eval('nav[aria-label="Hizmetler"] a', (as) => as.map((a) => ({ href: a.getAttribute("href"), title: a.textContent.trim() })));
  const stack = await p.$$eval("article h2", (hs) => hs.map((h) => h.textContent.trim()));
  if (chips.length !== EXPECTED || stack.length !== EXPECTED) {
    fail++;
    console.log(`${vp.width} /hizmetler: ${chips.length} çip, ${stack.length} kart, beklenen ${EXPECTED} HATA`);
  }
  for (const c of [...chips].reverse()) {
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.45));
    await p.waitForTimeout(300);
    await p.evaluate((h) => document.querySelector(`a[href="${h}"]`).click(), c.href);
    await p.waitForTimeout(1200);
    const got = await topCard(p);
    const ok = got === c.title;
    if (!ok) fail++;
    console.log(`${vp.width} /hizmetler ${c.href}: beklenen "${c.title}" görünen "${got}" ${ok ? "OK" : "HATA"}`);
  }
  await p.close();
}
await b.close();
console.log(fail ? `HATA: ${fail}` : "TÜMÜ OK");
process.exit(fail ? 1 : 0);
