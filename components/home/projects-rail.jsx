"use client"

/**
 * Projeler pinli yatay şerit — anasayfa.md v2 "Yolculuk".
 * Masaüstünde bölüm pinlenir, dikey kaydırma kartları yatay taşır (scrub; kaydırma hızı
 * değişmez, scroll-jacking yok). Mobilde, reduced-motion'da ve JS kapalıyken normal ızgara.
 *
 * Tek DOM ağacı: ızgara ↔ şerit yalnızca sınıf değiştirir. Böylece `useScroll`un hedef
 * ref'i ilk boyamada (hidrasyon öncesi) zaten bağlıdır — eskiden ızgara dalında ref yoktu,
 * Framer "Target ref is defined but not hydrated" uyarısı verip ilerlemeyi bölüme değil
 * tüm sayfaya bağlıyordu ve şerit kaymıyordu. Kartlar da modlar arasında yeniden mount olmaz.
 */
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"

import { ProjectCard } from "@/components/project/project-card"
import { cn } from "@/lib/utils"
import { useMedia, useReducedMotion } from "@/lib/use-media"

const START = 0.05
const END = 0.95

/** @param {number} p */
function phase(p) {
  return Math.min(1, Math.max(0, (p - START) / (END - START)))
}

/** @param {any} props */
export function ProjectsRail({ projects, header }) {
  const reduce = useReducedMotion()
  const desktop = useMedia("(min-width: 1024px)")
  const pinned = desktop && !reduce
  const outer = useRef(null)
  const track = useRef(null)
  // Kayma mesafesi motion value'da: ölçüm değişince React yeniden render etmez,
  // transform bir sonraki karede yeni mesafeyle hesaplanır.
  const dist = useMotionValue(0)

  useEffect(() => {
    if (!pinned || !track.current || !outer.current) {
      dist.set(0)
      if (outer.current) outer.current.style.height = ""
      return
    }
    const el = track.current
    const box = outer.current
    const measure = () => {
      const d = Math.max(0, el.scrollWidth - window.innerWidth + 64)
      dist.set(d)
      box.style.height = `calc(100vh + ${d}px)`
    }
    measure()
    // Kart görselleri/yazı tipleri yüklenince genişlik değişebilir
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      box.style.height = ""
    }
  }, [pinned, dist])

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] })
  const x = useTransform(() => -phase(scrollYProgress.get()) * dist.get())
  const bar = useTransform(scrollYProgress, [START, END], [0, 1])

  return (
    <div ref={outer} className="relative">
      <div className={cn(pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-24")}>
        <div className="container-site">{header}</div>
        <div className={pinned ? undefined : "container-site"}>
          <motion.ul
            ref={track}
            style={pinned ? { x } : undefined}
            className={cn(
              "mt-12",
              pinned
                ? "flex w-max gap-6 pr-8 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] will-change-transform"
                : "grid gap-6 md:grid-cols-2"
            )}
          >
            {projects.map((p) => (
              <li key={p.slug} className={pinned ? "w-[clamp(20rem,32vw,28rem)] shrink-0" : undefined}>
                <ProjectCard project={p} />
              </li>
            ))}
          </motion.ul>
        </div>
        {pinned ? (
          <div className="container-site mt-10">
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-border">
              <motion.div className="h-full origin-left bg-brand" style={{ scaleX: bar }} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
