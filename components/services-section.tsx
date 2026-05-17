"use client"

const services = [
  {
    n: "001",
    title: "Akıllı Otomasyon",
    body: "Tekrarlayan iş süreçlerinizi yapay zeka ile otomatikleştirin ve zamandan tasarruf edin.",
  },
  {
    n: "002",
    title: "Veri Analizi",
    body: "Büyük veri setlerinizi analiz ederek işletmeniz için değerli içgörüler elde edin.",
  },
  {
    n: "003",
    title: "Müşteri Deneyimi",
    body: "AI destekli chatbot’lar ve kişiselleştirme ile müşteri memnuniyetini artırın.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      <div className="wrap">
        {/* Section heading */}
        <div className="reveal mb-14 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                — Çözümler
              </span>
              <span className="hidden h-px w-10 bg-rule sm:block" />
              <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                Section 02
              </span>
            </div>
            <h2 className="display mt-5 text-[clamp(38px,5vw,68px)] text-ink">
              AI <span className="italic-amber">çözümlerimiz</span>
            </h2>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-ink-2 md:justify-self-end md:text-right">
            İş süreçlerinizi otomatikleştiren ve verimliliğinizi artıran yapay zeka modelleri.
          </p>
        </div>

        {/* Cards row */}
        <div className="reveal grid grid-cols-1 border-y border-rule md:grid-cols-3">
          {services.map((s, i) => (
            <article
              key={s.n}
              className={`group relative p-8 transition-colors hover:bg-bg-elev md:p-10 ${
                i < services.length - 1 ? "border-b border-rule md:border-b-0 md:border-r" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  — {s.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                  Çözüm
                </span>
              </div>
              <h3 className="mt-10 font-serif text-[clamp(28px,3.2vw,38px)] leading-[1.04] text-ink">
                {s.title}
              </h3>
              <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
              <div className="mt-10 flex items-center justify-between border-t border-rule-2 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                  Daha fazla
                </span>
                <span
                  aria-hidden="true"
                  className="text-ink transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
