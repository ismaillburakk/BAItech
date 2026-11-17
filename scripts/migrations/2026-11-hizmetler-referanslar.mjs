#!/usr/bin/env node
/**
 * İçerik güncellemesi — Kasım 2026
 *  1. Referans logoları: görünüm modu "original" (kendi renkleri)
 *  2. Üç yeni hizmet: Hosting & Sunucu Yönetimi, SEO & Dijital Görünürlük, Bakım & Teknik Destek
 *     (sıra 006–008; mevcut beş hizmete dokunulmaz)
 *  3. SSS "BAI Technology ne yapar?" cevabı yeni hizmetleri içerecek şekilde
 *  4. /hizmetler SEO başlık/açıklama + hizmet giriş metinleri (ana sayfa + /hizmetler)
 *  5. Ana sayfa teknoloji şeridi alanının (pages/anasayfa.fields.techStrip) silinmesi
 *
 * İdempotent: tekrar çalıştırmak aynı sonucu verir; var olan yeni hizmet dokümanı
 * panelde düzenlendiyse ÜZERİNE YAZILMAZ.
 *
 *   node --env-file=.env scripts/migrations/2026-11-hizmetler-referanslar.mjs --dry-run
 *   node --env-file=.env scripts/migrations/2026-11-hizmetler-referanslar.mjs
 */
import process from "node:process";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { initAdminApp } from "../_firebase.mjs";

const DRY = process.argv.includes("--dry-run");
const db = getFirestore(initAdminApp());
const now = FieldValue.serverTimestamp();
const log = (...a) => console.log(DRY ? "[deneme]" : "[yazıldı]", ...a);

const NEW_SERVICES = [
  {
    "slug": "hosting",
    "title": "Hosting & Sunucu Yönetimi",
    "icon": "server",
    "summary": "Geliştirdiğimiz yazılımları yayına alıyor; sunucu kurulumundan alan adı ve SSL bağlantısına kadar barındırma tarafını yönetiyoruz.",
    "detail": "Projenin ölçeğine uygun sunucu veya barındırma ortamını seçer, kurar ve yazılımı yayına alırız. Alan adı yönlendirmesi, SSL sertifikası ve ortam ayarları bu sürecin parçasıdır. Yayından sonra sistem güncellemelerini, erişim yetkilerini ve kaynak kullanımını izleriz; yedekleme düzeni proje başında birlikte belirlenir. Çıktı, kendi alan adınızda güvenli bağlantıyla çalışan bir canlı ortamdır.",
    "order": 5,
    "homeOrder": 5
  },
  {
    "slug": "seo",
    "title": "SEO & Dijital Görünürlük",
    "icon": "search-check",
    "summary": "Sitenizin arama motorlarında ve yapay zeka asistanlarında doğru anlaşılması için teknik SEO, yapılandırılmış veri ve hız üzerinde çalışıyoruz.",
    "detail": "Görünürlük, sitenin teknik temelinden başlar. Sayfa yapısını, başlık ve açıklamaları, site haritasını ve schema.org yapılandırılmış verisini düzenler; yükleme hızını ve mobil uyumu ölçerek iyileştiririz. İçeriği, yapay zeka asistanlarının doğru aktarabileceği açık ve tutarlı bir biçimde kurgularız. Çıktı, arama motorlarının ve asistanların doğru okuyup tanımladığı bir sitedir.",
    "order": 6,
    "homeOrder": 6
  },
  {
    "slug": "bakim-destek",
    "title": "Bakım & Teknik Destek",
    "icon": "wrench",
    "summary": "Yayına aldığımız yazılımların güncellemelerini, hata düzeltmelerini ve teknik desteğini yayından sonra da sürdürüyoruz.",
    "detail": "Yazılım yayına alındığında bitmez. İşletim sistemi ve mağaza gereksinimlerindeki değişikliklere göre sürüm güncellemeleri yapar, kullanılan kütüphanelerin güvenlik yamalarını uygular, bildirilen hataları önceliğine göre düzeltiriz. Yeni ihtiyaçlar küçük geliştirmeler olarak planlanır; destek kapsamı ve süresi proje başında birlikte belirlenir. Çıktı, güncel ve güvenle kullanılmaya devam eden bir üründür.",
    "order": 7,
    "homeOrder": 7
  }
];

const FAQ_WHAT = "BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; markalara e-ticaret altyapısı kurar ve görüntü ile dil tabanlı yapay zeka modellerini kendisi eğitir. Geliştirdiği yazılımları yayına alır; sunucu yönetimini, SEO çalışmasını ve bakımını da üstlenir. Baseline, Bukira ve GymBot App Store ve Google Play'de yayındadır.";
const SERVICES_INTRO = "Mobil uygulama, web ve özel yazılım geliştiriyoruz; yapay zeka modellerini de kendimiz eğitiyoruz. Yayına aldığımız yazılımların sunucusunu, görünürlüğünü ve bakımını da üstleniyoruz.";
const HIZMETLER_SEO = {
  title: "Hizmetler: Mobil, Web, Yapay Zeka, Hosting ve SEO | BAI Tech",
  description: "BAI Technology; mobil uygulama, web, özel yazılım ve e-ticaret altyapısı geliştirir, yapay zeka modelleri eğitir; hosting, SEO, bakım ve destek sunar.",
};

const batch = db.batch();

// 1 — referanslar
for (const d of (await db.collection("references").get()).docs) {
  if (d.data().logoMode === "original") continue;
  batch.update(d.ref, { logoMode: "original", updatedAt: now });
  log(`references/${d.id}: logoMode ${d.data().logoMode ?? "(yok)"} → original`);
}

// 2 — yeni hizmetler
for (const s of NEW_SERVICES) {
  const ref = db.collection("services").doc(s.slug);
  if ((await ref.get()).exists) {
    console.log(`  services/${s.slug} zaten var — dokunulmadı`);
    continue;
  }
  const clash = await db.collection("services").where("slug", "==", s.slug).limit(1).get();
  if (!clash.empty) {
    console.log(`  slug "${s.slug}" başka dokümanda kullanılıyor — atlandı`);
    continue;
  }
  batch.set(ref, { ...s, bentoSize: "small", bentoArt: "none", images: [], createdAt: now, updatedAt: now });
  log(`services/${s.slug}: oluşturuldu (sıra ${s.order + 1})`);
}

// 3 — SSS
const faq = await db.collection("faq").where("question", "==", "BAI Technology ne yapar?").limit(1).get();
if (!faq.empty && faq.docs[0].data().answer !== FAQ_WHAT) {
  batch.update(faq.docs[0].ref, { answer: FAQ_WHAT, updatedAt: now });
  log(`faq/${faq.docs[0].id}: cevap güncellendi (${FAQ_WHAT.split(/\s+/).length} kelime)`);
}

// 4–5 — sayfalar
const hz = db.collection("pages").doc("hizmetler");
batch.update(hz, { "seo.title": HIZMETLER_SEO.title, "seo.description": HIZMETLER_SEO.description, "fields.headerDescription": SERVICES_INTRO, updatedAt: now });
log("pages/hizmetler: seo.title, seo.description, fields.headerDescription");
const home = db.collection("pages").doc("anasayfa");
batch.update(home, { "fields.servicesDescription": SERVICES_INTRO, "fields.techStrip": FieldValue.delete(), updatedAt: now });
log("pages/anasayfa: fields.servicesDescription, fields.techStrip silindi");

if (!DRY) await batch.commit();
console.log(DRY ? "Deneme bitti — hiçbir şey yazılmadı." : "Tamamlandı.");
process.exit(0);
