import type { Metadata } from "next"
import { ProjectsSection } from "@/components/projects-section"
import {
  BreadcrumbStructuredData,
  ProjectsListStructuredData,
} from "@/components/structured-data"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Projeler ve Ürünler",
  description:
    "App Store ve Google Play'de yayında ürünler dahil BAI Technology projeleri: Baseline, GymBot, Dukan, Bukira, ChatEKG ve işletmeye özel yazılımlar.",
  path: "/projeler",
})

export default function ProjelerPage() {
  return (
    <>
      <ProjectsListStructuredData />
      <BreadcrumbStructuredData
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Projeler", path: "/projeler" },
        ]}
      />
      <ProjectsSection variant="grid" headingAs="h1" />
    </>
  )
}
