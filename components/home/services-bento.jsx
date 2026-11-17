"use client"

/**
 * Hizmet bento'su — anasayfa.md v2 "Çözüm", projeler.md bento kuralı (değişken açıklık,
 * radius 16px, eğim + spotlight). Yapay Zeka kutusunda çizilen sinyal yolu (pathLength, görünür olunca bir kez).
 */
import { motion } from "framer-motion"
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import { TiltCard } from "@/components/motion/fx"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { BrowserFrame, PhoneFrame } from "@/components/project/device-frame"
import { EASE } from "@/lib/motion"
import { ServiceIcon } from "@/lib/services-ui"
import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

// Bento boyutu ve sırası panelden (Hizmetler › bentoSize / homeOrder).
// Masaüstü 6 sütun: büyük kart 3×2, küçük kart 2×1 → 2 büyük + 6 küçük = 2 tam blok + 2 tam sıra.
// Tablet 2 sütun (tüm kartlar 1 sütun); tek sayıda kart kalırsa sonuncusu tam genişlik olur.
const LAYOUT = { large: "lg:col-span-3 lg:row-span-2", small: "lg:col-span-2" }

function SignalArt() {
  const reduce = useReducedMotion()
  const d = "M0 60 L60 60 L75 60 L85 20 L97 100 L108 45 L118 60 L190 60 L205 60 L215 25 L227 95 L238 50 L248 60 L320 60"
  return (
    <svg viewBox="0 0 320 120" className="h-28 w-full" aria-hidden="true">
      <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth="2" />
      <motion.path
        d={d}
        fill="none"
        stroke="var(--brand)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
        style={{ filter: "drop-shadow(0 0 6px var(--glow-strong))" }}
      />
    </svg>
  )
}

/** @param {any} props */
function Art({ service }) {
  const images = service.images ?? []
  if (service.bentoArt === "signal") return <SignalArt />
  if (service.bentoArt === "phones" && images.length)
    return (
      <div className="flex h-48 items-start justify-center gap-3 overflow-hidden">
        {images.slice(0, 2).map((p, i) => (
          <PhoneFrame key={p.public_id} src={p.public_id} alt={p.alt ?? ""} sizes="160px" className={cn("w-32", i === 1 && "mt-8")} />
        ))}
      </div>
    )
  if (service.bentoArt === "browser" && images[0])
    return (
      <div className="h-24 overflow-hidden">
        <BrowserFrame src={images[0].public_id} alt={images[0].alt ?? ""} w={images[0].width} h={images[0].height} sizes="360px" />
      </div>
    )
  return null
}

/** @param {any} props */
export function ServicesBento({ services }) {
  const list = [...services].sort((a, b) => (a.homeOrder ?? a.order) - (b.homeOrder ?? b.order))
  return (
    <Stagger as="ul" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-flow-row-dense lg:auto-rows-[minmax(220px,auto)] lg:grid-cols-6">
      {list.map((s) => {
              return (
          <StaggerItem as="li" key={s.id} className={cn(LAYOUT[s.bentoSize] ?? LAYOUT.small, "md:max-lg:odd:last:col-span-2")}>
            <TiltCard className="h-full rounded-2xl border border-border bg-card transition-colors duration-(--dur-fast) hover:border-border-strong has-focus-visible:ring-2 has-focus-visible:ring-ring">
              <div className="relative z-10 flex h-full flex-col gap-5 p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-soft text-brand-ink">
                    <ServiceIcon name={s.icon} className="size-6" aria-hidden="true" />
                  </span>
                  <span className="tabular font-heading text-sm text-muted-foreground">{String(s.order + 1).padStart(3, "0")}</span>
                </div>
                <Art service={s} />
                <div className="mt-auto">
                  <h3 className="font-heading text-xl font-semibold">
                    <Link href={`/hizmetler#${s.slug}`} className="outline-none after:absolute after:inset-0">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{s.summary}</p>
                </div>
                <ArrowUpRightIcon
                  className="absolute top-6 right-16 size-5 text-muted-foreground opacity-0 transition-all duration-(--dur-fast) group-hover/tilt:opacity-100 group-hover/tilt:text-brand-ink"
                  aria-hidden="true"
                />
              </div>
            </TiltCard>
          </StaggerItem>
        )
      })}
    </Stagger>
  )
}
