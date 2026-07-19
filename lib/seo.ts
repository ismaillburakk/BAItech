import type { Metadata } from "next"

const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "BAI Technology — Yapay Zeka ve Özel Yazılım Çözümleri",
}

/**
 * Sayfa başına metadata: title (root'taki "%s | BAI Technology" şablonuna girer),
 * description, canonical, OG ve Twitter kartı. Görsel/locale alanları root layout
 * ile aynıdır; twitter bloğu og ile aynı değerleri taşır (aksi halde alt sayfalar
 * kök başlıkla paylaşılıyordu).
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const fullTitle = `${title} | BAI Technology`
  return {
    title,
    description,
    alternates: { canonical: path, languages: { "tr-TR": path } },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: "BAI Technology",
      locale: "tr_TR",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  }
}
