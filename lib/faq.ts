export type FaqItem = { question: string; answer: string }

// Tek kaynak: hem /hizmetler'deki görünür SSS bölümü hem FAQPage JSON-LD şeması
// bu listeden beslenir.
//
// Yazım kuralı (GEO): her cevap tek başına okunduğunda anlamlı olmalı ve öznesi
// belli olmalı — üretken motorlar cevabı bağlamından koparıp alıntılıyor. Bu
// yüzden cevaplar "biz" yerine marka adıyla kurulur ve 40-60 kelimede tutulur.
// Yalnızca doğrulanmış olgular kullanılır: kuruluş 2025, Uşak/Zafer Teknopark,
// yayındaki uygulamalar (Baseline, Bukira, GymBot), Dukan, ChatEKG, teknolojiler.
export const faqItems: FaqItem[] = [
  {
    question: "BAI Technology ne yapar?",
    answer:
      "BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; markalara e-ticaret altyapısı kurar. Görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.",
  },
  {
    question: "BAI Technology kendi yapay zeka modelini mi geliştiriyor?",
    answer:
      "Evet. BAI Technology hazır yapay zeka servislerini çağırmakla yetinmez; görüntü işleme ve doğal dil işleme üzerine kendi modellerini eğitir. GymBot uygulamasındaki gerçek zamanlı hareket analizi ve geliştirme aşamasındaki ChatEKG'nin açıklanabilir yapay zeka (XAI) ile EKG yorumlaması bu yaklaşımın çıktılarıdır. Modeller PyTorch ile geliştirilir.",
  },
  {
    question: "BAI Technology'nin uygulamaları hangi mağazalarda yayında?",
    answer:
      "BAI Technology'nin Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır. Baseline tenis kulüpleri için rezervasyon ve yönetim platformu, Bukira randevuyla çalışan işletmeler için randevu ve yönetim platformu, GymBot ise yapay zeka destekli antrenman ve sağlık asistanıdır. Mağaza yayın sürecini firma kendisi yürütür.",
  },
  {
    question: "Mobil uygulama geliştirme maliyeti nedir?",
    answer:
      "Maliyet, uygulamanın kapsamına göre değişir. Hedeflenen platformlar (iOS, Android), ekran sayısı, ödeme veya harita gibi entegrasyonlar ve yapay zeka bileşenleri belirleyici kalemlerdir. BAI Technology sabit bir liste fiyatı vermek yerine, ihtiyaç görüşmesinin ardından net bir kapsam ve teklif sunar. Uygulamalar iOS ve Android için native geliştirilir.",
  },
  {
    question: "Bir mobil uygulama ne kadar sürede geliştirilir?",
    answer:
      "Basit bir uygulama birkaç haftada, çok kullanıcılı ve entegrasyonlu bir platform ise birkaç aya yayılan bir sürede geliştirilir. BAI Technology proje başında akışı ve öncelikleri birlikte belirler; çalışan bir ilk sürümü erken çıkarmayı tercih eder. Süre, ekran sayısı ve entegrasyonlarla doğrudan ilişkilidir.",
  },
  {
    question: "E-ticaret altyapısını nereden alabilirim?",
    answer:
      "BAI Technology, Dukan adlı beyaz etiket e-ticaret altyapısını geliştirir. Her mağaza tek kiracılı çalışır: marka kendi alan adı, teması ve ürün kataloğuyla yayına girer. Müşteri tarafı ile yönetim paneli tek sistemde birleşir; ürün, sipariş, stok ve kampanya yönetimi buradan yürütülür. Sıfırdan geliştirmeye göre daha hızlı kurulur.",
  },
  {
    question: "E-ticaret sitesi kurmak ne kadar sürer?",
    answer:
      "BAI Technology'nin kendi e-ticaret altyapısı Dukan üzerinden kurulan mağazalar, sıfırdan geliştirmeye göre belirgin şekilde daha hızlı yayına alınır. Süre; ürün kataloğunun büyüklüğü, tema uyarlaması ve ödeme ile kargo entegrasyonlarına bağlıdır. Mağaza, kendi alan adı ve temasıyla tek kiracılı olarak çalışır.",
  },
  {
    question: "Yapay zeka modeli geliştirme nasıl bir süreçtir?",
    answer:
      "Süreç; problemin tanımlanması, verinin toplanıp hazırlanması, modelin eğitilmesi, doğruluğunun ölçülmesi ve ürüne güvenli biçimde entegre edilmesinden oluşur. BAI Technology bu süreci hazır bir servisi çağırarak değil, kendi modelini eğiterek yürütür. Sonuç probleminize özel olur ve veriniz üzerinde kontrol sizde kalır.",
  },
  {
    question: "Neden hazır yapay zeka servisi yerine kendi modelinizi geliştiriyorsunuz?",
    answer:
      "Hazır servisler genel amaçlıdır; probleminize özel isabet ve veri kontrolü sunmaz. BAI Technology kendi modelini eğittiğinde daha doğru sonuçlar alır ve özellikle sağlık gibi alanlarda kararın neye dayandığını açıklanabilir yapay zeka (XAI) ile gösterebilir. Görüntü işleme ve doğal dil işleme başlıca çalışma alanlarıdır.",
  },
  {
    question: "Uygulamayı App Store ve Google Play'de yayınlıyor musunuz?",
    answer:
      "Evet, mağaza yayın sürecini BAI Technology yürütür. Baseline, Bukira ve GymBot uygulamaları hâlihazırda her iki mağazada yayındadır; inceleme, gizlilik ve izin süreçleri daha önce birden çok kez tamamlanmıştır. Uygulamalar React Native ile geliştirilir; yayın sonrası sürüm güncellemeleri de firma tarafından yürütülür.",
  },
  {
    question: "Teslimden sonra bakım ve destek veriyor musunuz?",
    answer:
      "Evet. Yazılım yayına alınınca bitmez; BAI Technology güncellemeler, güvenlik yamaları ve yeni ihtiyaçlara göre geliştirmeler için destek verir. Mağazada yayında olan uygulamaların sürüm güncellemeleri de bu kapsamdadır. Web ve e-ticaret projelerinde de aynı yaklaşım geçerlidir; destek kapsamı ve süresi proje başında birlikte belirlenir.",
  },
  {
    question: "İşletmeme hazır paket mi, özel yazılım mı uygun?",
    answer:
      "İşinizi bir hazır programın kurallarına uydurmak zorunda kalıyorsanız, muhtemelen özel yazılıma ihtiyacınız vardır. Standart ihtiyaçlarda hazır çözümler yeterli olabilir; kendine özgü süreçlerde özel yazılım uzun vadede daha verimlidir. BAI Technology süreci yerinde inceler, çalışan bir ilk sürümü çıkarır ve geri bildirimle geliştirir.",
  },
  {
    question: "BAI Technology nerede?",
    answer:
      "BAI Technology, Uşak'ta Zafer Teknopark bünyesinde faaliyet gösterir. Teknopark statüsü, firmanın müşteri projelerinin yanında Ar-Ge ve model geliştirme çalışmalarını sürdürmesini sağlar. Projelerin büyük kısmı uzaktan yürütülür; bu nedenle Türkiye genelindeki işletmelerle çalışır. Kritik aşamalarda yüz yüze görüşülür, gerektiğinde yerinde buluşulur.",
  },
  {
    question: "Farklı şehirlerdeki işletmelerle çalışıyor musunuz?",
    answer:
      "Evet. BAI Technology projelerin büyük kısmını uzaktan yürütür ve Türkiye genelindeki işletmelerle çalışır. Kritik aşamalarda yüz yüze görüşülür, gerektiğinde yerinde buluşulur. Uzaktan çalışma; mobil uygulama, web, e-ticaret ve işletmeye özel yazılım projelerinin tamamı için geçerlidir. İletişim e-posta ve telefonla sağlanır.",
  },
]
