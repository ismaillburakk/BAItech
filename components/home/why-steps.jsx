"use client"

/**
 * "Neden BAI" — sol başlık yapışkan, sağda adımlar; dikey çizgi kaydırmayla dolar,
 * her adım görünür alanın ortasına gelince aydınlanır (scrub). Reduced-motion: tümü aydınlık.
 */
import { motion, useScroll, useTransform } from "framer-motion"
import { useReducedMotion } from "@/lib/use-media"
import { useRef } from "react"

/** @param {any} props */
function Step({ index, total, text, progress, reduce }) {
  const start = index / total
  const opacity = useTransform(progress, [start - 0.1, start + 0.05], [0.25, 1])
  const x = useTransform(progress, [start - 0.1, start + 0.05], [16, 0])
  return (
    <motion.li style={reduce ? undefined : { opacity, x }} className="relative py-10 pl-12">
      <span className="tabular absolute top-11 left-0 font-heading text-sm text-brand-ink">{String(index + 1).padStart(2, "0")}</span>
      <p className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-medium leading-tight">{text}</p>
    </motion.li>
  )
}

/** @param {any} props */
export function WhySteps({ heading, items }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] })
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
      <div className="lg:sticky lg:top-32 lg:self-start">{heading}</div>
      <div ref={ref} className="relative">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-[0.6rem] w-px bg-border" />
        <motion.div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[0.6rem] w-px origin-top bg-brand"
          style={reduce ? undefined : { scaleY: scrollYProgress }}
        />
        <ol>
          {items.map((t, i) => (
            <Step key={t} index={i} total={items.length} text={t} progress={scrollYProgress} reduce={reduce} />
          ))}
        </ol>
      </div>
    </div>
  )
}
