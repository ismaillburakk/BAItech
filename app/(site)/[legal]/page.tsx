/**
 * Yasal metinler — /aydinlatma-metni, /gizlilik-politikasi, /cerez-politikasi.
 * Tek dinamik segment; yalnız bu üç slug prerender edilir (dynamicParams=false).
 * Gövde panelden Markdown olarak yönetilir.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/site/json-ld";
import Markdown from "@/components/site/markdown";
import { PageHeader } from "@/components/site/page-header";
import { getPage, getSiteSettings } from "@/lib/db/public";
import { pageText } from "@/lib/page-schemas";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import type { PageSlug } from "@/types";

export const revalidate = 300;
export const dynamicParams = false;

const LEGAL_SLUGS = ["aydinlatma-metni", "gizlilik-politikasi", "cerez-politikasi"] as const;

export function generateStaticParams() {
  return LEGAL_SLUGS.map((legal) => ({ legal }));
}

type Params = { params: Promise<{ legal: string }> };

function isLegal(slug: string): slug is (typeof LEGAL_SLUGS)[number] {
  return (LEGAL_SLUGS as readonly string[]).includes(slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { legal } = await params;
  if (!isLegal(legal)) return {};
  const [settings, page] = await Promise.all([getSiteSettings(), getPage(legal as PageSlug)]);
  return buildMetadata({ title: page?.seo.title || "", description: page?.seo.description || "", path: `/${legal}`, settings });
}

export default async function LegalPage({ params }: Params) {
  const { legal } = await params;
  if (!isLegal(legal)) notFound();
  const page = await getPage(legal as PageSlug);
  if (!page) notFound();
  const t = (key: string) => pageText(page, key);
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          path: `/${legal}`,
          name: t("headerTitle"),
          description: page.seo.description,
          breadcrumb: [
            { name: "Ana Sayfa", path: "/" },
            { name: t("headerTitle"), path: `/${legal}` },
          ],
        })}
      />
      <PageHeader eyebrow={t("headerEyebrow")} title={t("headerTitle")} description={t("intro")} />
      <section className="container-site py-20">
        {t("updatedAt") ? (
          <p className="mb-2 text-sm text-muted-foreground">Son güncelleme: {t("updatedAt")}</p>
        ) : null}
        <Markdown source={t("body")} className="prose-legal" />
      </section>
    </>
  );
}
