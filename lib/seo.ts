/**
 * SEO + GEO çekirdeği — metadata kurucusu ve schema.org JSON-LD kurucuları.
 *
 * İlkeler:
 * - Her sayfa tekil title (50–60), description (140–160), canonical, OG,
 *   Twitter kartı ve hreflang tr-TR taşır. Metinler panelden (pages.seo,
 *   projects.seo, siteSettings.seo) gelir; burada yalnız yapı kurulur.
 * - Organization + LocalBusiness + ProfessionalService TEK düğümdür (aynı
 *   @id) — tek NAP kaydı. Tüm diğer şemalar bu @id'ye bağlanır.
 * - Uşak dengesi: şehir adı görünür metinde öne çıkarılmaz; lokal sinyal
 *   schema'da (address, geo, areaServed) taşınır.
 * - Uydurma veri YOK: aggregateRating, review, fiyat iddiası eklenmez.
 */
import type { Metadata } from "next";
import { cldUrl } from "@/lib/cloudinary";
import { stripEm } from "@/lib/utils";
import { DEFAULT_GEO, type CloudinaryImage, type FaqItem, type GeoPoint, type Project, type Reference, type Service, type SiteSettings } from "@/types";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://baitech.com.tr").replace(/\/$/, "");

export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const FALLBACK_NAME = "BAI Technology";
const FALLBACK_OG = "/og-image.png";

/**
 * Konum koordinatları — Site Ayarları › İletişim'den (contact.geo) okunur; adresle birlikte
 * panelden güncellenir. Alan boş ya da geçersizse ilk kurulumdaki değer kullanılır.
 */
export function geoOf(settings: SiteSettings | null): GeoPoint {
  const g = settings?.contact?.geo;
  const ok = g && Number.isFinite(g.latitude) && Number.isFinite(g.longitude) && Math.abs(g.latitude) <= 90 && Math.abs(g.longitude) <= 180;
  return ok ? { latitude: g.latitude, longitude: g.longitude } : DEFAULT_GEO;
}

/** Hizmet bölgesi — lokal + bölgesel + ülke */
export const AREA_SERVED = [
  { "@type": "City", name: "Uşak", sameAs: "https://www.wikidata.org/wiki/Q189134" },
  { "@type": "City", name: "İzmir", sameAs: "https://www.wikidata.org/wiki/Q35997" },
  { "@type": "City", name: "Denizli", sameAs: "https://www.wikidata.org/wiki/Q170967" },
  { "@type": "City", name: "Manisa", sameAs: "https://www.wikidata.org/wiki/Q147089" },
  { "@type": "City", name: "Afyonkarahisar", sameAs: "https://www.wikidata.org/wiki/Q166824" },
  { "@type": "Country", name: "Türkiye", sameAs: "https://www.wikidata.org/wiki/Q43" },
];

/** Uzmanlık alanları — Wikidata varlıklarına bağlı (Q-ID'ler doğrulandı) */
const KNOWS_ABOUT = [
  { "@type": "Thing", name: "Yapay zeka", sameAs: "https://www.wikidata.org/wiki/Q11660" },
  { "@type": "Thing", name: "Makine öğrenmesi", sameAs: "https://www.wikidata.org/wiki/Q2539" },
  { "@type": "Thing", name: "Derin öğrenme", sameAs: "https://www.wikidata.org/wiki/Q197536" },
  { "@type": "Thing", name: "Bilgisayarlı görü", sameAs: "https://www.wikidata.org/wiki/Q844240" },
  { "@type": "Thing", name: "Görüntü işleme", sameAs: "https://www.wikidata.org/wiki/Q1070689" },
  { "@type": "Thing", name: "Doğal dil işleme", sameAs: "https://www.wikidata.org/wiki/Q30642" },
  { "@type": "Thing", name: "Açıklanabilir yapay zeka", sameAs: "https://www.wikidata.org/wiki/Q40890078" },
  { "@type": "Thing", name: "Mobil uygulama", sameAs: "https://www.wikidata.org/wiki/Q620615" },
  { "@type": "Thing", name: "Web geliştirme", sameAs: "https://www.wikidata.org/wiki/Q386275" },
  { "@type": "Thing", name: "Yazılım geliştirme", sameAs: "https://www.wikidata.org/wiki/Q638608" },
  { "@type": "Thing", name: "E-ticaret", sameAs: "https://www.wikidata.org/wiki/Q484847" },
];

/**
 * Kuruluş yeri. BAI Technology 2025'te Zafer Teknopark bünyesinde KURULDU, bugün orada
 * faaliyet göstermiyor. Bu yüzden güncel üyelik anlamına gelen `memberOf` kullanılmaz;
 * yalnızca tarihsel bir olgu olan `foundingLocation` (Place) ile ifade edilir.
 */
const FOUNDING_LOCATION = {
  "@type": "Place",
  name: "Zafer Teknopark",
  address: { "@type": "PostalAddress", addressLocality: "Uşak", addressCountry: "TR" },
};

/* ================================================================
 * Yardımcılar
 * ================================================================ */

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

/** Cloudinary görselinden 1200×630 OG görseli; yoksa statik /og-image.png */
export function ogImageUrl(image?: CloudinaryImage | null): string {
  return image?.public_id ? cldUrl(image.public_id, "f_jpg,q_auto,c_fill,g_auto,w_1200,h_630") : absoluteUrl(FALLBACK_OG);
}

function imageUrl(image: CloudinaryImage, width = 1200): string {
  return cldUrl(image.public_id, `f_auto,q_auto,w_${width},c_limit`);
}

/** "+90 506 356 1490" → "+90-506-356-1490" (schema için E.164 benzeri) */
function schemaPhone(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  const m = digits.match(/^\+90(\d{3})(\d{3})(\d{4})$/);
  return m ? `+90-${m[1]}-${m[2]}-${m[3]}` : phone;
}

function brandName(settings: SiteSettings | null): string {
  return settings?.brand.name || FALLBACK_NAME;
}

/* ================================================================
 * Metadata kurucusu
 * ================================================================ */

interface MetaInput {
  title: string;
  description: string;
  path: string;
  settings: SiteSettings | null;
  image?: CloudinaryImage | null;
  type?: "website" | "article";
  noindex?: boolean;
}

export function buildMetadata({ title, description, path, settings, image, type = "website", noindex }: MetaInput): Metadata {
  const fullTitle = stripEm(title || settings?.seo.defaultTitle || FALLBACK_NAME);
  const desc = description || settings?.seo.defaultDescription || "";
  const og = ogImageUrl(image ?? settings?.seo.ogImage ?? null);
  const url = absoluteUrl(path);
  return {
    title: { absolute: fullTitle },
    description: desc,
    alternates: {
      canonical: url,
      languages: { "tr-TR": url, "x-default": url },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: brandName(settings),
      locale: "tr_TR",
      type,
      images: [{ url: og, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [og],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ================================================================
 * JSON-LD kurucuları
 * ================================================================ */

function postalAddress(settings: SiteSettings | null) {
  const lines = (settings?.contact.address ?? "").split("\n").map((l) => l.trim()).filter(Boolean);
  // Adres satırlarından posta bilgisi: ilk satır cadde, ikinci satırdaki kapı no birleşir
  const street = lines
    .join(" ")
    .replace(/\s*(Merkez\s+)?Uşak,?\s*Türkiye\s*$/i, "")
    .trim();
  return {
    "@type": "PostalAddress",
    ...(street ? { streetAddress: street } : {}),
    addressLocality: "Uşak",
    addressRegion: "Uşak",
    postalCode: "64100",
    addressCountry: "TR",
  };
}

function sameAs(settings: SiteSettings | null, projects: Project[]): string[] {
  const urls = [
    ...(settings?.socials ?? []).map((s) => s.url),
    ...projects.flatMap((p) => [p.links?.appStore, p.links?.playStore]),
  ].filter((u): u is string => typeof u === "string" && u.startsWith("http"));
  return [...new Set(urls)];
}

/**
 * Organization + LocalBusiness + ProfessionalService — tek düğüm, tek @id.
 * Site genelinde her sayfada basılır (layout).
 */
export function organizationJsonLd(settings: SiteSettings | null, projects: Project[], services: Service[]) {
  const name = brandName(settings);
  const logo = settings?.brand.logo
    ? { "@type": "ImageObject", url: imageUrl(settings.brand.logo, 512), width: 512, height: 512 }
    : { "@type": "ImageObject", url: absoluteUrl("/bai-logo-512.png"), width: 512, height: 512 };
  const phone = settings?.contact.phone ? schemaPhone(settings.contact.phone) : undefined;
  const email = settings?.contact.email || undefined;
  const geo = geoOf(settings);
  const legalName = settings?.brand.legalName?.trim();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ORG_ID,
    name,
    ...(legalName ? { legalName } : {}),
    alternateName: settings?.seo.alternateNames?.filter(Boolean) ?? [],
    url: SITE_URL,
    logo,
    image: logo.url,
    description: settings?.seo.organizationDescription || settings?.seo.defaultDescription,
    slogan: "Yazılım ve yapay zeka",
    foundingDate: settings?.brand.foundingYear || "2025",
    foundingLocation: FOUNDING_LOCATION,
    address: postalAddress(settings),
    geo: { "@type": "GeoCoordinates", ...geo },
    hasMap: `https://www.google.com/maps?q=${geo.latitude},${geo.longitude}`,
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    priceRange: "₺₺",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: AREA_SERVED,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        ...(phone ? { telephone: phone } : {}),
        ...(email ? { email } : {}),
        areaServed: "TR",
        availableLanguage: ["Turkish", "English"],
      },
    ],
    knowsAbout: KNOWS_ABOUT,
    sameAs: sameAs(settings, projects),
    ...(services.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Yazılım ve yapay zeka hizmetleri",
            itemListElement: services.map((s) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                "@id": `${SITE_URL}/hizmetler#${s.slug}`,
                name: s.title,
                serviceType: serviceTypes(s),
              },
            })),
          },
        }
      : {}),
    ...(projects.length
      ? {
          owns: projects
            .filter((p) => p.links?.appStore || p.links?.playStore || p.links?.web)
            .map((p) => ({ "@id": `${absoluteUrl(`/projeler/${p.slug}`)}#software` })),
        }
      : {}),
  };
}

export function websiteJsonLd(settings: SiteSettings | null) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: brandName(settings),
    alternateName: [settings?.brand.localName, "BAI", "baitech"].filter(Boolean),
    description: settings?.seo.defaultDescription,
    inLanguage: "tr-TR",
    publisher: { "@id": ORG_ID },
  };
}

/** Sayfa düğümü — WebPage / AboutPage / ContactPage / CollectionPage / FAQPage */
export function webPageJsonLd(input: {
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  path: string;
  name: string;
  description: string;
  breadcrumb?: { name: string; path: string }[];
  /** Sayfada adı geçen kuruluşlar (referanslar) — ilişki iddiası değil, yalnız söz */
  mentions?: Record<string, unknown>[];
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: stripEm(input.name),
    description: input.description,
    inLanguage: "tr-TR",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(input.breadcrumb ? { breadcrumb: breadcrumbJsonLd(input.breadcrumb) } : {}),
    ...(input.mentions?.length ? { mentions: input.mentions } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: stripEm(item.name),
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: FaqItem[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    inLanguage: "tr-TR",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** serviceType: panelde girilen kapsam (arama niyeti), yoksa hizmet adı */
function serviceTypes(s: Service): string | string[] {
  const list = (s.serviceTypes ?? []).map((t) => t.trim()).filter(Boolean);
  return list.length ? [s.title, ...list.filter((t) => t !== s.title)] : s.title;
}

export function servicesJsonLd(services: Service[]) {
  return services.map((s) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/hizmetler#${s.slug}`,
    name: s.title,
    serviceType: serviceTypes(s),
    // Beyan cümlesi yalnızca burada yaşar (kartta görünmez); açıklama görünür kart metniyle aynıdır
    ...(s.claim ? { disambiguatingDescription: s.claim } : {}),
    description: [s.summary, s.detail].filter(Boolean).join(" "),
    ...(s.audience?.trim() ? { audience: { "@type": "Audience", audienceType: s.audience.trim() } } : {}),
    url: `${SITE_URL}/hizmetler#${s.slug}`,
    provider: { "@id": ORG_ID },
    areaServed: AREA_SERVED,
    availableChannel: { "@type": "ServiceChannel", serviceUrl: `${SITE_URL}/iletisim` },
  }));
}

/** Proje listesi → ItemList (ana sayfa, /projeler) */
export function projectsItemListJsonLd(projects: Project[], name: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/projeler/${p.slug}`),
      name: p.title,
    })),
  };
}

const PLATFORM_OS: Record<string, string> = { ios: "iOS", android: "Android", web: "Web" };

function applicationCategory(p: Project): string {
  if (p.isAI) return "HealthApplication";
  const c = p.category.toLowerCase();
  if (c.includes("e-ticaret")) return "ShoppingApplication";
  if (c.includes("spor")) return "SportsApplication";
  return "BusinessApplication";
}

function projectImages(p: Project): CloudinaryImage[] {
  const all = [...(p.coverImage ? [p.coverImage] : []), ...p.gallery.flatMap((t) => t.images)];
  return all.slice(0, 6);
}

/**
 * Proje detayı → SoftwareApplication (MobileApplication / WebApplication)
 * + CreativeWork. Fiyat/puan bilgisi UYDURULMAZ.
 */
export function projectJsonLd(p: Project) {
  const url = absoluteUrl(`/projeler/${p.slug}`);
  const mobile = p.platforms.includes("ios") || p.platforms.includes("android");
  const web = p.platforms.includes("web");
  const types = ["SoftwareApplication", ...(mobile ? ["MobileApplication"] : []), ...(web ? ["WebApplication"] : [])];
  const images = projectImages(p).map((im) => imageUrl(im, 1200));
  const description = p.seo?.description || p.subtitle;
  const sameAsLinks = [p.links?.appStore, p.links?.playStore, p.links?.web].filter((u): u is string => !!u);
  // Mağaza bağlantıları yalnızca yayındaki uygulamalarda; fiyat/teklif (offers) bilgisi eklenmez
  const storeLinks = p.status === "live" ? [p.links?.appStore, p.links?.playStore].filter((u): u is string => !!u) : [];
  // Özellik listesi = sayfadaki "Öne çıkanlar" (görünür metinle birebir); tek bir ürün olmayan sayfalarda (durum yok) eklenmez
  const features = p.status === "none" ? [] : (p.highlights ?? []).map((h) => h.trim()).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": types,
    "@id": `${url}#software`,
    name: p.title,
    alternateName: `${p.title} — ${p.subtitle}`,
    description,
    url,
    applicationCategory: p.category.toLowerCase().includes("yazılım") ? "BusinessApplication" : applicationCategory(p),
    operatingSystem: p.platforms.map((x) => PLATFORM_OS[x]).join(", ") || undefined,
    ...(features.length ? { featureList: features } : {}),
    ...(images.length ? { image: images[0], screenshot: images } : {}),
    ...(sameAsLinks.length ? { sameAs: sameAsLinks } : {}),
    ...(p.links?.appStore || p.links?.playStore ? { installUrl: p.links.appStore || p.links.playStore } : {}),
    ...(storeLinks.length ? { downloadUrl: storeLinks.length === 1 ? storeLinks[0] : storeLinks } : {}),
    keywords: [p.category, ...p.tech].join(", "),
    inLanguage: "tr-TR",
    creativeWorkStatus: p.status === "live" ? "Published" : p.status === "development" ? "Incomplete" : undefined,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    creator: { "@id": ORG_ID },
  };
}

/**
 * Referanslar → sayfanın `mentions` alanı. Yalnızca "bu sayfa bu kuruluşlardan söz ediyor"
 * olgusunu bildirir; müşteri ilişkisi, değerlendirme (review/rating) veya referans beyanı
 * (testimonial) İDDİA ETMEZ. Yalnızca referansların gerçekten listelendiği / adının geçtiği
 * sayfalarda kullanılır.
 */
export function referencesJsonLd(references: Reference[]) {
  return references.map((r) => ({
    "@type": "Organization",
    name: r.name,
    ...(r.url ? { url: r.url } : {}),
    ...(r.logo ? { logo: imageUrl(r.logo, 400) } : {}),
  }));
}

/** Görsel alt metni: panel girdisi yoksa doğal, marka-atıflı üretim */
export function projectImageAlt(p: Project, image: CloudinaryImage, index: number): string {
  return image.alt?.trim() || `${p.title} — BAI Technology tarafından geliştirilen ${p.category.toLowerCase()} uygulaması, ekran ${index + 1}`;
}
