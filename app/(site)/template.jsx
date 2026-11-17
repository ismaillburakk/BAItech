import { enterClass } from "@/components/motion/reveal"

/**
 * Sayfa geçişi: App Router template her rota değişiminde yeniden mount olur.
 * CSS giriş animasyonu (300 ms, y 12px, tek eğri) — hidrasyon beklemez, reduced-motion'da 0 ms.
 */
export default function Template({ children }) {
  return <div className={enterClass}>{children}</div>
}
