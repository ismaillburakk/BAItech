import type { MetadataRoute } from "next"
import { BASE_URL, projects } from "@/lib/projects"

// Statik tarih: her crawl'da "az önce değişti" sinyali vermemek için içerik
// güncellendiğinde elle ilerletilir.
const LAST_MODIFIED = new Date("2026-07-18")

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/hizmetler`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projeler`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/hakkimizda`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/iletisim`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE_URL}/projeler/${p.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const legalPages: MetadataRoute.Sitemap = [
    "/aydinlatma-metni",
    "/gizlilik-politikasi",
    "/cerez-politikasi",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "yearly",
    priority: 0.3,
  }))

  return [...staticPages, ...projectPages, ...legalPages]
}
