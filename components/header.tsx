"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu, X, Home, Info, Layers, Mail } from "lucide-react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
  }

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ""

    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="tech-border sticky top-0 z-50 border-b border-tech-blue/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src="/bai-logo.png"
                alt="BAI TECHNOLOGY"
                width={48}
                height={48}
                className="logo-glow animate-logo-pulse"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white neon-text notranslate">BAI TECHNOLOGY</h1>
              <p className="text-xs text-tech-cyan notranslate">AI Solutions for Business</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick("#home")}
              className="text-gray-300 hover:text-neon-blue font-medium transition-all duration-300 hover:glow relative group"
            >
              Ana Sayfa
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleNavClick("#about")}
              className="text-gray-300 hover:text-neon-blue font-medium transition-all duration-300 hover:glow relative group"
            >
              Hakkımızda
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleNavClick("#services")}
              className="text-gray-300 hover:text-neon-blue font-medium transition-all duration-300 hover:glow relative group"
            >
              Hizmetler
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => handleNavClick("#contact")}
              className="text-gray-300 hover:text-neon-blue font-medium transition-all duration-300 hover:glow relative group"
            >
              İletişim
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all duration-300 group-hover:w-full"></span>
            </button>
          </nav>

          {/* Contact Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <button
            onClick={() => handleNavClick("#contact")}
            className="hidden sm:block bg-gradient-to-r from-tech-blue to-tech-purple hover:from-neon-blue hover:to-neon-purple text-white px-6 py-2 rounded-2xl transition-all duration-300 cyber-glow font-semibold"
            >
            İletişime Geç
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-tech-blue/20 transition-colors"
            >
              <Menu className="h-6 w-6 text-neon-blue" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu-backdrop ${isMobileMenuOpen ? "open" : ""}`} onClick={toggleMobileMenu}></div>
      <div className={`mobile-menu-panel ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-tech-blue/30">
          <span className="text-lg font-semibold text-neon-blue">Menu</span>
          <button onClick={toggleMobileMenu} className="p-2 rounded-lg hover:bg-tech-blue/20 transition-colors">
            <X className="h-6 w-6 text-neon-blue" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => handleNavClick("#home")} className="mobile-menu-item">
            <span className="mobile-menu-icon">
              <Home size={20} />
            </span>
            Ana Sayfa
          </button>
          <button onClick={() => handleNavClick("#about")} className="mobile-menu-item">
            <span className="mobile-menu-icon">
              <Info size={20} />
            </span>
            Hakkımızda
          </button>
          <button onClick={() => handleNavClick("#services")} className="mobile-menu-item">
            <span className="mobile-menu-icon">
              <Layers size={20} />
            </span>
            Hizmetler
          </button>
          <button onClick={() => handleNavClick("#contact")} className="mobile-menu-item">
            <span className="mobile-menu-icon">
              <Mail size={20} />
            </span>
            İletişim
          </button>
        </nav>
      </div>
    </header>
  )
}
