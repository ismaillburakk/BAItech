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
    <footer className="bg-black/90 border-t border-gray-800 py-8 md:py-12 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="sm:col-span-2">
            <div className="flex items-center space-x-3 mb-3 md:mb-4">
              <Image
                src="/bai-logo.png"
                alt="BAI Technology"
                width={36}
                height={36}
                className="logo-glow md:w-10 md:h-10"
              />
              <h3 className="text-xl md:text-2xl font-bold text-white neon-text notranslate">BAI TECHNOLOGY</h3>
            </div>
            <p className="text-sm md:text-base text-gray-400 mb-4">
              İşletmenizin geleceğini yapay zeka ile şekillendiriyoruz. Verimliliği artıran, maliyetleri düşüren AI
              çözümleri.
            </p>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-300">Hızlı Linkler</h4>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-400">
              <li>
                <button onClick={() => handleNavClick("#home")} className="hover:text-white transition-colors">
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#services")} className="hover:text-white transition-colors">
                  Hizmetler
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#projects")} className="hover:text-white transition-colors">
                  Projeler
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#about")} className="hover:text-white transition-colors">
                  Hakkımızda
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick("#contact")} className="hover:text-white transition-colors">
                  İletişim
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-gray-300">İletişim</h4>
            <ul className="space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 flex-shrink-0" />
                <span className="break-all">info@baitech.com.tr</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 flex-shrink-0" />
                <span>+90 532 369 4564</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <span>
                  Tekstil OSB Mah. 204. Cd. No:566/103
                  <br />
                  Merkez Uşak
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm md:text-base text-gray-400">
          <p>© 2025 BAI TECHNOLOGY. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  )
}
