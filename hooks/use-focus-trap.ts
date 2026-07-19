"use client"

import { useEffect, useRef } from "react"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Modal/overlay erişilebilirliği: açıkken odağı kap içinde döndürür (Tab/Shift+Tab),
 * Escape ile kapatır, kapanınca odağı tetikleyen öğeye iade eder.
 * `onClose` stabil (useCallback'li) olmalı; aksi halde her render'da yeniden kurulur.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean, onClose: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!active) return
    const container = ref.current
    if (!container) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0
      )
    focusables()[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== "Tab") return
      const els = focusables()
      if (!els.length) return
      const first = els[0]
      const last = els[els.length - 1]
      const current = document.activeElement
      if (e.shiftKey && (current === first || !container.contains(current))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (current === last || !container.contains(current))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [active, onClose])

  return ref
}
