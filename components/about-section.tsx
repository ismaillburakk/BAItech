"use client"

import { Check, Eye, Target } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-white mb-4 neon-text">Hakkımızda</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            BAI Technology olarak, yapay zeka teknolojilerinin gücünü insanlığın hizmetine sunuyoruz
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-white mb-6">
              <span className="text-transparent bg-gradient-to-r from-logo-orange to-logo-gold bg-clip-text">
                Neden
              </span>{" "}
              BAI Technology?
            </h3>

            <p className="text-lg text-gray-300 mb-8">
              Yapay zeka alanında uzman ekibimizle, işletmenizin ihtiyaçlarına özel çözümler geliştiriyoruz. Amacımız,
              teknolojinin gücünü kullanarak iş süreçlerinizi daha verimli hale getirmek.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Uzman AI geliştirici ekibi
                </span>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">İşletmeye özel çözümler</span>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">7/24 teknik destek</span>
              </div>

              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center group-hover:animate-pulse-glow">
                  <Check className="h-5 w-5 text-white" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Kanıtlanmış başarı hikayeleri
                </span>
              </div>
            </div>
          </div>

          {/* Vizyon ve Misyon */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Vizyon */}
            <div className="tech-border rounded-2xl p-8 cyber-glow relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-logo-orange/20 to-neon-blue/20"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-logo-orange to-logo-gold rounded-full flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Vizyonumuz</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Yapay zekâ teknolojilerini kullanarak insanların günlük yaşamlarını kolaylaştırmak; aldıkları
                  hizmetlerde kaliteyi artırmak ve her bireye, aldığı hizmetin değerli olduğunu hissettiren yenilikçi
                  çözümler sunmak.
                </p>
              </div>
            </div>

            {/* Misyon */}
            <div className="tech-border rounded-2xl p-8 cyber-glow relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-tech-purple/20"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-tech-purple rounded-full flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Misyonumuz</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Toplumun yaşam kalitesini artıran, erişilebilir ve güvenilir yapay zekâ tabanlı hizmetler
                  geliştirerek; kullanıcı odaklı, etik değerlere bağlı, sürdürülebilir ve yüksek standartlarda dijital
                  deneyimler sunmak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
