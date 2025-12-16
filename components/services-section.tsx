"use client"

import { Brain, BarChart3, Users } from "lucide-react"

export function ServicesSection() {
  return (
    <section id="services" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 neon-text">AI Çözümlerimiz</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            İş süreçlerinizi otomatikleştiren ve verimliliğinizi artıran yapay zeka modelleri
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {/* Service 1 */}
          <div className="tech-border rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:border-neon-blue/50 hover:cyber-glow group animate-fade-in-up">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-tech-blue to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:animate-pulse-glow">
              <Brain className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Akıllı Otomasyon</h3>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
              Tekrarlayan iş süreçlerinizi yapay zeka ile otomatikleştirin ve zamandan tasarruf edin.
            </p>
          </div>

          {/* Service 2 */}
          <div
            className="tech-border rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:border-logo-orange/50 hover:cyber-glow group animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-logo-orange to-logo-gold rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:animate-pulse-glow">
              <BarChart3 className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Veri Analizi</h3>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
              Büyük veri setlerinizi analiz ederek işletmeniz için değerli içgörüler elde edin.
            </p>
          </div>

          {/* Service 3 */}
          <div
            className="tech-border rounded-2xl p-6 md:p-8 text-center transition-all duration-300 hover:border-tech-cyan/50 hover:cyber-glow group animate-fade-in-up sm:col-span-2 md:col-span-1"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-tech-cyan to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:animate-pulse-glow">
              <Users className="h-7 w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Müşteri Deneyimi</h3>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-6">
              AI destekli chatbot&apos;lar ve kişiselleştirme ile müşteri memnuniyetini artırın.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
