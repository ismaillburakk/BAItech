/**
 * Firestore veri modeli — BAI Teknoloji (BAI Technology)
 * =============================================================
 * Mimari kaynak: Ahmet Demir Mimarlık projesi (Firebase + Cloudinary).
 * Tasarım kaynağı: taslak/ (koyu teknoloji teması).
 *
 * Genel kurallar:
 * - `id` alanı Firestore doküman ID'sidir; dokümanın İÇİNE yazılmaz,
 *   okuma sırasında `doc.id` ile birleştirilir.
 * - Tüm görseller Cloudinary'dedir; Firestore yalnızca referansı
 *   (public_id + url) tutar. Firebase Storage KULLANILMAZ.
 * - Tüm alanlar her yazımda eksiksiz gönderilir (boş = "" / [] / null);
 *   Firestore `undefined` kabul etmediği için opsiyonel alanlar bile
 *   tanımlı değerle saklanır.
 * - VURGU KONVANSİYONU: başlıklarda `*kelime*` → sitede degrade vurgu.
 */

/* ================================================================
 * ORTAK TİPLER
 * ================================================================ */

export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export type FirestoreDoc<T extends { id: string }> = Omit<T, "id">;

/** Cloudinary görsel referansı — görsel içeren TÜM alanlarda kullanılır */
export interface CloudinaryImage {
  /** Cloudinary public ID — next/image loader bunu kaynak alır */
  public_id: string;
  /** Teslim URL'i (secure) */
  url: string;
  width?: number;
  height?: number;
  /** Alt metni (erişilebilirlik + SEO) */
  alt?: string;
  /** Dosya biçimi (svg, png, webp …) */
  format?: string;
}

export interface GalleryImage extends CloudinaryImage {
  order: number;
}

export interface LabelValue {
  label: string;
  value: string;
}

export const COLLECTIONS = {
  projects: "projects",
  services: "services",
  references: "references",
  faq: "faq",
  hero: "hero",
  teamMembers: "teamMembers",
  pages: "pages",
  siteSettings: "siteSettings",
  submissions: "submissions",
} as const;

/** Tekil dokümanların ID'si (hero/main, siteSettings/main) */
export const SINGLETON_DOC_ID = "main";

/* ================================================================
 * PROJECTS — 6 proje (Baseline, Bukira, GymBot, Dukan, Özel Yazılım, ChatEKG)
 * Besler: ana sayfa yatay şerit, /projeler bento ızgarası, /projeler/[slug]
 * ================================================================ */

export type ProjectStatus = "live" | "development" | "soon" | "none";

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "live",
  "development",
  "soon",
  "none",
] as const;

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Yayında",
  development: "Geliştirmede",
  soon: "Yakında",
  none: "Durum gösterme",
};

/** Durum rozeti renk tonu (components/origin/comp-421) */
export const PROJECT_STATUS_TONES: Record<ProjectStatus, "live" | "active" | "soon"> = {
  live: "live",
  development: "active",
  soon: "soon",
  none: "soon",
};

export type Platform = "ios" | "android" | "web";

export const PLATFORMS: readonly Platform[] = ["ios", "android", "web"] as const;

export const PLATFORM_LABELS: Record<Platform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
};

/** Galeri sekmesindeki ekranların cihaz çerçevesi */
export type DeviceType = "mobile" | "web";

export interface GalleryTab {
  /** Sekme kimliği (crypto.randomUUID) */
  id: string;
  /** Sekme etiketi — örn. "Müşteri Tarafı", "Yönetim Paneli" */
  label: string;
  /** mobile → telefon çerçevesi, web → tarayıcı çerçevesi */
  device: DeviceType;
  images: GalleryImage[];
}

export interface ProjectLinks {
  appStore: string;
  playStore: string;
  web: string;
}

export interface SeoFields {
  /** Boşsa varsayılan başlık üretilir (50–60 karakter önerilir) */
  title: string;
  /** Boşsa varsayılan açıklama kullanılır (140–160 karakter önerilir) */
  description: string;
}

export interface Project {
  id: string;
  /** URL: /projeler/[slug] */
  slug: string;
  title: string;
  /** Kart ve detay alt başlığı */
  subtitle: string;
  /** Kategori etiketi — örn. "Spor & Rezervasyon" */
  category: string;
  status: ProjectStatus;
  /** Detay sayfası paragrafları */
  description: string[];
  /** Öne çıkanlar kutusunun başlığı (boşsa "Öne çıkanlar") */
  highlightsTitle: string;
  highlights: string[];
  /** Vaka bölümleri — görünür ara başlıklı metinler (İhtiyaç, Ne yapıldı, Bugün …).
   *  Yalnızca doğrulanmış bilgiyle doldurulur; boş bölüm sitede görünmez. Gövdede boş satır yeni paragraf açar. */
  sections?: CardItem[];
  /** Bilgi notu — örn. "Planlar ve ayrıntılar bukira.com.tr adresinde." */
  note: string;
  /** Künye satırları — örn. Sektör: Tenis · Spor */
  meta: LabelValue[];
  /** Teknoloji etiketleri — örn. React Native, Django */
  tech: string[];
  /** İlgili hizmetler (services.slug) — proje sayfasından /hizmetler#slug iç bağlantıları.
   *  Yalnızca projede gerçekten verilen hizmetler işaretlenir. */
  services?: string[];
  /** Filtre ve schema için platformlar */
  platforms: Platform[];
  /** "Yapay Zeka" filtresinde görünsün mü */
  isAI: boolean;
  links: ProjectLinks;
  /** Kapak (OG görseli + schema). Boşsa galerinin ilk görseli kullanılır */
  coverImage: CloudinaryImage | null;
  /** Sekmeli ekran görüntüsü galerisi */
  gallery: GalleryTab[];
  /** Opsiyonel metrikler — yalnız doğrulanmış değerler girilmelidir */
  metrics: LabelValue[];
  seo: SeoFields;
  /** Ana sayfa yatay şeridinde göster */
  isFeatured: boolean;
  /** Yayında değilse sitede görünmez (taslak) */
  isPublished: boolean;
  order: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * SERVICES — 5 hizmet
 * Besler: ana sayfa bento, /hizmetler yapışkan kartlar
 * ================================================================ */

export type ServiceIcon =
  | "smartphone"
  | "globe"
  | "blocks"
  | "shopping-bag"
  | "brain-circuit"
  | "code"
  | "database"
  | "cloud"
  | "shield"
  | "server"
  | "search-check"
  | "wrench"
  | "sparkles";

export const SERVICE_ICONS: readonly ServiceIcon[] = [
  "smartphone",
  "globe",
  "blocks",
  "shopping-bag",
  "brain-circuit",
  "code",
  "database",
  "cloud",
  "shield",
  "server",
  "search-check",
  "wrench",
  "sparkles",
] as const;

export const SERVICE_ICON_LABELS: Record<ServiceIcon, string> = {
  smartphone: "Telefon (mobil)",
  globe: "Küre (web)",
  blocks: "Bloklar (özel yazılım)",
  "shopping-bag": "Alışveriş çantası (e-ticaret)",
  "brain-circuit": "Beyin devresi (yapay zeka)",
  code: "Kod",
  database: "Veritabanı",
  cloud: "Bulut",
  shield: "Kalkan",
  server: "Sunucu (hosting)",
  "search-check": "Arama (SEO)",
  wrench: "Anahtar (bakım ve destek)",
  sparkles: "Parıltı",
};

/** Ana sayfa bento kutusundaki görsel */
export type ServiceArt = "none" | "phones" | "browser" | "signal";

export const SERVICE_ARTS: readonly ServiceArt[] = ["none", "phones", "browser", "signal"] as const;

export const SERVICE_ART_LABELS: Record<ServiceArt, string> = {
  none: "Görsel yok",
  phones: "Telefon ekranları (1–2 görsel)",
  browser: "Tarayıcı ekranı (1 görsel)",
  signal: "Sinyal çizgisi animasyonu (görsel gerekmez)",
};

export interface Service {
  id: string;
  title: string;
  /** Sayfa içi çapa: /hizmetler#[slug] */
  slug: string;
  icon: ServiceIcon;
  /** Kısa açıklama (kartlar) */
  summary: string;
  /** Soru başlığı — /hizmetler kartının sağ sütununda, okurun kendi cümlesiyle */
  question?: string;
  /** "Kime uygun" — /hizmetler kartı + Service schema audience */
  audience?: string;
  /** "Ne teslim ediyoruz" maddeleri — /hizmetler kartı */
  deliverables?: string[];
  /** "Süreç" açıklaması (/hizmetler) */
  detail: string;
  /** "Nasıl başlanır" — /hizmetler kartı */
  start?: string;
  /** Marka-atıflı beyan cümlesi (üçüncü şahıs, 9–16 kelime) — yalnızca Service schema'sında (GEO); kartta görünmez */
  claim?: string;
  /** Hizmet türleri / kapsam — /hizmetler kartında "Kapsam", schema'da serviceType */
  serviceTypes?: string[];
  bentoSize: "large" | "small";
  bentoArt: ServiceArt;
  /** Bento görselleri (phones: 1–2, browser: 1) */
  images: CloudinaryImage[];
  /** Ana sayfa bento sırası */
  homeOrder: number;
  /** /hizmetler sırası (001, 002 … numarası buradan türer) */
  order: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * REFERENCES — referanslar / müşteriler (YENİ)
 * Besler: ana sayfa + hakkımızda logo bölümü
 * ================================================================ */

export interface Reference {
  id: string;
  name: string;
  /** Logo — SVG/PNG/WebP önerilir (şeffaf zemin) */
  logo: CloudinaryImage | null;
  /** original (varsayılan) → kendi renkleri, açık plaka üzerinde; mono → koyu zeminde beyaz tek renk (açık renkli logolar) */
  logoMode: "mono" | "original";
  /** Opsiyonel web sitesi */
  url: string;
  /** Opsiyonel kısa açıklama (hover / kart altı) */
  description: string;
  isActive: boolean;
  order: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * FAQ — sıkça sorulan sorular (FAQPage schema + /hizmetler akordeon)
 * ================================================================ */

export interface FaqItem {
  id: string;
  question: string;
  /** 40–60 kelime, marka-atıflı, tek başına anlamlı cevap (GEO) */
  answer: string;
  isActive: boolean;
  order: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * HERO — ana sayfa giriş bölümü (tekil doküman: hero/main)
 * ================================================================ */

export interface CtaLink {
  label: string;
  href: string;
}

export interface HeroContent {
  id: string;
  /** Durum rozeti — örn. "Aktif / Yayında" */
  badge: string;
  /** Rozet yanındaki not — örn. "Baseline · Bukira · GymBot" */
  badgeNote: string;
  /** H1 — *kelime* vurgu konvansiyonu */
  title: string;
  lead: string;
  primaryCta: CtaLink;
  secondaryCta: CtaLink;
  /** Alt bilgi satırı — örn. Konum: Türkiye */
  meta: LabelValue[];
  /** Telefon yelpazesi: tam 3 ekran (sol, orta, sağ) */
  phones: CloudinaryImage[];
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * TEAM MEMBERS — ekip (opsiyonel; kayıt yoksa bölüm gizlenir)
 * ================================================================ */

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: CloudinaryImage | null;
  bio: string[];
  linkedin: string;
  isActive: boolean;
  order: number;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * PAGES — sayfa bazlı düzenlenebilir içerik (doc id = slug)
 * Alan şeması: lib/page-schemas.ts (her sayfanın hangi alanları olduğu)
 * ================================================================ */

export type PageSlug =
  | "anasayfa"
  | "hakkimizda"
  | "hizmetler"
  | "projeler"
  | "iletisim"
  | "aydinlatma-metni"
  | "gizlilik-politikasi"
  | "cerez-politikasi";

export interface CardItem {
  title: string;
  body: string;
}

export type PageFieldValue = string | string[] | CardItem[];

export interface Page {
  id: string;
  slug: PageSlug;
  fields: Record<string, PageFieldValue>;
  seo: SeoFields;
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * SITE SETTINGS — tekil ayar dokümanı (siteSettings/main)
 * ================================================================ */

export interface SocialLink {
  /** instagram, linkedin, x, youtube, github … */
  platform: string;
  url: string;
}

export type StatSource = "manual" | "liveApps" | "projects" | "services";

export const STAT_SOURCES: readonly StatSource[] = ["manual", "liveApps", "projects", "services"] as const;

export const STAT_SOURCE_LABELS: Record<StatSource, string> = {
  manual: "Elle girilen değer",
  liveApps: "Otomatik: mağazada yayındaki uygulama sayısı",
  projects: "Otomatik: yayındaki proje sayısı",
  services: "Otomatik: hizmet sayısı",
};

export interface StatItem {
  label: string;
  /** source=manual iken gösterilen değer */
  value: string;
  source: StatSource;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/** Panelde koordinat girilmemişse kullanılan değer (ilk kurulumdaki konum) */
export const DEFAULT_GEO: GeoPoint = { latitude: 38.6823, longitude: 29.4082 };

/** Doğrulanmış resmi profiller (2026-11) — panelde "Resmi profiller" alanı boş kaydedilmemişse kullanılır */
export const DEFAULT_OFFICIAL_PROFILES: readonly string[] = [
  "https://apps.apple.com/tr/developer/bai-teknoloji-sanayi-ve-ticaret-ltd-%C5%9Fti/id1893507166",
  "https://play.google.com/store/apps/dev?id=8007462759594152372",
  "https://bukira.com.tr",
  "https://www.linkedin.com/company/bai-teknoloji/",
  "https://www.instagram.com/baitechnology/",
  // Google İşletme Profili — share.google kısa bağlantısının vardığı kalıcı kgmid adresi
  "https://www.google.com/search?kgmid=/g/11zc_m6755",
] as const;

export interface SiteSettings {
  id: string;
  brand: {
    /** Resmî/ana marka adı — "BAI Technology" */
    name: string;
    /** Türkçe kullanım — "BAI Teknoloji" */
    localName: string;
    /** null → /img/bai-logo.png */
    logo: CloudinaryImage | null;
    /** Footer tanıtım cümlesi */
    tagline: string;
    /** Ticari unvan — footer'da ve Organization.legalName'de (boşsa gösterilmez) */
    legalName?: string;
    foundingYear: string;
  };
  contact: {
    email: string;
    /** Görünen biçim — "+90 506 356 1490" */
    phone: string;
    /** Çok satırlı adres (\n ile) */
    address: string;
    responseTime: string;
    /** Google Maps embed URL'i (boşsa harita gösterilmez) */
    mapEmbedUrl: string;
    /** Form bildirimlerinin gideceği adres (boşsa email) */
    notifyEmail: string;
    /** Konum koordinatları — schema geo + hasMap. Adres değişirse birlikte güncellenir. */
    geo?: GeoPoint;
  };
  socials: SocialLink[];
  stats: StatItem[];
  cta: {
    /** Final CTA başlığı */
    title: string;
    /** Birincil buton etiketi — "Ücretsiz Danışmanlık" */
    buttonLabel: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    /** Varlık tanımı (GEO omurgası) — Organization.description */
    organizationDescription: string;
    /** Marka varyantları — schema alternateName */
    alternateNames: string[];
    /**
     * Resmi profiller — yalnız schema Organization.sameAs (footer'da görünmez): mağaza geliştirici
     * sayfaları, ürün siteleri, LinkedIn, Google İşletme Profili … Alan hiç kaydedilmemişse
     * DEFAULT_OFFICIAL_PROFILES kullanılır.
     */
    officialProfiles?: string[];
    /** null → /og-image.png */
    ogImage: CloudinaryImage | null;
  };
  updatedAt: FirestoreTimestamp;
}

/* ================================================================
 * SUBMISSIONS — iletişim formu kayıtları (public create, şema kısıtlı)
 * ================================================================ */

export interface Submission {
  id: string;
  name: string;
  email: string;
  /** Opsiyonel — boşsa alan yazılmaz */
  phone?: string;
  subject: string;
  /** Opsiyonel proje türü (formdaki seçim) — boşsa alan yazılmaz */
  topic?: string;
  message: string;
  /** KVKK onayı — daima true */
  consent: boolean;
  isRead: boolean;
  createdAt: FirestoreTimestamp;
  /** Mail bildirimi zamanı — yalnız server yazar */
  notifiedAt?: FirestoreTimestamp;
}
