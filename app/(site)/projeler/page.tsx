/** Projeler — bento ızgara + layout animasyonlu filtre. CollectionPage + ItemList şeması. */
import type { Metadata } from "next";

import { ProjectFilterGrid } from "@/components/project/project-filter-grid";
import { FinalCta } from "@/components/site/final-cta";
import JsonLd from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";
import { getPage, getProjects, getSiteSettings } from "@/lib/db/public";
import { pageText } from "@/lib/page-schemas";
import { buildMetadata, projectsItemListJsonLd, webPageJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("projeler")]);
  return buildMetadata({ title: page?.seo.title || "", description: page?.seo.description || "", path: "/projeler", settings });
}

export default async function ProjectsPage() {
  const [settings, page, projects] = await Promise.all([getSiteSettings(), getPage("projeler"), getProjects()]);
  const t = (key: string) => pageText(page, key);
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            type: "CollectionPage",
            path: "/projeler",
            name: t("headerTitle"),
            description: page?.seo.description || "",
            breadcrumb: [
              { name: "Ana Sayfa", path: "/" },
              { name: t("headerEyebrow") || "Projeler", path: "/projeler" },
            ],
          }),
          projectsItemListJsonLd(projects, t("headerTitle") || "Projeler"),
        ]}
      />
      <PageHeader eyebrow={t("headerEyebrow")} title={t("headerTitle")} description={t("headerDescription")} />
      <section className="container-site py-16 md:py-20">
        <ProjectFilterGrid projects={projects} />
      </section>
      <FinalCta settings={settings} />
    </>
  );
}
