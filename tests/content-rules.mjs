/**
 * İçerik kuralları taraması — üretim HTML'i + Firestore + seed dosyaları.
 *  1. Yer tutucu kalıntısı yok ([KURUCU], köşeli parantez notu, "eklenecek", TBD/TODO, lorem)
 *  2. GymBot: "hareket analizi / gerçek zamanlı / yapay zeka" yalnızca "henüz yayında değil" çerçevesinde
 *  3. "native" tek başına geçmiyor (yalnızca "React Native")
 *  4. Telefon: her yerde +90 506 356 1490
 *  5. Kurucunun "belirtilmeyecek" dediği konular: süre ifadesi, kaynak kod/hesap sahipliği, devralma, ödeme düzeni
 *  6. Kimlik cümlesi ve "kendimiz eğitiyoruz" iddiasının görünür metindeki yerleri
 *   node --env-file=.env tests/content-rules.mjs
 */
import { readFileSync } from "node:fs";
import { getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../scripts/_firebase.mjs";

const BASE = process.env.SITE_URL ?? "http://localhost:3100";
const ROUTES = ["/", "/hizmetler", "/projeler", "/projeler/baseline", "/projeler/bukira", "/projeler/gymbot", "/projeler/dukan", "/projeler/isletmelere-ozel-yazilim", "/projeler/chatekg", "/hakkimizda", "/iletisim"];
const PHONE = "+90 506 356 1490";
const issues = [];
const info = {};
const tr = (s) => s.toLocaleLowerCase("tr");
const sentences = (s) => s.split(/(?<=[.!?:;])\s+|\n+/).map((x) => x.trim()).filter(Boolean);
const decode = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ");

/* ---------- kaynaklar: [nerede, metin] ---------- */
const sources = [];
// Firestore (submissions hariç)
const db = getFirestore(initAdminApp());
function walk(v, path) {
  if (typeof v === "string") sources.push([`firestore:${path}`, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (v && typeof v === "object" && !("_seconds" in v)) for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
}
for (const c of await db.listCollections()) if (c.id !== "submissions") for (const d of (await c.get()).docs) walk(d.data(), `${c.id}/${d.id}`);
// Seed: güncel metnin tek kaynağı
const icerik = await import("../scripts/seed-data/icerik.mjs");
(function walkSeed(v, path) {
  if (typeof v === "string") sources.push([`seed:${path}`, v]);
  else if (Array.isArray(v)) v.forEach((x, i) => walkSeed(x, `${path}[${i}]`));
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walkSeed(x, `${path}.${k}`);
})(Object.fromEntries(Object.entries(icerik).filter(([k]) => k !== "ALT_REPLACEMENTS")), "icerik"); // ALT_REPLACEMENTS: aranan eski metin, içerik değil
// Üretim HTML'i: görünür metin (blok bazında) + meta + JSON-LD dizgeleri
const visible = {};
for (const r of ROUTES) {
  const html = await (await fetch(BASE + r)).text();
  const body = html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<head[\s\S]*?<\/head>/g, " ")
    .replace(/<\/(p|h\d|li|dd|dt|summary|button|option|label|a)>/g, "\n")
    .replace(/<[^>]+>/g, " ");
  visible[r] = decode(body).split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  for (const line of visible[r]) sources.push([`html:${r}`, line]);
  for (const m of html.matchAll(/<meta (?:name|property)="([^"]+)" content="([^"]*)"/g)) sources.push([`meta:${r}:${m[1]}`, decode(m[2])]);
  sources.push([`title:${r}`, decode(html.match(/<title>(.*?)<\/title>/)?.[1] ?? "")]);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))
    (function ld(v, path) {
      if (typeof v === "string") sources.push([`ld:${r}:${path}`, v]);
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) ld(x, Array.isArray(v) ? path : k);
    })(JSON.parse(m[1]), "");
}

/* ---------- 1. yer tutucu ---------- */
const PLACEHOLDER = /KURUCU|\[[^\]]{0,80}\]|\beklenecek\b|\bTBD\b|\bTODO\b|lorem ipsum|\(\s*\)|XXX/i;
// Yasal metinlerin Markdown bağlantıları ([metin](url)) yer tutucu değildir
const isLegalMarkdown = (where) => /pages\/(aydinlatma-metni|gizlilik-politikasi|cerez-politikasi)/.test(where);
for (const [where, text] of sources) {
  if (isLegalMarkdown(where)) continue;
  const m = text.match(PLACEHOLDER);
  if (m) issues.push(`yer tutucu [${where}] "${m[0]}" → ${text.slice(0, 120)}`);
}
// Seed kaynak dosyalarının ham metni de taranır (yorumlar dahil değil: yalnızca dizgeler yukarıda)
for (const f of ["scripts/seed-data/icerik.mjs"]) if (/\[KURUCU|KURUCU:/.test(readFileSync(f, "utf8"))) issues.push(`yer tutucu: ${f}`);

/* ---------- 2. GymBot ---------- */
const AI = /hareket\w* analiz|gerçek zamanlı|yapay zeka|akıllı|kişiye özel (antrenman|diyet|program)/i;
const NOT_LIVE = /henüz yayında değil|üzerinde çalışıyoruz/i;
info.gymbot = [];
for (const [where, text] of sources) {
  const onGymbotPage = /projeler\/gymbot|projects\/gymbot|PROJECTS\.gymbot/.test(where);
  for (const s of sentences(text)) {
    const mentions = /gymbot/i.test(s);
    if (!(mentions || onGymbotPage) || !AI.test(s)) continue;
    // Site geneli kalıplar (footer, menü, kapanış) ve kurum tanımı GymBot hakkında bir iddia değildir
    const aboutCompany = /^BAI Technology|yazılım ve yapay zeka firması|Yapay Zeka Modelleri|Yazılım · AI/.test(s) && !/gymbot[^.]*(yapay zeka|hareket|akıllı)/i.test(s);
    if (aboutCompany) continue;
    if (onGymbotPage && !mentions && !/hareket|gerçek zamanlı|kişiye özel|akıllı/i.test(s) && /^html:|^ld:|^meta:|^title:/.test(where) && !/gymbot/i.test(where.split(":").pop())) {
      // GymBot sayfasındaki ortak bölümler (ilgili hizmet çipleri, diğer proje adları): yalnızca "yapay zeka" kelimesi
      if (!/GymBot/.test(s)) continue;
    }
    const ok = NOT_LIVE.test(s);
    info.gymbot.push(`${ok ? "✓" : "✗"} [${where}] ${s.slice(0, 150)}`);
    if (!ok) issues.push(`GymBot yayında gibi: [${where}] ${s.slice(0, 140)}`);
  }
}

/* ---------- 3. native ---------- */
for (const [where, text] of sources) if (/(?<!React )\bnative\b/i.test(text)) issues.push(`"native" tek başına: [${where}] ${text.slice(0, 120)}`);

/* ---------- 4. telefon ---------- */
const phones = new Map();
for (const [where, text] of sources)
  for (const m of text.matchAll(/(?:\+90|0)[\s-]?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g)) {
    const digits = m[0].replace(/\D/g, "").replace(/^0/, "90");
    phones.set(digits, [...(phones.get(digits) ?? []), where]);
  }
info.phones = Object.fromEntries([...phones].map(([k, v]) => [k, v.length]));
for (const [digits, where] of phones) if (digits !== PHONE.replace(/\D/g, "")) issues.push(`farklı telefon ${digits}: ${where.slice(0, 3).join(", ")}`);
for (const r of ROUTES) if (!visible[r].some((l) => l.includes(PHONE))) issues.push(`${r}: telefon görünmüyor`);
// E-posta şablonları ve kod: sabit numara yok (numara Site Ayarları'ndan okunur)
for (const f of ["lib/email.ts", "lib/seo.ts", "components/site/footer.jsx", "components/site/final-cta.jsx"]) {
  const m = readFileSync(f, "utf8").match(/5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/g)?.filter((x) => x.replace(/\D/g, "") !== "5063561490");
  if (m?.length) issues.push(`${f}: sabit telefon ${m}`);
}

/* ---------- 5. belirtilmeyecek konular ---------- */
const FORBIDDEN = [
  ["süre ifadesi", /\b(birkaç|\d+)\s*(hafta|ay|gün)(da|de|lık|lik|ya|ye)?\b(?! ücretsiz)/i],
  ["kod/hesap sahipliği", /kaynak kod|geliştirici hesab|hesaplar?ı? (kimde|müşterinin)|kod(un)? sahipli/i],
  ["devralma", /devral|başkasının (yazdığı|geliştirdiği)/i],
  ["ödeme düzeni", /peşin|taksit|aşamalı ödeme|ödeme plan|hakediş/i],
  ["görüşme sıklığı", /haftalık (görüşme|toplantı|rapor)|her hafta/i],
  ["sertifikalı antrenör", /sertifikalı/i],
  ["ücretsiz plan", /ücretsiz plan/i],
  ["aktif kullanımda", /aktif olarak kullanımda/i],
  ["ajans dili", /sektörün öncüsü|yenilikçi çözüm|dijital dönüşüm yolculuğu|anahtar teslim|360 derece|tutkuyla|siz istersiniz/i],
];
for (const [where, text] of sources) {
  if (isLegalMarkdown(where) || /aydinlatma|gizlilik|cerez/.test(where)) continue;
  for (const [name, re] of FORBIDDEN) {
    const m = text.match(re);
    // "Yaklaşık 24 saat" yanıt süresi kurucu kararıyla kalır; sürüm/saat ifadeleri süre taahhüdü değildir
    if (m) issues.push(`${name} [${where}] "${m[0]}" → ${text.slice(0, 110)}`);
  }
}

/* ---------- 7. "X firmasına şunu yaptık" anlatımı yok ---------- */
// Kural metin anlatımı içindir: logo şeridi, schema `mentions` düğümleri, bölüm başlığı/künye olarak
// firma adı serbest. Yasak olan: müşteriyi özne yapıp ona ne yapıldığını sayan cümle.
const refNames = (await db.collection("references").get()).docs.map((d) => d.data().name).filter(Boolean);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const NAME = refNames.length ? `(?:${refNames.map(esc).join("|")})` : "(?!)";
const DID = "(?:geliştir|yap(?:tı|ıl|ıyor)|kur(?:du|ul|uyor)|hazırla|tasarla|üret|yazdı)";
const CLIENT_PATTERNS = [
  ["müşteri adı + için … yaptık", new RegExp(`${NAME}(?:'?[a-zçğıöşü]*)?(?: ve ${NAME})? için\\b[^.!?]*${DID}`, "i")],
  ["müşteri adı + -a/-e yaptık", new RegExp(`${NAME}'?(?:n?[ae]|y[ae])\\b[^.!?]*${DID}`, "i")],
  ["müşteri adı için + iş adı", new RegExp(`${NAME} (?:ve ${NAME} )?için (?:bir |kurumsal |saha |inşaat |web |mobil )`, "i")],
  ["… firmasına/şirketine … yaptık", /(firması|şirketi|markası|kurumu)(na|ne|nın|nin)? (için )?[^.!?]*(geliştirdik|yaptık|kurduk|hazırladık|tasarladık)/i],
  ["birlikte ürün geliştirdiğimiz", /birlikte ürün geliştirdiğimiz|ürün geliştirdiğimiz markalar/i],
  ["müşterilerimize şunu yaptık", /müşteri(ler)?(imiz)?(e|ine) (yaptığımız|geliştirdiğimiz|kurduğumuz)/i],
  ["onlar için yaptık", /\b(onlar|kendileri) için (geliştirdik|yaptık|kurduk)/i],
];
info.clientPattern = [];
// Seed kaynak dosyalarının ham metni de taranır (taslaktan kalan eski cümleler dahil)
const rawSeed = ["scripts/seed-data/icerik.mjs", "scripts/seed-data/content.mjs", "scripts/seed-data/site.mjs", "scripts/seed.mjs"].flatMap((f) =>
  readFileSync(f, "utf8").split("\n").filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).map((l, i) => [`seed-dosya:${f}:${i + 1}`, l]),
);
for (const [where, text] of [...sources, ...rawSeed]) {
  if (isLegalMarkdown(where) || /aydinlatma|gizlilik|cerez/.test(where)) continue;
  for (const s of sentences(text))
    for (const [name, re] of CLIENT_PATTERNS)
      if (re.test(s)) {
        info.clientPattern.push(`[${where}] ${name}: ${s.slice(0, 130)}`);
        issues.push(`müşteri kalıbı (${name}) [${where}] ${s.slice(0, 120)}`);
      }
}
// Ana sayfa referans bölümü: yalnızca başlık + logo şeridi (açıklama metni yok)
{
  const home = await (await fetch(BASE + "/")).text();
  const sec = home.match(/<section[^>]*aria-labelledby="referanslar"[\s\S]*?<\/section>/)?.[0] ?? "";
  const heading = sec.split('role="region"')[0];
  if (!sec) issues.push("ana sayfa referans bölümü bulunamadı");
  if (/<p[^>]*text-lg[^>]*>/.test(heading)) issues.push("ana sayfa referans bölümünde açıklama paragrafı var");
}

/* ---------- 9. Referans açıklaması ve proje listesi yok ---------- */
{
  const refs = (await db.collection("references").get()).docs.map((d) => ({ id: d.id, ...d.data() }));
  for (const r of refs) {
    if ((r.description ?? "") !== "") issues.push(`referans açıklaması dolu: ${r.id} → ${r.description}`);
    if (r.logo && r.logo.alt !== r.name) issues.push(`referans alt metni firma adı değil: ${r.id} → ${r.logo.alt}`);
  }
  for (const r of icerik.REFERENCES) if ("description" in r) issues.push(`seed referansında açıklama: ${r.id}`);
  const home = await (await fetch(BASE + "/")).text();
  const region = home.match(/role="region"[\s\S]*?<\/section>/)?.[0] ?? "";
  if (!region) issues.push("referans şeridi bulunamadı");
  if (/\stitle="|aria-description|aria-describedby/.test(region)) issues.push("referans şeridinde title / aria açıklaması var");
  for (const m of region.matchAll(/<img[^>]*alt="([^"]*)"/g)) if (m[1] && !refNames.includes(decode(m[1]))) issues.push(`logo alt metni firma adı değil: ${m[1]}`);
  // schema mentions: yalnızca ad (+ doğrulanmış adres, logo); açıklama yok
  for (const r of ROUTES) {
    const html = await (await fetch(BASE + r)).text();
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const nodes = [JSON.parse(m[1])].flat().flatMap((x) => x["@graph"] ?? [x]);
      for (const n of nodes) for (const men of n.mentions ?? []) {
        const extra = Object.keys(men).filter((k) => !["@type", "name", "url", "logo"].includes(k));
        if (extra.length) issues.push(`${r}: mentions düğümünde fazla alan ${extra}`);
      }
    }
  }
  // Firma adı yalnızca ana sayfadaki logo şeridinde (ve oradaki schema mentions'da) geçer:
  // diğer sayfalarda görünür metin, metadata, JSON-LD ve alt metinlerinde yok (proje listesi verilmez)
  for (const [where, text] of sources) {
    const [kind, route] = where.split(":");
    if (!["html", "meta", "title", "ld"].includes(kind) || route === "/") continue;
    for (const name of refNames) if (text.includes(name)) issues.push(`firma adı ana sayfa dışında [${where}] ${name}: ${text.slice(0, 80)}`);
  }
  // Firestore/seed: projeler, hizmetler, SSS ve sayfa metinlerinde firma adı yok
  for (const [where, text] of sources) {
    if (!/^(firestore:(projects|services|faq|pages|hero|siteSettings)\/|seed:icerik\.(PROJECTS|SERVICES|FAQ|PAGES|HERO|SETTINGS))/.test(where)) continue;
    if (isLegalMarkdown(where)) continue;
    for (const name of refNames) if (text.includes(name)) issues.push(`firma adı içerikte [${where}] ${name}`);
  }
}

/* ---------- 8. Dukan: mağaza adı ve doğrulanmamış entegrasyon yok ---------- */
const DUKAN_FORBIDDEN = /hepsiburada|yurtiçi kargo|mng kargo|ptt kargo|sürat kargo|ups kargo|n11|amazon|çiçeksepeti/i;
for (const [where, text] of sources) if (DUKAN_FORBIDDEN.test(text) && !/aydinlatma|gizlilik|cerez/.test(where)) issues.push(`doğrulanmamış entegrasyon [${where}] ${text.match(DUKAN_FORBIDDEN)[0]}`);

/* ---------- 6. kimlik cümlesi ve "kendimiz eğitiyoruz" yerleri (görünür metin) ---------- */
const IDENTITY = /mobil uygulama, web ve işletmeye özel yazılım gelişti/i;
const TRAIN = /kendi(si|miz| modellerimizi)? eğit|modeli(ni)? (de )?kendimiz eğit/i;
info.identity = {};
info.train = {};
// Footer'ın kısa kimlik cümlesi her sayfada bir kez; kalan satırlardan çıkarılıp diğer yerler sayılır
const footerLine = icerik.SETTINGS.brand.tagline;
for (const r of ROUTES) {
  const n = visible[r].filter((l) => l.includes(footerLine)).length;
  if (n !== 1) issues.push(`${r}: footer kimlik cümlesi ${n} kez`);
  const idLines = visible[r].map((l) => l.replace(footerLine, "")).filter((l) => IDENTITY.test(l));
  const trainLines = visible[r].filter((l) => TRAIN.test(l));
  if (idLines.length) info.identity[r] = idLines.map((l) => l.slice(0, 70));
  if (trainLines.length) info.train[r] = trainLines.map((l) => l.slice(0, 90));
}
info.footer = footerLine;
if (/eğit|yapay zeka/i.test(footerLine)) issues.push("footer'da yapay zeka vurgusu var");
// Beklenen: kimlik cümlesi (footer dışında) yalnızca 3 sayfada, birer kez — hero, SSS, Hakkımızda kimlik paragrafı
const idPages = Object.keys(info.identity).sort().join(",");
if (idPages !== "/,/hakkimizda,/hizmetler" || Object.values(info.identity).some((l) => l.length !== 1)) issues.push(`kimlik cümlesi beklenmeyen yerde: ${JSON.stringify(info.identity)}`);
// "Kendimiz eğitiyoruz": ana sayfa 2 (hero kimliği + yapay zeka bento özeti), /hizmetler 3 (kart özeti, kimlik SSS'si, ilgili SSS), /hakkimizda 3 (kimlik, Ar-Ge başlığı + metni)
const trainCount = Object.fromEntries(Object.entries(info.train).map(([k, v]) => [k, v.length]));
if (JSON.stringify(trainCount) !== JSON.stringify({ "/": 2, "/hizmetler": 3, "/hakkimizda": 3 })) issues.push(`"kendimiz eğitiyoruz" dağılımı: ${JSON.stringify(trainCount)}`);

console.log(JSON.stringify({ kaynak: sources.length, issues, ...info }, null, 1));
process.exit(issues.length ? 1 : 0);
