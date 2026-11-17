"use client"

import { motion } from "framer-motion"

import { useReducedMotion } from "@/lib/use-media"
import { reveal, staggerChild, staggerParent } from "@/lib/motion"

// Hareketi azalt: öğe türü aynı kalır, doğrudan son haline geçer (geçiş süresi 0)
const SHOWN = { opacity: 1, y: 0 }
const INSTANT = { duration: 0 }

/**
 * Bölüm girişi (300 ms, y 12px, tek eğri). Görünür alana bir kez girince oynar.
 * Hareketi azalt açıksa animasyon yok — içerik doğrudan son halinde.
 * data-reveal: <noscript> stili JS kapalıyken içeriği görünür yapar (SEO/no-JS).
 */
/** @param {any} props */
export function Reveal({ as = "div", children, className, delay = 0, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div
  // Hareketi azalt: aynı öğe, animasyonsuz ve doğrudan son halinde. Öğe türü değiştirilmez —
  // sunucu HTML'i gizli başlangıç stiliyle (opacity 0) gelir; farklı bir öğeyle hidrasyon bu stili
  // temizlemediği için içerik görünmez kalıyordu.
  if (reduce) {
    return (
      <Tag data-reveal="" className={className} initial={false} animate={SHOWN} transition={INSTANT} {...rest}>
        {children}
      </Tag>
    )
  }
  return (
    <Tag
      data-reveal=""
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={delay ? { ...reveal.show.transition, delay } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Liste/ızgara: çocuklar arası 40 ms gecikme. */
/** @param {any} props */
export function Stagger({ as = "div", children, className, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div
  if (reduce) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }
  return (
    <Tag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** @param {any} props */
export function StaggerItem({ as = "div", children, className, ...rest }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] ?? motion.div
  if (reduce) {
    return (
      <Tag data-reveal="" className={className} initial={false} animate={SHOWN} transition={INSTANT} {...rest}>
        {children}
      </Tag>
    )
  }
  return (
    <Tag data-reveal="" className={className} variants={staggerChild} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Katlamanın üstü (hero, sayfa başlığı) için JS beklemeyen giriş: aynı token'lar
 * (300 ms, y 12px, tek eğri) CSS ile. Hidrasyonu beklemediği için LCP'yi geciktirmez;
 * reduced-motion'da --dur-slow 0ms olduğundan anında son halde.
 */
export const enterClass =
  "animate-in fade-in slide-in-from-bottom-3 duration-(--dur-slow) ease-standard fill-mode-both"
