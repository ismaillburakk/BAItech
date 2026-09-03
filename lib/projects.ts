export const BASE_URL = "https://baitech.com.tr"

export type GalleryImage = {
  src: string
  alt: string
  type: "mobile" | "web"
  /**
   * Web (tarayıcı) mockup'ında görselin gerçek piksel boyutları. Görsel alanına
   * en-boy oranı verip yüksekliğin içeriğe göre (kırpılmadan) oluşmasını sağlar;
   * tanımsızsa 16:9 varsayılır. Telefon mockup'ı bunu kullanmaz.
   */
  w?: number
  h?: number
}

export type GalleryTab = {
  /** Mono eyebrow etiketi (uppercase render edilir), örn "MÜŞTERİ TARAFI". */
  label: string
  images: GalleryImage[]
}

export type Project = {
  id: string
  slug: string
  category: string
  status?: string
  statusTone?: "live" | "active" | "soon"
  title: string
  subtitle: string
  /**
   * SEO meta description (120–160 karakter). subtitle görsel bir alt başlık
   * olduğundan arama sonuçları için kısa kalır; bu alan ayrı ve daha dolu
   * tutulur. Tanımsızsa detay sayfası subtitle'a düşer.
   */
  metaDescription?: string
  body: string[]
  bullets?: string[]
  note?: string
  /** En fazla 2 kalem (Platform, Sektör/Alan) — kartlarda 2 kolonlu şerit. */
  meta: { label: string; value: string }[]
  /** Teknoloji/stack etiketi (mono satır), örn "React Native · Django · PostgreSQL". */
  tech?: string
  /** Store linkleri geldiğinde tek satırla aktifleşir; yoksa buton render edilmez. */
  storeLinks?: {
    appStore?: string
    playStore?: string
  }
  /** Web ürünleri için (ör. Bukira) — detay sayfasında "Web sitesini ziyaret et" linki. */
  webUrl?: string
  /**
   * Gerçek ürün görseli hazır olduğunda doldurulur; yoksa kartlar mevcut
   * çizgili placeholder'ı gösterir. Önerilen boyut: 1280×720 (16:9).
   */
  image?: { src: string; alt: string }
  /** Detay sayfası ekran görüntüsü galerisi. Tanımsızsa galeri bölümü render edilmez. */
  gallery?: { tabs: GalleryTab[] }
  structuredData: Record<string, unknown>
}

// Galeri görseli kısayolları. Web görsellerinde w/h verilebilir (tarayıcı
// mockup'ının en-boy oranı için); mobil görsellerde gerekmez.
const img = (
  path: string,
  alt: string,
  type: "mobile" | "web",
  w?: number,
  h?: number
): GalleryImage => ({
  src: `/projects-ss/${path}`,
  alt,
  type,
  ...(w && h ? { w, h } : {}),
})

// Ardışık adlandırılmış görseller: {folder}/{folder}-01.png … -NN.png
function seq(
  folder: string,
  count: number,
  altBase: string,
  type: "mobile" | "web"
): GalleryImage[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0")
    return img(`${folder}/${folder}-${n}.png`, `${altBase} — ekran ${i + 1}`, type)
  })
}

// Ekranda gösterim sırası kürasyonla belirlenir; bu dizideki sıra korunur
// (001 Baseline → 006 ChatEKG). orderedProjects bu sırayı aynen yansıtır.
export const projects: Project[] = [
  {
    id: "case-01",
    slug: "baseline",
    category: "Spor & Rezervasyon",
    status: "Aktif / Yayında",
    statusTone: "live",
    title: "Baseline",
    subtitle: "Tenis Kulüpleri için Kapsamlı Rezervasyon ve Yönetim Platformu",
    metaDescription:
      "Tenis kulüpleri için rezervasyon ve yönetim platformu. Kort rezervasyonu, antrenör eşleştirme ve üyelik yönetimini iOS ve Android uygulamasında toplar.",
    body: [
      "Baseline, tenis kulüpleri, antrenörler ve sporseverler için geliştirilmiş kapsamlı bir rezervasyon ve yönetim platformudur. Kulüplerin kort rezervasyonlarını, özel ders süreçlerini ve üyelik yönetimini tek bir sistem üzerinden dijital ortama taşımasını sağlar.",
      "Platform; kulüp sahipleri, antrenörler ve kullanıcılar için ayrı rol yapılarıyla çalışır. Kullanıcılar uygulama üzerinden kort rezervasyonu yapabilir, sertifikalı antrenörlerden özel ders talep edebilir ve kulüp üyeliklerini yönetebilir. Kulüpler ise rezervasyonları, antrenörleri, kortları ve üyelikleri merkezi bir panelden takip edebilir.",
      "Baseline aynı zamanda tenis ekipmanları ve spor ürünleri satan mağazaların ürünlerini listeleyip satacağı entegre bir pazaryeri modülü de içerecek şekilde planlanmaktadır. Bu modülle mağazalar, ürünlerini platforma yükleyerek doğrudan sporseverlere ulaşabilecektir.",
      "Baseline’ı farklılaştıran temel özellikler:",
    ],
    bullets: [
      "Gerçek zamanlı kort müsaitlik takibi ve online rezervasyon",
      "Antrenör–öğrenci eşleştirme ve özel ders yönetimi",
      "Entegre ödeme sistemi ile güvenli online tahsilat",
      "Kulüp üyelik sistemi ve üye yönetimi",
      "Tenis ekipmanları ve spor ürünleri için planlanan entegre pazaryeri modülü",
      "iOS ve Android platformlarında sorunsuz çalışan native mobil uygulama",
      "Push bildirim sistemi ile anlık kullanıcı bildirimleri",
    ],
    note: "Durum: iOS ve Android platformlarında aktif olarak yayında",
    meta: [
      { label: "Sektör", value: "Tenis · Spor" },
      { label: "Platform", value: "iOS · Android" },
    ],
    storeLinks: {
      appStore: "https://apps.apple.com/tr/app/baseline/id6762238661?l=tr",
      playStore: "https://play.google.com/store/apps/details?id=com.bai.baseline",
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "@id": `${BASE_URL}/projeler/baseline`,
      name: "Baseline",
      alternateName: ["Baseline Tennis", "Baseline Tenis"],
      applicationCategory: "SportsApplication",
      applicationSubCategory: "Tennis Booking & Club Management",
      operatingSystem: ["iOS", "Android"],
      description:
        "Tenis kulüpleri için kapsamlı rezervasyon ve yönetim platformu. Kort rezervasyonu, antrenör eşleştirme ve üyelik yönetimini tek bir uygulamada sunar; tenis ekipmanları pazaryeri modülü ise planlanmaktadır.",
      image: `${BASE_URL}/bai-logo-512.png`,
      url: `${BASE_URL}/projeler/baseline`,
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
        "Tenis ekipmanları ve spor ürünleri için planlanan entegre pazaryeri modülü",
        "iOS ve Android platformlarında native mobil uygulama",
        "Push bildirim sistemi ile anlık kullanıcı bildirimleri",
      ],
      audience: {
        "@type": "Audience",
        audienceType: "Tenis kulüpleri, antrenörler, sporseverler",
      },
      publisher: { "@id": `${BASE_URL}/#organization` },
      creator: { "@id": `${BASE_URL}/#organization` },
      releaseNotes: "iOS ve Android platformlarında aktif olarak yayında.",
    },
  },
  {
    id: "case-02",
    slug: "bukira",
    category: "Randevu & Yönetim",
    status: "Aktif / Yayında",
    statusTone: "live",
    title: "Bukira",
    subtitle: "Randevuyla Çalışan İşletmeler için Randevu ve Yönetim Platformu",
    metaDescription:
      "Randevuyla çalışan işletmeler için randevu ve yönetim platformu. Takvim, müşteri kayıtları, hizmet ve personel programını iOS ve Android'de birleştirir.",
    body: [
      "Bukira, randevuyla çalışan işletmeler için geliştirilen bir randevu ve işletme yönetim platformudur. İşletmeler; randevu takvimini, müşteri kayıtlarını, hizmet tanımlarını ve personel programını tek bir mobil uygulama üzerinden yönetebilir.",
      "Uygulama, gün içi akışı takvim üzerinden görünür kılar: randevular saat bazında listelenir, personele ve duruma (onaylı, bekliyor) göre filtrelenebilir. Müşteri geçmişi ve hizmet tanımları aynı sistemde tutulur; böylece işletme sahibi dağınık araçlar yerine tek bir yerden çalışır.",
      "Bukira, farklı hizmet sektörlerinin ortak ihtiyaçlarını temel alır; iOS ve Android platformlarında yayındadır.",
    ],
    bullets: [
      "Haftalık ve günlük randevu takvimi",
      "Personel bazlı program ve filtreleme",
      "Müşteri kayıtları ve geçmiş takibi",
      "Hizmet tanımları ve süre yönetimi",
    ],
    note: "Durum: iOS ve Android platformlarında aktif olarak yayında",
    meta: [
      { label: "Alan", value: "Randevu · Yönetim" },
      { label: "Platform", value: "iOS · Android" },
    ],
    storeLinks: {
      appStore: "https://apps.apple.com/tr/app/bukira/id6789983975?l=tr",
      playStore: "https://play.google.com/store/apps/details?id=com.bukira.admin",
    },
    webUrl: "https://bukira.com.tr",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "@id": `${BASE_URL}/projeler/bukira`,
      name: "Bukira",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Appointment Scheduling & Business Management",
      operatingSystem: ["iOS", "Android"],
      description:
        "Randevuyla çalışan işletmeler için randevu ve işletme yönetim platformu. Randevu takvimi, müşteri kayıtları, hizmet tanımları ve personel programını tek bir mobil uygulamada birleştirir.",
      image: `${BASE_URL}/bai-logo-512.png`,
      url: `${BASE_URL}/projeler/bukira`,
      inLanguage: "tr-TR",
      installUrl: [
        "https://apps.apple.com/tr/app/bukira/id6789983975?l=tr",
        "https://play.google.com/store/apps/details?id=com.bukira.admin",
      ],
      downloadUrl: [
        "https://apps.apple.com/tr/app/bukira/id6789983975?l=tr",
        "https://play.google.com/store/apps/details?id=com.bukira.admin",
      ],
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${BASE_URL}/#organization` },
      },
      featureList: [
        "Haftalık ve günlük randevu takvimi",
        "Personel bazlı program ve filtreleme",
        "Müşteri kayıtları ve geçmiş takibi",
        "Hizmet tanımları ve süre yönetimi",
      ],
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Randevuyla çalışan hizmet işletmeleri",
      },
      releaseNotes: "iOS ve Android platformlarında aktif olarak yayında.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      creator: { "@id": `${BASE_URL}/#organization` },
    },
  },
  {
    id: "case-03",
    slug: "gymbot",
    category: "Spor & Sağlık",
    status: "Aktif / Yayında",
    statusTone: "live",
    title: "GymBot",
    subtitle: "Yapay Zeka Destekli Akıllı Antrenman ve Sağlık Asistanı",
    metaDescription:
      "Yapay zeka destekli antrenman ve sağlık asistanı. Spor hareketlerini gerçek zamanlı analiz eder, kişiye özel antrenman ve diyet planları sunar. iOS ve Android.",
    body: [
      "GymBot, mobil platformlar için geliştirilen, yapay zeka destekli bir spor ve sağlık takip sistemidir. Sistem, spor hareketlerini analiz ederek kullanıcının hareketleri doğru yapıp yapmadığını, hareketlerin doğruluk oranlarını ve egzersiz sırasında hangi noktaların eksik veya hatalı olduğunu gerçek zamanlı olarak belirler.",
      "GymBot’un yapay zeka altyapısı yalnızca hareket analiziyle sınırlı değildir. Kullanıcının hedeflerine, fiziksel durumuna ve ilerleme verilerine göre kişiye özel antrenman programları ve diyet planları oluşturabilen bir yapıya sahiptir. Aynı zamanda kullanıcılar; antrenman programlarını, ağırlık ve gelişim grafiklerini, diyet planlarını ve günlük mikro–makro besin değerlerini uygulama üzerinden takip edebilir.",
      "Bu bütüncül yapı sayesinde GymBot, kullanıcıya yalnızca veri sunan bir uygulama değil; antrenman, beslenme ve gelişimi tek bir merkezden yönlendiren akıllı bir spor asistanıdır.",
    ],
    note: "Durum: iOS ve Android platformlarında aktif olarak yayında",
    meta: [
      { label: "Alan", value: "Spor · Beslenme" },
      { label: "Platform", value: "iOS · Android" },
    ],
    storeLinks: {
      appStore: "https://apps.apple.com/tr/app/gymbot/id6784051250?l=tr",
      playStore: "https://play.google.com/store/apps/details?id=com.gymbot.app",
    },
    structuredData: {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "@id": `${BASE_URL}/projeler/gymbot`,
      name: "GymBot",
      applicationCategory: "HealthAndFitnessApplication",
      applicationSubCategory: "Personal Training & Nutrition",
      operatingSystem: ["iOS", "Android"],
      description:
        "Yapay zeka destekli akıllı antrenman ve sağlık asistanı. Spor hareketlerini analiz eder, doğruluk oranlarını gerçek zamanlı tespit eder; kişiye özel antrenman ve diyet planları oluşturur.",
      image: `${BASE_URL}/bai-logo-512.png`,
      url: `${BASE_URL}/projeler/gymbot`,
      inLanguage: "tr-TR",
      isAccessibleForFree: true,
      installUrl: [
        "https://apps.apple.com/tr/app/gymbot/id6784051250?l=tr",
        "https://play.google.com/store/apps/details?id=com.gymbot.app",
      ],
      downloadUrl: [
        "https://apps.apple.com/tr/app/gymbot/id6784051250?l=tr",
        "https://play.google.com/store/apps/details?id=com.gymbot.app",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "TRY",
        availability: "https://schema.org/InStock",
        seller: { "@id": `${BASE_URL}/#organization` },
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
      releaseNotes: "iOS ve Android platformlarında aktif olarak yayında.",
    },
  },
  {
    id: "case-04",
    slug: "dukan",
    category: "E-Ticaret",
    status: "Aktif / Yayında",
    statusTone: "live",
    title: "Dukan",
    subtitle: "Beyaz Etiket, Tek Kiracılı E-Ticaret Altyapısı",
    metaDescription:
      "Beyaz etiket, tek kiracılı e-ticaret altyapısı. Markalar kendi alan adı ve temasıyla web mağazası kurar; satış ile yönetim paneli tek sistemde birleşir.",
    body: [
      "Dukan, markaların kendi online mağazalarını kurup yönetebilmesi için geliştirilen beyaz etiket bir e-ticaret altyapısıdır. Her mağaza kendi alan adı, teması ve ürün kataloğuyla tek kiracılı olarak çalışır; müşteri tarafı ve yönetim paneli tek sistemde birleşir.",
      "Müşteri tarafında ürün listeleme, kategori ve arama, sepet ve ödeme akışı yer alır. Yönetim panelinde ise ürün, kategori, sipariş, stok ve kampanya yönetimi ile temel satış raporları bulunur.",
      "Amaç, işletmelerin sıfırdan geliştirme yapmadan kendi markalı satış kanalını hızlıca kurabilmesidir.",
    ],
    bullets: [
      "Beyaz etiket, markaya özel mağaza",
      "Ürün, kategori ve stok yönetimi",
      "Sipariş takibi ve durum yönetimi",
      "Kampanya, kupon ve satış raporları",
    ],
    note: "Durum: Aktif olarak kullanımda",
    meta: [
      { label: "Sektör", value: "E-Ticaret" },
      { label: "Platform", value: "Web" },
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/projeler/dukan`,
      name: "Dukan",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "E-Commerce Platform",
      operatingSystem: "Web",
      description:
        "Beyaz etiket, tek kiracılı e-ticaret altyapısı. Markalar kendi alan adı, teması ve ürün kataloğuyla online mağaza kurar; müşteri tarafı ve yönetim paneli tek sistemde birleşir.",
      image: `${BASE_URL}/bai-logo-512.png`,
      url: `${BASE_URL}/projeler/dukan`,
      inLanguage: "tr-TR",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Beyaz etiket, markaya özel mağaza",
        "Ürün, kategori ve stok yönetimi",
        "Sepet ve ödeme akışı",
        "Sipariş takibi ve durum yönetimi",
        "Kampanya, kupon ve satış raporları",
      ],
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Markalar, perakendeciler, üreticiler",
      },
      publisher: { "@id": `${BASE_URL}/#organization` },
      creator: { "@id": `${BASE_URL}/#organization` },
    },
  },
  {
    id: "case-05",
    slug: "isletmelere-ozel-yazilim",
    category: "Kurumsal Yazılım",
    title: "İşletmelere Özel Yazılım",
    subtitle: "İhtiyaca Özel Web ve Mobil Yazılım Çözümleri",
    metaDescription:
      "İşletmelere özel web, iOS ve Android yazılım geliştirme. Hazır paketler yerine sürece göre tasarlanan çözümler; inşaat yönetimi ve kurumsal web siteleri dahil.",
    body: [
      "BAI Teknoloji olarak, işletmelerin ihtiyaçlarına göre web, iOS ve Android tabanlı yazılımlar geliştiriyoruz. Her kurumun iş yapış şekli farklı olduğundan, hazır çözümler yerine talebe özel yazılımlar üretiyoruz.",
      "Bu yaklaşımın örnekleri farklı sektörlere yayılır: Çetin Group için proje ve saha süreçlerini yöneten bir inşaat uygulaması, Kompas Care için bir bakım hizmeti web sitesi, Ahmet Demir Mimarlık için bir mimari ofis web sitesi geliştirdik.",
      "Her proje, ilgili işletmenin süreçlerine göre baştan tasarlanır; ortak nokta, işi yerinde anlayıp ona göre yazılım üretmektir.",
    ],
    bullets: [
      "İnşaat proje ve saha yönetimi (Çetin Group)",
      "Kurumsal hizmet web sitesi (Kompas Care)",
      "Mimari ofis web sitesi (Ahmet Demir Mimarlık)",
      "Web, iOS ve Android platformlarda geliştirme",
    ],
    note: "Her biri, “siz istersiniz, biz geliştiririz” yaklaşımımızın somut örnekleridir.",
    meta: [
      { label: "Alan", value: "Kurumsal Yazılım" },
      { label: "Platform", value: "Web · Mobil" },
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/projeler/isletmelere-ozel-yazilim`,
      name: "İşletmelere Özel Yazılım",
      serviceType: "Custom Software Development",
      description:
        "İşletmelere özel web, iOS ve Android yazılım geliştirme. İnşaat proje yönetimi, kurumsal hizmet web siteleri ve mimari ofis siteleri dahil talebe özel çözümler.",
      provider: { "@id": `${BASE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "Turkey" },
      audience: {
        "@type": "BusinessAudience",
        audienceType: "Kurumsal işletmeler, proje ekipleri, hizmet firmaları",
      },
    },
  },
  {
    id: "case-06",
    slug: "chatekg",
    category: "Sağlık Teknolojisi",
    status: "Geliştirme Aşamasında",
    statusTone: "active",
    title: "ChatEKG",
    subtitle: "Açıklanabilir Yapay Zeka ile Akıllı EKG Analizi ve Karar Destek Sistemi",
    metaDescription:
      "Açıklanabilir yapay zeka (XAI) ile EKG analizi ve klinik karar destek sistemi. Acil serviste EKG yorumlamayı hızlandırır; web ve mobil için geliştiriliyor.",
    body: [
      "ChatEKG, acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırmak ve standartlaştırmak için geliştirilen yapay zeka tabanlı bir sağlık teknolojisi projesidir. Sistem; EKG kağıdı veya dijital EKG görüntülerini analiz ederek ritim bozukluklarına yönelik ön değerlendirme ve klinik yönlendirme önerileri sunmayı hedefler.",
      "ChatEKG’yi farklılaştıran temel nokta, yalnızca sonuç üretmeyip açıklanabilir yapay zeka (XAI) ile kararın dayandığı EKG segmentlerini görsel ve metinsel biçimde sunmasıdır. Böylece sağlık profesyonelleri, modelin hangi örüntüler üzerinden sonuca ulaştığını daha şeffaf şekilde inceleyebilir.",
      "Görüntü işleme, derin öğrenme ve doğal dil işleme bileşenleriyle çalışan sistem; chat tabanlı arayüz üzerinden anlaşılır çıktı üretir. Web ve mobil platformlarda, ek donanım gerektirmeden çalışacak şekilde tasarlanmakta; Türkçe ve İngilizce dil desteğiyle ölçeklenebilir bir ürün hedeflemektedir.",
    ],
    note: "Durum: Aktif geliştirme sürecinde",
    meta: [
      { label: "Alan", value: "Sağlık · XAI" },
      { label: "Platform", value: "Web · Mobile" },
    ],
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/projeler/chatekg`,
      name: "ChatEKG",
      alternateName: "ChatEKG XAI",
      applicationCategory: "HealthApplication",
      applicationSubCategory: "Medical AI Decision Support",
      operatingSystem: "Web, iOS, Android",
      description:
        "Açıklanabilir yapay zeka (XAI) ile akıllı EKG analizi ve klinik karar destek sistemi. Acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırır, ritim bozukluklarına yönelik ön değerlendirme ve klinik yönlendirme önerileri sunar.",
      image: `${BASE_URL}/bai-logo-512.png`,
      url: `${BASE_URL}/projeler/chatekg`,
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
    },
  },
]

// Detay sayfası galerileri — slug bazında tanımlanıp yukarıdaki projelere
// iliştirilir (her proje nesnesini galeriyle şişirmeden tek yerde toplu tutmak
// için). ChatEKG bilinçli olarak yok: gösterilecek arayüzü henüz olmadığından
// detay sayfasında galeri bölümü render edilmez.
const galleries: Record<string, NonNullable<Project["gallery"]>> = {
  baseline: {
    tabs: [
      {
        label: "Baseline",
        images: seq("baseline", 8, "Baseline tenis kulübü rezervasyon uygulaması", "mobile"),
      },
    ],
  },
  bukira: {
    tabs: [
      {
        label: "Bukira",
        images: seq("bukira", 6, "Bukira randevu ve işletme yönetim uygulaması", "mobile"),
      },
    ],
  },
  gymbot: {
    tabs: [
      {
        label: "GymBot",
        images: seq("gymbot", 10, "GymBot yapay zeka antrenman uygulaması", "mobile"),
      },
    ],
  },
  dukan: {
    tabs: [
      {
        label: "Müşteri Tarafı",
        images: [
          img("dukan/dukan-01-anasayfa.png", "Dukan e-ticaret mağazası — ana sayfa", "web", 1920, 1080),
          img("dukan/dukan-02-urun-detay.png", "Dukan e-ticaret mağazası — ürün detay", "web", 1920, 1080),
          img("dukan/dukan-03-sepet.png", "Dukan e-ticaret mağazası — sepet", "web", 1920, 1080),
          img("dukan/dukan-03b-odeme.png", "Dukan e-ticaret mağazası — ödeme", "web", 1920, 1080),
        ],
      },
      {
        label: "Yönetim Paneli",
        images: [
          img("dukan/dukan-04-dashboard.png", "Dukan e-ticaret yönetim paneli — genel bakış", "web", 1920, 1080),
          img("dukan/dukan-05-siparisler.png", "Dukan e-ticaret yönetim paneli — siparişler", "web", 1920, 1080),
          img("dukan/dukan-06-urun-yonetimi.png", "Dukan e-ticaret yönetim paneli — ürün yönetimi", "web", 1920, 1080),
          img("dukan/dukan-06b-urun-duzenle.png", "Dukan e-ticaret yönetim paneli — ürün düzenle", "web", 1920, 1080),
        ],
      },
    ],
  },
  "isletmelere-ozel-yazilim": {
    tabs: [
      {
        label: "Çetin Group",
        images: seq("cetin-group", 2, "Çetin Group inşaat proje yönetim uygulaması", "mobile"),
      },
      {
        // Web görselleri: gerçek boyutlar (tarayıcı mockup en-boy oranı için) —
        // seq yerine tek tek, çünkü dosyaların oranları birbirinden farklı.
        label: "Kompas Care",
        images: [
          img("kompas-care/kompas-care-01.png", "Kompas Care kurumsal web sitesi — ekran 1", "web", 1856, 922),
          img("kompas-care/kompas-care-02.png", "Kompas Care kurumsal web sitesi — ekran 2", "web", 1867, 861),
        ],
      },
      {
        label: "Ahmet Demir Mimarlık",
        images: [
          img("ahmet-demir-mimarlik/ahmet-demir-mimarlik-01.png", "Ahmet Demir Mimarlık mimarlık ofisi web sitesi — ekran 1", "web", 1850, 918),
          img("ahmet-demir-mimarlik/ahmet-demir-mimarlik-02.png", "Ahmet Demir Mimarlık mimarlık ofisi web sitesi — ekran 2", "web", 1852, 918),
        ],
      },
    ],
  },
}

projects.forEach((p) => {
  if (galleries[p.slug]) p.gallery = galleries[p.slug]
})

// Teknoloji/stack etiketleri (slug bazında; kartlarda mono satır olarak gösterilir).
// isletmelere-ozel-yazilim bir kategori (üç ayrı müşteri işi); tek stack yerine
// çalışılan platformları gösteren genel etiket kullanılır.
const techTags: Record<string, string> = {
  baseline: "React Native · Django · PostgreSQL",
  bukira: "React Native · Django · PostgreSQL",
  gymbot: "React Native · Django · Celery",
  dukan: "Django · Next.js · PostgreSQL",
  "isletmelere-ozel-yazilim": "Web · iOS · Android",
  chatekg: "Derin Öğrenme · PyTorch · Görüntü İşleme",
}
projects.forEach((p) => {
  if (techTags[p.slug]) p.tech = techTags[p.slug]
})

// Gösterim sırası dizideki kürasyon sırasıdır (durum bazlı sort YOK — Baseline
// featured, kalanlar indeks listesinde bu sırayla).
export const orderedProjects = projects

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

// 1-based position of a project in the display order — the "— 00N" / "FIG. 0N"
// numbers shown on cards stay consistent across grid, list and detail pages.
export function getProjectDisplayIndex(slug: string): number {
  return orderedProjects.findIndex((p) => p.slug === slug) + 1
}
