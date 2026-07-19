import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageCta } from "@/components/page-cta"
import { SectionHeading } from "@/components/section-heading"
import { BreadcrumbStructuredData } from "@/components/structured-data"
import { getLocation, locations } from "@/lib/locations"
import { getProject } from "@/lib/projects"
import { pageMetadata } from "@/lib/seo"

// Kök seviyesinde tek dinamik route: yalnızca tanımlı lokasyon slug'larını
// üretir (dynamicParams=false → bilinmeyen slug 404). Statik segmentler
// (/hizmetler, /projeler, /iletisim, yasal sayfalar) bundan önce eşleşir.
export const dynamicParams = false

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const loc = getLocation(params.slug)
  if (!loc) return {}
  return pageMetadata({
    title: loc.metaTitle,
    description: loc.metaDescription,
    path: `/${loc.slug}`,
  })
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const loc = getLocation(params.slug)
  if (!loc) notFound()

  const sectionNo = loc.slug.startsWith("usak") ? "Uşak / TR" : "Ege / TR"

  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
          { name: loc.metaTitle, path: `/${loc.slug}` },
        ]}
      />

      <section className="relative pt-24 md:pt-32">
        <div className="wrap">
          <SectionHeading
            eyebrow={loc.eyebrow}
            sectionNo={sectionNo}
            title={loc.h1}
            description={loc.lead}
            headingAs="h1"
          />

          <div className="max-w-3xl">
            {/* Giriş */}
            <div className="reveal space-y-5 text-[17px] leading-relaxed text-ink-2 md:text-[18px]">
              {loc.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* İçerik bölümleri — hairline ayraçlı */}
            {loc.sections.map((s) => (
              <div key={s.heading} className="reveal mt-12 border-t border-rule pt-10">
                <h2 className="font-serif text-[clamp(24px,3vw,32px)] leading-tight text-ink">
                  {s.heading}
                </h2>
                <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-2">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* İlgili çalışmalar — proje detaylarına iç link */}
            {loc.relatedProjects.length > 0 && (
              <div className="reveal mt-12 border-t border-rule pt-10">
                <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  — İlgili çalışmalar
                </span>
                <ul className="mt-5 divide-y divide-rule border-y border-rule">
                  {loc.relatedProjects.map((rp) => {
                    const project = getProject(rp.slug)
                    if (!project) return null
                    return (
                      <li key={rp.slug}>
                        <Link
                          href={`/projeler/${rp.slug}`}
                          className="group flex items-center justify-between gap-6 py-4"
                        >
                          <span className="text-[16px] leading-snug text-ink-2 transition-colors group-hover:text-ink">
                            {rp.anchor}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-ink-3 transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
                  Tüm{" "}
                  <Link href="/hizmetler" className="underline underline-offset-2 hover:text-ink">
                    yazılım ve yapay zeka hizmetlerimizi
                  </Link>{" "}
                  inceleyebilir veya{" "}
                  <Link href="/projeler" className="underline underline-offset-2 hover:text-ink">
                    tüm projelerimize
                  </Link>{" "}
                  göz atabilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <PageCta />
    </>
  )
}
