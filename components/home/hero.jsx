"use client"

/**
 * Ana sayfa hero — anasayfa.md v2 "Giriş kancası".
 * Hareket: kelime kelime başlık (300 ms / 40 ms), imleci izleyen ışıma (spring),
 * telefon yelpazesi: yüklenince açılır, kaydırdıkça daha da açılıp eğilir (scrub).
 * Reduced-motion: yelpaze son halinde, ışıma sabit, başlık doğrudan görünür.
 */
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

import { CursorGlow, Magnetic, SplitText } from "@/components/motion/fx"
import StatusBadge from "@/components/origin/comp-421"
import { PhoneFrame } from "@/components/project/device-frame"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/lib/use-media"
import { enterClass } from "@/components/motion/reveal"

/** @param {any} props */
function FanPhone({ img, progress, idx, reduce }) {
  // idx: -1 sol, 0 orta, 1 sağ
  const baseX = idx * 46
  const baseR = idx * 9
  const x = useTransform(progress, [0, 1], [`${baseX}%`, `${idx * 70}%`])
  const rotate = useTransform(progress, [0, 1], [baseR, idx * 16])
  const y = useTransform(progress, [0, 1], [idx === 0 ? -10 : 24, idx === 0 ? -70 : 60])
  return (
    <motion.div
      className="absolute left-1/2 top-0 w-[42%] max-w-[250px] -translate-x-1/2"
      style={reduce ? { x: `${baseX}%`, rotate: baseR, y: idx === 0 ? -10 : 24, zIndex: idx === 0 ? 3 : 1 } : { x, rotate, y, zIndex: idx === 0 ? 3 : 1 }}
    >
      <div
        className="animate-in fade-in slide-in-from-bottom-20 zoom-in-90 duration-(--dur-slow) ease-standard fill-mode-both"
        style={{ animationDelay: `${250 + Math.abs(idx) * 40}ms` }}
      >
        <PhoneFrame src={img.public_id} alt={img.alt ?? ""} priority sizes="250px" />
      </div>
    </motion.div>
  )
}

/** @param {any} props */
export function Hero({ hero }) {
  const phones = hero.phones ?? []
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const fadeOut = useTransform(scrollYProgress, [0, 0.7], [1, 0.25])

  return (
    <section ref={ref} className="relative isolate overflow-hidden pt-[4.5rem]">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <CursorGlow className="-z-10" />
      <div aria-hidden="true" className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-strong),transparent)] opacity-40 blur-3xl" />

      <div className="container-site grid min-h-[calc(100dvh-4.5rem)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-10">
        <motion.div style={reduce ? undefined : { opacity: fadeOut }}>
          <div className="flex flex-wrap items-center gap-3">
            {hero.badge ? <StatusBadge tone="live">{hero.badge}</StatusBadge> : null}
            {hero.badgeNote ? <span className="text-sm text-muted-foreground">{hero.badgeNote}</span> : null}
          </div>
          <SplitText
            text={hero.title}
            className="mt-6 text-[clamp(1.75rem,8.4vw,2.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[clamp(2.75rem,7vw,5.75rem)]"
          />
          <p className={`${enterClass} measure mt-7 text-lg leading-relaxed text-muted-foreground delay-300 md:text-xl`}>
            {hero.lead}
          </p>
          <div className={`${enterClass} mt-10 flex flex-col gap-3 delay-[380ms] sm:flex-row sm:items-center`}>
            <Magnetic>
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-base shadow-[0_0_40px_var(--glow)]">
                <Link href={hero.primaryCta.href || "/iletisim"}>
                  {hero.primaryCta.label}
                  <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="ghost" className="h-14 rounded-full px-6 text-base">
              <Link href={hero.secondaryCta.href || "/hizmetler"}>{hero.secondaryCta.label}</Link>
            </Button>
          </div>
          <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            {hero.meta.map((m) => (
              <div key={m.label}>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 font-heading text-lg font-medium">{m.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {phones.length === 3 ? (
          <div className="relative mx-auto aspect-[1/1] w-full max-w-[560px] sm:aspect-[5/6]">
            {[-1, 1, 0].map((idx) => (
              <FanPhone key={idx} idx={idx} img={phones[idx + 1]} progress={scrollYProgress} reduce={reduce} />
            ))}
          </div>
        ) : null}
      </div>

      <a
        href="#kesfet"
        className="absolute bottom-6 left-1/2 hidden min-h-11 -translate-x-1/2 items-center gap-2 text-sm text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground [@media(min-width:1024px)_and_(min-height:820px)]:inline-flex"
      >
        <ArrowDownIcon className="size-4 motion-safe:animate-bounce" aria-hidden="true" />
        Kaydırın
      </a>
    </section>
  )
}
