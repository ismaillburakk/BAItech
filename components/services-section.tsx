import Link from "next/link"
import { SectionHeading } from "@/components/section-heading"
import { services } from "@/lib/services"

export function ServicesSection({
  moreHref,
  headingAs = "h2",
  cardHeadingAs: CardHeading = "h3",
}: {
  /** Verilirse kartlardaki "Daha fazla →" satırı bu adrese link olur (ana sayfa → /hizmetler). */
  moreHref?: string
  /** Ayrık sayfada ana başlık h1 olur; görünüm aynı kalır (stiller class'lardan gelir). */
  headingAs?: "h1" | "h2"
  /** Sayfa başlığı h1 olduğunda kartlar h2 olur (heading atlaması olmasın diye). */
  cardHeadingAs?: "h2" | "h3"
}) {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          eyebrow="Hizmetler"
          sectionNo="Section 02"
          title={
            <>
              Yazılım ve <span className="italic-amber">yapay zeka</span>
            </>
          }
          description="Mobil uygulama, web ve özel yazılım geliştiriyoruz; yapay zeka modellerini de kendimiz eğitiyoruz."
          headingAs={headingAs}
          headingClassName="display mt-5 text-[clamp(38px,5vw,68px)] text-ink"
        />

        {/* Kart grid'i — 3 kolon (md), 5 kart 3+2 dizilir. Border mantığı: dikey
            ayraç son kolon/son kart hariç; satır ayracı son satır dışındaki
            kartlarda (mobilde her kart arası). Mevcut hairline border-grid sistemi. */}
        <div className="reveal grid grid-cols-1 border-y border-rule md:grid-cols-3">
          {services.map((s, i) => {
            const cols = 3
            const lastRowStart = Math.floor((services.length - 1) / cols) * cols
            const isLast = i === services.length - 1
            const border = [
              "border-rule",
              !isLast ? "border-b" : "",
              i >= lastRowStart && !isLast ? "md:border-b-0" : "",
              i % cols !== cols - 1 && !isLast ? "md:border-r" : "",
            ].join(" ")
            return (
            <article
              key={s.n}
              className={`group relative p-8 transition-colors hover:bg-bg-elev md:p-10 ${border}`}
            >
              <div className="flex items-center justify-between">
                <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  — {s.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                  Çözüm
                </span>
              </div>
              <CardHeading className="mt-10 font-serif text-[clamp(28px,3.2vw,38px)] leading-[1.04] text-ink">
                {s.title}
              </CardHeading>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
              {/* "Daha fazla" satırı yalnızca gerçek bir hedef varsa render edilir —
                  /hizmetler'de tıklanabilirlik vaat edip hiçbir yere gitmeyen ölü
                  satır kaldırıldı (denetim U1). */}
              {moreHref && (
                <Link
                  href={moreHref}
                  className="mt-10 flex items-center justify-between border-t border-rule-2 pt-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                    Daha fazla
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ink transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              )}
            </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
