/**
 * Hakkımızda — kurumsal kimlik (kaydırdıkça aydınlanan metin) + kuruluş paragrafı, çalışma ilkeleri,
 * Ar-Ge bölümleri (yapışkan başlık), model geliştirme süreci, opsiyonel ekip.
 * AboutPage şeması; kimlik metni GEO varlık tanımının görünür karşılığıdır.
 */
import type { Metadata } from "next";
import Image from "next/image";

import { ScrollProcess } from "@/components/about/process";
import { ScrollRevealText, TiltCard } from "@/components/motion/fx";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Eyebrow } from "@/components/site/eyebrow";
import { FinalCta } from "@/components/site/final-cta";
import JsonLd from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { getPage, getSiteSettings, getTeamMembers } from "@/lib/db/public";
import { pageCards, pageList, pageText } from "@/lib/page-schemas";
import { buildMetadata, ORG_ID, webPageJsonLd } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("hakkimizda")]);
  return buildMetadata({ title: page?.seo.title || "", description: page?.seo.description || "", path: "/hakkimizda", settings });
}

export default async function AboutPage() {
  const [settings, page, team] = await Promise.all([getSiteSettings(), getPage("hakkimizda"), getTeamMembers()]);
  const t = (key: string) => pageText(page, key);
  const sections = pageCards(page, "rdSections");
  const steps = pageList(page, "processSteps");
  const principles = pageCards(page, "principles").filter((v) => v.title && v.body);

  let n = 0;
  const next = () => pad2(++n);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            type: "AboutPage",
            path: "/hakkimizda",
            name: t("headerTitle"),
            description: page?.seo.description || "",
            breadcrumb: [
              { name: "Ana Sayfa", path: "/" },
              { name: t("headerEyebrow") || "Hakkımızda", path: "/hakkimizda" },
            ],
          }),
          ...team.map((m) => ({
            "@context": "https://schema.org",
            "@type": "Person",
            name: m.name,
            jobTitle: m.role,
            worksFor: { "@id": ORG_ID },
            ...(m.linkedin ? { sameAs: [m.linkedin] } : {}),
          })),
        ]}
      />
      <PageHeader eyebrow={t("headerEyebrow")} title={t("headerTitle")} description={t("headerDescription")} />

      {t("identityText") ? (
        <section aria-labelledby="kimlik" className="container-site py-28">
          <Reveal>
            <Eyebrow index={next()}>{t("identityEyebrow")}</Eyebrow>
          </Reveal>
          <h2 id="kimlik" className="sr-only">
            {t("identityEyebrow") || "Kurumsal Kimlik"}
          </h2>
          <ScrollRevealText
            text={t("identityText")}
            className="mt-10 max-w-5xl font-heading text-[clamp(1.6rem,3.4vw,2.75rem)] font-medium leading-[1.25] tracking-tight"
          />
          {t("foundingText") ? (
            <Reveal as="p" className="measure mt-10 text-lg leading-relaxed text-muted-foreground">
              {t("foundingText")}
            </Reveal>
          ) : null}
        </section>
      ) : null}

      {principles.length ? (
        <section className="container-site pb-28">
          {t("principlesEyebrow") || t("principlesTitle") ? (
            <SectionHeading index={next()} eyebrow={t("principlesEyebrow")} title={t("principlesTitle")} className="mb-12" />
          ) : null}
          <Stagger className={`grid gap-5 ${principles.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
            {principles.map((v, i) => (
              <StaggerItem key={v.title}>
                <TiltCard className="h-full rounded-2xl border border-border bg-card transition-colors duration-(--dur-fast) hover:border-border-strong">
                  <div className="relative z-10 p-8 md:p-10">
                    <span className="font-heading text-[5rem] font-bold leading-none text-transparent [-webkit-text-stroke:1px_var(--brand)]">
                      {pad2(i + 1)}
                    </span>
                    <h3 className="mt-6 font-heading text-3xl font-semibold">{v.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{v.body}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      {sections.length ? (
        <section className="border-y border-border bg-card/40 py-28">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading index={next()} eyebrow={t("rdEyebrow")} title={t("rdTitle")} />
            </div>
            <div className="divide-y divide-border">
              {sections.map((d, i) => (
                <Reveal key={d.title} as="article" className="py-10 first:pt-0">
                  <span className="tabular font-heading text-sm text-brand-ink">{pad2(i + 1)}</span>
                  <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug md:text-3xl">{d.title}</h3>
                  <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">{d.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {steps.length ? (
        <section className="container-site grid gap-12 py-28 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <SectionHeading index={next()} eyebrow={t("processEyebrow")} title={t("processTitle")} />
          <Reveal className="sm:pl-6">
            <ScrollProcess steps={steps} note={t("processNote")} />
          </Reveal>
        </section>
      ) : null}

      {team.length ? (
        <section className="border-t border-border py-28">
          <div className="container-site">
            <SectionHeading index={next()} eyebrow={t("teamEyebrow")} title={t("teamTitle")} />
            <Stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <StaggerItem as="li" key={m.id}>
                  <TiltCard max={4} className="h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-(--dur-fast) hover:border-border-strong">
                    {m.photo ? (
                      <div className="relative z-10 aspect-[4/5] border-b border-border bg-muted">
                        <Image src={m.photo.public_id} alt={m.photo.alt || `${m.name} — ${m.role}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                      </div>
                    ) : null}
                    <div className="relative z-10 p-6">
                      <h3 className="font-heading text-xl font-semibold">{m.name}</h3>
                      <p className="mt-1 text-sm text-brand-ink">{m.role}</p>
                      {m.bio?.map((b, i) => (
                        <p key={i} className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                          {b}
                        </p>
                      ))}
                      {m.linkedin ? (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm font-medium underline underline-offset-4 hover:text-brand-ink">
                          LinkedIn<span className="sr-only"> profili (yeni sekmede açılır)</span>
                        </a>
                      ) : null}
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}

      <FinalCta settings={settings} />
    </>
  );
}
