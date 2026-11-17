// Framer Motion token'ları — app/tokens.css'teki --dur-* / --ease-standard / --stagger
// ile birebir aynı değerler. Kural kaynağı: MASTER.md "BAI Marka Uyarlaması › Motion".
//
//  · 150 ms  hover / renk / basma geri bildirimi
//  · 200 ms  akordeon, sekme, menü, çıkış animasyonları
//  · 300 ms  bölüm girişi (reveal), dialog açılışı
//  · Tek geçiş eğrisi: cubic-bezier(0.2, 0, 0, 1)
//  · Liste öğeleri arası 40 ms gecikme
//  · prefers-reduced-motion: <MotionConfig reducedMotion="user"> (providers.jsx)
//    transform'ları kapatır; Reveal bileşenleri ayrıca son halde render edilir.

export const EASE = [0.2, 0, 0, 1]
export const DUR = { fast: 0.15, base: 0.2, slow: 0.3 }
export const STAGGER = 0.04

export const transition = {
  fast: { duration: DUR.fast, ease: EASE },
  base: { duration: DUR.base, ease: EASE },
  slow: { duration: DUR.slow, ease: EASE },
}

// Bölüm girişi: skill "Scroll Reveal (Subtle)" değerleri — y 12px, yalnız opacity+transform.
export const reveal = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: transition.slow },
}

export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
}

export const staggerChild = reveal
