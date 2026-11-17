"use client"

/**
 * Origin UI comp-577 — "navbar, navigation"
 * Kaynak: https://coss.com/origin/r/comp-577.json (@origin/comp-577)
 * BAI v2 uyarlaması: sabit, üstte şeffaf → kaydırınca cam (blur) zemin; aşağı kaydırınca
 * gizlenir, yukarı kaydırınca geri gelir; aktif sayfa göstergesi layoutId ile kayar;
 * mobilde Origin'in animasyonlu hamburger + Popover menüsü. Birincil CTA mıknatıslı.
 * Kurallar: MASTER v2 (Motion-Driven), anasayfa.md (tek birincil CTA), skill
 * nav-state-active, skip-links, focus-not-obscured (odakta header geri gelir).
 */
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"

import { Magnetic } from "@/components/motion/fx"
import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { transition } from "@/lib/motion"
import { NAV as nav } from "@/lib/nav"
import { useReducedMotion } from "@/lib/use-media"
import { cn } from "@/lib/utils"

function isActive(pathname, href) {
  if (href === "/") return pathname === "/"
  return pathname.startsWith(href.replace(/\/$/, ""))
}

/** @param {any} props */
export default function SiteHeader({ ctaLabel = "Ücretsiz Danışmanlık", logo = null, brandName = "BAI Technology" }) {
  const pathname = usePathname() || "/"
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hover, setHover] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Sayfa değişince mobil menüyü kapat (render sırasında state uyarlama deseni)
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setMenuOpen(false)
  }

  // Durum yalnızca eşik geçilince güncellenir (her scroll karesinde setState yok)
  const flags = useRef({ scrolled: false, hidden: false })
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0
    const nextScrolled = y > 12
    let nextHidden = flags.current.hidden
    if (!reduce && y > 400 && y > prev + 4) nextHidden = true
    else if (y < prev - 4 || y <= 400 || reduce) nextHidden = false
    if (nextScrolled !== flags.current.scrolled) {
      flags.current.scrolled = nextScrolled
      setScrolled(nextScrolled)
    }
    if (nextHidden !== flags.current.hidden) {
      flags.current.hidden = nextHidden
      setHidden(nextHidden)
    }
  })

  const links = nav.map((l) => ({ ...l, active: isActive(pathname, l.href) }))
  const indicator = hover ?? links.find((l) => l.active)?.href

  return (
    <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-(--dur-base) ease-standard",
        scrolled ? "glass border-border" : "border-transparent bg-transparent"
      )}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={transition.slow}
      onFocusCapture={() => {
        flags.current.hidden = false
        setHidden(false)
      }}
    >
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        İçeriğe geç
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* modal: odak menü içinde kalır (focus trap), arka plan kaydırması kilitlenir */}
          <Popover modal open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button className="group md:hidden" size="icon" variant="ghost" aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}>
                <svg className="pointer-events-none" fill="none" height={18} width={18} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path className="-translate-y-[7px] origin-center transition-all duration-(--dur-slow) ease-standard group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315" d="M4 12L20 12" />
                  <path className="origin-center transition-all duration-(--dur-slow) ease-standard group-aria-expanded:rotate-45" d="M4 12H20" />
                  <path className="origin-center translate-y-[7px] transition-all duration-(--dur-slow) ease-standard group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135" d="M4 12H20" />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(18rem,calc(100vw-2rem))] p-2 md:hidden">
              <nav aria-label="Ana menü (mobil)">
                <ul className="grid gap-1">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={link.active ? "page" : undefined}
                        className={cn(
                          "flex min-h-11 items-center rounded-md px-3 text-base hover:bg-accent",
                          link.active && "bg-accent text-brand-ink"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-2 w-full">
                  <Link href="/iletisim" onClick={() => setMenuOpen(false)}>{ctaLabel}</Link>
                </Button>
              </nav>
            </PopoverContent>
          </Popover>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-md" aria-label={`${brandName} — Ana Sayfa`}>
            <Logo logo={logo} />
          </Link>
        </div>

        <nav aria-label="Ana menü" className="max-md:hidden">
          <ul
            className="flex items-center gap-1 rounded-full border border-border bg-card/60 p-1"
            onPointerLeave={() => setHover(null)}
          >
            {links.map((link) => (
              <li key={link.href} className="relative">
                {indicator === link.href ? (
                  <motion.span
                    layoutId="nav-pill"
                    className={cn("absolute inset-0 rounded-full", link.active && !hover ? "bg-secondary" : "bg-accent")}
                    transition={transition.base}
                  />
                ) : null}
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  onPointerEnter={() => setHover(link.href)}
                  className={cn(
                    "relative z-10 inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors duration-(--dur-fast) hover:text-foreground",
                    link.active && "text-foreground"
                  )}
                >
                  {link.active ? <span aria-hidden="true" className="mr-2 size-1.5 rounded-full bg-brand" /> : null}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Magnetic className="max-sm:hidden md:max-lg:hidden">
          <Button asChild size="sm" className="h-11 rounded-full px-5">
            <Link href="/iletisim">
              {ctaLabel}
              <ArrowUpRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
        </Magnetic>
        <span className="sm:hidden" />
      </div>
    </motion.header>
  )
}
