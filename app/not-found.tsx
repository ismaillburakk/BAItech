import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: false },
}

// Root seviyesinde durduğu için (site) layout'u uygulanmaz; Header/Footer
// burada açıkça render edilir.
export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="relative py-24 md:py-32">
          <div className="wrap">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                — Hata
              </span>
              <span className="hidden h-px w-10 bg-rule sm:block" />
              <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                404
              </span>
            </div>

            <h1 className="display mt-5 text-[clamp(40px,6vw,88px)] text-ink">
              Sayfa <span className="italic-amber">bulunamadı.</span>
            </h1>

            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-2">
              Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px"
              >
                Ana Sayfa
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href="/projeler"
                className="group inline-flex items-center justify-center gap-2 rounded-pill border border-rule px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-bg-elev"
              >
                Projelere Göz At
                <span className="text-ink-3 transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
