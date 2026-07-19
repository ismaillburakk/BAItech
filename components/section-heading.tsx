import type React from "react"

/**
 * Section başlık bloğu: mono eyebrow satırı + display başlık + sağa yaslı açıklama.
 * Services/Projects/About section'larındaki birebir aynı markup'ın tek kaynağı.
 * headingClassName mevcut section'ların kendi clamp değerlerini korumak içindir.
 */
export function SectionHeading({
  eyebrow,
  sectionNo,
  title,
  description,
  headingAs: Heading = "h2",
  headingClassName = "display mt-5 text-[clamp(36px,5vw,68px)] text-ink",
}: {
  eyebrow: string
  sectionNo: string
  title: React.ReactNode
  description: string
  headingAs?: "h1" | "h2"
  headingClassName?: string
}) {
  return (
    <div className="reveal mb-14 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
            — {eyebrow}
          </span>
          <span className="hidden h-px w-10 bg-rule sm:block" />
          <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
            {sectionNo}
          </span>
        </div>
        <Heading className={headingClassName}>{title}</Heading>
      </div>
      <p className="max-w-md text-[16px] leading-relaxed text-ink-2 md:justify-self-end md:text-right">
        {description}
      </p>
    </div>
  )
}
