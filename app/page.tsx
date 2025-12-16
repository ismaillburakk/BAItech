"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { NeuralNetwork } from "@/components/neural-network"
import { BackgroundElements } from "@/components/background-elements"
import { StructuredData } from "@/components/structured-data"

export default function Home() {
  return (
    <div className="relative z-10">
      <StructuredData />

      <NeuralNetwork />
      <BackgroundElements />

      <div className="relative z-10">
        <Header />
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  )
}
