"use client"

import { ArrowUpRightIcon, PauseIcon, PlayIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Referanslar — durmadan akan logo şeridi (Referanslar modülü).
 *
 * - Saf CSS animasyonu (`marquee` keyframe'i, yalnızca transform → compositor, JS'siz de akar).
 * - Üzerine gelince / klavye odağında duraklar; ayrıca duraklat-oynat düğmesi (WCAG 2.2.2).
 * - Az referans varken şerit boş kalmasın diye liste satır içinde çoğaltılır; kopyalar
 *   ekran okuyucudan ve Tab sırasından gizlidir.
 * - prefers-reduced-motion: animasyon yok, kopyalar gizli, ortalanmış statik liste (CSS ile,
 *   hidrasyon farkı oluşmaz).
 * Kart dili taslakla aynı: radius 16px, border → hover'da border-strong.
 * Erişilebilir ad yalnızca firma adıdır. Referans açıklaması (yapılan iş) sitede HİÇBİR biçimde
 * gösterilmez: ipucu, title, aria açıklaması yok.
 * Logolar varsayılan olarak kendi renklerinde, kartın içindeki açık (--foreground) plakada
 * gösterilir; "mono" seçilmiş (beyaz/açık renkli) logolar koyu kart üzerinde beyaz tek renk.
 */
const MIN_PER_ROW = 8

/** @param {any} props */
function Item({ r, copy }) {
  const hidden = copy || undefined
  // Varsayılan orijinal renk; yalnızca açıkça "mono" seçilen logolar beyaz tek renk
  const mono = r.logoMode === "mono"
  const label = (
    <>
      {r.logo && mono ? (
        <span className="relative block h-16 w-full max-w-[150px]">
          <Image
            src={r.logo.public_id}
            alt={copy ? "" : r.name}
            fill
            sizes="150px"
            className="object-contain opacity-70 [filter:brightness(0)_invert(1)] transition-opacity duration-(--dur-base) group-hover/ref:opacity-100"
          />
        </span>
      ) : r.logo ? (
        // Orijinal renkler: açık (foreground) plaka — koyu/siyah logolar da koyu temada okunur.
        // Plaka 80px: kare ve yüksek logolar 64px yüksekliğe çıkar, çok yatay logolar 150px genişlikte kalır;
        // farklı oranlar yan yana benzer görsel ağırlıkta durur.
        <span className="flex h-20 w-full items-center justify-center rounded-xl bg-foreground px-4 py-2 transition-shadow duration-(--dur-base) group-hover/ref:shadow-[0_0_24px_var(--glow)]">
          <span className="relative block h-full w-full max-w-[150px]">
            <Image src={r.logo.public_id} alt={copy ? "" : r.name} fill sizes="150px" className="object-contain" />
          </span>
        </span>
      ) : (
        <span aria-hidden="true" className="font-heading text-xl font-semibold tracking-tight text-foreground/80 transition-colors duration-(--dur-base) group-hover/ref:text-foreground">
          {r.name}
        </span>
      )}
      {/* Logolu kartta ad görselin alt metninden okunur; görünen etiket ekran okuyucuya ikinci kez okunmaz */}
      <span
        aria-hidden={r.logo ? "true" : undefined}
        className={cn("text-sm font-medium text-muted-foreground transition-colors duration-(--dur-base) group-hover/ref:text-foreground", !r.logo && "sr-only")}
      >
        {r.name}
      </span>
    </>
  )
  const box =
    "group/ref relative flex h-36 w-56 flex-col items-center justify-center gap-2.5 rounded-2xl border border-border bg-card px-5 text-center transition-colors duration-(--dur-fast) hover:border-border-strong"
  return (
    <li aria-hidden={hidden} className={cn("shrink-0", copy && "motion-reduce:hidden")}>
      {r.url ? (
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={copy ? -1 : undefined}
          className={cn(box, "outline-none focus-visible:ring-2 focus-visible:ring-ring")}
        >
          {label}
          {copy ? null : <span className="sr-only"> (yeni sekmede açılır)</span>}
          <ArrowUpRightIcon
            className="absolute top-3 right-3 size-4 text-muted-foreground opacity-0 transition-opacity duration-(--dur-fast) group-hover/ref:text-brand-ink group-hover/ref:opacity-100"
            aria-hidden="true"
          />
        </a>
      ) : (
        <div className={box}>{label}</div>
      )}
    </li>
  )
}

/** @param {any} props */
export function ReferencesMarquee({ references, label = "Referanslarımız" }) {
  const [paused, setPaused] = useState(false)
  if (!references?.length) return null

  const reps = Math.max(1, Math.ceil(MIN_PER_ROW / references.length))
  const row = Array.from({ length: reps }, (_, k) => references.map((r) => ({ r, k }))).flat()
  // Kart başına ~5 sn: az ya da çok referansta hız sabit kalır
  const duration = `${row.length * 5}s`

  /** @param {boolean} half2 */
  const list = (half2) => (
    <ul
      aria-hidden={half2 || undefined}
      aria-label={half2 ? undefined : label}
      className={cn("flex shrink-0 items-center gap-4 pr-4", half2 && "motion-reduce:hidden", "motion-reduce:w-full motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0")}
    >
      {row.map(({ r, k }) => (
        <Item key={`${r.id}-${k}`} r={r} copy={half2 || k > 0} />
      ))}
    </ul>
  )

  return (
    <div className="group/marquee flex flex-col gap-4">
      <div
        role="region"
        aria-label={label}
        className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] motion-reduce:[mask-image:none]"
      >
        <div
          style={{ "--marquee-duration": duration }}
          className={cn(
            "marquee-track flex w-max will-change-transform motion-reduce:will-change-auto animate-[marquee_var(--marquee-duration)_linear_infinite] py-1 group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:justify-center",
            paused && "[animation-play-state:paused]"
          )}
        >
          {list(false)}
          {list(true)}
        </div>
      </div>
      <div className="flex justify-end motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Referans şeridini oynat" : "Referans şeridini duraklat"}
          aria-pressed={paused}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors duration-(--dur-fast) hover:border-border-strong hover:text-foreground"
        >
          {paused ? <PlayIcon className="size-4" aria-hidden="true" /> : <PauseIcon className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}
