"use client"

const bullets = [
  "Uzman AI geliştirici ekibi",
  "İşletmeye özel çözümler",
  "7/24 teknik destek",
  "Kanıtlanmış başarı hikayeleri",
]

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="wrap">
        <div className="reveal mb-14 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                — Hakkımızda
              </span>
              <span className="hidden h-px w-10 bg-rule sm:block" />
              <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                Section 04
              </span>
            </div>
            <h2 className="display mt-5 text-[clamp(36px,5vw,68px)] text-ink">
              Neden{" "}
              <span className="italic-amber">
                <span className="notranslate">BAI Technology</span>?
              </span>
            </h2>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-ink-2 md:justify-self-end md:text-right">
            BAI Technology olarak, yapay zeka teknolojilerinin gücünü insanlığın hizmetine sunuyoruz.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left — narrative + bullets */}
          <div className="reveal">
            <p className="text-[18px] leading-relaxed text-ink-2 md:text-[19px]">
              Yapay zeka alanında uzman ekibimizle, işletmenizin ihtiyaçlarına özel çözümler
              geliştiriyoruz. Amacımız, teknolojinin gücünü kullanarak iş süreçlerinizi daha verimli
              hale getirmek.
            </p>

            <ul className="mt-10 divide-y divide-rule border-y border-rule">
              {bullets.map((b, i) => (
                <li
                  key={b}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5"
                >
                  <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-[clamp(22px,2.4vw,28px)] leading-tight text-ink">
                    {b}
                  </span>
                  <span aria-hidden="true" className="text-ink-3">
                    →
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — vision + mission cards */}
          <div className="reveal flex flex-col gap-8">
            <ValueCard
              tag="i."
              title="Vizyonumuz"
              body="Yapay zekâ teknolojilerini kullanarak insanların günlük yaşamlarını kolaylaştırmak; aldıkları hizmetlerde kaliteyi artırmak ve her bireye, aldığı hizmetin değerli olduğunu hissettiren yenilikçi çözümler sunmak."
            />
            <ValueCard
              tag="ii."
              title="Misyonumuz"
              body="Toplumun yaşam kalitesini artıran, erişilebilir ve güvenilir yapay zekâ tabanlı hizmetler geliştirerek; kullanıcı odaklı, etik değerlere bağlı, sürdürülebilir ve yüksek standartlarda dijital deneyimler sunmak."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ValueCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <article className="relative rounded-md border border-rule bg-paper p-8 md:p-10">
      <div className="flex items-center justify-between">
        <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
          {tag}
        </span>
        <span className="h-px w-12 bg-rule" />
      </div>
      <h3 className="mt-6 font-serif italic text-[clamp(28px,3.2vw,40px)] leading-tight text-amber-ink">
        {title}
      </h3>
      <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{body}</p>
    </article>
  )
}
