import Script from "next/script"

const BASE_URL = "https://baitech.com.tr"

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "BAI Technology",
  alternateName: ["BAI Teknoloji", "BAITECH"],
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/bai-logo.png`,
    width: 512,
    height: 512,
  },
  image: `${BASE_URL}/bai-logo.png`,
  description:
    "Yapay zeka destekli özel yazılım çözümleri sunan teknoloji şirketi. ChatEKG sağlık teknolojisi, GymBot spor asistanı, Baseline tenis rezervasyon platformu, Çetin Group App inşaat yönetim sistemi, web ve mobil yönetim sistemleri, e-ticaret platformları geliştiriyoruz.",
  foundingDate: "2024",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tekstil OSB Mahallesi 204. Cadde No:566/103",
    addressLocality: "Merkez",
    addressRegion: "Uşak",
    addressCountry: "TR",
  },
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
  areaServed: { "@type": "Country", name: "Turkey" },
  knowsAbout: [
    "Yapay Zeka",
    "Makine Öğrenmesi",
    "Açıklanabilir Yapay Zeka",
    "Doğal Dil İşleme",
    "Görüntü İşleme",
    "Mobil Uygulama Geliştirme",
    "Web Geliştirme",
    "E-Ticaret",
    "İş Süreçleri Otomasyonu",
  ],
}

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: "BAI Technology",
  alternateName: "BAI Teknoloji",
  url: BASE_URL,
  description:
    "Yapay zeka ve özel yazılım çözümleri. ChatEKG, GymBot, Baseline tenis platformu, Çetin Group App, web ve mobil yönetim sistemleri.",
  inLanguage: "tr-TR",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/?s={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
}

const servicesCatalog = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/#services`,
  serviceType: "Software Development",
  name: "Yapay Zeka ve Yazılım Geliştirme Hizmetleri",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "Turkey" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI ve Yazılım Hizmetleri",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Akıllı Otomasyon",
          description:
            "Tekrarlayan iş süreçlerinizi yapay zeka ile otomatikleştirin ve zamandan tasarruf edin.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Veri Analizi",
          description:
            "Büyük veri setlerinizi analiz ederek işletmeniz için değerli içgörüler elde edin.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Müşteri Deneyimi",
          description: "AI destekli chatbot’lar ve kişiselleştirme ile müşteri memnuniyetini artırın.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Yönetim Sistemleri",
          description:
            "İşletmelere özel web, iOS ve Android tabanlı yönetim sistemleri geliştirme.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "E-Ticaret Çözümleri",
          description:
            "Özelleştirilmiş, ölçeklenebilir ve modern ödeme entegrasyonlu online satış sistemleri.",
        },
      },
    ],
  },
}

const chatekg = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#chatekg`,
  name: "ChatEKG",
  alternateName: "ChatEKG XAI",
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Medical AI Decision Support",
  operatingSystem: "Web, iOS, Android",
  description:
    "Açıklanabilir yapay zeka (XAI) ile akıllı EKG analizi ve klinik karar destek sistemi. Acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırır, ritim bozukluklarına yönelik ön değerlendirme ve klinik yönlendirme önerileri sunar.",
  image: `${BASE_URL}/bai-logo.png`,
  url: `${BASE_URL}/#chatekg`,
  inLanguage: ["tr-TR", "en-US"],
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    availability: "https://schema.org/PreOrder",
  },
  featureList: [
    "Görüntü işleme tabanlı EKG analizi",
    "Açıklanabilir yapay zeka (XAI) çıktıları",
    "Ritim bozukluğu ön değerlendirmesi",
    "Chat tabanlı klinik arayüz",
    "Türkçe ve İngilizce dil desteği",
    "Web ve mobil platform desteği",
  ],
  audience: {
    "@type": "MedicalAudience",
    audienceType: "Sağlık Profesyonelleri",
  },
  publisher: { "@id": `${BASE_URL}/#organization` },
  creator: { "@id": `${BASE_URL}/#organization` },
}

const gymbot = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "@id": `${BASE_URL}/#gymbot`,
  name: "GymBot",
  applicationCategory: "HealthAndFitnessApplication",
  applicationSubCategory: "Personal Training & Nutrition",
  operatingSystem: ["iOS", "Android"],
  description:
    "Yapay zeka destekli akıllı antrenman ve sağlık asistanı. Spor hareketlerini analiz eder, doğruluk oranlarını gerçek zamanlı tespit eder; kişiye özel antrenman ve diyet planları oluşturur.",
  image: `${BASE_URL}/bai-logo.png`,
  url: `${BASE_URL}/#gymbot`,
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    availability: "https://schema.org/PreOrder",
  },
  featureList: [
    "Gerçek zamanlı hareket analizi (Pose AI)",
    "Hareket doğruluk skorlama",
    "Kişiye özel antrenman programları",
    "Diyet planları ve makro/mikro besin takibi",
    "Ağırlık ve gelişim grafikleri",
  ],
  publisher: { "@id": `${BASE_URL}/#organization` },
  creator: { "@id": `${BASE_URL}/#organization` },
}

const baseline = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  "@id": `${BASE_URL}/#baseline`,
  name: "Baseline",
  alternateName: ["Baseline Tennis", "Baseline Tenis"],
  applicationCategory: "SportsApplication",
  applicationSubCategory: "Tennis Booking & Marketplace",
  operatingSystem: ["iOS", "Android"],
  description:
    "Tenis kulüpleri için kapsamlı rezervasyon, yönetim ve pazaryeri platformu. Kort rezervasyonu, antrenör eşleştirme, üyelik yönetimi ve tenis ekipmanları pazaryerini tek bir uygulamada birleştirir.",
  image: `${BASE_URL}/bai-logo.png`,
  url: `${BASE_URL}/#baseline`,
  inLanguage: "tr-TR",
  isAccessibleForFree: true,
  installUrl: [
    "https://apps.apple.com/tr/app/baseline/id6762238661?l=tr",
    "https://play.google.com/store/apps/details?id=com.bai.baseline",
  ],
  downloadUrl: [
    "https://apps.apple.com/tr/app/baseline/id6762238661?l=tr",
    "https://play.google.com/store/apps/details?id=com.bai.baseline",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "TRY",
    availability: "https://schema.org/InStock",
    seller: { "@id": `${BASE_URL}/#organization` },
  },
  featureList: [
    "Gerçek zamanlı kort müsaitlik takibi ve online rezervasyon",
    "Antrenör–öğrenci eşleştirme ve özel ders yönetimi",
    "Entegre ödeme sistemi ile güvenli online tahsilat",
    "Kulüp üyelik sistemi ve üye yönetimi",
    "Tenis ekipmanları ve spor ürünleri için entegre pazaryeri modülü",
    "iOS ve Android platformlarında native mobil uygulama",
    "Push bildirim sistemi ile anlık kullanıcı bildirimleri",
  ],
  audience: {
    "@type": "Audience",
    audienceType: "Tenis kulüpleri, antrenörler, sporseverler, tenis ekipmanı mağazaları",
  },
  publisher: { "@id": `${BASE_URL}/#organization` },
  creator: { "@id": `${BASE_URL}/#organization` },
  releaseNotes: "iOS ve Android platformlarında aktif olarak yayında.",
}

const cetinGroupApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${BASE_URL}/#cetin-group-app`,
  name: "Çetin Group App",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Construction Project Management",
  operatingSystem: ["Web", "iOS", "Android"],
  description:
    "Çetin Group inşaat firması için BAI Technology tarafından geliştirilen, proje ve saha süreçlerini tek merkezden yöneten talebe özel yönetim sistemi. Görev, personel ve ilerleme takibi; ofis–saha bilgi akışını dijitalleştirir.",
  image: `${BASE_URL}/bai-logo.png`,
  inLanguage: "tr-TR",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Proje ve saha süreçleri tek merkezden yönetim",
    "Görev, personel ve ilerleme takibi",
    "Ofis ve saha arasında hızlı bilgi akışı",
    "Web, iOS ve Android platformlarda eşzamanlı kullanım",
  ],
  audience: {
    "@type": "BusinessAudience",
    audienceType: "İnşaat firmaları, proje yöneticileri, saha ekipleri",
  },
  publisher: { "@id": `${BASE_URL}/#organization` },
  creator: { "@id": `${BASE_URL}/#organization` },
}

const ecommerce = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/#e-ticaret`,
  name: "E-Ticaret Çözümleri",
  serviceType: "Custom E-Commerce Development",
  description:
    "Özelleştirilmiş online satış sistemleri. Web ve mobil uyumlu, güvenli, ölçeklenebilir altyapı; ürün yönetimi, modern ödeme entegrasyonları ve sipariş takibi.",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: { "@type": "Country", name: "Turkey" },
  audience: {
    "@type": "BusinessAudience",
    audienceType: "Markalar, perakendeciler, üreticiler",
  },
}

const projectsItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${BASE_URL}/#projects`,
  name: "BAI Technology Projeleri",
  description: "BAI Technology tarafından geliştirilen yapay zeka ve özel yazılım projeleri.",
  numberOfItems: 5,
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: [
    { "@type": "ListItem", position: 1, item: { "@id": `${BASE_URL}/#chatekg` } },
    { "@type": "ListItem", position: 2, item: { "@id": `${BASE_URL}/#gymbot` } },
    { "@type": "ListItem", position: 3, item: { "@id": `${BASE_URL}/#cetin-group-app` } },
    { "@type": "ListItem", position: 4, item: { "@id": `${BASE_URL}/#e-ticaret` } },
    { "@type": "ListItem", position: 5, item: { "@id": `${BASE_URL}/#baseline` } },
  ],
}

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Hizmetler", item: `${BASE_URL}/#services` },
    { "@type": "ListItem", position: 3, name: "Projeler", item: `${BASE_URL}/#projects` },
    { "@type": "ListItem", position: 4, name: "Hakkımızda", item: `${BASE_URL}/#about` },
    { "@type": "ListItem", position: 5, name: "İletişim", item: `${BASE_URL}/#contact` },
  ],
}

const schemas = [
  { id: "organization-schema", data: organization },
  { id: "website-schema", data: website },
  { id: "services-schema", data: servicesCatalog },
  { id: "chatekg-schema", data: chatekg },
  { id: "gymbot-schema", data: gymbot },
  { id: "baseline-schema", data: baseline },
  { id: "cetin-group-app-schema", data: cetinGroupApp },
  { id: "ecommerce-schema", data: ecommerce },
  { id: "projects-itemlist-schema", data: projectsItemList },
  { id: "breadcrumb-schema", data: breadcrumb },
]

export function StructuredData() {
  return (
    <>
      {schemas.map(({ id, data }) => (
        <Script
          key={id}
          id={id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  )
}
