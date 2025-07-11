"use client"

import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const handleNavClick = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-tech-darker/90 border-t border-tech-blue/30 py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Açıklama */}
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image src="/bai-logo.png" alt="BAI Technology" width={40} height={40} className="logo-glow" />
              <h3 className="text-2xl font-bold text-white neon-text notranslate">BAI TECHNOLOGY</h3>
            </div>
            <p className="text-gray-400 mb-4">
              İşletmenizin geleceğini yapay zeka ile şekillendiriyoruz. Verimliliği artıran, maliyetleri düşüren AI
              çözümleri.
            </p>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-neon-blue">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => handleNavClick("#home")} className="hover:text-neon-blue transition-colors">
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#services")} className="hover:text-neon-blue transition-colors">
                  Hizmetler
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#about")} className="hover:text-neon-blue transition-colors">
                  Hakkımızda
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#contact")} className="hover:text-neon-blue transition-colors">
                  İletişim
                </button>
              </li>
            </ul>
          </div>

          {/* Footer İletişim */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-neon-blue">İletişim</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-tech-cyan" />
                <span>info@baitech.com.tr</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-tech-cyan" />
                <span>+90 532 369 4564</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-tech-cyan" />
                <span>
                  Tekstil OSB Mah. 204. Cd. No:566/103
                  <br />
                  Merkez Uşak
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Telif */}
        <div className="border-t border-tech-blue/30 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 BAI TECHNOLOGY. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
