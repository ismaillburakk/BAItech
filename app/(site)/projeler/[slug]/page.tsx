/**
 * Proje detayı — cihaz mockup'lı hero (2 katman parallax), açıklama + vaka
 * bölümleri + öne çıkanlar, sekmeli galeri, önceki/sonraki. generateStaticParams ile
 * tüm projeler build'de prerender edilir; yeni projeler ISR ile gelir.
 */
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, InfoIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SplitText } from "@/components/motion/fx";
import { enterClass, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import ProjectBreadcrumb from "@/components/origin/comp-446";
import StatusBadge from "@/components/origin/comp-421";
import { DetailHeroArt } from "@/components/project/detail-hero-art";
import { ProjectGallery } from "@/components/project/project-gallery";
import { StoreButtons } from "@/components/project/store-buttons";
import { FinalCta } from "@/components/site/final-cta";
import JsonLd from "@/components/site/json-ld";
import { SectionHeading } from "@/components/site/section-heading";
import { getProjectBySlug, getProjects, getReferences, getServices, getSiteSettings } from "@/lib/db/public";
import { statusLabel, statusTone } from "@/lib/project-ui";
import { ServiceIcon } from "@/lib/services-ui";
import { buildMetadata, projectJsonLd, referencesJsonLd, webPageJsonLd } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [settings, data] = await Promise.all([getSiteSettings(), getProjectBySlug(slug)]);
  if (!data) return {};
  const p = data.project;
  return buildMetadata({
    title: p.seo?.title || `${p.title}: ${p.subtitle} | BAI Technology`,
    description: p.seo?.description || p.subtitle,
    path: `/projeler/${p.slug}`,
    settings,
    image: p.coverImage ?? p.gallery?.[0]?.images?.[0] ?? null,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const [settings, data, services, references] = await Promise.all([getSiteSettings(), getProjectBySlug(slug), getServices(), getReferences()]);
  if (!data) notFound();
  const { project, previous, next, siblings } = data;

  const heroTab = project.gallery?.find((t) => t.images?.length);
  const heroImages = heroTab?.images.slice(0, 3);
  const meta = [...(project.meta ?? []), ...(project.tech?.length ? [{ label: "Teknoloji", value: project.tech.join(" · ") }] : [])];
  const label = statusLabel(project);
  const hasLinks = project.links?.appStore || project.links?.playStore || project.links?.web;
  // Panelde bu proje için işaretlenen hizmetler (hizmet sırasıyla) → /hizmetler#slug iç bağlantıları
  const relatedServices = services.filter((s) => project.services?.includes(s.slug));
  // Proje metninde adı geçen referanslar → yalnız `mentions` (ilişki/değerlendirme iddiası yok)
  const sections = (project.sections ?? []).filter((s) => s.title?.trim() && s.body?.trim());
  const projectText = [...project.description, ...(project.highlights ?? []), ...sections.flatMap((s) => [s.title, s.body])].join(" ");
  const mentioned = references.filter((r) => projectText.includes(r.name));

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: `/projeler/${project.slug}`,
            name: project.seo?.title || project.title,
            description: project.seo?.description || project.subtitle,
            breadcrumb: [
              { name: "Ana Sayfa", path: "/" },
              { name: "Projeler", path: "/projeler" },
              { name: project.title, path: `/projeler/${project.slug}` },
            ],
            mentions: referencesJsonLd(mentioned),
          }),
          projectJsonLd(project),
        ]}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border pt-[4.5rem]">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
        <div className="container-site pt-8 pb-16">
          <div className={enterClass}>
            <ProjectBreadcrumb current={project.title} siblings={siblings.map(({ slug, title }) => ({ slug, title }))} />
          </div>
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div className="min-w-0">
              <div className={`${enterClass} flex flex-wrap items-center gap-3 text-sm`}>
                <span className="rounded-full border border-border bg-card/60 px-3 py-1 text-muted-foreground">{project.category}</span>
                {label ? <StatusBadge tone={statusTone(project)}>{label}</StatusBadge> : null}
              </div>
              <SplitText
                text={project.title}
                className="mt-6 text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.95] tracking-[-0.04em] [overflow-wrap:anywhere]"
              />
              <p className={`${enterClass} measure mt-6 text-xl leading-relaxed text-muted-foreground delay-150`}>{project.subtitle}</p>
              <div className={`${enterClass} mt-8 delay-200`}>
                <StoreButtons project={project} size="lg" />
              </div>
              {meta.length ? (
                <dl className={`${enterClass} mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-border pt-6 delay-300 sm:grid-cols-3`}>
                  {meta.map((m) => (
                    <div key={m.label}>
                      <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{m.label}</dt>
                      <dd className="mt-1.5 text-sm font-medium leading-snug">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
            {heroImages?.length ? <DetailHeroArt images={heroImages} device={heroTab?.device} /> : null}
          </div>
        </div>
      </section>

      {/* Metrikler (opsiyonel — yalnız doğrulanmış değerler) */}
      {project.metrics?.length ? (
        <section aria-label="Metrikler" className="container-site pt-16">
          <Stagger as="dl" className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {project.metrics.map((m) => (
              <StaggerItem key={m.label} className="bg-background p-6 md:p-8">
                <dd className="font-heading text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-tight">{m.value}</dd>
                <dt className="mt-3 text-sm leading-snug text-muted-foreground">{m.label}</dt>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      {/* Açıklama + öne çıkanlar */}
      <section className="container-site grid gap-12 py-24 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="min-w-0 space-y-6">
          <SectionHeading index="01" eyebrow="Proje" />
          <h2 className="sr-only">{project.title} hakkında</h2>
          {project.description.map((para, i) => (
            <Reveal key={i} as="p" className="measure text-lg leading-relaxed">
              {para}
            </Reveal>
          ))}
          {/* Vaka bölümleri: görünür ara başlıklar (İhtiyaç · Ne yapıldı · Bugün …); boş bölüm basılmaz */}
          {sections.map((s) => (
            <Reveal key={s.title} as="section" className="pt-4">
              <h3 className="font-heading text-2xl font-semibold leading-snug">{s.title}</h3>
              {s.body
                .split(/\n{2,}/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="measure mt-3 text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
            </Reveal>
          ))}
          {project.note ? (
            <Reveal as="p" className="measure flex items-start gap-3 rounded-2xl border border-border bg-card p-5 text-[0.9375rem]">
              <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand-ink" aria-hidden="true" />
              {project.note}
            </Reveal>
          ) : null}
          {relatedServices.length ? (
            <Reveal as="nav" aria-labelledby="ilgili-hizmetler" className="pt-4">
              <h2 id="ilgili-hizmetler" className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                İlgili hizmetler
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {relatedServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/hizmetler#${s.slug}`}
                      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-sm font-medium transition-colors duration-(--dur-fast) hover:border-brand hover:text-brand-ink"
                    >
                      <ServiceIcon name={s.icon} className="size-4 text-brand-ink" aria-hidden="true" />
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
        {project.highlights?.length ? (
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border-strong bg-card p-7">
              <h2 className="font-heading text-xl font-semibold">{project.highlightsTitle || "Öne çıkanlar"}</h2>
              <Stagger as="ul" className="mt-5 space-y-4">
                {project.highlights.map((b) => (
                  <StaggerItem as="li" key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
                      <CheckIcon className="size-3.5" aria-hidden="true" />
                    </span>
                    {b}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        ) : null}
      </section>

      {/* Ekran görüntüleri */}
      {project.gallery?.some((t) => t.images?.length) ? (
        <section aria-labelledby="ekranlar" className="border-t border-border bg-card/40 py-24">
          <div className="container-site">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading index="02" eyebrow="Galeri" />
              <p className="text-sm text-muted-foreground">Büyütmek için görsele dokunun</p>
            </div>
            <h2 id="ekranlar" className="sr-only">
              {project.title} ekran görüntüleri
            </h2>
            <ProjectGallery gallery={project.gallery} title={project.title} />
            {hasLinks ? (
              <Reveal className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border-strong bg-band p-6 sm:p-8">
                <p className="font-heading text-2xl font-semibold">{project.title}</p>
                <StoreButtons project={project} />
              </Reveal>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Önceki / sonraki */}
      {siblings.length ? (
        <nav aria-label="Diğer projeler" className="border-t border-border">
          <div className="grid sm:grid-cols-2">
            {[
              { p: previous, label: "Önceki proje", Icon: ArrowLeftIcon, align: "" },
              { p: next, label: "Sonraki proje", Icon: ArrowRightIcon, align: "sm:items-end sm:text-right" },
            ].map(({ p, label: navLabel, Icon, align }, i) => (
              <Link
                key={navLabel}
                href={`/projeler/${p.slug}`}
                className={`group relative flex min-h-40 flex-col justify-center gap-2 overflow-hidden px-6 py-10 transition-colors duration-(--dur-base) hover:bg-card sm:px-8 md:px-16 ${align} ${i === 0 ? "border-b border-border sm:border-r sm:border-b-0" : ""}`}
              >
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  {i === 0 ? <Icon className="size-4 transition-transform duration-(--dur-fast) group-hover:-translate-x-1" aria-hidden="true" /> : null}
                  {navLabel}
                  {i === 1 ? <Icon className="size-4 transition-transform duration-(--dur-fast) group-hover:translate-x-1" aria-hidden="true" /> : null}
                </span>
                <span className="font-heading text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] transition-colors duration-(--dur-fast) group-hover:text-brand-ink md:text-4xl">
                  {p.title}
                </span>
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      <FinalCta settings={settings} />
    </>
  );
}
