/**
 * İletişim — bilgi kartları (TiltCard) + form (Firestore submissions + Resend).
 * ContactPage şeması. Bilgiler Site Ayarları'ndan, metinler Sayfalar › İletişim'den.
 */
import { ArrowUpRightIcon, ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";

import { TiltCard } from "@/components/motion/fx";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { ContactForm } from "@/components/site/contact-form";
import JsonLd from "@/components/site/json-ld";
import { PageHeader } from "@/components/site/page-header";
import { getPage, getSiteSettings } from "@/lib/db/public";
import { pageList, pageText } from "@/lib/page-schemas";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";
import { telHref } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("iletisim")]);
  return buildMetadata({ title: page?.seo.title || "", description: page?.seo.description || "", path: "/iletisim", settings });
}

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage("iletisim")]);
  const t = (key: string) => pageText(page, key);
  const c = settings?.contact;
  const rows = [
    c?.email ? { icon: MailIcon, label: "E-posta", value: c.email, href: `mailto:${c.email}` } : null,
    c?.phone ? { icon: PhoneIcon, label: "Telefon", value: c.phone, href: telHref(c.phone) } : null,
    c?.address ? { icon: MapPinIcon, label: "Adres", value: c.address.split("\n").join(" "), href: null } : null,
    c?.responseTime ? { icon: ClockIcon, label: "Yanıt Süresi", value: c.responseTime, href: null } : null,
  ].filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "ContactPage",
          path: "/iletisim",
          name: t("headerTitle"),
          description: page?.seo.description || "",
          breadcrumb: [
            { name: "Ana Sayfa", path: "/" },
            { name: t("headerEyebrow") || "İletişim", path: "/iletisim" },
          ],
        })}
      />
      <PageHeader eyebrow={t("headerEyebrow")} title={t("headerTitle")} description={t("headerDescription")} />
      <section className="relative isolate py-20">
        <div
          aria-hidden="true"
          className="absolute top-20 right-0 -z-10 h-[500px] w-[min(600px,100%)] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-3xl"
        />
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
          <div className="grid content-start gap-4">
            <Stagger as="address" className="grid content-start gap-4 not-italic">
              {rows.map(({ icon: Icon, label, value, href }) => (
                <StaggerItem key={label}>
                  <TiltCard max={4} className="rounded-2xl border border-border bg-card transition-colors duration-(--dur-fast) hover:border-border-strong">
                    <div className="relative z-10 flex items-start gap-4 p-5 sm:p-6">
                      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="mt-1 block font-heading text-xl font-semibold [overflow-wrap:anywhere] outline-none after:absolute after:inset-0 hover:text-brand-ink"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className={label === "Adres" ? "mt-1 leading-relaxed" : "mt-1 font-heading text-xl font-semibold"}>{value}</p>
                        )}
                      </div>
                      {href ? (
                        <ArrowUpRightIcon
                          className="size-5 shrink-0 text-muted-foreground transition-colors duration-(--dur-fast) group-hover/tilt:text-brand-ink"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </Stagger>
            {c?.mapEmbedUrl ? (
              <Reveal className="overflow-hidden rounded-2xl border border-border bg-card">
                <iframe
                  src={c.mapEmbedUrl}
                  title="Konum haritası"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-64 w-full border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)]"
                />
              </Reveal>
            ) : null}
          </div>
          <Reveal>
            <div className="glass rounded-3xl border border-border-strong p-5 shadow-xl sm:p-6 md:p-10">
              <h2 className="font-heading text-2xl font-semibold">{t("formTitle") || "Mesaj Bırakın"}</h2>
              {t("formHint") ? <p className="measure mt-3 leading-relaxed text-muted-foreground">{t("formHint")}</p> : null}
              <p className="mt-3 mb-8 text-sm text-muted-foreground">
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>{" "}
                işaretli alanlar zorunludur.
              </p>
              <ContactForm
                topics={pageList(page, "formTopics")}
                consentText={t("consentText")}
                successTitle={t("successTitle") || undefined}
                successDescription={t("successDescription") || undefined}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
