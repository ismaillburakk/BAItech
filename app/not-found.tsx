import type { Metadata } from "next";

import SiteHeader from "@/components/origin/comp-577";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/site/footer";
import { NotFoundContent } from "@/components/site/not-found-content";
import { getSiteSettings } from "@/lib/db/public";

export const metadata: Metadata = {
  title: { absolute: "Sayfa bulunamadı (404) | BAI Technology" },
  robots: { index: false, follow: true },
};

/** Eşleşmeyen tüm adresler — site kabuğuyla (header + footer) birlikte */
export default async function NotFound() {
  const settings = await getSiteSettings().catch(() => null);
  return (
    <Providers>
      <SiteHeader ctaLabel={settings?.cta.buttonLabel || "Ücretsiz Danışmanlık"} logo={settings?.brand.logo ?? null} />
      <main id="icerik" tabIndex={-1} className="outline-none">
        <NotFoundContent />
      </main>
      <Footer settings={settings} />
    </Providers>
  );
}
