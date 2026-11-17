"use client"

/**
 * BAI v2 hareket kütüphanesi (Framer Motion).
 * Kurallar: MASTER.md › "BAI Marka Uyarlaması — v2 › Motion"
 *  - Geçişler tek eğri (EASE) + 150/200/300 ms, liste/kelime gecikmesi 40 ms
 *  - Scroll'a bağlı efektler süresiz (scrub), işaretçiye bağlı efektler spring yumuşatma
 *  - useReducedMotion() → her bileşen statik, son halinde render edilir
 */
import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/use-media"
import { EASE } from "@/lib/motion"

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }

/** *vurgu* aralıklarını (tek veya çok kelime) işaretler */
function markHighlights(words, extra = []) {
  const flags = []
  let open = false
  words.forEach((w, i) => {
    if (w.startsWith("*")) open = true
    flags.push(open || extra.includes(i))
    if (/\*[.,!?:;]*$/.test(w)) open = false
  })
  return flags
}

/* ------------------------------------------------------------------ */
/* Kelime kelime başlık — her kelime maskeli satırdan yukarı kayar      */
/* ------------------------------------------------------------------ */
/** @param {any} props */
export function SplitText({ text, as: Tag = "h1", className, delay = 0, highlight = [] }) {
  // CSS animasyonu: hidrasyon beklemeden ilk boyamada oynar (LCP gecikmez);
  // reduced-motion'da --dur-slow 0ms → anında son hal.
  // Vurgu konvansiyonu: *kelime* → degrade (panelden girilen başlıklar)
  const raw = (text ?? "").split(" ").filter(Boolean)
  const highlighted = markHighlights(raw, highlight)
  const words = raw.map((w) => w.replace(/\*/g, ""))
  const plain = words.join(" ")
  return (
    <Tag className={className} aria-label={plain}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span
            className={cn(
              "inline-block animate-in slide-in-from-bottom duration-(--dur-slow) ease-standard fill-mode-both",
              highlighted[i] && "text-gradient"
            )}
            style={{ animationDelay: `calc(${delay * 1000}ms + ${i} * var(--stagger))` }}
          >
            {w}
            {i < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/* Scroll'la aydınlanan paragraf (kelime başına opaklık, scrub)         */
/* ------------------------------------------------------------------ */
/** @param {any} props */
function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span data-reveal="" style={{ opacity }} className="inline">
      {children}
    </motion.span>
  )
}
/** @param {any} props */
export function ScrollRevealText({ text, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] })
  const words = text.split(" ")
  // ref her durumda bağlı: useScroll hedefi hidrasyon anında hazır olmalı
  return (
    <p ref={ref} className={className}>
      {reduce ? text : words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}{" "}
        </Word>
      ))}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Mıknatıslı sarmalayıcı — CTA imleci hafifçe takip eder                */
/* ------------------------------------------------------------------ */
/** @param {any} props */
export function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)
  if (reduce) return <span className={cn("inline-flex", className)}>{children}</span>
  return (
    <motion.span
      ref={ref}
      className={cn("inline-flex", className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ */
/* Eğimli kart + imleci takip eden spotlight                            */
/* ------------------------------------------------------------------ */
/** @param {any} props */
export function TiltCard({ children, className, max = 6, ...rest }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  // Spotlight: sabit degrade katmanı transform ile taşınır (her karede background
  // yeniden boyanmaz → yalnızca compositor). Kart ölçüsü pointerenter'da bir kez okunur.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(0, SPRING)
  const ry = useSpring(0, SPRING)
  const rect = useRef(null)

  return (
    <motion.div
      ref={ref}
      className={cn("group/tilt relative isolate [transform-style:preserve-3d]", className)}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerEnter={(e) => {
        if (reduce || e.pointerType !== "mouse") return
        // Eğim uygulanmadan önceki düz ölçü; kaydırmada sayfa ofseti değişir, sonraki girişte tazelenir
        rect.current = ref.current.getBoundingClientRect()
      }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return
        const r = rect.current ?? (rect.current = ref.current.getBoundingClientRect())
        const lx = e.clientX - r.left
        const ly = e.clientY - r.top
        mx.set(lx)
        my.set(ly)
        ry.set((lx / r.width - 0.5) * max * 2)
        rx.set(-(ly / r.height - 0.5) * max * 2)
      }}
      onPointerLeave={() => {
        rect.current = null
        rx.set(0)
        ry.set(0)
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 overflow-hidden rounded-[inherit] opacity-0 transition-opacity duration-(--dur-base) group-hover/tilt:opacity-100"
      >
        {reduce ? null : (
          <motion.div
            className="absolute top-0 left-0 -mt-[420px] -ml-[420px] size-[840px] group-hover/tilt:will-change-transform bg-[radial-gradient(circle_closest-side,var(--glow),transparent_60%)]"
            style={{ x: mx, y: my }}
          />
        )}
      </div>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Sayaç — görünür olunca 0'dan hedefe                                  */
/* ------------------------------------------------------------------ */
/** @param {any} props */
export function CountUp({ to, className, duration = 1.2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" })
  const reduce = useReducedMotion()
  const [val, setVal] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration, ease: EASE, onUpdate: (v) => setVal(Math.round(v)) })
    return () => c.stop()
  }, [inView, reduce, to, duration])
  return (
    <span ref={ref} className={cn("tabular", className)}>
      {reduce ? to : val}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Üst kaydırma ilerleme çubuğu                                         */
/* ------------------------------------------------------------------ */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-brand"
      style={{ scaleX }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Parallax katmanı (en fazla ±60px)                                    */
/* ------------------------------------------------------------------ */
/** @param {any} props */
export function Parallax({ children, offset = 60, className }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* İmleci yumuşak takip eden arka plan ışıması (hero)                   */
/* ------------------------------------------------------------------ */
/** @param {any} props */
export function CursorGlow({ className }) {
  const reduce = useReducedMotion()
  const box = useRef(null)
  // Konum px cinsinden; 1200px'lik sabit degrade katmanı transform ile taşınır
  // (eskiden tüm hero'nun background'u her pointermove'da yeniden boyanıyordu).
  const x = useSpring(0, { stiffness: 60, damping: 20 })
  const y = useSpring(0, { stiffness: 60, damping: 20 })
  useEffect(() => {
    if (reduce || !box.current) return
    const el = box.current
    let size = { w: el.clientWidth, h: el.clientHeight }
    const onResize = () => (size = { w: el.clientWidth, h: el.clientHeight })
    // Dinlenme noktası (%50, %30) CSS'te; spring'ler o noktadan sapmayı taşır → SSR'da da doğru yerde
    const on = (e) => {
      if (e.pointerType !== "mouse") return
      x.set((e.clientX / window.innerWidth - 0.5) * size.w)
      y.set((e.clientY / window.innerHeight - 0.3) * size.h)
    }
    window.addEventListener("pointermove", on, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("pointermove", on)
      window.removeEventListener("resize", onResize)
    }
  }, [reduce, x, y])
  return (
    <div ref={box} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {reduce ? (
        <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_70%_30%,var(--glow),transparent_65%)]" />
      ) : (
        <motion.div
          className="absolute top-[30%] left-1/2 -mt-[600px] -ml-[600px] size-[1200px] will-change-transform bg-[radial-gradient(circle_closest-side,var(--glow),transparent_65%)]"
          style={{ x, y }}
        />
      )}
    </div>
  )
}
