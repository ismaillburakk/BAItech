import { chromium } from "playwright";
// Kaydırma + imleç hareketinde kare süreleri ve ana iş parçacığı yükü (CDP metrikleri).
const BASE = process.argv[2] || "http://localhost:3100";
const RUNS = 3;
const b = await chromium.launch();
async function run(vp, cpu, mobile) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Performance.enable");
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForTimeout(2500);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  await b.startTracing(p, { categories: ["devtools.timeline", "disabled-by-default-devtools.timeline"] });
  const m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  await p.evaluate(() => {
    window.__f = [];
    let last = performance.now();
    const tick = (t) => { window.__f.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  // 1) imleç: hero üzerinde 2 sn dairesel hareket (yalnızca masaüstü)
  if (!mobile) for (let i = 0; i < 120; i++) await p.mouse.move(700 + Math.cos(i / 8) * 400, 400 + Math.sin(i / 8) * 250);
  // 2) kaydırma: sayfa sonuna kadar 16 ms aralıklı tekerlek adımları
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 60) { await p.mouse.wheel(0, 60); await p.waitForTimeout(16); }
  await p.waitForTimeout(300);
  const f = await p.evaluate(() => { window.__stop = true; return window.__f.slice(2); });
  const m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
  const trace = JSON.parse((await b.stopTracing()).toString()).traceEvents;
  const dur = (n) => trace.filter((e) => e.name === n && e.ph === "X").reduce((a, e) => a + (e.dur || 0), 0) / 1000;
  const cnt = (n) => trace.filter((e) => e.name === n).length;
  await ctx.close();
  const s = [...f].sort((a, b) => a - b);
  const sum = f.reduce((a, c) => a + c, 0);
  return {
    fps: (f.length / sum) * 1000,
    p95: s[Math.floor(s.length * 0.95)],
    jank: (f.filter((x) => x > 25).length / f.length) * 100,
    script: (m1.ScriptDuration - m0.ScriptDuration) * 1000,
    layout: (m1.LayoutDuration - m0.LayoutDuration) * 1000,
    style: (m1.RecalcStyleDuration - m0.RecalcStyleDuration) * 1000,
    task: (m1.TaskDuration - m0.TaskDuration) * 1000,
    paint: dur("Paint"),
    paints: cnt("Paint"),
    raster: dur("RasterTask"),
  };
}
for (const [name, vp, cpu, mobile] of [
  ["masaüstü 1440 (CPU 1x)", { width: 1440, height: 900 }, 1, false],
  ["masaüstü 1440 (CPU 4x yavaş)", { width: 1440, height: 900 }, 4, false],
  ["mobil 390 (CPU 4x yavaş)", { width: 390, height: 844 }, 4, true],
]) {
  const rs = [];
  for (let i = 0; i < RUNS; i++) rs.push(await run(vp, cpu, mobile));
  const med = (k) => [...rs.map((r) => r[k])].sort((a, b) => a - b)[Math.floor(RUNS / 2)];
  console.log(`${name}: fps ${med("fps").toFixed(1)} · p95 kare ${med("p95").toFixed(1)} ms · >25ms kare %${med("jank").toFixed(1)} · script ${med("script").toFixed(0)} ms · layout ${med("layout").toFixed(0)} ms · style ${med("style").toFixed(0)} ms · toplam görev ${med("task").toFixed(0)} ms · paint ${med("paints")} adet/${med("paint").toFixed(0)} ms · raster ${med("raster").toFixed(0)} ms`);
}
await b.close();
