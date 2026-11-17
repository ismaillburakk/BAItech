/**
 * Ana Sayfa — taslak v2 düzeni birebir (giriş › şerit › sayılar › çözüm ›
 * yolculuk › referanslar › neden › final CTA). Tüm içerik Firestore'dan.
 */
import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Hero } from "@/components/home/hero";
import { ProjectsRail } from "@/components/home/projects-rail";
import { ServicesBento } from "@/components/home/services-bento";
import { Stats } from "@/components/home/stats";
import { WhySteps } from "@/components/home/why-steps";
import { Reveal } from "@/components/motion/reveal";
import { FinalCta } from "@/components/site/final-cta";
import JsonLd from "@/components/site/json-ld";
import { ReferencesMarquee } from "@/components/site/references-marquee";
import { SectionHeading } from "@/components/site/section-heading";
import { Button } from "@/components/ui/button";
import { getHero, getPage, getProjects, getReferences, getServices, getSiteSettings } from "@/lib/db/public";
import { pageList, pageText } from "@/lib/page-schemas";
import { buildMetadata, projectsItemListJsonLd, referencesJsonLd, webPageJsonLd } from "@/lib/seo";
import { computeStats } from "@/lib/stats";

/** ISR: 5 dakikada bir tazelenir; panel değişiklikleri on-demand tetikler */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("anasayfa")]);
  return buildMetadata({
    title: page?.seo.title || settings?.seo.defaultTitle || "",
    description: page?.seo.description || settings?.seo.defaultDescription || "",
    path: "/",
    settings,
  });
}

function MiniCta({ href, children }: { href: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <Button asChild variant="outline" className="rounded-full">
      <Link href={href}>
        {children}
        <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
      </Link>
    </Button>
  );
}

export default async function HomePage() {
  const [settings, hero, page, projects, services, references] = await Promise.all([
    getSiteSettings(),
    getHero(),
    getPage("anasayfa"),
    getProjects(),
    getServices(),
    getReferences(),
  ]);
  const t = (key: string) => pageText(page, key);
  const stats = computeStats(settings, projects, services);
  const featured = projects.filter((p) => p.isFeatured);
  const bullets = pageList(page, "whyBullets");

  // Bölüm numaraları görünür bölümlere göre sırayla atanır
  let n = 0;
  const next = () => String(++n).padStart(2, "0");

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/",
            name: page?.seo.title || "BAI Technology",
            description: page?.seo.description || "",
            mentions: referencesJsonLd(references),
          }),
          projectsItemListJsonLd(featured, t("projectsTitle") || "Projeler"),
        ]}
      />

      {hero ? <Hero hero={hero} /> : null}

      {/* Hero'daki "Kaydırın" bağlantısının hedefi: hero'dan sonraki ilk bölüm */}
      <div id="kesfet" aria-hidden="true" />

      {stats.length ? (
        <section className="container-site py-24">
          <SectionHeading index={next()} eyebrow={t("statsEyebrow")} title={t("statsTitle")} />
          <div className="mt-12">
            <Stats items={stats} />
          </div>
        </section>
      ) : null}

      {services.length ? (
        <section className="container-site py-24">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              index={next()}
              eyebrow={t("servicesEyebrow")}
              title={t("servicesTitle")}
              description={t("servicesDescription")}
            />
            <Reveal>
              <MiniCta href="/hizmetler">{t("servicesCta")}</MiniCta>
            </Reveal>
          </div>
          <div className="mt-14">
            <ServicesBento services={services} />
          </div>
        </section>
      ) : null}

      {featured.length ? (
        <section className="border-y border-border bg-[linear-gradient(180deg,var(--background),var(--band)_140%)]">
          <ProjectsRail
            projects={featured}
            header={
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <SectionHeading index={next()} eyebrow={t("projectsEyebrow")} title={t("projectsTitle")} />
                <MiniCta href="/projeler">{t("projectsCta")}</MiniCta>
              </div>
            }
          />
        </section>
      ) : null}

      {references.length ? (
        <section aria-labelledby="referanslar" className="container-site py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              index={next()}
              eyebrow={t("referencesEyebrow")}
              title={<span id="referanslar">{t("referencesTitle")}</span>}
              description={t("referencesDescription")}
            />
          </div>
          <div className="mt-12">
            <ReferencesMarquee references={references} label={t("referencesTitle") || "Referanslarımız"} />
          </div>
        </section>
      ) : null}

      {bullets.length ? (
        <section className="container-site py-28">
          <WhySteps
            items={bullets}
            heading={
              <>
                <SectionHeading
                  index={next()}
                  eyebrow={t("whyEyebrow")}
                  title={t("whyTitle")}
                  description={t("whyDescription")}
                />
                <Reveal className="mt-8">
                  <MiniCta href="/hakkimizda">{t("whyCta")}</MiniCta>
                </Reveal>
              </>
            }
          />
        </section>
      ) : null}

      <FinalCta settings={settings} />
    </>
  );
}
