"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

/** Basit media query kancası — SSR'da `fallback` döner. */
export function useMedia(query, fallback = false) {
  const [match, setMatch] = useState(fallback)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener("change", on)
    return () => m.removeEventListener("change", on)
  }, [query])
  return match
}

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)"
function subscribeReduce(onChange) {
  const m = window.matchMedia(REDUCE_QUERY)
  m.addEventListener("change", onChange)
  return () => m.removeEventListener("change", onChange)
}

/**
 * "Hareketi azalt" tercihi — hidrasyon güvenli.
 * Framer'ın `useReducedMotion`ı istemcide ilk render'da gerçek değeri döndürür; sunucu HTML'i ise
 * tercihi bilmeden (hareketli dal) üretildiği için bu tercih açıkken ağaç uyuşmaz ve React
 * hidrasyon hatası (#418) verir. Bu kanca hidrasyon sırasında sunucuyla aynı değeri (false)
 * döndürür, hemen ardından gerçek değerle yeniden render eder: uyuşmazlık olmaz, statik görünüm
 * ilk boyamadan önce gelir.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false
  )
}
