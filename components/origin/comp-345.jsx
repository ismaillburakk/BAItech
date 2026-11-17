/**
 * Origin UI comp-345 — "accordion" (artı/eksi ikonlu, kart satırlı) — BAI uyarlaması.
 * Kaynak: https://coss.com/origin/r/comp-345.json (@origin/comp-345)
 *
 * Görünüm taslaktaki Radix akordeonla birebir; altyapı yerel <details name>:
 * - Tüm cevaplar SSR HTML'inde (JS kapalıyken ve AI crawler'lar için okunur)
 * - Aynı anda tek madde açık (exclusive accordion, name ortak), ilk madde açık
 * - Açılış/kapanış 200 ms yükseklik geçişi (::details-content, destekleyen tarayıcılarda)
 * - reduced-motion'da geçiş yok (--dur-base 0ms)
 */
import { PlusIcon } from "lucide-react"

export default function FaqAccordion({ items, defaultOpen = 0, name = "sss" }) {
  return (
    <div className="w-full space-y-2">
      {items.map((item, i) => (
        <details
          key={item.id ?? item.question}
          name={name}
          open={i === defaultOpen}
          className="faq-details group rounded-2xl border border-border bg-card px-6 outline-none transition-colors duration-(--dur-base) open:border-border-strong open:bg-card-hover has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
        >
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-md py-3 text-left font-heading text-[1.0625rem] font-medium leading-6 outline-none transition-colors duration-(--dur-base) ease-standard hover:text-brand-ink [&::-webkit-details-marker]:hidden">
            <h3 className="font-heading text-[1.0625rem] font-medium leading-6">{item.question}</h3>
            <PlusIcon
              aria-hidden="true"
              size={18}
              className="pointer-events-none shrink-0 opacity-70 transition-transform duration-(--dur-base) ease-standard group-open:rotate-180 [&>path:last-child]:origin-center [&>path:last-child]:transition-all [&>path:last-child]:duration-(--dur-base) group-open:[&>path:last-child]:rotate-90 group-open:[&>path:last-child]:opacity-0"
            />
          </summary>
          <p className="measure pb-4 text-base leading-relaxed text-muted-foreground">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}
