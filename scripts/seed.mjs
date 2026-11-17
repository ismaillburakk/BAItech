#!/usr/bin/env node
/**
 * İlk içerik yüklemesi (seed) — BAI Teknoloji
 * ============================================
 * Taslaktaki onaylı içeriği Firestore'a, ekran görüntülerini Cloudinary'ye
 * taşır. Bir kez çalıştırılır; sonrasında TÜM içerik panelden yönetilir.
 *
 * Kullanım:
 *   npm run seed                 → yalnızca BOŞ koleksiyonları doldurur
 *   npm run seed -- --force      → seed dokümanlarını (sabit id'li) yeniden yazar
 *   npm run seed -- --only=faq,pages   → yalnızca belirtilen koleksiyonlar
 *
 * Görsel kaynağı: taslak/public/img (SEED_IMAGE_DIR ile değiştirilebilir).
 * Cloudinary yüklemeleri imzalıdır (API key/secret) ve sabit public_id
 * kullanır (bai/…); tekrar çalıştırmak kopya üretmez (overwrite).
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { fail, initAdminApp } from "./_firebase.mjs";
import { faqItems as taslakFaq, projects as taslakProjects, services as taslakServices } from "./seed-data/content.mjs";
import { about, contact, hero as taslakHero, sectionIntros, serviceDetails } from "./seed-data/site.mjs";
// Güncel metinler (Kasım 2026 içerik planı): taslaktan gelen metnin üzerine yazılır — canlı Firestore ile aynı kaynak
import { GALLERY_RULES as ICERIK_GALLERY, REFERENCES as ICERIK_REFERENCES, FAQ as ICERIK_FAQ, HERO as ICERIK_HERO, PAGES as ICERIK_PAGES, PROJECTS as ICERIK_PROJECTS, SERVICES as ICERIK_SERVICES, SETTINGS as ICERIK_SETTINGS } from "./seed-data/icerik.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_DIR = process.env.SEED_IMAGE_DIR ?? path.join(ROOT, "taslak/public/img");
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const ONLY = (args.find((a) => a.startsWith("--only="))?.split("=")[1] ?? "").split(",").filter(Boolean);

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
if (!CLOUD || !KEY || !SECRET) fail("Cloudinary değişkenleri eksik (.env).");

const db = getFirestore(initAdminApp());
const now = FieldValue.serverTimestamp();

/* ---------------------------------------------------------------- */
/* Cloudinary — imzalı yükleme                                        */
/* ---------------------------------------------------------------- */

const uploadCache = new Map();

async function upload(localPath, publicId, alt) {
  if (uploadCache.has(publicId)) return { ...uploadCache.get(publicId), alt };
  const abs = path.isAbsolute(localPath) ? localPath : path.join(IMAGE_DIR, localPath);
  if (!existsSync(abs)) fail(`Görsel bulunamadı: ${abs}`);
  const params = { overwrite: "true", public_id: publicId, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = createHash("sha1").update(toSign + SECRET).digest("hex");
  const form = new FormData();
  const buf = await readFile(abs);
  const ext = path.extname(abs).slice(1).toLowerCase();
  const mime = { webp: "image/webp", png: "image/png", svg: "image/svg+xml", jpg: "image/jpeg" }[ext] ?? "application/octet-stream";
  form.append("file", new Blob([buf], { type: mime }), path.basename(abs));
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", KEY);
  form.append("signature", signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) fail(`Cloudinary yükleme hatası (${publicId}): ${JSON.stringify(data).slice(0, 300)}`);
  const image = { public_id: data.public_id, url: data.secure_url, width: data.width, height: data.height, format: data.format };
  uploadCache.set(publicId, image);
  process.stdout.write(".");
  return { ...image, alt };
}

/* ---------------------------------------------------------------- */
/* Yardımcılar                                                        */
/* ---------------------------------------------------------------- */

async function shouldSeed(name) {
  if (ONLY.length && !ONLY.includes(name)) return false;
  if (FORCE) return true;
  const snap = await db.collection(name).limit(1).get();
  if (!snap.empty) {
    console.log(`  · ${name}: dolu — atlandı (yeniden yazmak için --force)`);
    return false;
  }
  return true;
}

function checkLen(label, value, min, max) {
  const n = [...value].length;
  if (n < min || n > max) console.warn(`  ! ${label}: ${n} karakter (önerilen ${min}-${max}) → "${value}"`);
}

const splitTech = (s) => (s ?? "").split(" · ").map((t) => t.trim()).filter(Boolean);

/* ---------------------------------------------------------------- */
/* Proje SEO + platform eşlemesi (taslakta olmayan alanlar)            */
/* ---------------------------------------------------------------- */

const PROJECT_EXTRA = {
  baseline: {
    status: "live",
    platforms: ["ios", "android"],
    isAI: false,
    seoTitle: "Baseline: Tenis Kulübü Rezervasyon Uygulaması | BAI Tech",
  },
  bukira: {
    status: "live",
    platforms: ["ios", "android"],
    isAI: false,
    seoTitle: "Bukira: Randevu ve İşletme Yönetim Uygulaması | BAI Tech",
  },
  gymbot: {
    status: "live",
    platforms: ["ios", "android"],
    isAI: true,
    seoTitle: "GymBot: Yapay Zeka Destekli Antrenman Asistanı | BAI Tech",
  },
  dukan: {
    status: "live",
    platforms: ["web"],
    isAI: false,
    seoTitle: "Dukan: Beyaz Etiket E-Ticaret Altyapısı | BAI Teknoloji",
  },
  "isletmelere-ozel-yazilim": {
    status: "none",
    platforms: ["web", "ios", "android"],
    isAI: false,
    seoTitle: "İşletmelere Özel Yazılım Geliştirme | BAI Teknoloji",
  },
  chatekg: {
    status: "development",
    platforms: ["web", "ios", "android"],
    isAI: true,
    seoTitle: "ChatEKG: Açıklanabilir Yapay Zeka ile EKG Analizi | BAI",
  },
};

async function seedProjects() {
  if (!(await shouldSeed("projects"))) return;
  console.log("  → projects");
  for (const [order, p] of taslakProjects.entries()) {
    const extra = PROJECT_EXTRA[p.slug];
    const body = p.body ?? [];
    const lastIsIntro = body.at(-1)?.trim().endsWith(":");
    const gallery = [];
    const rule = ICERIK_GALLERY[p.slug];
    for (const tab of p.gallery?.tabs ?? []) {
      if (rule?.removeTabLabels.includes(tab.label)) continue;
      const images = [];
      for (const [i, im] of tab.images.entries()) {
        const rel = im.src.replace(/^\/img\//, "");
        const id = `bai/projects/${p.slug}/${path.basename(rel, path.extname(rel))}`;
        const alt = (rule?.altReplacements ?? []).reduce((a, [from, to]) => a.replaceAll(from, to), im.alt);
        images.push({ ...(await upload(rel, id, alt)), order: i });
      }
      gallery.push({
        id: createHash("md5").update(`${p.slug}-${tab.label}`).digest("hex").slice(0, 12),
        label: rule?.renameTabs[tab.label] ?? tab.label,
        device: tab.images[0]?.type === "web" ? "web" : "mobile",
        images,
      });
    }
    const icerik = ICERIK_PROJECTS[p.slug] ?? {};
    const seo = { title: extra.seoTitle, description: p.metaDescription ?? p.subtitle, ...icerik.seo };
    checkLen(`${p.slug} seo.title`, seo.title, 50, 60);
    checkLen(`${p.slug} seo.description`, seo.description, 140, 160);
    await db
      .collection("projects")
      .doc(p.slug)
      .set({
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        status: extra.status,
        description: lastIsIntro ? body.slice(0, -1) : body,
        highlightsTitle: lastIsIntro ? body.at(-1) : "",
        highlights: p.bullets ?? [],
        note: p.note ?? "",
        meta: p.meta ?? [],
        tech: splitTech(p.tech),
        services: PROJECT_SERVICES[p.slug] ?? [],
        platforms: extra.platforms,
        isAI: extra.isAI,
        links: { appStore: p.storeLinks?.appStore ?? "", playStore: p.storeLinks?.playStore ?? "", web: p.webUrl ?? "" },
        coverImage: null,
        gallery,
        metrics: [],
        isFeatured: true,
        isPublished: true,
        order,
        createdAt: now,
        updatedAt: now,
        // içerik planı: alt başlık, vaka bölümleri, öne çıkanlar, not, durum, ilgili hizmetler
        ...icerik,
        seo,
      });
  }
  console.log("");
}

/* ---------------------------------------------------------------- */
/* Hizmetler                                                          */
/* ---------------------------------------------------------------- */

/** Projelerde gerçekten verilen hizmetler (iç bağlantılar). Hosting ve SEO için doğrulanmış proje yok. */
const PROJECT_SERVICES = {"baseline": ["mobil", "bakim-destek"], "bukira": ["mobil", "bakim-destek"], "gymbot": ["mobil", "yapay-zeka", "bakim-destek"], "dukan": ["e-ticaret", "web"], "isletmelere-ozel-yazilim": ["ozel-yazilim", "web", "mobil"], "chatekg": ["yapay-zeka"]};

const SERVICE_EXTRA = {
  "Mobil Uygulama Geliştirme": { slug: "mobil", claim: "BAI Technology, iOS ve Android için native mobil uygulamalar geliştirir ve mağazalarda yayınlar.", serviceTypes: ["iOS uygulama geliştirme", "Android uygulama geliştirme", "App Store ve Google Play yayını"], icon: "smartphone", bentoSize: "large", bentoArt: "phones", homeOrder: 1 },
  "Web Geliştirme": { slug: "web", claim: "BAI Technology, kurumsal web sitelerinden çok kullanıcılı yönetim panellerine kadar web yazılımı geliştirir.", serviceTypes: ["Kurumsal web sitesi", "Yönetim paneli geliştirme", "Web uygulaması geliştirme"], icon: "globe", bentoSize: "small", bentoArt: "none", homeOrder: 2 },
  "Özel Yazılım": { slug: "ozel-yazilim", claim: "BAI Technology, hazır paketlerin karşılamadığı süreçler için işletmeye özel yazılım geliştirir.", serviceTypes: ["İşletmeye özel yazılım", "Kurumsal yazılım geliştirme", "Süreç yönetim uygulaması"], icon: "blocks", bentoSize: "small", bentoArt: "none", homeOrder: 3 },
  "E-Ticaret Altyapısı": { slug: "e-ticaret", claim: "BAI Technology, Dukan altyapısıyla markalara kendi alan adında çalışan tek kiracılı mağazalar kurar.", serviceTypes: ["E-ticaret sitesi kurulumu", "Beyaz etiket e-ticaret altyapısı", "Online mağaza yönetim paneli"], icon: "shopping-bag", bentoSize: "small", bentoArt: "browser", homeOrder: 4 },
  "Yapay Zeka Modelleri": { slug: "yapay-zeka", claim: "BAI Technology, görüntü işleme ve doğal dil işleme modellerini derin öğrenmeyle kendisi eğitir.", serviceTypes: ["Yapay zeka modeli geliştirme", "Görüntü işleme", "Doğal dil işleme", "Açıklanabilir yapay zeka (XAI)"], icon: "brain-circuit", bentoSize: "large", bentoArt: "signal", homeOrder: 0 },
  "Hosting & Sunucu Yönetimi": { slug: "hosting", claim: "BAI Technology, geliştirdiği yazılımların hosting kurulumunu, alan adı ve SSL bağlantısını ve sunucu yönetimini üstlenir.", serviceTypes: ["Hosting kurulumu", "Sunucu yönetimi", "Alan adı ve SSL kurulumu", "Yazılımı yayına alma"], icon: "server", bentoSize: "small", bentoArt: "none", homeOrder: 5 },
  "SEO & Dijital Görünürlük": { slug: "seo", claim: "BAI Technology, web siteleri için teknik SEO, yapılandırılmış veri ve site hızı çalışması yapar.", serviceTypes: ["SEO hizmeti", "Web sitesi SEO", "Teknik SEO", "Yapılandırılmış veri (schema.org)", "Site hızı iyileştirme"], icon: "search-check", bentoSize: "small", bentoArt: "none", homeOrder: 6 },
  "Bakım & Teknik Destek": { slug: "bakim-destek", claim: "BAI Technology, yayına aldığı web ve mobil yazılımlara bakım, güncelleme ve teknik destek sağlar.", serviceTypes: ["Yazılım bakımı", "Web sitesi bakımı", "Mobil uygulama güncelleme", "Teknik destek"], icon: "wrench", bentoSize: "small", bentoArt: "none", homeOrder: 7 },
};

async function seedServices() {
  if (!(await shouldSeed("services"))) return;
  console.log("  → services");
  for (const [order, s] of taslakServices.entries()) {
    const extra = SERVICE_EXTRA[s.title];
    let images = [];
    if (extra.bentoArt === "phones") {
      images = [
        await upload("projects-ss/baseline/baseline-03.webp", "bai/services/mobil-1", "BAI Technology'nin geliştirdiği Baseline mobil uygulamasından ekran"),
        await upload("projects-ss/gymbot/gymbot-04.webp", "bai/services/mobil-2", "BAI Technology'nin geliştirdiği GymBot antrenman ve beslenme takibi uygulamasından ekran"),
      ];
    }
    if (extra.bentoArt === "browser") {
      images = [await upload("projects-ss/dukan/dukan-01-anasayfa.webp", "bai/services/e-ticaret-1", "BAI Technology'nin Dukan e-ticaret altyapısıyla kurulan mağaza ana sayfası")];
    }
    await db
      .collection("services")
      .doc(extra.slug)
      .set({
        title: s.title,
        slug: extra.slug,
        icon: extra.icon,
        summary: s.body,
        detail: serviceDetails.find((d) => d.title === s.title)?.body ?? "",
        claim: extra.claim,
        serviceTypes: extra.serviceTypes,
        bentoSize: extra.bentoSize,
        bentoArt: extra.bentoArt,
        images,
        homeOrder: extra.homeOrder,
        order,
        createdAt: now,
        updatedAt: now,
        // içerik planı: soru başlığı, kime uygun, ne teslim edilir, süreç, nasıl başlanır, beyan cümlesi
        ...ICERIK_SERVICES[extra.slug],
      });
  }
  console.log("");
}

/* ---------------------------------------------------------------- */
/* SSS — GEO kapsülleri (40-60 kelime, marka-atıflı)                  */
/* ---------------------------------------------------------------- */

const EXTRA_FAQ = [
  {
    after: "BAI Technology nerede?",
    question: "Uşak'ta mobil uygulama, web veya yapay zeka projesi için BAI Technology ile çalışabilir miyim?",
    answer:
      "Evet. BAI Technology Uşak merkezli bir yazılım ve yapay zeka firmasıdır. Bölgedeki işletmelere mobil uygulama, web sitesi, işletmeye özel yazılım ve yapay zeka projeleri geliştirir; sitenin hosting, SEO ve bakım tarafını da üstlenir. Gerektiğinde yüz yüze görüşür; İzmir, Denizli, Manisa, Afyonkarahisar ve Türkiye genelindeki işletmelerle uzaktan çalışır.",
  },
  {
    after: "Neden hazır yapay zeka servisi yerine kendi modelinizi geliştiriyorsunuz?",
    question: "BAI Technology hangi teknolojileri kullanır?",
    answer:
      "BAI Technology, mobil uygulamalarını React Native ile iOS ve Android için geliştirir; sunucu tarafında Django, PostgreSQL ve Celery kullanır. Web ve e-ticaret projelerinde Next.js tercih eder. Görüntü işleme ve doğal dil işleme modellerini PyTorch ile kendisi eğitir. Teknoloji seçimi her projede ihtiyaca ve ölçeğe göre yapılır.",
  },
];

/** Yeni hizmet kapsülleri: "bakım" sorusundan hemen sonra, sabit id'lerle (canlı Firestore ile aynı) */
const SERVICE_FAQ = [
  { id: "faq-17", question: "BAI Technology hosting ve sunucu kurulumu yapıyor mu?", answer: "Evet. BAI Technology, geliştirdiği web ve mobil yazılımların sunucu ya da barındırma ortamını projenin ölçeğine göre seçer, kurar ve yazılımı yayına alır. Alan adı yönlendirmesi ve SSL sertifikası bu sürecin parçasıdır. Yayından sonra sistem güncellemelerini ve erişim yetkilerini izler; yedekleme düzeni proje başında müşteriyle birlikte belirlenir." },
  { id: "faq-18", question: "BAI Technology SEO hizmeti veriyor mu?", answer: "Evet. BAI Technology, web siteleri için teknik SEO çalışması yapar: sayfa yapısını, başlık ve açıklamaları, site haritasını ve schema.org yapılandırılmış verisini düzenler; yükleme hızını ve mobil uyumu iyileştirir. İçeriği, arama motorlarının ve yapay zeka asistanlarının doğru okuyup aktarabileceği açık ve tutarlı bir biçimde kurgular." },
];

async function seedFaq() {
  if (!(await shouldSeed("faq"))) return;
  console.log("  → faq");
  const list = [];
  for (const f of taslakFaq) {
    list.push({ question: f.question === "BAI Technology nerede?" ? "BAI Technology nerede bulunuyor?" : f.question, answer: f.answer });
    for (const extra of EXTRA_FAQ.filter((e) => e.after === f.question)) list.push(extra);
  }
  // Taban liste konumsal id alır (faq-01…16); hizmet kapsülleri bakım sorusundan sonra araya girer
  const withIds = list.map((f, i) => ({ id: `faq-${String(i + 1).padStart(2, "0")}`, ...f }));
  const at = withIds.findIndex((f) => f.question === "BAI Technology yazılım yayına alındıktan sonra bakım ve destek veriyor mu?") + 1;
  withIds.splice(at || withIds.length, 0, ...SERVICE_FAQ);
  // İçerik planı SSS'yi baştan düzenledi (birleştirme + yeni sorular): güncel liste icerik.mjs'den gelir.
  // Yukarıdaki taslak listesi yalnızca tarihçe olarak durur.
  void withIds;
  for (const [order, f] of ICERIK_FAQ.entries()) {
    const words = f.answer.split(/\s+/).length;
    if (words < 40 || words > 60) console.warn(`  ! SSS cevabı ${words} kelime: ${f.question}`);
    await db
      .collection("faq")
      .doc(f.id)
      .set({ question: f.question, answer: f.answer, isActive: true, order, createdAt: now, updatedAt: now });
  }
}

/* ---------------------------------------------------------------- */
/* Referanslar — yalnız doğrulanmış müşteriler (proje içeriğinden)     */
/* ---------------------------------------------------------------- */

async function seedReferences() {
  if (!(await shouldSeed("references"))) return;
  console.log("  → references");
  // Güncel liste icerik.mjs'den: sıra, yazım ve web adresi orada. Açıklama alanı bilerek boş.
  // Depoda dosyası olmayan logo için isteğe bağlı yerel yol (SEED_AD_LOGO); yoksa kayıt logosuz oluşur, logo panelden eklenir
  const adLogo = process.env.SEED_AD_LOGO ?? "";
  for (const [order, r] of ICERIK_REFERENCES.entries()) {
    const file = r.logoFile ? path.join(ROOT, "scripts/seed-data/references", r.logoFile) : r.id === "ahmet-demir-mimarlik" && adLogo && existsSync(adLogo) ? adLogo : null;
    const logo = file ? await upload(file, `bai/references/${r.id}`, r.name) : null;
    await db
      .collection("references")
      .doc(r.id)
      .set({ name: r.name, logo, logoMode: "original", url: r.url, description: "", isActive: true, order, createdAt: now, updatedAt: now });
  }
  console.log("");
}

/* ---------------------------------------------------------------- */
/* Hero                                                               */
/* ---------------------------------------------------------------- */

async function seedHero() {
  if (!(await shouldSeed("hero"))) return;
  console.log("  → hero");
  const phones = [
    await upload("projects-ss/bukira/bukira-01.webp", "bai/hero/phone-1", "BAI Technology'nin geliştirdiği Bukira randevu uygulaması ekranı"),
    await upload("projects-ss/baseline/baseline-01.webp", "bai/hero/phone-2", "BAI Technology'nin geliştirdiği Baseline tenis rezervasyon uygulaması ekranı"),
    await upload("projects-ss/gymbot/gymbot-01.webp", "bai/hero/phone-3", "BAI Technology'nin geliştirdiği GymBot antrenman ve beslenme takibi uygulaması ekranı"),
  ];
  await db
    .collection("hero")
    .doc("main")
    .set({
      badge: "Aktif / Yayında",
      badgeNote: "Baseline · Bukira · GymBot",
      title: "Geleceği *teknoloji* ile şekillendiriyoruz.",
      lead: taslakHero.lead,
      primaryCta: { label: taslakHero.primaryCta, href: "/iletisim" },
      secondaryCta: { label: taslakHero.secondaryCta, href: "/hizmetler" },
      meta: taslakHero.meta,
      phones,
      updatedAt: now,
      ...ICERIK_HERO,
    });
  console.log("");
}

/* ---------------------------------------------------------------- */
/* Site ayarları                                                      */
/* ---------------------------------------------------------------- */

async function seedSettings() {
  if (!(await shouldSeed("siteSettings"))) return;
  console.log("  → siteSettings");
  const logo = await upload("bai-logo.png", "bai/brand/bai-logo", "BAI Technology (BAI Teknoloji) logosu");
  const og = await upload(path.join(ROOT, "public/og-image.png"), "bai/brand/og-image", "BAI Technology — yazılım ve yapay zeka");
  const { defaultTitle, defaultDescription } = ICERIK_SETTINGS.seo;
  checkLen("defaultTitle", defaultTitle, 50, 60);
  checkLen("defaultDescription", defaultDescription, 140, 160);
  await db
    .collection("siteSettings")
    .doc("main")
    .set({
      brand: {
        name: "BAI Technology",
        localName: "BAI Teknoloji",
        logo,
        foundingYear: "2025",
        ...ICERIK_SETTINGS.brand,
      },
      contact: {
        email: contact.email,
        phone: "+90 506 356 1490",
        address: contact.address.join("\n"),
        responseTime: contact.responseTime,
        mapEmbedUrl: "",
        notifyEmail: contact.email,
        ...ICERIK_SETTINGS.contact,
      },
      socials: [],
      stats: [
        { value: "", source: "liveApps" },
        { value: "", source: "projects" },
        { value: "", source: "services" },
        { value: "2025", source: "manual" },
      ].map((s, i) => ({ label: ICERIK_SETTINGS.statLabels[i], ...s })),
      cta: ICERIK_SETTINGS.cta,
      seo: {
        defaultTitle,
        defaultDescription,
        organizationDescription:
          "BAI Technology, 2025'te kurulmuş, Uşak merkezli bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve özel yazılım geliştirir; e-ticaret altyapısı kurar. Görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Geliştirdiği yazılımların hosting, SEO ve bakımını da üstlenir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.",
        alternateNames: [
          "BAI",
          "BAI Teknoloji",
          "BAI Tech",
          "BAITECH",
          "baitech",
          "Bai Teknoloji",
          "Bai Technology",
          "BAI Technology Yazılım",
          "BAI Yazılım",
          "BAI Teknoloji Yazılım",
          "BAI Teknoloji Uşak",
          "Baı Teknoloji",
          "BAİ Teknoloji",
          "Bao Teknoloji",
          "Bay Teknoloji",
          "Baytek",
          "Bai Tek",
          "BAI Tecnology",
          "BAI Technologies",
        ],
        ogImage: og,
      },
      updatedAt: now,
    });
  console.log("");
}

/* ---------------------------------------------------------------- */
/* Sayfalar                                                           */
/* ---------------------------------------------------------------- */

function legalPage(legal, slug, seo) {
  const l = legal[slug];
  return {
    fields: {
      headerEyebrow: l.meta.eyebrow,
      headerTitle: `${l.meta.title} *${l.meta.italicWord}*`,
      updatedAt: l.meta.updatedAt,
      intro: l.intro,
      body: l.body,
    },
    seo,
  };
}

async function seedPages() {
  if (!(await shouldSeed("pages"))) return;
  console.log("  → pages");
  const legal = JSON.parse(await readFile(path.join(ROOT, "scripts/seed-data/legal.json"), "utf8"));
  const pages = {
    anasayfa: {
      fields: {
        statsEyebrow: "Sayılarla",
        statsTitle: sectionIntros.about.description,
        servicesEyebrow: sectionIntros.services.eyebrow,
        servicesTitle: sectionIntros.services.title,
        servicesDescription: sectionIntros.services.description,
        servicesCta: "Tüm hizmetler",
        projectsEyebrow: sectionIntros.projects.eyebrow,
        projectsTitle: sectionIntros.projects.title,
        projectsCta: "Tüm projeler",
        referencesEyebrow: "Referanslar",
        referencesTitle: "Birlikte çalıştığımız işletmeler",
        referencesDescription: "",
        whyEyebrow: sectionIntros.about.eyebrow,
        whyTitle: sectionIntros.about.title,
        whyDescription: about.lead,
        whyBullets: about.bullets,
        whyCta: "Hakkımızda",
      },
      seo: {
        title: "BAI Teknoloji | Yazılım, Mobil Uygulama, Yapay Zeka ve SEO",
        description:
          "BAI Technology (BAI Teknoloji); mobil uygulama, web, özel yazılım ve e-ticaret geliştirir, yapay zeka modelleri eğitir; hosting, SEO ve bakım desteği verir.",
      },
    },
    hakkimizda: {
      fields: {
        headerEyebrow: sectionIntros.about.eyebrow,
        headerTitle: sectionIntros.about.title,
        headerDescription: sectionIntros.about.description,
        identityEyebrow: "Kurumsal Kimlik",
        identityText: about.identity,
        visionTitle: about.vision.title,
        visionBody: about.vision.body,
        missionTitle: about.mission.title,
        missionBody: about.mission.body,
        rdEyebrow: "Ar-Ge",
        rdTitle: "Ar-Ge ve Yaklaşım",
        rdSections: about.depth.map((d) => ({ title: d.heading, body: d.body })),
        processEyebrow: "Süreç",
        processTitle: about.modelProcess.title,
        processSteps: about.modelProcess.steps,
        processNote: about.modelProcess.note,
        teamEyebrow: "Ekip",
        teamTitle: "Ürünü geliştiren ekip",
      },
      seo: {
        title: "Hakkımızda: Yazılım ve Yapay Zeka Firması | BAI Technology",
        description:
          "BAI Technology, 2025'te kurulan, Uşak merkezli bir yazılım ve yapay zeka firmasıdır. Kendi yapay zeka modellerini eğitir; mobil, web ve özel yazılım geliştirir.",
      },
    },
    hizmetler: {
      fields: {
        headerEyebrow: sectionIntros.services.eyebrow,
        headerTitle: sectionIntros.services.title,
        headerDescription: sectionIntros.services.description,
        processLabel: "Süreç ve çıktı",
        faqEyebrow: "SSS",
        faqTitle: "Sıkça Sorulan Sorular",
      },
      seo: {
        title: "Hizmetler: Mobil, Web, Yapay Zeka, Hosting ve SEO | BAI Tech",
        description:
          "BAI Technology; mobil uygulama, web, özel yazılım ve e-ticaret altyapısı geliştirir, yapay zeka modelleri eğitir; hosting, SEO, bakım ve destek sunar.",
      },
    },
    projeler: {
      fields: {
        headerEyebrow: sectionIntros.projects.eyebrow,
        headerTitle: sectionIntros.projects.title,
        headerDescription: sectionIntros.projects.description,
      },
      seo: {
        title: "Projeler: Baseline, Bukira, GymBot, Dukan | BAI Teknoloji",
        description:
          "BAI Technology projeleri: App Store ve Google Play'de yayındaki Baseline, Bukira, GymBot; Dukan e-ticaret altyapısı, ChatEKG ve işletmelere özel yazılımlar.",
      },
    },
    iletisim: {
      fields: {
        headerEyebrow: "İletişim",
        headerTitle: contact.title,
        headerDescription: contact.lead,
        formTitle: "Mesaj Bırakın",
        consentText: contact.consent,
        successTitle: contact.success.title,
        successDescription: contact.success.description,
      },
      seo: {
        title: "İletişim: Yazılım ve Yapay Zeka Projeniz | BAI Teknoloji",
        description:
          "BAI Technology ile iletişime geçin: Uşak merkezli ekip, Türkiye genelinde mobil, web, özel yazılım, yapay zeka, hosting, SEO ve bakım projeleri yürütür.",
      },
    },
    "aydinlatma-metni": legalPage(legal, "aydinlatma-metni", {
      title: "KVKK Aydınlatma Metni: İletişim Formu | BAI Teknoloji",
      description:
        "BAI Technology iletişim formu aracılığıyla işlenen kişisel verilere ilişkin 6698 sayılı KVKK kapsamındaki aydınlatma metni: amaçlar, aktarım ve haklarınız.",
    }),
    "gizlilik-politikasi": legalPage(legal, "gizlilik-politikasi", {
      title: "Gizlilik Politikası: Kişisel Verileriniz | BAI Teknoloji",
      description:
        "BAI Technology gizlilik politikası: baitech.com.tr üzerinden toplanan kişisel verilerin hangi amaçla işlendiği, kimlerle paylaşıldığı ve nasıl korunduğu.",
    }),
    "cerez-politikasi": legalPage(legal, "cerez-politikasi", {
      title: "Çerez Politikası: Kullanılan Çerezler | BAI Teknoloji",
      description:
        "BAI Technology çerez politikası: baitech.com.tr ziyaretçilerine reklam, analitik veya takip çerezi yerleştirmez; yalnızca yönetim paneli zorunlu çerez kullanır.",
    }),
  };

  // İçerik planı: sayfa metinleri ve metadata güncel hâliyle (eski vizyon/misyon alanları kaldırılır)
  for (const [slug, icerik] of Object.entries(ICERIK_PAGES)) {
    const fields = { ...pages[slug].fields, ...icerik.fields };
    for (const key of icerik.remove) delete fields[key];
    pages[slug] = { fields, seo: { ...pages[slug].seo, ...icerik.seo } };
  }
  for (const [slug, page] of Object.entries(pages)) {
    checkLen(`${slug} seo.title`, page.seo.title, 50, 60);
    checkLen(`${slug} seo.description`, page.seo.description, 140, 160);
    await db.collection("pages").doc(slug).set({ slug, ...page, updatedAt: now });
  }
}

/* ---------------------------------------------------------------- */

console.log(`Seed başlıyor${FORCE ? " (--force)" : ""}…`);
await seedSettings();
await seedHero();
await seedProjects();
await seedServices();
await seedFaq();
await seedReferences();
await seedPages();
console.log("✓ Seed tamamlandı.");
process.exit(0);
