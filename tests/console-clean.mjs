/**
 * Konsol temizliği + hidrasyon: 11 sayfa × (normal, hareketi azalt) × (masaüstü, mobil).
 * Kabul: konsolda hata ve uyarı 0 (React hidrasyon hatası dahil), giriş animasyonlu hiçbir öğe gizli
 * kalmıyor; sayaçlar her iki modda doğru değeri gösteriyor; kart eğimi normal modda çalışıyor,
 * hareketi azalt modunda statik.
 *   node tests/console-clean.mjs [BASE]
 */
import { chromium } from "playwright";
const BASE = process.argv[2] || "http://localhost:3100";
const ROUTES = ["/", "/hizmetler", "/projeler", "/projeler/baseline", "/projeler/bukira", "/projeler/gymbot", "/projeler/dukan", "/projeler/isletmelere-ozel-yazilim", "/projeler/chatekg", "/hakkimizda", "/iletisim"];
const b = await chromium.launch();
let fail = 0;
for (const mode of ["no-preference", "reduce"])
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: mode, isMobile: w < 768, hasTouch: w < 768 });
    const p = await ctx.newPage();
    let cur = "";
    const msgs = [];
    p.on("pageerror", (e) => msgs.push(`${cur} pageerror: ${e.message.slice(0, 110)}`));
    p.on("console", (m) => ["error", "warning"].includes(m.type()) && msgs.push(`${cur} ${m.type()}: ${m.text().slice(0, 110)}`));
    const hidden = [];
    const notes = [];
    for (const path of ROUTES) {
      cur = path;
      await p.goto(BASE + path, { waitUntil: "load" });
      await p.waitForTimeout(500);
      const H = await p.evaluate(() => document.body.scrollHeight);
      for (let y = 0; y < H; y += 500) {
        await p.mouse.wheel(0, 500);
        await p.waitForTimeout(90);
      }
      await p.waitForTimeout(1500);
      const n = await p.evaluate(() => [...document.querySelectorAll("main [data-reveal]")].filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length);
      if (n) hidden.push(`${path}:${n}`);
      if (path === "/") {
        // Sayaçlar: son değer (yayındaki uygulama 3, proje 6, hizmet 8)
        const stats = await p.evaluate(() => [...document.querySelectorAll("span.tabular")].map((s) => s.textContent.trim()).filter((t) => /^\d+$/.test(t)));
        for (const want of ["3", "6", "8"]) if (!stats.includes(want)) notes.push(`sayaç ${want} yok (${stats.slice(0, 8)})`);
      }
      if (path === "/hakkimizda" && w >= 768) {
        // Kart eğimi: normal modda imleçle döner, hareketi azalt modunda dönmez
        const card = p.locator(".group\\/tilt").first();
        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();
        await p.mouse.move(box.x + box.width * 0.15, box.y + box.height * 0.2);
        await p.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.25, { steps: 4 });
        await p.waitForTimeout(450);
        const tf = await card.evaluate((el) => getComputedStyle(el).transform);
        // Birim matris (2B ya da 3B) = eğim yok
        const nums = (tf.slice(tf.indexOf("(") + 1).match(/-?[\d.]+(?:e-?\d+)?/g) ?? []).map(Number);
        const identity = tf === "none" || (nums.length === 6 ? [1, 0, 0, 1, 0, 0] : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]).every((v, i) => (nums.length === 16 && i > 10) || Math.abs((nums[i] ?? v) - v) < 0.0005); // 3B: yalnızca dönüş/ölçek bileşenleri (perspektif terimi eğim değildir)
        const tilted = !identity;
        if (mode === "reduce" ? tilted : !tilted) notes.push(`kart eğimi ${mode === "reduce" ? "statik olmalıydı" : "çalışmadı"} (${tf.slice(0, 40)})`);
        else notes.push(`✓eğim ${tilted ? "var" : "yok"}`);
      }
    }
    const bad = msgs.length || hidden.length || notes.some((x) => !x.startsWith("✓"));
    if (bad) fail++;
    console.log(`${bad ? "✗" : "✓"} ${mode === "reduce" ? "hareketi azalt" : "normal"} · ${w}px · konsol ${msgs.length} · gizli kalan ${hidden.length} ${notes.join(" ")}${msgs.length ? "\n   " + [...new Set(msgs)].slice(0, 6).join("\n   ") : ""}${hidden.length ? "\n   " + hidden.join(" ") : ""}`);
    await ctx.close();
  }
await b.close();
console.log(fail ? `HATA: ${fail}` : "TÜMÜ OK");
process.exit(fail ? 1 : 0);
