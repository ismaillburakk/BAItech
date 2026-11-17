#!/usr/bin/env node
/**
 * SEO / GEO güncellemesi — Kasım 2026
 *  1. Zafer Teknopark: bugüne dair ifadeler → kuruluş bağlamı (kimlik, Ar-Ge, SSS, metadata, istatistik)
 *  2. SSS: bakım sorusu yeniden yazılır; hosting ve SEO kapsülleri eklenir (sıra: bakım → hosting → SEO)
 *  3. Hizmetler: beyan cümlesi (claim) + kapsam (serviceTypes) — yalnızca boşsa yazılır
 *  4. Projeler: ilgili hizmetler (services) — yalnızca boşsa yazılır
 *  5. Ana sayfa / hakkımızda / iletişim metadata + kurum açıklaması
 *
 * İdempotent; panelde sonradan düzenlenen hizmet/proje alanlarının üzerine yazmaz.
 *   node --env-file=.env scripts/migrations/2026-11-seo-geo.mjs --dry-run
 *   node --env-file=.env scripts/migrations/2026-11-seo-geo.mjs
 */
import process from "node:process";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../_firebase.mjs";

const DRY = process.argv.includes("--dry-run");
const db = getFirestore(initAdminApp());
const now = FieldValue.serverTimestamp();
const batch = db.batch();
let changes = 0;
const short = (v) => (typeof v === "string" ? v : JSON.stringify(v)).slice(0, 400);
function change(ref, path, before, after) {
  if (JSON.stringify(before) === JSON.stringify(after)) return false;
  changes++;
  console.log(`\n${DRY ? "[deneme]" : "[yazıldı]"} ${ref.path} › ${path}\n  eski: ${short(before ?? "(yok)")}\n  yeni: ${short(after)}`);
  return true;
}

const IDENTITY = "BAI Technology, 2025'te Zafer Teknopark bünyesinde kurulmuş bir yazılım ve yapay zeka firmasıdır. Uşak merkezlidir ve Türkiye genelinde uzaktan çalışır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Geliştirdiği yazılımların sunucu yönetimini, SEO çalışmasını ve bakımını da üstlenir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.";
const RD0 = {
  "title": "Ar-Ge odaklı çalışma",
  "body": "BAI Technology — Türkçe kullanımıyla BAI Teknoloji, kısa adıyla BAI — yalnızca proje teslim eden bir yazılım evi değil, Ar-Ge odaklı bir ekip olarak çalışır. Günlük müşteri işlerinin yanında araştırma ve model geliştirme çalışmalarını sürdürür. Derin öğrenme, görüntü işleme ve doğal dil işleme bu çalışmaların merkezindedir."
};
const SEO = {
  "anasayfa": {
    "title": "BAI Teknoloji | Yazılım, Mobil Uygulama, Yapay Zeka ve SEO",
    "description": "BAI Technology (BAI Teknoloji); mobil uygulama, web, özel yazılım ve e-ticaret geliştirir, yapay zeka modelleri eğitir; hosting, SEO ve bakım desteği verir."
  },
  "hakkimizda": {
    "title": "Hakkımızda: Yazılım ve Yapay Zeka Firması | BAI Technology",
    "description": "BAI Technology, 2025'te kurulan, Uşak merkezli bir yazılım ve yapay zeka firmasıdır. Kendi yapay zeka modellerini eğitir; mobil, web ve özel yazılım geliştirir."
  },
  "iletisim": {
    "description": "BAI Technology ile iletişime geçin: Uşak merkezli ekip, Türkiye genelinde mobil, web, özel yazılım, yapay zeka, hosting, SEO ve bakım projeleri yürütür."
  }
};
const ORG_DESCRIPTION = "BAI Technology, 2025'te kurulmuş, Uşak merkezli bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve özel yazılım geliştirir; e-ticaret altyapısı kurar. Görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Geliştirdiği yazılımların hosting, SEO ve bakımını da üstlenir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.";
const STAT_LABEL = "Kuruluş · Uşak";
const FAQ = {
  "faq-12": {
    "question": "BAI Technology yazılım yayına alındıktan sonra bakım ve destek veriyor mu?",
    "answer": "Evet. Yazılım yayına alınınca bitmez; BAI Technology işletim sistemi ve mağaza gereksinimlerine göre sürüm güncellemeleri yapar, güvenlik yamalarını uygular ve bildirilen hataları düzeltir. Baseline, Bukira ve GymBot'un mağaza güncellemeleri de bu kapsamdadır. Web ve e-ticaret projelerinde aynı yaklaşım geçerlidir; destek kapsamı ve süresi proje başında birlikte belirlenir."
  },
  "faq-14": {
    "question": "BAI Technology nerede bulunuyor?",
    "answer": "BAI Technology, Uşak merkezli bir yazılım ve yapay zeka firmasıdır; 2025'te Zafer Teknopark bünyesinde kurulmuştur. Projelerin büyük kısmını uzaktan yürütür ve Türkiye genelindeki işletmelerle çalışır. Mobil uygulama, web, özel yazılım ve yapay zeka projelerinin yanında hosting, SEO ve bakım desteği de verir; gerektiğinde müşterileriyle yüz yüze görüşür."
  },
  "faq-15": {
    "question": "Uşak'ta mobil uygulama, web veya yapay zeka projesi için BAI Technology ile çalışabilir miyim?",
    "answer": "Evet. BAI Technology Uşak merkezli bir yazılım ve yapay zeka firmasıdır. Bölgedeki işletmelere mobil uygulama, web sitesi, işletmeye özel yazılım ve yapay zeka projeleri geliştirir; sitenin hosting, SEO ve bakım tarafını da üstlenir. Gerektiğinde yüz yüze görüşür; İzmir, Denizli, Manisa, Afyonkarahisar ve Türkiye genelindeki işletmelerle uzaktan çalışır."
  },
  "faq-17": {
    "question": "BAI Technology hosting ve sunucu kurulumu yapıyor mu?",
    "answer": "Evet. BAI Technology, geliştirdiği web ve mobil yazılımların sunucu ya da barındırma ortamını projenin ölçeğine göre seçer, kurar ve yazılımı yayına alır. Alan adı yönlendirmesi ve SSL sertifikası bu sürecin parçasıdır. Yayından sonra sistem güncellemelerini ve erişim yetkilerini izler; yedekleme düzeni proje başında müşteriyle birlikte belirlenir."
  },
  "faq-18": {
    "question": "BAI Technology SEO hizmeti veriyor mu?",
    "answer": "Evet. BAI Technology, web siteleri için teknik SEO çalışması yapar: sayfa yapısını, başlık ve açıklamaları, site haritasını ve schema.org yapılandırılmış verisini düzenler; yükleme hızını ve mobil uyumu iyileştirir. İçeriği, arama motorlarının ve yapay zeka asistanlarının doğru okuyup aktarabileceği açık ve tutarlı bir biçimde kurgular."
  }
};
/** Hedef SSS sırası (bakım → hosting → SEO yan yana) */
const FAQ_ORDER = ["faq-01", "faq-02", "faq-03", "faq-04", "faq-05", "faq-06", "faq-07", "faq-08", "faq-09", "faq-10", "faq-11", "faq-12", "faq-17", "faq-18", "faq-13", "faq-14", "faq-15", "faq-16"];
const SERVICES = {
  "mobil": {
    "claim": "BAI Technology, iOS ve Android için native mobil uygulamalar geliştirir ve mağazalarda yayınlar.",
    "serviceTypes": [
      "iOS uygulama geliştirme",
      "Android uygulama geliştirme",
      "App Store ve Google Play yayını"
    ]
  },
  "web": {
    "claim": "BAI Technology, kurumsal web sitelerinden çok kullanıcılı yönetim panellerine kadar web yazılımı geliştirir.",
    "serviceTypes": [
      "Kurumsal web sitesi",
      "Yönetim paneli geliştirme",
      "Web uygulaması geliştirme"
    ]
  },
  "ozel-yazilim": {
    "claim": "BAI Technology, hazır paketlerin karşılamadığı süreçler için işletmeye özel yazılım geliştirir.",
    "serviceTypes": [
      "İşletmeye özel yazılım",
      "Kurumsal yazılım geliştirme",
      "Süreç yönetim uygulaması"
    ]
  },
  "e-ticaret": {
    "claim": "BAI Technology, Dukan altyapısıyla markalara kendi alan adında çalışan tek kiracılı mağazalar kurar.",
    "serviceTypes": [
      "E-ticaret sitesi kurulumu",
      "Beyaz etiket e-ticaret altyapısı",
      "Online mağaza yönetim paneli"
    ]
  },
  "yapay-zeka": {
    "claim": "BAI Technology, görüntü işleme ve doğal dil işleme modellerini derin öğrenmeyle kendisi eğitir.",
    "serviceTypes": [
      "Yapay zeka modeli geliştirme",
      "Görüntü işleme",
      "Doğal dil işleme",
      "Açıklanabilir yapay zeka (XAI)"
    ]
  },
  "hosting": {
    "claim": "BAI Technology, geliştirdiği yazılımların hosting kurulumunu, alan adı ve SSL bağlantısını ve sunucu yönetimini üstlenir.",
    "serviceTypes": [
      "Hosting kurulumu",
      "Sunucu yönetimi",
      "Alan adı ve SSL kurulumu",
      "Yazılımı yayına alma"
    ]
  },
  "seo": {
    "claim": "BAI Technology, web siteleri için teknik SEO, yapılandırılmış veri ve site hızı çalışması yapar.",
    "serviceTypes": [
      "SEO hizmeti",
      "Web sitesi SEO",
      "Teknik SEO",
      "Yapılandırılmış veri (schema.org)",
      "Site hızı iyileştirme"
    ]
  },
  "bakim-destek": {
    "claim": "BAI Technology, yayına aldığı web ve mobil yazılımlara bakım, güncelleme ve teknik destek sağlar.",
    "serviceTypes": [
      "Yazılım bakımı",
      "Web sitesi bakımı",
      "Mobil uygulama güncelleme",
      "Teknik destek"
    ]
  }
};
const PROJECT_SERVICES = {
  "baseline": [
    "mobil",
    "bakim-destek"
  ],
  "bukira": [
    "mobil",
    "bakim-destek"
  ],
  "gymbot": [
    "mobil",
    "yapay-zeka",
    "bakim-destek"
  ],
  "dukan": [
    "e-ticaret",
    "web"
  ],
  "isletmelere-ozel-yazilim": [
    "ozel-yazilim",
    "web",
    "mobil"
  ],
  "chatekg": [
    "yapay-zeka"
  ]
};

// 1 + 5 — sayfalar
{
  const ref = db.collection("pages").doc("hakkimizda");
  const d = (await ref.get()).data();
  const upd = {};
  if (change(ref, "fields.identityText", d.fields.identityText, IDENTITY)) upd["fields.identityText"] = IDENTITY;
  const rd = [...(d.fields.rdSections ?? [])];
  if (rd[0] && change(ref, "fields.rdSections[0]", rd[0], RD0)) {
    rd[0] = RD0;
    upd["fields.rdSections"] = rd;
  }
  for (const k of ["title", "description"]) if (change(ref, `seo.${k}`, d.seo?.[k], SEO.hakkimizda[k])) upd[`seo.${k}`] = SEO.hakkimizda[k];
  if (Object.keys(upd).length) batch.update(ref, { ...upd, updatedAt: now });
}
for (const slug of ["anasayfa", "iletisim"]) {
  const ref = db.collection("pages").doc(slug);
  const d = (await ref.get()).data();
  const upd = {};
  for (const [k, v] of Object.entries(SEO[slug])) if (change(ref, `seo.${k}`, d.seo?.[k], v)) upd[`seo.${k}`] = v;
  if (Object.keys(upd).length) batch.update(ref, { ...upd, updatedAt: now });
}
{
  const ref = db.collection("siteSettings").doc("main");
  const d = (await ref.get()).data();
  const upd = {};
  const stats = (d.stats ?? []).map((s) => (/teknopark/i.test(s.label) ? { ...s, label: STAT_LABEL } : s));
  if (change(ref, "stats", d.stats, stats)) upd.stats = stats;
  if (change(ref, "seo.organizationDescription", d.seo?.organizationDescription, ORG_DESCRIPTION)) upd["seo.organizationDescription"] = ORG_DESCRIPTION;
  if (change(ref, "seo.defaultTitle", d.seo?.defaultTitle, SEO.anasayfa.title)) upd["seo.defaultTitle"] = SEO.anasayfa.title;
  if (change(ref, "seo.defaultDescription", d.seo?.defaultDescription, SEO.anasayfa.description)) upd["seo.defaultDescription"] = SEO.anasayfa.description;
  if (Object.keys(upd).length) batch.update(ref, { ...upd, updatedAt: now });
}

// 2 — SSS
for (const [id, f] of Object.entries(FAQ)) {
  const ref = db.collection("faq").doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    change(ref, "(yeni)", null, f);
    batch.set(ref, { ...f, isActive: true, order: FAQ_ORDER.indexOf(id), createdAt: now, updatedAt: now });
    continue;
  }
  const d = snap.data();
  const upd = {};
  for (const k of ["question", "answer"]) if (change(ref, k, d[k], f[k])) upd[k] = f[k];
  if (Object.keys(upd).length) batch.update(ref, { ...upd, updatedAt: now });
}
for (const [order, id] of FAQ_ORDER.entries()) {
  const ref = db.collection("faq").doc(id);
  const snap = await ref.get();
  if (snap.exists && snap.data().order !== order) {
    change(ref, "order", snap.data().order, order);
    batch.update(ref, { order });
  }
}

// 3 — hizmetler (yalnızca boş alanlar)
for (const [slug, s] of Object.entries(SERVICES)) {
  const ref = db.collection("services").doc(slug);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`  services/${slug} yok — atlandı`);
    continue;
  }
  const d = snap.data();
  const upd = {};
  if (!d.claim?.trim() && change(ref, "claim", d.claim, s.claim)) upd.claim = s.claim;
  if (!(d.serviceTypes ?? []).length && change(ref, "serviceTypes", d.serviceTypes, s.serviceTypes)) upd.serviceTypes = s.serviceTypes;
  if (Object.keys(upd).length) batch.update(ref, { ...upd, updatedAt: now });
}

// 4 — projeler (yalnızca boş alanlar)
for (const [slug, services] of Object.entries(PROJECT_SERVICES)) {
  const q = await db.collection("projects").where("slug", "==", slug).limit(1).get();
  if (q.empty) {
    console.log(`  projects/${slug} yok — atlandı`);
    continue;
  }
  const doc = q.docs[0];
  if (!(doc.data().services ?? []).length && change(doc.ref, "services", doc.data().services, services))
    batch.update(doc.ref, { services, updatedAt: now });
}

if (!DRY && changes) await batch.commit();
console.log(`\n${changes} değişiklik — ${DRY ? "deneme, hiçbir şey yazılmadı" : changes ? "tamamlandı" : "yapılacak bir şey yok"}.`);
process.exit(0);
