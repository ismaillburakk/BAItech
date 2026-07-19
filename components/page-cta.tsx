import Link from "next/link"

/**
 * Sayfa sonu CTA'sı — hairline çizgi + mevcut dolu pill buton kalıbı.
 * İçerik sayfalarının "şimdi ne yapmalıyım" sorusunu cevaplar (denetim U1/U6).
 */
export function PageCta({
  href = "/iletisim",
  label = "İletişime Geç",
}: {
  href?: string
  label?: string
}) {
  return (
    <section className="pb-24 md:pb-32">
      <div className="wrap">
        <div className="rule" />
        <div className="mt-10">
          <Link
            href={href}
            className="group inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px"
          >
            {label}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
