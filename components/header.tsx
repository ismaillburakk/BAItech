"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
  { href: "#home", label: "Ana Sayfa" },
  { href: "#services", label: "Hizmetler" },
  { href: "#projects", label: "Projeler" },
  { href: "#about", label: "Hakkımızda" },
  { href: "#contact", label: "İletişim" },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur transition-colors ${
          scrolled ? "border-b border-rule bg-bg/85" : "border-b border-transparent bg-bg/70"
        }`}
      >
        <div className="wrap flex h-16 items-center justify-between md:h-20">
          {/* Brand */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-3 text-left"
            aria-label="Ana sayfaya git"
          >
            <span className="relative inline-flex h-9 w-9 items-center justify-center md:h-10 md:w-10">
              <Image
                src="/bai-logo.png"
                alt="BAI Technology"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </span>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="notranslate font-serif text-[17px] tracking-tight text-ink">
                BAI Technology
              </span>
              <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
                AI Solutions for Business
              </span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Ana navigasyon">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="group relative text-[14px] text-ink-2 transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <button
              onClick={() => handleNavClick("#contact")}
              className="hidden rounded-pill bg-ink px-4 py-2 text-[13px] font-medium text-bg transition-transform hover:-translate-y-px sm:inline-flex"
              aria-label="İletişime geç"
            >
              İletişime Geç →
            </button>
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-rule text-ink md:hidden"
              aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mounted &&
        isMobileMenuOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[60] flex flex-col bg-bg md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobil navigasyon"
          >
            {/* Replicated top bar so it's clear the menu owns the viewport */}
            <div className="wrap flex h-16 items-center justify-between border-b border-rule">
              <button
                onClick={() => handleNavClick("#home")}
                className="flex items-center gap-3"
                aria-label="Ana sayfaya git"
              >
                <Image
                  src="/bai-logo.png"
                  alt="BAI Technology"
                  width={36}
                  height={36}
                  className="object-contain"
                />
                <span className="notranslate font-serif text-[16px] tracking-tight text-ink">
                  BAI Technology
                </span>
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-rule text-ink"
                aria-label="Menüyü kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav
              className="wrap flex-1 overflow-y-auto py-6"
              aria-label="Mobil ana menü"
            >
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="flex w-full items-center justify-between border-b border-rule-2 py-5 text-left"
                    >
                      <span className="font-serif text-2xl text-ink">{item.label}</span>
                      <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-center justify-between">
                <ThemeToggle />
                <button
                  onClick={() => handleNavClick("#contact")}
                  className="rounded-pill bg-ink px-5 py-2.5 text-sm font-medium text-bg"
                >
                  İletişime Geç →
                </button>
              </div>
            </nav>
          </div>,
          document.body
        )}
    </>
  )
}
