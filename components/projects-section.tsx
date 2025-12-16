"use client"

import { Heart, Dumbbell, Building2, ShoppingCart } from "lucide-react"

export function ProjectsSection() {
  return (
    <section id="projects" className="py-12 md:py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 neon-text">
            Projelerimiz ve Geliştirdiğimiz Çözümler
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Farklı sektörlere özel, yenilikçi ve sürdürülebilir teknoloji çözümlerimiz
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* ChatEKG Project */}
          <div className="tech-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-tech-cyan/50 hover:cyber-glow group animate-fade-in-up relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-tech-cyan/20 to-neon-blue/20"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-tech-cyan to-neon-blue rounded-xl flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 group-hover:animate-pulse-glow">
                  <Heart className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">ChatEKG</h3>
                  <span className="inline-block px-2 md:px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30">
                    Geliştirme Aşamasında
                  </span>
                </div>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-200 mb-3">
                Açıklanabilir Yapay Zeka ile Akıllı EKG Analizi ve Karar Destek Sistemi
              </h4>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                ChatEKG, acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırmak ve standartlaştırmak için
                geliştirilen yapay zeka tabanlı bir sağlık teknolojisi projesidir. Sistem; EKG kağıdı veya dijital EKG
                görüntülerini analiz ederek ritim bozukluklarına yönelik ön değerlendirme ve klinik yönlendirme
                önerileri sunmayı hedefler.
              </p>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                {
                  "ChatEKG'yi farklılaştıran temel nokta, yalnızca sonuç üretmeyip açıklanabilir yapay zeka (XAI) ile kararın dayandığı EKG segmentlerini görsel ve metinsel biçimde sunmasıdır. Böylece sağlık profesyonelleri, modelin hangi örüntüler üzerinden sonuca ulaştığını daha şeffaf şekilde inceleyebilir."
                }
              </p>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                Görüntü işleme, derin öğrenme ve doğal dil işleme bileşenleriyle çalışan sistem; chat tabanlı arayüz
                üzerinden anlaşılır çıktı üretir. Web ve mobil platformlarda, ek donanım gerektirmeden çalışacak şekilde
                tasarlanmakta; Türkçe ve İngilizce dil desteğiyle ölçeklenebilir bir ürün hedeflemektedir.
              </p>
              <p className="text-xs text-gray-400 mt-2 md:mt-3 italic">Durum: Aktif geliştirme sürecinde</p>
            </div>
          </div>

          {/* GymBot Project */}
          <div
            className="tech-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-logo-orange/50 hover:cyber-glow group animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-logo-orange/20 to-logo-gold/20"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-logo-orange to-logo-gold rounded-xl flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 group-hover:animate-pulse-glow">
                  <Dumbbell className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">GymBot</h3>
                  <span className="inline-block px-2 md:px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30">
                    Geliştirme Aşamasında
                  </span>
                </div>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-200 mb-3">
                Yapay Zeka Destekli Akıllı Antrenman ve Sağlık Asistanı
              </h4>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                {
                  "GymBot, mobil platformlar için geliştirilen, yapay zeka destekli bir spor ve sağlık takip sistemidir. Sistem, spor hareketlerini analiz ederek kullanıcının hareketleri doğru yapıp yapmadığını, hareketlerin doğruluk oranlarını ve egzersiz sırasında hangi noktaların eksik veya hatalı olduğunu gerçek zamanlı olarak belirlemeyi hedefler."
                }
              </p>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                GymBot&apos;un yapay zeka altyapısı yalnızca hareket analiziyle sınırlı değildir. Kullanıcının
                hedeflerine, fiziksel durumuna ve ilerleme verilerine göre kişiye özel antrenman programları ve diyet
                planları oluşturabilen bir yapı üzerine geliştirilmektedir. Aynı zamanda kullanıcılar; antrenman
                programlarını, ağırlık ve gelişim grafiklerini, diyet planlarını ve günlük mikro–makro besin değerlerini
                uygulama üzerinden takip edebilecektir.
              </p>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                Bu bütüncül yapı sayesinde GymBot, kullanıcıya yalnızca veri sunan bir uygulama değil; antrenman,
                beslenme ve gelişimi tek bir merkezden yönlendiren akıllı bir spor asistanı olmayı amaçlar.
              </p>
              <p className="text-xs text-gray-400 mt-2 md:mt-3 italic">Durum: Aktif geliştirme sürecinde</p>
            </div>
          </div>

          {/* Management Systems */}
          <div
            className="tech-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-gray-400/50 hover:cyber-glow group animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-gray-600/20"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 group-hover:animate-pulse-glow">
                  <Building2 className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Yönetim Sistemleri</h3>
                </div>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-200 mb-3">
                İhtiyaca Özel Web ve Mobil Yönetim Çözümleri
              </h4>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                BAI Teknoloji olarak, işletmelerin ihtiyaçlarına göre web, iOS ve Android tabanlı yönetim sistemleri
                geliştiriyoruz. Her kurumun iş yapış şeklinin farklı olduğu bilinciyle, hazır çözümler yerine talebe
                özel yazılımlar üretiyoruz.
              </p>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                Bu yaklaşımın bir örneği olarak geliştirdiğimiz <strong>Çetin Group App</strong>, inşaat projelerinin
                yönetimini kolaylaştırmak amacıyla hayata geçirilmiştir. Uygulama sayesinde:
              </p>
              <div className="space-y-2 mb-3 md:mb-4">
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2 flex-shrink-0"></div>
                  <span>Proje ve saha süreçleri tek merkezden yönetilebilir</span>
                </div>
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2 flex-shrink-0"></div>
                  <span>Görev, personel ve ilerleme takibi yapılabilir</span>
                </div>
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2 flex-shrink-0"></div>
                  <span>Ofis ve saha arasındaki bilgi akışı hızlanır</span>
                </div>
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2 flex-shrink-0"></div>
                  <span>Web, iOS ve Android platformlarında aynı anda kullanılabilir</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                {
                  'Çetin Group\'un ihtiyaçları doğrultusunda geliştirilen bu sistem, "siz istersiniz, biz geliştiririz" yaklaşımımızın somut bir örneğidir.'
                }
              </p>
            </div>
          </div>

          {/* E-Commerce Solutions */}
          <div
            className="tech-border rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-green-400/50 hover:cyber-glow group animate-fade-in-up relative overflow-hidden"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20"></div>
            </div>
            <div className="relative z-10">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center mr-3 md:mr-4 flex-shrink-0 group-hover:animate-pulse-glow">
                  <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">E-Ticaret Çözümleri</h3>
                </div>
              </div>
              <h4 className="text-base md:text-lg font-semibold text-gray-200 mb-3">
                Özelleştirilmiş Online Satış Sistemleri
              </h4>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                BAI Teknoloji, farklı sektörlere yönelik özelleştirilebilir e-ticaret altyapıları geliştirir. Web ve
                mobil uyumlu olarak tasarlanan bu sistemler; ürün yönetimi, ödeme altyapıları, sipariş takibi ve
                kullanıcı deneyimini ön planda tutacak şekilde planlanır.
              </p>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-3 md:mb-4">
                Geliştirdiğimiz e-ticaret çözümleri:
              </p>
              <div className="space-y-2 mb-3 md:mb-4">
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 flex-shrink-0"></div>
                  <span>İşletmeye özel ihtiyaçlara göre şekillendirilir</span>
                </div>
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 flex-shrink-0"></div>
                  <span>Güvenli ve ölçeklenebilir altyapı sunar</span>
                </div>
                <div className="flex items-center text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 flex-shrink-0"></div>
                  <span>Modern ödeme ve entegrasyon sistemleriyle çalışır</span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                Amaç, markaların dijital satış kanallarını güçlü ve sürdürülebilir hale getirmektir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
