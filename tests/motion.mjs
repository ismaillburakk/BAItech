import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || "/tmp";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const msgs = [];
p.on("console", (m) => { if (["error", "warning"].includes(m.type())) msgs.push(`${m.type()}: ${m.text().slice(0, 220)}`); });
p.on("pageerror", (e) => msgs.push("pageerror: " + e.message));
await p.goto(BASE + "/", { waitUntil: "load" });
await p.waitForTimeout(2500);
// JSON-LD root shape
const ld = await p.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => { const j = JSON.parse(x.textContent); return { ctx: j["@context"], arr: Array.isArray(j), graph: Array.isArray(j["@graph"]) ? j["@graph"].length : 0 }; }));
console.log("LD", JSON.stringify(ld));
// Rail
const rail = await p.evaluate(() => {
  const ul = [...document.querySelectorAll("ul")].find((u) => u.className.includes("w-max") && u.querySelector("a[href^='/projeler/']"));
  if (!ul) return null;
  const outer = ul.closest(".relative");
  return { top: outer.getBoundingClientRect().top + scrollY, h: outer.offsetHeight, sw: ul.scrollWidth };
});
console.log("RAIL", JSON.stringify(rail));
const xs = [];
if (rail) {
  for (const f of [0, 0.25, 0.5, 0.75, 1]) {
    await p.evaluate((y) => window.scrollTo(0, y), rail.top + f * (rail.h - 900));
    await p.waitForTimeout(500);
    xs.push(await p.evaluate(() => { const ul = [...document.querySelectorAll("ul")].find((u) => u.className.includes("w-max") && u.querySelector("a[href^='/projeler/']")); return Math.round(new DOMMatrix(getComputedStyle(ul).transform).m41); }));
    await p.screenshot({ path: `${OUT}/rail-${f}.png` });
  }
}
console.log("RAIL_X", JSON.stringify(xs));
// marquee
const mq = await p.evaluate(() => {
  const r = document.querySelector('[role="region"][aria-label] .marquee-track ul[aria-label]')?.closest(".marquee-track");
  if (!r) return null;
  const a = new DOMMatrix(getComputedStyle(r).transform).m41;
  return { anim: getComputedStyle(r).animationName, dur: getComputedStyle(r).animationDuration, a };
});
await p.waitForTimeout(1000);
const mq2 = await p.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('[role="region"] ul[aria-label]').closest(".marquee-track")).transform).m41);
console.log("MARQUEE", JSON.stringify(mq), "after1s", Math.round(mq2));
const ref = await p.locator("#referanslar").first();
await ref.scrollIntoViewIfNeeded();
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/references.png` });
// Teknoloji şeridi kaldırıldı; proje kartlarındaki teknoloji etiketleri duruyor
const strip = await p.evaluate(() => ({
  techStrip: !!document.querySelector("#teknoloji, [aria-label='Kullandığımız teknolojiler']"),
  marquees: document.querySelectorAll(".marquee-track").length,
  projectTechTags: [...document.querySelectorAll("a[href^='/projeler/']")].some((a) => /React Native|Django|PyTorch/.test(a.closest("li,article")?.textContent ?? "")),
  heroCue: document.querySelector('a[href="#kesfet"]') ? !!document.getElementById("kesfet") : "yok",
}));
console.log("STRIP", JSON.stringify(strip));
console.log("MSGS", JSON.stringify(msgs, null, 1));
await b.close();
