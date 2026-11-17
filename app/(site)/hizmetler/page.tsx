/**
 * Hizmetler — yapışkan üst üste binen hizmet kartları + genel proje süreci + SSS akordeonu.
 * Service + FAQPage + BreadcrumbList şemaları.
 */
import { ArrowDownIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import FaqAccordion from "@/components/origin/comp-345";
import { StackCards } from "@/components/services/stack-cards";
import { FinalCta } from "@/components/site/final-cta";
import JsonLd from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";
import { SectionHeading } from "@/components/site/section-heading";
import { getFaq, getPage, getProjects, getServices, getSiteSettings } from "@/lib/db/public";
import { pageCards, pageText } from "@/lib/page-schemas";
import { buildMetadata, faqJsonLd, servicesJsonLd, webPageJsonLd } from "@/lib/seo";
import { ServiceIcon } from "@/lib/services-ui";
import { pad2 } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("hizmetler")]);
  return buildMetadata({
    title: page?.seo.title || "",
    description: page?.seo.description || "",
    path: "/hizmetler",
    settings,
  });
}

export default async function ServicesPage() {
  const [settings, page, services, faq, projects] = await Promise.all([getSiteSettings(), getPage("hizmetler"), getServices(), getFaq(), getProjects()]);
  const t = (key: string) => pageText(page, key);
  const work = pageCards(page, "workSteps").filter((w) => w.title && w.body);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/hizmetler",
            name: t("headerTitle"),
            description: page?.seo.description || "",
            breadcrumb: [
              { name: "Ana Sayfa", path: "/" },
              { name: t("headerEyebrow") || "Hizmetler", path: "/hizmetler" },
            ],
          }),
          ...servicesJsonLd(services),
          ...(faq.length ? [faqJsonLd(faq, "/hizmetler")] : []),
        ]}
      />
      <PageHeader eyebrow={t("headerEyebrow")} title={t("headerTitle")} description={t("headerDescription")}>
        <nav aria-label="Hizmetler" className="mt-10 flex flex-wrap gap-2">
          {services.map((s) => {
            return (
              <Link
                key={s.id}
                href={`#${s.slug}`}
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card/60 px-4 text-sm font-medium transition-colors duration-(--dur-fast) hover:border-brand hover:text-brand-ink"
              >
                <ServiceIcon name={s.icon} className="size-4 text-brand-ink" aria-hidden="true" />
                {s.title}
                <ArrowDownIcon
                  className="size-3.5 text-muted-foreground transition-transform duration-(--dur-fast) group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
      </PageHeader>

      <section className="container-site py-24">
        <StackCards
          services={services}
          projects={projects.map(({ slug, title, services: related }) => ({ slug, title, services: related ?? [] }))}
          labels={{
            audience: t("audienceLabel") || "Kime uygun",
            deliverables: t("deliverablesLabel") || "Ne teslim ediyoruz",
            process: t("processLabel") || "Süreç",
            start: t("startLabel") || "Nasıl başlanır",
          }}
        />
      </section>

      {/* Genel proje süreci — kartların altında, SSS'nin üstünde (Hakkımızda › Ar-Ge bölümüyle aynı kalıp) */}
      {work.length ? (
        <section aria-labelledby="surec" className="container-site grid gap-12 pt-4 pb-28 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow={t("workEyebrow")} title={<span id="surec">{t("workTitle") || "Süreç"}</span>} />
          </div>
          <ol className="divide-y divide-border">
            {work.map((w, i) => (
              <Reveal key={w.title} as="li" className="py-10 first:pt-0">
                <span className="tabular font-heading text-sm text-brand-ink">{pad2(i + 1)}</span>
                <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug md:text-3xl">{w.title}</h3>
                <p className="measure mt-4 text-[1.0625rem] leading-relaxed text-muted-foreground">{w.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      ) : null}

      {faq.length ? (
        <section aria-labelledby="sss" className="border-t border-border bg-card/40 py-28">
          <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading eyebrow={t("faqEyebrow")} title={<span id="sss">{t("faqTitle")}</span>} />
              <Reveal className="mt-5 text-muted-foreground">{faq.length} soru</Reveal>
            </div>
            <Reveal>
              <FaqAccordion items={faq} />
            </Reveal>
          </div>
        </section>
      ) : null}

      <FinalCta settings={settings} />
    </>
  );
}
