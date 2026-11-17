import SiteHeader from "@/components/origin/comp-577";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/site/footer";
import JsonLd from "@/components/site/json-ld";
import { getProjects, getServices, getSiteSettings } from "@/lib/db/public";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/** Veri katmanı (lib/db/public) firebase-admin kullanır → Node.js runtime */
export const runtime = "nodejs";

/**
 * Public site kabuğu: sabit header + içerik + footer. Organization
 * (LocalBusiness + ProfessionalService) ve WebSite şemaları her sayfada.
 */
export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, projects, services] = await Promise.all([getSiteSettings(), getProjects(), getServices()]);

  return (
    <Providers>
      <JsonLd data={[organizationJsonLd(settings, projects, services), websiteJsonLd(settings)]} />
      <SiteHeader
        ctaLabel={settings?.cta.buttonLabel || "Ücretsiz Danışmanlık"}
        logo={settings?.brand.logo ?? null}
        brandName={settings?.brand.name || "BAI Technology"}
      />
      <main id="icerik" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
    </Providers>
  );
}
