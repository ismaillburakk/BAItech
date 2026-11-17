/** SEO/GEO doğrulaması — canlı HTML'den JSON-LD, Wikidata, Uşak sıklığı, SSS kapsülleri. */
const BASE = process.env.SITE_URL ?? "http://localhost:3100";
const ROUTES = ["/", "/hizmetler", "/projeler", "/projeler/baseline", "/projeler/bukira", "/projeler/gymbot", "/projeler/dukan", "/projeler/isletmelere-ozel-yazilim", "/projeler/chatekg", "/hakkimizda", "/iletisim", "/aydinlatma-metni", "/gizlilik-politikasi", "/cerez-politikasi"];
const EXPECTED_SERVICES = Number(process.env.EXPECTED_SERVICES ?? 8);
const out = { pages: [], issues: [] };
const metaSeen = { title: new Map(), desc: new Map() };
const teknopark = [];
const aiTerms = {};
const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ");
let org = null;
const allLd = {};
for (const r of ROUTES) {
  const html = await (await fetch(BASE + r)).text();
  const lds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => { const j = JSON.parse(m[1]); return j["@graph"] ?? [j].flat(); });
  allLd[r] = lds;
  const types = lds.map((x) => [x["@type"]].flat().join("+"));
  org ??= lds.find((x) => [x["@type"]].flat().includes("Organization"));
  const text = strip(html.split('<main')[1] ?? html);
  const usak = (text.match(/Uşak/g) ?? []).length;
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.replace(/&amp;/g, "&").replace(/&#x27;/g, "'");
  if (!title || [...title].length < 50 || [...title].length > 60) out.issues.push(`${r}: title ${title ? [...title].length : 0} karakter`);
  if (!desc || [...desc].length < 140 || [...desc].length > 160) out.issues.push(`${r}: description ${desc ? [...desc].length : 0} karakter`);
  if (/aggregateRating|ratingValue|reviewCount|"review"/.test(html)) out.issues.push(`${r}: rating/review bulundu`);
  // Tekil metadata
  for (const [k, v] of [["title", title], ["desc", desc]]) {
    if (metaSeen[k].has(v)) out.issues.push(`${r}: ${k} ${metaSeen[k].get(v)} ile aynı`);
    else metaSeen[k].set(v, r);
  }
  // Breadcrumb (ana sayfa hariç), canonical/OG/Twitter/hreflang
  if (r !== "/" && !lds.some((x) => x.breadcrumb?.["@type"] === "BreadcrumbList")) out.issues.push(`${r}: BreadcrumbList yok`);
  for (const [name, re] of [["canonical", /<link rel="canonical" href="https:\/\/baitech\.com\.tr/], ["og:title", /property="og:title"/], ["twitter:card", /name="twitter:card"/], ["hreflang tr-TR", /hrefLang="tr-TR"/i]])
    if (!re.test(html)) out.issues.push(`${r}: ${name} yok`);
  // Teknopark: görünür cümleler + metadata + JSON-LD değerleri — hepsi yalnız kuruluş bağlamında olmalı
  const sources = [
    ...text.split(/(?<=[.!?])\s+/).map((x) => ["metin", x]),
    ["title", title ?? ""],
    ["description", desc ?? ""],
    ...[...html.matchAll(/<meta (?:property|name)="(?:og|twitter):(?:title|description)" content="([^"]*)"/g)].map((m) => ["og/twitter", m[1]]),
  ];
  const ldStrings = (node, key = "") =>
    typeof node === "string" ? [[key, node]] : node && typeof node === "object" ? Object.entries(node).flatMap(([k, v]) => ldStrings(v, k === "name" ? key || k : k)) : [];
  for (const x of lds) {
    const { foundingLocation: _f, ...rest } = x; // kuruluş yeri ayrıca, kendi etiketiyle eklenir
    for (const [k, v] of ldStrings(rest)) sources.push([`ld:${k}`, v]);
  }
  for (const node of lds) if (node.foundingLocation?.name) sources.push(["ld:foundingLocation", node.foundingLocation.name]);
  for (const [where, sentence] of sources) {
    if (!/teknopark/i.test(sentence)) continue;
    const ok = /kurul/i.test(sentence) || where === "ld:foundingLocation";
    teknopark.push(`${ok ? "✓" : "✗"} ${r} [${where}] ${sentence.trim().slice(0, 150)}`);
    if (!ok) out.issues.push(`${r}: Teknopark kuruluş dışı bağlamda [${where}]: ${sentence.slice(0, 120)}`);
  }
  // Yapay zeka terimleri görünür metinde
  for (const t of ["derin öğrenme", "görüntü işleme", "doğal dil işleme"]) if (text.toLocaleLowerCase("tr").includes(t)) (aiTerms[t] ??= []).push(r);
  out.pages.push({ r, types: types.join(", "), usakVisible: usak, title, titleLen: [...(title ?? "")].length, descLen: [...(desc ?? "")].length });
}
// Organization düğümü
const need = ["name", "alternateName", "address", "geo", "areaServed", "telephone", "email", "sameAs", "knowsAbout", "foundingDate", "foundingLocation", "description", "logo"];
for (const k of need) if (!org?.[k] || (Array.isArray(org[k]) && !org[k].length)) out.issues.push(`Organization.${k} eksik`);
if (org.geo.latitude !== 38.6823 || org.geo.longitude !== 29.4082) out.issues.push(`geo ${JSON.stringify(org.geo)}`);
// Kuruluş: güncel üyelik iddiası (memberOf) YOK; yalnızca tarihsel kuruluş yeri
if (org.memberOf) out.issues.push(`memberOf hâlâ var: ${JSON.stringify(org.memberOf)}`);
if (org.foundingLocation?.name !== "Zafer Teknopark" || org.foundingLocation?.["@type"] !== "Place") out.issues.push("foundingLocation eksik");
// Uygulamalar: yayındaki 3 uygulama (Baseline, Bukira, GymBot) — mağaza bağlantıları, teklif/fiyat yok
for (const slug of ["baseline", "bukira", "gymbot"]) {
  const app = allLd[`/projeler/${slug}`].find((x) => [x["@type"]].flat().includes("SoftwareApplication"));
  if (!app) { out.issues.push(`${slug}: SoftwareApplication yok`); continue; }
  const dl = [app.downloadUrl].flat().filter(Boolean);
  if (!app.installUrl || dl.length !== 2 || !dl.some((u) => u.includes("apps.apple.com")) || !dl.some((u) => u.includes("play.google.com"))) out.issues.push(`${slug}: mağaza bağlantıları eksik`);
  if (app.offers || app.aggregateRating) out.issues.push(`${slug}: offers/rating olmamalı`);
}
// Yayındaki uygulamalar listesi tutarlı: Baseline ve GymBot'un birlikte geçtiği her cümlede Bukira da var
for (const [r, lds] of Object.entries(allLd)) {
  const txt = JSON.stringify(lds);
  for (const m of txt.matchAll(/[^."]*Baseline[^."]*GymBot[^."]*/g)) if (!m[0].includes("Bukira")) out.issues.push(`${r}: uygulama listesinde Bukira yok: ${m[0].slice(0, 100)}`);
}
// Referanslar: ana sayfada yalnız mentions (review/rating/testimonial yok)
const home = allLd["/"].find((x) => x["@type"] === "WebPage");
out.mentions = (home?.mentions ?? []).map((m) => m.name);
if (!out.mentions.length) out.issues.push("ana sayfa mentions (referanslar) yok");
// Hizmet kataloğu: /hizmetler Service düğümleri + Organization.hasOfferCatalog
const svcNodes = allLd["/hizmetler"].filter((x) => x["@type"] === "Service");
const catalog = org.hasOfferCatalog?.itemListElement ?? [];
if (svcNodes.length !== EXPECTED_SERVICES) out.issues.push(`Service düğümü ${svcNodes.length}, beklenen ${EXPECTED_SERVICES}`);
if (catalog.length !== EXPECTED_SERVICES) out.issues.push(`hasOfferCatalog ${catalog.length}, beklenen ${EXPECTED_SERVICES}`);
for (const s of svcNodes) if (!s.name || !s.description || !s.url?.includes("/hizmetler#")) out.issues.push(`Service eksik alan: ${s.name}`);
out.services = svcNodes.map((s) => `${s.name} → ${s.url.split("#")[1]}`);
// Wikidata (knowsAbout + areaServed) — API ile yeniden doğrula
const wd = [...org.knowsAbout, ...org.areaServed].filter((x) => x.sameAs?.includes("wikidata")).map((x) => [x.name, x.sameAs.split("/").pop()]);
const api = await (
  await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${wd.map(([, q]) => q).join("|")}&props=labels&languages=en|tr&format=json`, { headers: { "User-Agent": "bai-schema-check/1.0" } })
).json();
const wdRows = wd.map(([name, q]) => `${q} ${name} ⇄ ${api.entities[q]?.labels?.tr?.value ?? "-"} / ${api.entities[q]?.labels?.en?.value ?? "YOK"}`);
// SSS kapsülleri
const faq = allLd["/hizmetler"].find((x) => x["@type"] === "FAQPage").mainEntity.map((q) => ({ q: q.name, w: q.acceptedAnswer.text.split(/\s+/).length, brand: /BAI Technology/.test(q.acceptedAnswer.text) }));
for (const f of faq) {
  if (f.w < 40 || f.w > 60) out.issues.push(`SSS kelime ${f.w}: ${f.q}`);
  if (!f.brand) out.issues.push(`SSS marka atfı yok: ${f.q}`);
}
// Beyan cümleleri (GEO omurga)
const about = strip(await (await fetch(`${BASE}/hakkimizda`)).text());
const claims = ["BAI Technology, 2025'te Zafer Teknopark bünyesinde kurulmuş bir yazılım ve yapay zeka firmasıdır", "Uşak merkezlidir", "kendisi eğitir"].filter((c) => !about.includes(c));
if (claims.length) out.issues.push(`hakkımızda beyanları eksik: ${claims}`);
// robots / sitemap
const robots = await (await fetch(`${BASE}/robots.txt`)).text();
const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
const smUrls = [...sm.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
for (const r of ROUTES) if (!smUrls.includes(`https://baitech.com.tr${r === "/" ? "" : r}`)) out.issues.push(`sitemap eksik: ${r}`);
// Hizmet beyan cümleleri (/hizmetler görünür metin + schema)
const hzText = strip(await (await fetch(`${BASE}/hizmetler`)).text());
out.claims = svcNodes.map((s) => ({ name: s.name, claim: s.disambiguatingDescription, words: s.disambiguatingDescription?.split(/\s+/).length, visible: !!s.disambiguatingDescription && hzText.includes(s.disambiguatingDescription), serviceType: s.serviceType }));
// Beyan cümlesi yalnızca schema'da yaşar (kurucu kararı: kartta görünmez)
for (const c of out.claims) if (!c.claim || c.words < 9 || c.words > 16 || c.visible || !/^BAI Technology/.test(c.claim)) out.issues.push(`beyan cümlesi: ${c.name}${c.visible ? " (kartta görünüyor)" : ""}`);
// Kart bölümleri HTML'de: her hizmette soru + dört bölüm; proje süreci SSS'den önce
const hzHtml = await (await fetch(`${BASE}/hizmetler`)).text();
const panelCount = (hzHtml.match(/class="svc-panel[ "]/g) ?? []).length;
if (panelCount !== EXPECTED_SERVICES * 4) out.issues.push(`hizmet kartı bölümü ${panelCount}, beklenen ${EXPECTED_SERVICES * 4}`);
if (!(hzHtml.indexOf('id="surec"') > 0 && hzHtml.indexOf('id="surec"') < hzHtml.indexOf('id="sss"'))) out.issues.push("proje süreci bölümü SSS'den önce değil");
for (const s of svcNodes) if (!s.audience?.audienceType) out.issues.push(`Service.audience yok: ${s.name}`);
// Uygulama şemaları: özellik listesi görünür "Öne çıkanlar" ile aynı; yayında olmayan özellik yok
for (const slug of ["baseline", "bukira", "gymbot"]) {
  const app = allLd[`/projeler/${slug}`].find((x) => [x["@type"]].flat().includes("SoftwareApplication"));
  const page = strip(await (await fetch(`${BASE}/projeler/${slug}`)).text());
  if (!app?.featureList?.length || app.featureList.some((f) => !page.includes(f))) out.issues.push(`${slug}: featureList görünür metinle uyuşmuyor`);
  if (/yapay zeka|hareket analizi|gerçek zamanlı/i.test(JSON.stringify([app.featureList, app.description, app.alternateName, app.applicationCategory, app.keywords]))) out.issues.push(`${slug}: şemada yapay zeka/hareket analizi iddiası`);
}
if (org.legalName !== "BAI Teknoloji Sanayi ve Ticaret Ltd. Şti.") out.issues.push(`legalName ${org.legalName}`);
if (org.telephone !== "+90-506-356-1490") out.issues.push(`telephone ${org.telephone}`);
for (const t of ["derin öğrenme", "görüntü işleme", "doğal dil işleme"]) if (!(aiTerms[t] ?? []).includes("/hizmetler") || !(aiTerms[t] ?? []).includes("/hakkimizda")) out.issues.push(`AI terimi görünür değil: ${t}`);
console.log(JSON.stringify({ ...out, teknopark, aiTerms, org: { alternateName: org.alternateName, areaServed: org.areaServed.map((a) => a.name), foundingLocation: org.foundingLocation?.name, sameAs: org.sameAs.length, telephone: org.telephone }, wikidata: wdRows, faq: faq.map((f) => `${f.w}w ${f.brand ? "✓" : "✗"} ${f.q}`), robotsAI: ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot", "Google-Extended"].every((b) => robots.includes(b)), sitemap: smUrls.length }, null, 1));
