"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { NeuralNetwork } from "@/components/neural-network"
import { BackgroundElements } from "@/components/background-elements"

export default function Home() {
  return (
    <div className="relative z-10">
      <NeuralNetwork />
      <BackgroundElements />

      {/* GTranslate widget artık Header komponenti içinde yönetiliyor, buradan kaldırıldı */}

      <div className="relative z-10">
        <Header />
        <HeroSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  )
}
