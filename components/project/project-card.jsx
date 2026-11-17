"use client"

import { motion } from "framer-motion"
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import { TiltCard } from "@/components/motion/fx"
import StatusBadge from "@/components/origin/comp-421"
import { BrowserFrame, PhoneFrame } from "@/components/project/device-frame"
import { EASE } from "@/lib/motion"
import { statusLabel, statusTone } from "@/lib/project-ui"
import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

/** ChatEKG'nin arayüz görseli yok (rapor §10) — veri temalı çizgi animasyonu, görünür olunca bir kez. */
function EcgArt() {
  const reduce = useReducedMotion()
  const d =
    "M0 70 H70 L82 70 L92 30 L104 112 L116 52 L126 70 H200 L212 70 L222 30 L234 112 L246 52 L256 70 H340 L352 70 L362 30 L374 112 L386 52 L396 70 H480"
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-6">
      <svg viewBox="0 0 480 140" className="w-full" aria-hidden="true">
        <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth="2" />
        <motion.path
          d={d}
          fill="none"
          stroke="var(--brand)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{ filter: "drop-shadow(0 0 8px var(--glow-strong))" }}
        />
      </svg>
      <span className="text-sm text-muted-foreground">Arayüz görseli henüz yok</span>
    </div>
  )
}

/** @param {any} props */
function Cover({ project }) {
  const tab = project.gallery?.[0]
  const imgs = tab?.images ?? []
  if (!imgs.length) return <EcgArt />
  if (tab.device === "mobile") {
    return (
      <div className="flex h-full items-start justify-center gap-4 px-8 pt-8">
        {imgs.slice(0, 3).map((im, i) => (
          <PhoneFrame
            key={im.public_id}
            src={im.public_id}
            alt={im.alt ?? ""}
            sizes="160px"
            className={cn(
              "w-[30%] transition-transform duration-(--dur-slow) ease-standard",
              i === 1 && "translate-y-6 group-hover/tilt:-translate-y-1",
              i !== 1 && "translate-y-12 group-hover/tilt:translate-y-8"
            )}
          />
        ))}
      </div>
    )
  }
  return (
    <div className="flex h-full items-start px-8 pt-8">
      <BrowserFrame
        src={imgs[0].public_id}
        alt={imgs[0].alt ?? ""}
        w={imgs[0].width}
        h={imgs[0].height}
        sizes="480px"
        className="w-full translate-y-4 transition-transform duration-(--dur-slow) ease-standard group-hover/tilt:-translate-y-1"
      />
    </div>
  )
}

/**
 * Proje kartı v2 — eğim + spotlight (TiltCard), kapak içeriği hover'da hafifçe yükselir.
 * Kartın tamamı tek link; odakta halka.
 */
/** @param {any} props */
export function ProjectCard({ project, headingAs: H = "h3", className, tall = false }) {
  return (
    <TiltCard
      className={cn(
        "h-full overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-(--dur-fast) hover:border-border-strong has-focus-visible:ring-2 has-focus-visible:ring-ring",
        className
      )}
    >
      <div className={cn("relative z-10 overflow-hidden border-b border-border bg-[linear-gradient(180deg,var(--band),var(--card))]", tall ? "aspect-[4/3.4]" : "aspect-[16/11]")}>
        <Cover project={project} />
      </div>
      <div className="relative z-10 flex flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{project.category}</span>
          {statusLabel(project) ? <StatusBadge tone={statusTone(project)}>{statusLabel(project)}</StatusBadge> : null}
        </div>
        <div className="flex items-start justify-between gap-4">
          <H className="font-heading text-2xl font-semibold tracking-tight">
            <Link href={`/projeler/${project.slug}`} className="outline-none after:absolute after:inset-0 after:z-20">
              {project.title}
            </Link>
          </H>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border transition-colors duration-(--dur-fast) group-hover/tilt:border-brand group-hover/tilt:bg-brand group-hover/tilt:text-brand-foreground">
            <ArrowUpRightIcon className="size-5" aria-hidden="true" />
          </span>
        </div>
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{project.subtitle}</p>
        {project.tech?.length ? <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground">{project.tech.join(" · ")}</p> : null}
      </div>
    </TiltCard>
  )
}
