import { BASE_URL, getProject, orderedProjects } from "@/lib/projects"
import { serviceCatalogItems } from "@/lib/services"
import { faqItems } from "@/lib/faq"

// Organization + ProfessionalService (LocalBusiness alt tipi) tek düğümde
// çoklu-tiplenir: aynı @id, tek NAP kaydı — ayrı LocalBusiness düğümüyle
// adres çakışması olmaz. Yerel SEO sinyalleri (geo, areaServed, openingHours,
// priceRange, sameAs) buraya eklendi.
const organization = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${BASE_URL}/#organization`,
  name: "BAI Technology",
  // Marka adının insanların yazabileceği tüm biçimleri — Türkçe/İngilizce ad,
  // kısaltma ve harf varyantları (Türkçe "ı/i" ve büyük/küçük harf dahil).
  alternateName: [
    "BAI",
    "bai",
    "BAI Teknoloji",
    "BAI Tech",
    "BAITECH",
    "baitech",
    "Bai Teknoloji",
    "Bai Technology",
  ],
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/bai-logo-512.png`,
    width: 512,
    height: 512,
  },
  image: `${BASE_URL}/bai-logo-512.png`,
  description:
    "BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; markalara e-ticaret altyapısı kurar. Görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.",
  foundingDate: "2025",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Uşak",
      addressCountry: "TR",
    },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tekstil OSB Mahallesi 204. Cadde No:566/103",
    addressLocality: "Uşak",
    addressRegion: "Uşak",
    postalCode: "64100",
    addressCountry: "TR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.6823,
    longitude: 29.4082,
  },
  hasMap: "https://www.google.com/maps?q=38.6823,29.4082",
  telephone: "+90-532-369-4564",
  email: "info@baitech.com.tr",
  priceRange: "₺₺",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  // App Store / Google Play uygulama sayfaları — dış otoritatif referanslar.
  // Sosyal medya profilleri hazır olduğunda buraya eklenmeli.
  sameAs: [
    "https://apps.apple.com/tr/app/baseline/id6762238661",
    "https://play.google.com/store/apps/details?id=com.bai.baseline",
    "https://apps.apple.com/tr/app/bukira/id6789983975",
    "https://play.google.com/store/apps/details?id=com.bukira.admin",
    "https://apps.apple.com/tr/app/gymbot/id6784051250",
    "https://play.google.com/store/apps/details?id=com.gymbot.app",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "info@baitech.com.tr",
      telephone: "+90-532-369-4564",
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "info@baitech.com.tr",
      areaServed: "TR",
      availableLanguage: ["Turkish", "English"],
    },
  ],
  areaServed: { "@type": "Country", name: "Türkiye" },
  memberOf: {
    "@type": "Organization",
    name: "Zafer Teknopark",
    alternateName: "Afyon Uşak Zafer Teknopark",
    url: "https://www.zaferteknopark.com.tr",
  },
  // Uzmanlık alanları düz metin yerine Wikidata varlıklarına bağlanır; üretken
  // motorlar ve arama motorları kavramı tekilleştirebilsin diye. Q-ID'ler
  // Wikidata etiketleriyle doğrulandı; karşılığı teyit edilemeyen iki kalem
  // (mobil uygulama geliştirme, iş süreçleri otomasyonu) düz metin bırakıldı.
  knowsAbout: [
    { "@type": "Thing", name: "Yapay Zeka", sameAs: "https://www.wikidata.org/wiki/Q11660" },
    { "@type": "Thing", name: "Makine Öğrenmesi", sameAs: "https://www.wikidata.org/wiki/Q2539" },
    {
      "@type": "Thing",
      name: "Açıklanabilir Yapay Zeka",
      sameAs: "https://www.wikidata.org/wiki/Q40890078",
    },
    {
      "@type": "Thing",
      name: "Doğal Dil İşleme",
      sameAs: "https://www.wikidata.org/wiki/Q30642",
    },
    { "@type": "Thing", name: "Görüntü İşleme", sameAs: "https://www.wikidata.org/wiki/Q844240" },
    { "@type": "Thing", name: "Web Geliştirme", sameAs: "https://www.wikidata.org/wiki/Q386275" },
    { "@type": "Thing", name: "E-Ticaret", sameAs: "https://www.wikidata.org/wiki/Q484847" },
    "Mobil Uygulama Geliştirme",
    "İş Süreçleri Otomasyonu",
  ],
}

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "BAI Technology",
  alternateName: ["BAI", "BAI Teknoloji", "baitech"],
  url: BASE_URL,
  description:
    "Yazılım ve yapay zeka firması BAI Technology (BAI Teknoloji). Mobil uygulama, web yazılım, e-ticaret altyapısı ve işletmeye özel yazılım.",
  inLanguage: "tr-TR",
  publisher: { "@id": `${BASE_URL}/#organization` },
  // Not: potentialAction/SearchAction kaldırıldı — sitede gerçek bir arama
  // özelliği yok; olmayan bir aramayı şemada iddia etmek yanıltıcıydı.
}

const servicesCatalog = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/hizmetler#services`,
  serviceType: "Software Development",
  name: "Yazılım ve Yapay Zeka Geliştirme Hizmetleri",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "Turkey" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Yazılım ve Yapay Zeka Hizmetleri",
    // Tek kaynak: lib/services.ts — kartlarla aynı metinler.
    itemListElement: serviceCatalogItems.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.body,
      },
    })),
  },
}

// Düz <script> kullanılır (next/script değil): next/script client-side sayfa
// geçişlerinde script'leri DOM'da bırakıp id'ye göre tekilleştirdiği için
// sayfa başına JSON-LD yanlış birikir. Düz script React ile birlikte
// mount/unmount olur; her sayfa yalnızca kendi şemalarını taşır.
function JsonLd({ id, data }: { id: string; data: Record<string, unknown> }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Organization + WebSite — her sayfada ortak, (site) layout'unda render edilir. */
export function SiteStructuredData() {
  return (
    <>
      <JsonLd id="organization-schema" data={organization} />
      <JsonLd id="website-schema" data={website} />
    </>
  )
}

/** Hizmet kataloğu — /hizmetler sayfasında render edilir. */
export function ServicesStructuredData() {
  return <JsonLd id="services-schema" data={servicesCatalog} />
}

/** SSS (FAQPage) — /hizmetler sayfasında render edilir; görünür SSS ile aynı kaynak. */
export function FaqStructuredData() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE_URL}/hizmetler#faq`,
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }
  return <JsonLd id="faq-schema" data={faqPage} />
}

/** Proje listesi (ItemList) — /projeler sayfasında render edilir. */
export function ProjectsListStructuredData() {
  const projectsItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE_URL}/projeler#projects`,
    name: "BAI Technology Projeleri",
    description: "BAI Technology tarafından geliştirilen yapay zeka ve özel yazılım projeleri.",
    numberOfItems: orderedProjects.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: orderedProjects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@id": `${BASE_URL}/projeler/${p.slug}` },
    })),
  }
  return <JsonLd id="projects-itemlist-schema" data={projectsItemList} />
}

/** Tek projenin şeması — /projeler/[slug] sayfasında render edilir. */
export function ProjectStructuredData({ slug }: { slug: string }) {
  const project = getProject(slug)
  if (!project) return null
  return <JsonLd id={`${slug}-schema`} data={project.structuredData} />
}

/** Sayfa başına breadcrumb zinciri. path "/" ise kök URL kullanılır. */
export function BreadcrumbStructuredData({
  items,
}: {
  items: { name: string; path: string }[]
}) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.path === "/" ? BASE_URL : `${BASE_URL}${it.path}`,
    })),
  }
  return <JsonLd id="breadcrumb-schema" data={breadcrumb} />
}
