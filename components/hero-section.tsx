"use client"

import Image from "next/image"
import { Zap, ArrowRight, PlayCircle, Cpu, Brain, Network, Database } from "lucide-react"

export function HeroSection() {
  const handleContactClick = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleExploreClick = () => {
    const element = document.querySelector("#services")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Parallax Background */}
      <div className="parallax-bg absolute inset-0 bg-gradient-to-br from-tech-blue/5 via-tech-purple/5 to-tech-cyan/5"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <span className="inline-block tech-border px-4 py-2 rounded-full text-sm font-medium text-neon-blue border-neon-blue/50 cyber-glow">
                <Zap className="inline h-4 w-4 mr-2" />
                Teknoloji & İnovasyon
              </span>
              <h1 className="text-4xl lg:text-7xl font-bold text-white leading-tight">
                Geleceği{" "}
                <span className="text-transparent bg-gradient-to-r from-logo-orange to-logo-gold bg-clip-text">
                  Teknoloji
                </span>
                <br />
                ile Şekillendiriyoruz
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                BAI TECHNOLOGY olarak, en son teknolojilerle işletmenizi dijital dönüşüm yolculuğunda destekliyoruz.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContactClick}
                className="bg-gradient-to-r from-logo-orange to-logo-gold hover:from-logo-gold hover:to-logo-orange text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 cyber-glow flex items-center justify-center group"
              >
                Ücretsiz Danışmanlık
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={handleExploreClick}
                className="tech-border border-neon-purple text-neon-purple hover:bg-neon-purple/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Çözümlerimizi Keşfedin
              </button>
            </div>
          </div>

          {/* Enhanced Hero Tech Visual with Logo */}
          <div className="relative animate-fade-in-up">
            <div className="relative">
              {/* Animated Rings with Neural Network Integration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-80 h-80 border border-neon-blue/20 rounded-full animate-spin"
                  style={{ animationDuration: "20s" }}
                ></div>
                <div
                  className="absolute w-60 h-60 border border-logo-orange/30 rounded-full animate-spin"
                  style={{ animationDuration: "15s", animationDirection: "reverse" }}
                ></div>
                <div
                  className="absolute w-40 h-40 border border-tech-cyan/20 rounded-full animate-spin"
                  style={{ animationDuration: "10s" }}
                ></div>
              </div>

              {/* Center Logo with Enhanced Glow */}
              <div className="relative z-10 flex items-center justify-center h-80">
                <div className="relative">
                  <Image
                    src="/bai-logo.png"
                    alt="BAI Technology"
                    width={160}
                    height={160}
                    className="logo-glow animate-logo-pulse relative z-10"
                  />
                  {/* Additional glow effect with logo colors */}
                  <div className="absolute inset-0 w-40 h-40 bg-logo-orange/20 rounded-full blur-xl animate-pulse"></div>
                  <div
                    className="absolute inset-0 w-40 h-40 bg-logo-gold/10 rounded-full blur-2xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>

              {/* Enhanced Floating Tech Elements */}
              <div
                className="absolute top-10 left-10 tech-border p-3 rounded-lg animate-bounce cyber-glow"
                style={{ animationDelay: "0.5s" }}
              >
                <Cpu className="h-6 w-6 text-neon-blue" />
              </div>
              <div
                className="absolute top-20 right-10 tech-border p-3 rounded-lg animate-bounce cyber-glow"
                style={{ animationDelay: "1s" }}
              >
                <Brain className="h-6 w-6 text-logo-orange" />
              </div>
              <div
                className="absolute bottom-20 left-20 tech-border p-3 rounded-lg animate-bounce cyber-glow"
                style={{ animationDelay: "1.5s" }}
              >
                <Network className="h-6 w-6 text-tech-cyan" />
              </div>
              <div
                className="absolute bottom-10 right-20 tech-border p-3 rounded-lg animate-bounce cyber-glow"
                style={{ animationDelay: "2s" }}
              >
                <Database className="h-6 w-6 text-logo-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
