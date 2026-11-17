import type { MetadataRoute } from "next";
import {
  getFaq,
  getHero,
  getPage,
  getProjects,
  getReferences,
  getServices,
  getSiteSettings,
  getTeamMembers,
} from "@/lib/db/public";
import { SITE_URL } from "@/lib/seo";
import type { CloudinaryImage, FirestoreTimestamp, PageSlug } from "@/types";

/** Sitemap ISR: saatte bir; panel değişikliklerinde on-demand da tazelenir */
export const revalidate = 3600;
export const runtime = "nodejs";

type Stamped = { updatedAt?: FirestoreTimestamp | { seconds: number } | null } | null | undefined;

/**
 * lastModified = sayfayı besleyen içeriklerin en yeni `updatedAt` değeri.
 * Böylece her rota yalnızca kendi içeriği gerçekten değiştiğinde güncellenmiş görünür.
 */
function latest(...groups: (Stamped | Stamped[])[]): Date | undefined {
  const seconds = groups
    .flat()
    .map((d) => (d?.updatedAt as { seconds?: number } | undefined)?.seconds ?? 0)
    .reduce((max, s) => Math.max(max, s), 0);
  return seconds ? new Date(seconds * 1000) : undefined;
}

/** Görsel sitemap: Cloudinary adresleri, tekrarsız, Google sınırı içinde */
function imageUrls(images: (CloudinaryImage | null | undefined)[]): string[] | undefined {
  const urls = [...new Set(images.map((im) => im?.url).filter((u): u is string => !!u))].slice(0, 1000);
  return urls.length ? urls : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, services, references, faq, hero, settings, team] = await Promise.all([
    getProjects(),
    getServices(),
    getReferences(),
    getFaq(),
    getHero(),
    getSiteSettings(),
    getTeamMembers(),
  ]);
  const slugs: PageSlug[] = ["anasayfa", "hizmetler", "projeler", "hakkimizda", "iletisim", "aydinlatma-metni", "gizlilik-politikasi", "cerez-politikasi"];
  const pages = Object.fromEntries(await Promise.all(slugs.map(async (s) => [s, await getPage(s)] as const)));
  const featured = projects.filter((p) => p.isFeatured);

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: latest(pages.anasayfa, hero, services, featured, references, settings),
      changeFrequency: "weekly",
      priority: 1,
      images: imageUrls([
        ...(hero?.phones ?? []),
        ...services.flatMap((s) => s.images ?? []),
        ...featured.map((p) => p.coverImage),
        ...references.map((r) => r.logo),
      ]),
    },
    {
      url: `${SITE_URL}/hizmetler`,
      lastModified: latest(pages.hizmetler, services, faq),
      changeFrequency: "monthly",
      priority: 0.9,
      images: imageUrls(services.flatMap((s) => s.images ?? [])),
    },
    {
      url: `${SITE_URL}/projeler`,
      lastModified: latest(pages.projeler, projects),
      changeFrequency: "weekly",
      priority: 0.9,
      images: imageUrls(projects.map((p) => p.coverImage)),
    },
    {
      url: `${SITE_URL}/hakkimizda`,
      lastModified: latest(pages.hakkimizda, team),
      changeFrequency: "monthly",
      priority: 0.8,
      images: imageUrls(team.map((m) => m.photo)),
    },
    { url: `${SITE_URL}/iletisim`, lastModified: latest(pages.iletisim, settings), changeFrequency: "yearly", priority: 0.7 },
    { url: `${SITE_URL}/aydinlatma-metni`, lastModified: latest(pages["aydinlatma-metni"]), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/gizlilik-politikasi`, lastModified: latest(pages["gizlilik-politikasi"]), changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cerez-politikasi`, lastModified: latest(pages["cerez-politikasi"]), changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projeler/${p.slug}`,
    lastModified: latest(p),
    changeFrequency: "monthly",
    priority: 0.8,
    images: imageUrls([p.coverImage, ...(p.gallery ?? []).flatMap((t) => t.images)].slice(0, 10)),
  }));

  return [...routes, ...projectRoutes];
}
