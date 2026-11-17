"use client"

import { CountUp } from "@/components/motion/fx"
import { Stagger, StaggerItem } from "@/components/motion/reveal"

/** Sayılarla — tüm değerler mevcut veriden türetilir (uydurma istatistik yok). */
/** @param {any} props */
export function Stats({ items }) {
  return (
    <Stagger as="dl" className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
      {items.map((s) => (
        <StaggerItem key={s.label} className="bg-background p-6 md:p-8">
          <dd className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-tight">
            {typeof s.value === "number" ? <CountUp to={s.value} /> : s.value}
            {s.suffix ? <span className="text-brand-ink">{s.suffix}</span> : null}
          </dd>
          <dt className="mt-3 text-sm leading-snug text-muted-foreground">{s.label}</dt>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
