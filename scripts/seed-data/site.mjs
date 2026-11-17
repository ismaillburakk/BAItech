// Sayfa metinleri — mevcut siteden birebir alınmıştır.
// Kaynaklar: components/hero-section.tsx, about-section.tsx, contact-section.tsx,
// services-section.tsx, projects-section.tsx, app/(site)/hakkimizda/page.tsx,
// app/(site)/hizmetler/page.tsx. Yeni metin uydurulmamıştır; yalnız kısa arayüz
// etiketleri (ör. "Tümü", "Detayı gör") eklenmiştir — rapor §10'da listelenir.

export const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler/", label: "Hizmetler" },
  { href: "/projeler/", label: "Projeler" },
  { href: "/hakkimizda/", label: "Hakkımızda" },
  { href: "/iletisim/", label: "İletişim" },
]

export const hero = {
  eyebrow: "Teknoloji & İnovasyon",
  title: "Geleceği teknoloji ile şekillendiriyoruz.",
  lead: "BAI Technology olarak mobil uygulama, web ve özel yazılım geliştiriyoruz. Aynı zamanda görüntü ve dil tabanlı yapay zeka modellerini kendimiz eğitiyoruz.",
  primaryCta: "Ücretsiz Danışmanlık",
  secondaryCta: "Çözümlerimizi Keşfedin",
  meta: [
    { label: "Konum", value: "Türkiye" },
    { label: "Odak", value: "Yazılım · AI" },
    { label: "Statü", value: "Aktif" },
  ],
}

export const sectionIntros = {
  services: {
    eyebrow: "Hizmetler",
    title: "Yazılım ve yapay zeka",
    description:
      "Mobil uygulama, web ve özel yazılım geliştiriyoruz; yapay zeka modellerini de kendimiz eğitiyoruz. Yayına aldığımız yazılımların sunucusunu, görünürlüğünü ve bakımını da üstleniyoruz.",
  },
  projects: {
    eyebrow: "Çalışmalar",
    title: "Projelerimiz ve geliştirdiğimiz çözümler",
    description:
      "Mobil uygulama, web ve işletmeye özel yazılım projelerimiz; App Store ve Google Play'de yayında olanlar dahil.",
  },
  about: {
    eyebrow: "Hakkımızda",
    title: "Neden BAI Technology?",
    description:
      "BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Geliştirdiği uygulamalar App Store ve Google Play'de yayındadır.",
  },
}

export const about = {
  lead: "Mobil uygulama, web ve özel yazılım geliştiriyoruz; işletmelerin ihtiyaçlarına göre çözümler üretiyoruz. Aynı zamanda görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan, kendimiz eğitiyoruz.",
  bullets: [
    "Mobil, web ve özel yazılım geliştirme",
    "Görüntü ve dil tabanlı yapay zeka modelleri",
    "İşletmeye özel, sürece göre çözümler",
    "App Store ve Play Store'da yayında ürünler",
  ],
  vision: {
    title: "Vizyonumuz",
    body: "Yazılımı ve yapay zekayı, insanların günlük işlerini gerçekten kolaylaştıran ürünlere dönüştürmek; teknolojiyi gösteriş için değil, işe yaradığı için kullanmak.",
  },
  mission: {
    title: "Misyonumuz",
    body: "İşletmelerin ihtiyaçlarını yerinde anlayıp mobil, web ve özel yazılım geliştirmek; gerektiğinde kendi yapay zeka modellerimizi eğiterek sorunları hazır kalıplarla değil, probleme özel çözmek.",
  },
  identity:
    "BAI Technology, 2025'te Zafer Teknopark bünyesinde kurulmuş bir yazılım ve yapay zeka firmasıdır. Uşak merkezlidir ve Türkiye genelinde uzaktan çalışır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Geliştirdiği yazılımların sunucu yönetimini, SEO çalışmasını ve bakımını da üstlenir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.",
  depth: [
    {
      heading: "Ar-Ge odaklı çalışma",
      body: "BAI Technology — Türkçe kullanımıyla BAI Teknoloji, kısa adıyla BAI — yalnızca proje teslim eden bir yazılım evi değil, Ar-Ge odaklı bir ekip olarak çalışır. Günlük müşteri işlerinin yanında araştırma ve model geliştirme çalışmalarını sürdürür. Derin öğrenme, görüntü işleme ve doğal dil işleme bu çalışmaların merkezindedir.",
    },
    {
      heading: "Kendi yapay zeka modellerimizi geliştiriyoruz",
      body: "Yazılım firmalarının çoğu hazır yapay zeka servislerini kullanır; biz görüntü işleme ve doğal dil işleme üzerine kendi modellerimizi eğitiyoruz. Sağlık alanında açıklanabilir yapay zeka (XAI) ile çalışan EKG analiz sistemi ve spor alanında hareket analizi yapan bir sistem, bu Ar-Ge yaklaşımının somut çıktılarıdır. Model geliştirmek; veriyi hazırlamaktan doğruluğu ölçmeye kadar uzanan, zaman ve uzmanlık isteyen bir süreçtir.",
    },
    {
      heading: "Ürün geliştiren bir ekip",
      body: "2025'te kurulan BAI Technology, kısa sürede App Store ve Google Play'de yayında ürünlere ulaştı. Bir uygulamayı yayına almak, mağaza süreçlerini geçmek ve gerçek kullanıcılarla yaşatmak, ajans işlerinden farklı bir disiplin gerektirir; bu deneyimi bizzat edindik. Aynı ekip; işletmelere özel yazılım, e-ticaret altyapısı ve kurumsal web projeleri de geliştirir. Amacımız, teslim edilip unutulan değil, kullanıldıkça gelişen yazılımlar üretmektir.",
    },
  ],
  // SSS "Yapay zeka modeli geliştirme nasıl bir süreçtir?" cevabındaki adımlar —
  // cevabın kendi ifadeleri parçalanarak zaman çizelgesine dönüştürüldü.
  modelProcess: {
    title: "Yapay zeka modeli geliştirme nasıl bir süreçtir?",
    steps: [
      "Problemin tanımlanması",
      "Verinin toplanıp hazırlanması",
      "Modelin eğitilmesi",
      "Doğruluğunun ölçülmesi",
      "Ürüne güvenli biçimde entegre edilmesi",
    ],
    note: "BAI Technology bu süreci hazır bir servisi çağırarak değil, kendi modelini eğiterek yürütür. Sonuç probleminize özel olur ve veriniz üzerinde kontrol sizde kalır.",
  },
}

export const serviceDetails = [
  {
    title: "Mobil Uygulama Geliştirme",
    body: "iOS ve Android için native mobil uygulamalar geliştiriyoruz. Süreç; ihtiyaç analizi, akış tasarımı, native geliştirme, test ve mağaza yayınından oluşur. Ödeme entegrasyonu, anlık bildirim ve rol tabanlı kullanıcı yapıları proje başında planlanır. Çıktı, App Store ve Google Play'de yayınlanan ve bakımı sürdürülen bir uygulamadır.",
  },
  {
    title: "Web Geliştirme",
    body: "Kurumsal web sitelerinden çok kullanıcılı yönetim panellerine kadar web yazılımı geliştiriyoruz. Sayfaların önceden oluşturulması, görsel optimizasyonu ve erişilebilirlik ilkeleriyle hızlı, mobil uyumlu ve arama motoru dostu sistemler kurarız. Çıktı; güncellenebilir, ölçeklenen ve gerçek iş akışlarını yürüten bir web uygulamasıdır.",
  },
  {
    title: "E-Ticaret Altyapısı",
    body: "Markaya özel, tek kiracılı e-ticaret altyapıları kuruyoruz. Ürün, kategori, sepet ve ödeme akışı ile sipariş, stok ve kampanya yönetimi tek sistemde birleşir. Modern ödeme entegrasyonları ve sipariş takibi standarttır. Çıktı, kendi alan adı ve temasıyla çalışan bağımsız bir online mağazadır.",
  },
  {
    title: "Yapay Zeka Modelleri",
    body: "Hazır servisleri kullanmakla yetinmiyor, görüntü işleme ve doğal dil işleme üzerine kendi modellerimizi eğitiyoruz. Veri hazırlama, model eğitimi, doğruluk ölçümü ve ürüne güvenli entegrasyon sürecin adımlarıdır. Sağlık gibi hassas alanlarda kararın dayanağını gösteren açıklanabilir yapay zeka (XAI) yaklaşımını benimseriz.",
  },
  {
    title: "Özel Yazılım",
    body: "Hazır paketlerin çözemediği ihtiyaçlar için talebe özel yazılım geliştiriyoruz. Süreci yerinde inceler, çalışan bir ilk sürümü hızla ortaya koyar, kullanıcı geri bildirimiyle geliştiririz. Web ve mobil taraflar birlikte kurgulanır. Çıktı, ekibin gerçekten kullandığı ve zamanla gelişen bir sistemdir.",
  },
  {
    title: "Hosting & Sunucu Yönetimi",
    body: "Projenin ölçeğine uygun sunucu veya barındırma ortamını seçer, kurar ve yazılımı yayına alırız. Alan adı yönlendirmesi, SSL sertifikası ve ortam ayarları bu sürecin parçasıdır. Yayından sonra sistem güncellemelerini, erişim yetkilerini ve kaynak kullanımını izleriz; yedekleme düzeni proje başında birlikte belirlenir. Çıktı, kendi alan adınızda güvenli bağlantıyla çalışan bir canlı ortamdır.",
  },
  {
    title: "SEO & Dijital Görünürlük",
    body: "Görünürlük, sitenin teknik temelinden başlar. Sayfa yapısını, başlık ve açıklamaları, site haritasını ve schema.org yapılandırılmış verisini düzenler; yükleme hızını ve mobil uyumu ölçerek iyileştiririz. İçeriği, yapay zeka asistanlarının doğru aktarabileceği açık ve tutarlı bir biçimde kurgularız. Çıktı, arama motorlarının ve asistanların doğru okuyup tanımladığı bir sitedir.",
  },
  {
    title: "Bakım & Teknik Destek",
    body: "Yazılım yayına alındığında bitmez. İşletim sistemi ve mağaza gereksinimlerindeki değişikliklere göre sürüm güncellemeleri yapar, kullanılan kütüphanelerin güvenlik yamalarını uygular, bildirilen hataları önceliğine göre düzeltiriz. Yeni ihtiyaçlar küçük geliştirmeler olarak planlanır; destek kapsamı ve süresi proje başında birlikte belirlenir. Çıktı, güncel ve güvenle kullanılmaya devam eden bir üründür.",
  },
]

export const contact = {
  title: "İletişime geçin.",
  lead: "Yazılım ve yapay zeka projeleriniz için bizimle iletişime geçin.",
  email: "info@baitech.com.tr",
  phone: "+90 506 356 1490",
  phoneHref: "tel:+905063561490",
  address: ["Tekstil OSB Mahallesi 204. Cadde", "No:566/103 Merkez Uşak, Türkiye"],
  responseTime: "~ 24 saat",
  consent:
    "KVKK Aydınlatma Metni'ni okudum; kişisel verilerimin iletişim talebimi karşılamak amacıyla işlenmesini kabul ediyorum.",
  success: { title: "Mesajınız başarıyla gönderildi.", description: "En kısa sürede size geri döneceğiz." },
  consentError: { title: "KVKK onayı gerekli.", description: "Devam etmek için aydınlatma metnini kabul etmelisiniz." },
}
