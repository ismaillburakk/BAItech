"use client"

import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const scrollTo = (sel: string) => {
    const el = document.querySelector(sel)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="home" className="relative overflow-hidden pt-16 md:pt-24">
      <div className="wrap pb-20 pt-10 md:pb-28 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-16 lg:items-end">
          {/* Text column */}
          <div className="reveal">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                — Teknoloji &amp; İnovasyon
              </span>
              <span className="hidden h-px w-12 bg-rule sm:block" />
              <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                BAI · 001
              </span>
            </div>

            <h1 className="display mt-6 text-[clamp(40px,6.5vw,108px)] text-ink">
              Geleceği{" "}
              <span className="italic-amber">teknoloji</span> ile{" "}
              <span className="whitespace-nowrap">
                şekillendiriyoruz<span className="italic-amber">.</span>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-2 md:text-[18px]">
              BAI TECHNOLOGY olarak, en son teknolojilerle işletmenizi dijital dönüşüm yolculuğunda
              destekliyoruz.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={() => scrollTo("#contact")}
                className="group inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px"
              >
                Ücretsiz Danışmanlık
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => scrollTo("#services")}
                className="group inline-flex items-center justify-center gap-2 rounded-pill border border-rule px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-bg-elev"
              >
                Çözümlerimizi Keşfedin
                <span className="text-ink-3 transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            </div>

            {/* Meta row */}
            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-rule pt-6 max-w-md">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">Konum</div>
                <div className="notranslate mt-1 font-serif text-lg text-ink">Uşak / TR</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">Odak</div>
                <div className="notranslate mt-1 font-serif text-lg italic text-ink">
                  AI · Software
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">Statü</div>
                <div className="mt-1 font-serif text-lg text-ink">Aktif</div>
              </div>
            </div>
          </div>

          {/* Side figure */}
          <figure className="reveal relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] w-full rounded-md border border-rule bg-paper">
              {/* Corner ticks */}
              <CornerTicks />

              {/* Coordinates */}
              <div className="notranslate pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
                38.6823° N
              </div>
              <div className="notranslate pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
                29.4082° E
              </div>
              <div className="notranslate pointer-events-none absolute left-4 bottom-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
                FIG. 01
              </div>
              <div className="notranslate pointer-events-none absolute right-4 bottom-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
                BAI-001
              </div>

              {/* Compass glyph */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 200"
                  className="h-3/5 w-3/5 animate-spin-slow text-ink"
                  aria-hidden="true"
                >
                  <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.35" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                  <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
                  {/* Compass diamond */}
                  <g stroke="currentColor" strokeWidth="1" fill="none">
                    <path d="M100 18 L114 100 L100 182 L86 100 Z" />
                    <path d="M18 100 L100 86 L182 100 L100 114 Z" />
                  </g>
                  {/* Amber north tip */}
                  <path d="M100 18 L114 100 L100 100 Z" fill="var(--amber)" opacity="0.85" />
                  {/* Cardinal letters */}
                  <g
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="9"
                    fill="currentColor"
                    opacity="0.6"
                    textAnchor="middle"
                  >
                    <text x="100" y="10">N</text>
                    <text x="100" y="198">S</text>
                    <text x="194" y="103">E</text>
                    <text x="6" y="103">W</text>
                  </g>
                  {/* Tick marks */}
                  <g stroke="currentColor" strokeWidth="0.5" opacity="0.4">
                    {Array.from({ length: 36 }).map((_, i) => {
                      const a = (i * 10 * Math.PI) / 180
                      const r2 = i % 9 === 0 ? 82 : 87
                      const x1 = (100 + Math.sin(a) * 92).toFixed(3)
                      const y1 = (100 - Math.cos(a) * 92).toFixed(3)
                      const x2 = (100 + Math.sin(a) * r2).toFixed(3)
                      const y2 = (100 - Math.cos(a) * r2).toFixed(3)
                      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
                    })}
                  </g>
                  <circle cx="100" cy="100" r="2.5" fill="var(--amber)" />
                </svg>
              </div>

              {/* Counter-rotating outer ring */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[88%] w-[88%] animate-spin-reverse rounded-full border border-dashed border-rule-2 opacity-70" />
              </div>
            </div>

            <figcaption className="notranslate mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-mono text-ink-3">
              <span>Compass · Edition 001</span>
              <span>2025 / Q4</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function CornerTicks() {
  const arm = "h-3 w-3 absolute"
  return (
    <>
      <span className={`${arm} left-2 top-2 border-l border-t border-ink/40`} />
      <span className={`${arm} right-2 top-2 border-r border-t border-ink/40`} />
      <span className={`${arm} left-2 bottom-2 border-l border-b border-ink/40`} />
      <span className={`${arm} right-2 bottom-2 border-r border-b border-ink/40`} />
    </>
  )
}
