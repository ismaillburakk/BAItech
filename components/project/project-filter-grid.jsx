"use client"

/**
 * Projeler bento ızgarası + filtre — projeler.md v2.
 * Filtre: seçili sekmenin arka planı layoutId ile kayar (200 ms); kartlar layout
 * animasyonuyla yeniden dizilir, girişte 40 ms gecikme. Bento: ilk ve dördüncü kart geniş.
 */
import { AnimatePresence, LayoutGroup, motion } from "framer-motion"
import { useMemo, useState } from "react"

import { ProjectCard } from "@/components/project/project-card"
import { STAGGER, transition } from "@/lib/motion"
import { cn } from "@/lib/utils"

const FILTERS = [
  { key: "all", label: "Tümü", test: () => true },
  { key: "mobile", label: "Mobil", test: (p) => p.platforms?.includes("ios") || p.platforms?.includes("android") },
  { key: "web", label: "Web", test: (p) => p.platforms?.includes("web") },
  { key: "ai", label: "Yapay Zeka", test: (p) => p.isAI === true },
]

/** @param {any} props */
export function ProjectFilterGrid({ projects }) {
  const [active, setActive] = useState("all")
  const list = useMemo(() => projects.filter(FILTERS.find((f) => f.key === active).test), [active, projects])

  return (
    <LayoutGroup>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Projeleri filtrele" className="flex flex-wrap gap-1 rounded-full border border-border bg-card/60 p-1">
          {FILTERS.map((f) => {
            const on = f.key === active
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(f.key)}
                className={cn(
                  "relative inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors duration-(--dur-fast)",
                  on ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {on ? <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-brand" transition={transition.base} /> : null}
                <span className="relative">{f.label}</span>
                <span className={cn("tabular relative text-xs", on ? "opacity-80" : "text-muted-foreground")}>
                  {projects.filter(f.test).length}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {list.length} proje gösteriliyor
        </p>
      </div>

      <motion.ul layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              className={cn(active === "all" && (i === 0 || i === 3) && "lg:col-span-2")}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { ...transition.slow, delay: i * STAGGER } }}
              exit={{ opacity: 0, scale: 0.97, transition: transition.base }}
              transition={transition.slow}
            >
              <ProjectCard project={p} headingAs="h2" tall={!(active === "all" && (i === 0 || i === 3))} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  )
}
