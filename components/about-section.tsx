import Link from "next/link"
import { SectionHeading } from "@/components/section-heading"

const bullets = [
  "Mobil, web ve özel yazılım geliştirme",
  "Görüntü ve dil tabanlı yapay zeka modelleri",
  "İşletmeye özel, sürece göre çözümler",
  "App Store ve Play Store'da yayında ürünler",
]

export function AboutSection({
  variant = "full",
  headingAs = "h2",
}: {
  /**
   * "summary": ana sayfa hali — Vizyon/Misyon kartları görünmez, madde listesi
   * /hakkimizda'ya link olur. "full": sayfanın tamamı.
   */
  variant?: "summary" | "full"
  /** Ayrık sayfada ana başlık h1 olur; görünüm aynı kalır (stiller class'lardan gelir). */
  headingAs?: "h1" | "h2"
}) {
  const leftColumn = (
    <div className="reveal">
      <p className="text-[18px] leading-relaxed text-ink-2 md:text-[19px]">
        Mobil uygulama, web ve özel yazılım geliştiriyoruz; işletmelerin ihtiyaçlarına göre
        çözümler üretiyoruz. Aynı zamanda görüntü ve dil tabanlı yapay zeka modellerini hazır
        servis kullanmadan, kendimiz eğitiyoruz.
      </p>

      <ul className="mt-10 divide-y divide-rule border-y border-rule">
        {bullets.map((b, i) => (
          <li key={b}>
            {variant === "summary" ? (
              <Link
                href="/hakkimizda"
                className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5"
              >
                <BulletRow index={i} label={b} />
              </Link>
            ) : (
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5">
                <BulletRow index={i} label={b} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          eyebrow="Hakkımızda"
          sectionNo="Section 04"
          title={
            <>
              Neden{" "}
              <span className="italic-amber">
                <span className="notranslate">BAI Technology</span>?
              </span>
            </>
          }
          description="BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Geliştirdiği uygulamalar App Store ve Google Play'de yayındadır."
          headingAs={headingAs}
        />

        {variant === "full" ? (
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            {leftColumn}

            {/* Right — vision + mission cards. Başlık seviyesi sayfanınkiyle
                uyumlu: /hakkimizda'da (h1) bunlar h2 olur, h1→h3 atlaması olmaz. */}
            <div className="reveal flex flex-col gap-8">
              <ValueCard
                tag="i."
                title="Vizyonumuz"
                headingAs={headingAs === "h1" ? "h2" : "h3"}
                body="Yazılımı ve yapay zekayı, insanların günlük işlerini gerçekten kolaylaştıran ürünlere dönüştürmek; teknolojiyi gösteriş için değil, işe yaradığı için kullanmak."
              />
              <ValueCard
                tag="ii."
                title="Misyonumuz"
                headingAs={headingAs === "h1" ? "h2" : "h3"}
                body="İşletmelerin ihtiyaçlarını yerinde anlayıp mobil, web ve özel yazılım geliştirmek; gerektiğinde kendi yapay zeka modellerimizi eğiterek sorunları hazır kalıplarla değil, probleme özel çözmek."
              />
            </div>
          </div>
        ) : (
          /* Özet: tek kolon — sağda boş grid kolonu bırakmamak için genişlik
             max-w-2xl ile eski sol kolon ölçüsünde tutulur (denetim U5). */
          <div className="max-w-2xl">{leftColumn}</div>
        )}
      </div>
    </section>
  )
}

function BulletRow({ index, label }: { index: number; label: string }) {
  return (
    <>
      <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="font-serif text-[clamp(22px,2.4vw,28px)] leading-tight text-ink">
        {label}
      </span>
      <span aria-hidden="true" className="text-ink-3">
        →
      </span>
    </>
  )
}

function ValueCard({
  tag,
  title,
  body,
  headingAs: Heading = "h3",
}: {
  tag: string
  title: string
  body: string
  headingAs?: "h2" | "h3"
}) {
  return (
    <article className="relative rounded-md border border-rule bg-paper p-8 md:p-10">
      <div className="flex items-center justify-between">
        <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
          {tag}
        </span>
        <span className="h-px w-12 bg-rule" />
      </div>
      <Heading className="mt-6 font-serif italic text-[clamp(28px,3.2vw,40px)] leading-tight text-amber-ink">
        {title}
      </Heading>
      <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{body}</p>
    </article>
  )
}
