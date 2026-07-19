import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PageCta } from "@/components/page-cta"
import { ProjectGallery } from "@/components/project-gallery"
import { CaseCard } from "@/components/projects-section"
import {
  BreadcrumbStructuredData,
  ProjectStructuredData,
} from "@/components/structured-data"
import { getProject, getProjectDisplayIndex, projects } from "@/lib/projects"
import { pageMetadata } from "@/lib/seo"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Metadata {
  const project = getProject(params.slug)
  if (!project) return {}
  return pageMetadata({
    title: project.title,
    // subtitle görsel alt başlık (kısa); SEO için varsa daha dolu metaDescription.
    description: project.metaDescription ?? project.subtitle,
    path: `/projeler/${project.slug}`,
  })
}

export default function ProjeDetayPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = getProject(params.slug)
  if (!project) notFound()

  return (
    <>
      <ProjectStructuredData slug={project.slug} />
      <BreadcrumbStructuredData
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Projeler", path: "/projeler" },
          { name: project.title, path: `/projeler/${project.slug}` },
        ]}
      />
      <section className="relative py-24 md:py-32">
        <div className="wrap">
          {/* Yasal sayfalardaki geri dönüş kalıbının aynısı (denetim U3) */}
          <Link
            href="/projeler"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-mono text-ink-3 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Projelere dön
          </Link>

          <div className="mt-10 w-full max-w-[720px]">
            <CaseCard
              project={project}
              index={getProjectDisplayIndex(project.slug)}
              titleAs="h1"
              subtitleAs="p"
            />
          </div>

          {/* Ekran görüntüsü galerisi — gallery tanımlıysa (ChatEKG'de yok) */}
          {project.gallery && (
            <div className="reveal mt-16 md:mt-20">
              <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  — Ekran Görüntüleri
                </span>
                <span className="hidden h-px w-10 bg-rule sm:block" />
              </div>
              <ProjectGallery tabs={project.gallery.tabs} />
            </div>
          )}
        </div>
      </section>
      <PageCta />
    </>
  )
}
