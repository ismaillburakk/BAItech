export type FaqItem = { question: string; answer: string }

// Tek kaynak: hem /hizmetler'deki görünür SSS bölümü hem FAQPage JSON-LD şeması
// bu listeden beslenir.
export const faqItems: FaqItem[] = [
  {
    question: "Uşak'ta mobil uygulama geliştirme maliyeti nedir?",
    answer:
      "Maliyet, uygulamanın kapsamına göre değişir: hedeflenen platformlar (iOS, Android), ekran sayısı, ödeme veya harita gibi entegrasyonlar ve yapay zeka bileşenleri belirleyici kalemlerdir. Sabit bir liste fiyatı vermek yerine, ihtiyaç görüşmesinin ardından net bir kapsam ve teklif sunarız.",
  },
  {
    question: "Bir mobil uygulama ne kadar sürede geliştirilir?",
    answer:
      "Basit bir uygulama birkaç haftada, çok kullanıcılı ve entegrasyonlu bir platform ise birkaç aya yayılan bir sürede geliştirilir. Süreyi netleştirmenin yolu, proje başında akışı ve öncelikleri birlikte belirlemektir; çalışan bir ilk sürümü erken çıkarmayı tercih ederiz.",
  },
  {
    question: "E-ticaret sitesi kurmak ne kadar sürer?",
    answer:
      "Kendi e-ticaret altyapımız üzerinden kurulan mağazalar, sıfırdan geliştirmeye göre belirgin şekilde daha hızlı yayına alınır. Süre; ürün kataloğunun büyüklüğü, tema uyarlaması ve ödeme ile kargo entegrasyonlarına bağlıdır.",
  },
  {
    question: "Yapay zeka modeli geliştirme nasıl bir süreçtir?",
    answer:
      "Süreç; problemin tanımlanması, verinin toplanıp hazırlanması, modelin eğitilmesi, doğruluğunun ölçülmesi ve ürüne güvenli biçimde entegre edilmesinden oluşur. Hazır bir servisi çağırmaktan farklı olarak, sonuç probleminize özel olur ve veriniz üzerinde kontrol sizde kalır.",
  },
  {
    question: "Neden hazır yapay zeka servisi yerine kendi modelinizi geliştiriyorsunuz?",
    answer:
      "Hazır servisler genel amaçlıdır; probleminize özel isabet ve veri kontrolü sunmaz. Kendi modelimizi eğittiğimizde hem daha doğru sonuçlar alırız hem de özellikle sağlık gibi alanlarda kararın neye dayandığını (açıklanabilirlik) gösterebiliriz.",
  },
  {
    question: "Uşak dışındaki işletmelerle çalışıyor musunuz?",
    answer:
      "Evet. Uşak merkezliyiz ve hizmetlerimizi başta İzmir, Denizli, Manisa ve Afyonkarahisar olmak üzere Ege bölgesine ve Türkiye geneline sunuyoruz. Projelerin büyük kısmı uzaktan yürütülür; kritik aşamalarda yerinde buluşuruz.",
  },
  {
    question: "Uygulamayı App Store ve Google Play'de yayınlıyor musunuz?",
    answer:
      "Evet, mağaza yayın sürecini biz yürütürüz. Baseline ve GymBot uygulamalarımız hâlihazırda her iki mağazada yayında; inceleme, gizlilik ve izin süreçlerini daha önce birden çok kez tamamladık.",
  },
  {
    question: "Teslimden sonra bakım ve destek veriyor musunuz?",
    answer:
      "Evet. Yazılım yayına alınınca bitmez; güncellemeler, güvenlik yamaları ve yeni ihtiyaçlara göre geliştirmeler için destek veririz. Uşak'ta aynı bölgede olmak bu desteği hızlı yürütmeyi kolaylaştırır.",
  },
  {
    question: "İşletmeme hazır paket mi, özel yazılım mı uygun?",
    answer:
      "İşinizi bir hazır programın kurallarına uydurmak zorunda kalıyorsanız, muhtemelen özel yazılıma ihtiyacınız vardır. Standart ihtiyaçlarda hazır çözümler yeterli olabilir; kendine özgü süreçlerde ise özel yazılım uzun vadede daha verimlidir.",
  },
]
