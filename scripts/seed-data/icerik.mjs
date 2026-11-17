/**
 * Güncel site metinleri — Kasım 2026 içerik planı (docs/icerik-plani/ICERIK-PLANI.md) + kurucu kararları.
 *
 * TEK KAYNAK: hem `scripts/migrations/2026-11-icerik-plani.mjs` (canlı Firestore'u günceller) hem de
 * `scripts/seed.mjs` (boş veritabanını doldurur) metni buradan okur; böylece seed ile canlı içerik
 * aynı kalır. Karşılaştırma: migration'ı `--dry-run` ile çalıştırın; "0 değişiklik" canlı içeriğin bu dosyayla
 * birebir aynı olduğunu gösterir.
 *
 * Yazım kuralları:
 * - Yalnızca doğrulanmış bilgi. Bilinmeyen ayrıntı için cümle YAZILMAZ; yer tutucu bırakılmaz.
 * - Görünür bölüm metinleri "biz" diliyle; SSS cevapları, kimlik paragrafı, beyan cümleleri ve
 *   metadata üçüncü tekil ve marka adlı.
 * - Mobil için her yerde "React Native ile iOS ve Android".
 * - GymBot yalnızca mağaza sayfasında doğrulanan özelliklerle anlatılır; hareket analizi yayında değildir.
 * - Süre, ödeme düzeni, kod/hesap sahipliği, devralma, görüşme sıklığı ve ekip bilgisi yazılmaz.
 */

export const HERO = {
  title: "Yazılımı geliştirir, *yayına alır*, yaşatırız.",
  lead: "BAI Technology; mobil uygulama, web ve işletmeye özel yazılım geliştiren bir yazılım firması. Kendi uygulamalarımız App Store ve Google Play'de yayında. Gerektiğinde yapay zeka modelini de kendimiz eğitiyoruz.",
  primaryCta: { label: "Ücretsiz ilk görüşme", href: "/iletisim" },
  secondaryCta: { label: "Hizmetlere bakın", href: "/hizmetler" },
  meta: [
    { label: "Konum", value: "Türkiye" },
    { label: "Odak", value: "Yazılım · AI" },
    { label: "Çalışma", value: "Uzaktan, Türkiye geneli" },
  ],
};

export const SETTINGS = {
  brand: {
    tagline: "BAI Technology; mobil uygulama, web ve işletmeye özel yazılım geliştirir, yayına alır ve bakımını sürdürür.",
    legalName: "BAI Teknoloji Sanayi ve Ticaret Ltd. Şti.",
  },
  contact: {
    phone: "+90 506 356 1490",
    /** Değerler değişmedi; yalnızca koddan Site Ayarları'na taşındı */
    geo: { latitude: 38.6823, longitude: 29.4082 },
  },
  /** stats[i].label — sıra: yayındaki uygulama, proje, hizmet, kuruluş */
  statLabels: [
    "uygulama App Store ve Google Play'de yayında",
    "proje — mobil, web, e-ticaret, yapay zeka",
    "hizmet — geliştirmeden bakıma",
    "Kuruluş · Uşak",
  ],
  cta: {
    title: "Aklınızdaki işi anlatın; kapsamı birlikte çıkaralım. İlk görüşme ücretsiz.",
    buttonLabel: "Projenizi anlatın",
  },
  seo: {
    defaultTitle: "BAI Teknoloji | Mobil Uygulama, Web ve Özel Yazılım Firması",
    defaultDescription:
      "BAI Technology (BAI Teknoloji); mobil uygulama, web ve özel yazılım geliştirir, yayına alır ve bakımını sürdürür. Baseline, Bukira ve GymBot mağazalarda.",
  },
};

/** pages/{slug}: `fields` birleştirilir, `remove` listesindeki eski alanlar silinir, `seo` birleştirilir */
export const PAGES = {
  anasayfa: {
    fields: {
      statsEyebrow: "Sayılarla",
      statsTitle: "Müşteri işi yapan ekip, kendi uygulamalarını da mağazalarda yaşatıyor.",
      servicesEyebrow: "Hizmetler",
      servicesTitle: "Geliştirme, yayın ve sonrası",
      servicesDescription:
        "Beş hizmet yazılımı üretir: mobil uygulama, web, özel yazılım, e-ticaret ve yapay zeka. Üçü onu ayakta tutar: hosting, SEO ve bakım. İhtiyacınız bunlardan birinde de olabilir, hepsinde de.",
      servicesCta: "Tüm hizmetler",
      projectsEyebrow: "Çalışmalar",
      projectsTitle: "Kendi ürünlerimiz ve müşteri işleri",
      projectsCta: "Tüm projeler",
      referencesEyebrow: "Referanslar",
      referencesTitle: "Birlikte çalıştığımız işletmeler",
      // Bilerek boş: logolar kimle çalışıldığını gösterir; "X için şunu yaptık" anlatımı kullanılmaz
      referencesDescription: "",
      whyEyebrow: "Yaklaşım",
      whyTitle: "Neden BAI Technology?",
      whyDescription:
        "Yazılım yaptırmak çoğu zaman bir teslim tarihine kadar düşünülür. Biz kendi uygulamalarımızı yayınlayıp güncel tuttuğumuz için işin o tarihten sonra da sürdüğünü biliyoruz; müşteri projelerini de buna göre kuruyoruz.",
      whyBullets: [
        "Kendi uygulamalarımız mağazalarda; yayın ve güncelleme sürecini kendi ürünümüzde yaşadık",
        "Önce çalışan bir ilk sürüm, sonra geri bildirimle geliştirme",
        "Sunucu, SEO ve bakım aynı ekipte; yayından sonra muhatap değişmez",
        "Hazır bir çözüm işinizi görüyorsa bunu da söyleriz",
      ],
      whyCta: "Hakkımızda",
    },
    remove: [],
    seo: {
      title: "BAI Teknoloji | Mobil Uygulama, Web ve Özel Yazılım Firması",
      description:
        "BAI Technology (BAI Teknoloji); mobil uygulama, web ve özel yazılım geliştirir, yayına alır ve bakımını sürdürür. Baseline, Bukira ve GymBot mağazalarda.",
    },
  },
  hizmetler: {
    fields: {
      headerEyebrow: "Hizmetler",
      headerTitle: "Sekiz hizmet, tek ekip",
      headerDescription:
        "Her hizmet için dört soruyu cevapladık: kime uygun, ne teslim ediyoruz, süreç nasıl işliyor ve nasıl başlanıyor. Aradığınızı bulamazsanız sayfanın altındaki sorulara bakın ya da doğrudan bize yazın.",
      audienceLabel: "Kime uygun",
      deliverablesLabel: "Ne teslim ediyoruz",
      processLabel: "Süreç",
      startLabel: "Nasıl başlanır",
      workEyebrow: "Süreç",
      workTitle: "Bir proje nasıl yürür?",
      workSteps: [
        {
          title: "Görüşme",
          body: "İşin bugün nasıl yürüdüğünü, yazılımı kimlerin kullanacağını ve ilk sürümde nelerin şart olduğunu dinliyoruz. İlk görüşme ücretsiz.",
        },
        {
          title: "Kapsam ve teklif",
          body: "Yapılacakları ve öncelikleri yazıp teklifle birlikte sunuyoruz. Liste fiyatımız yok; teklif kapsama göre çıkar.",
        },
        {
          title: "Akış ve ilk sürüm",
          body: "Ekran akışını çıkarıyor, çalışan bir ilk sürümü erkenden paylaşıyoruz. Yorumlar gerçek ekran üzerinden yapılıyor.",
        },
        {
          title: "Geliştirme",
          body: "İlk sürümün üzerine öncelik sırasıyla ekliyor, gelen geri bildirimi bir sonraki sürüme yansıtıyoruz.",
        },
        {
          title: "Yayın",
          body: "Yazılımı sunucuya kuruyor, alan adını ve SSL'i bağlıyoruz; mobil uygulamalarda mağaza başvurusunu ve inceleme sürecini yürütüyoruz.",
        },
        {
          title: "Bakım",
          body: "Başta birlikte belirlediğimiz kapsamda güncelleme, güvenlik yaması ve hata düzeltmesiyle devam ediyoruz.",
        },
      ],
      faqEyebrow: "SSS",
      faqTitle: "Sıkça Sorulan Sorular",
    },
    remove: [],
    seo: {
      title: "Hizmetler: Mobil, Web, Yapay Zeka, Hosting ve SEO | BAI Tech",
      description:
        "Sekiz hizmet, tek ekip: mobil uygulama, web, özel yazılım, e-ticaret ve yapay zeka; sonra hosting, SEO ve bakım. Kime uygun, ne teslim edilir, nasıl başlanır?",
    },
  },
  projeler: {
    fields: {
      headerEyebrow: "Çalışmalar",
      headerTitle: "Yayındaki ürünler, müşteri işleri ve süren Ar-Ge",
      headerDescription:
        "Altı proje: üçü mağazalarda yayında, biri kendi e-ticaret altyapımız, biri işletmeye özel yazılım, biri geliştirme aşamasında bir araştırma projesi.",
    },
    remove: [],
    seo: {
      title: "Projeler: Baseline, Bukira, GymBot, Dukan | BAI Teknoloji",
      description:
        "BAI Technology'nin altı projesi: mağazalarda yayındaki Baseline, Bukira ve GymBot, Dukan e-ticaret altyapısı, müşteri işleri ve geliştirmedeki ChatEKG.",
    },
  },
  hakkimizda: {
    fields: {
      headerEyebrow: "Hakkımızda",
      headerTitle: "Ürün yayınlayan bir yazılım ekibi",
      headerDescription: "Müşteri işlerini, kendi uygulamalarımızı yayınlarken öğrendiklerimizle yürütüyoruz.",
      identityEyebrow: "Kurumsal Kimlik",
      identityText:
        "BAI Technology, 2025'te Zafer Teknopark bünyesinde kurulmuş bir yazılım ve yapay zeka firmasıdır. Uşak merkezlidir ve Türkiye genelinde uzaktan çalışır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; görüntü ve dil tabanlı yapay zeka modellerini hazır servis kullanmadan kendisi eğitir. Geliştirdiği yazılımların sunucu yönetimini, SEO çalışmasını ve bakımını da üstlenir. Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır.",
      foundingText:
        "2025'te Zafer Teknopark bünyesinde kurulduk. O günden beri iki tür iş yapıyoruz: kendi ürünlerimiz ve müşterilere özel projeler. İkisini de aynı ekip yürütüyor.",
      principlesEyebrow: "İlkeler",
      principlesTitle: "Nasıl çalışırız?",
      principles: [
        {
          title: "Önce işi anlamak",
          body: "Yazmaya başlamadan önce işin bugün nasıl yürüdüğünü öğreniyoruz; çoğu zaman en değerli çıktı, neyin yazılmaması gerektiğidir.",
        },
        {
          title: "Erken çalışan sürüm",
          body: "Uzun bir bekleyişin sonunda büyük bir teslim yerine, erkenden kullanılabilen küçük bir sürüm çıkarıp onun üzerinden ilerliyoruz.",
        },
        {
          title: "Teslimden sonrası",
          body: "Yazılım kullanıldıkça değişir. Sunucusunu, güncellemelerini ve bakımını da üstleniyoruz.",
        },
      ],
      rdEyebrow: "Ar-Ge",
      rdTitle: "Ar-Ge ve Yaklaşım",
      rdSections: [
        {
          title: "Ürün yayınlamak ne öğretti?",
          body: "Bir uygulamayı yayına almak, mağaza incelemesinden geçirmek ve gerçek kullanıcılarla güncel tutmak, sipariş üzerine yazılım teslim etmekten farklı bir disiplindir. Bunu kendi ürünlerimizde yaşadık; müşteri projelerinde yayın ve sonrası için verdiğimiz kararlar bu deneyime dayanıyor.",
        },
        {
          title: "Modeli neden kendimiz eğitiyoruz?",
          body: "Hazır yapay zeka servisleri genel amaçlıdır; belirli bir probleme özel isabet ve veri üzerinde kontrol gerektiğinde yetmez. Bu yüzden derin öğrenme, görüntü işleme ve doğal dil işleme üzerine kendi modellerimizi eğitiyoruz. Açıklanabilir yapay zeka (XAI) ile çalışan ChatEKG bu çalışmanın süren örneği. Model geliştirmek, veriyi hazırlamaktan doğruluğu ölçmeye uzanan, zaman isteyen bir iştir; her projede gerekmez.",
        },
      ],
      processEyebrow: "Süreç",
      processTitle: "Yapay zeka modeli geliştirme nasıl bir süreçtir?",
      processSteps: [
        "Problemin tanımlanması",
        "Verinin toplanıp hazırlanması",
        "Modelin eğitilmesi",
        "Doğruluğunun ölçülmesi",
        "Ürüne güvenli biçimde entegre edilmesi",
      ],
      processNote: "Sonuç probleme özeldir ve veri üzerindeki kontrol sizde kalır.",
      teamEyebrow: "Ekip",
      teamTitle: "Ürünü geliştiren ekip",
    },
    /** Vizyon / misyon kutuları "Nasıl çalışırız" ilkelerine dönüştü */
    remove: ["visionTitle", "visionBody", "missionTitle", "missionBody"],
    seo: {
      title: "Hakkımızda: Ürün Yayınlayan Yazılım Ekibi | BAI Technology",
      description:
        "BAI Technology 2025'te kuruldu. Kendi uygulamalarını mağazalarda yayınlayan ve müşteri projelerini aynı ekiple yürüten yazılım firmasının çalışma şekli.",
    },
  },
  iletisim: {
    fields: {
      headerEyebrow: "İletişim",
      headerTitle: "Projenizi anlatın.",
      headerDescription:
        "Ne yapmak istediğinizi birkaç cümleyle yazın. Yaklaşık 24 saat içinde dönüp bir görüşme planlıyoruz; ilk görüşme ücretsiz.",
      formTitle: "Mesaj Bırakın",
      formHint:
        "Şunları yazarsanız ilk görüşme daha verimli geçer: işin kim için olduğu, bugün nasıl yürüdüğü ve varsa hedeflediğiniz tarih.",
      formTopics: ["Mobil uygulama", "Web", "Özel yazılım", "E-ticaret", "Yapay zeka", "Hosting / SEO / Bakım", "Diğer"],
      consentText: "KVKK Aydınlatma Metni'ni okudum; kişisel verilerimin iletişim talebimi karşılamak amacıyla işlenmesini kabul ediyorum.",
      successTitle: "Mesajınız başarıyla gönderildi.",
      successDescription: "Yaklaşık 24 saat içinde, yazdığınız e-posta adresine dönüş yapacağız.",
    },
    remove: [],
    seo: {
      title: "İletişim: Projenizi Anlatın | BAI Teknoloji Yazılım Firması",
      description:
        "Projenizi BAI Technology'ye anlatın; yaklaşık 24 saat içinde dönüş yapılır. Uşak merkezli ekip, Türkiye genelindeki işletmelerle uzaktan çalışır.",
    },
  },
};

/** services/{slug} — kartın tüm metin alanları (görsel ve yerleşim alanları dokunulmaz) */
export const SERVICES = {
  mobil: {
    question: "Mobil uygulama yaptırmak nasıl bir süreç?",
    summary: "React Native ile iOS ve Android uygulaması geliştiriyor, App Store ve Google Play'de yayınlıyoruz.",
    audience:
      "Müşterisine ya da ekibine telefondan hizmet vermek isteyen işletmeler ve kendi ürün fikrini mağazaya çıkarmak isteyen girişimler için.",
    deliverables: [
      "iOS ve Android uygulaması",
      "Uygulamanın konuştuğu sunucu tarafı ve gerekiyorsa yönetim paneli",
      "App Store ve Google Play başvurusu ve yayını",
    ],
    detail:
      "Önce kimlerin kullanacağını ve rollerini netleştiriyoruz; Baseline'da bu üç ayrı roldü: oyuncu, kulüp ve antrenör. Ekran akışını çıkarıp ödeme, bildirim gibi entegrasyonları baştan planlıyoruz. Geliştirme sırasında çalışan sürümü erkenden paylaşıyoruz. Mağaza incelemesi, gizlilik beyanları ve izin açıklamaları yayın adımının parçası.",
    start: "Uygulamanın kim için olduğunu ve ilk sürümde mutlaka olması gerekenleri yazmanız yeterli; kapsamı görüşmede birlikte daraltıyoruz.",
    claim: "BAI Technology, React Native ile iOS ve Android uygulamaları geliştirir ve mağazalarda yayınlar.",
    serviceTypes: ["iOS uygulama geliştirme", "Android uygulama geliştirme", "App Store ve Google Play yayını"],
  },
  web: {
    question: "Kurumsal site mi, web uygulaması mı?",
    summary: "Kurumsal web sitelerinden çok kullanıcılı yönetim panellerine kadar web yazılımı geliştiriyoruz.",
    audience:
      "Kendini doğru anlatan bir siteye ihtiyacı olan işletmeler ve işini tarayıcıdan yürütmek isteyen ekipler için. İlki içerik ağırlıklıdır, ikincisinde kullanıcı girişi, roller ve veri vardır; hangisine ihtiyacınız olduğunu ilk görüşmede ayırıyoruz.",
    deliverables: [
      "Mobil uyumlu, hızlı açılan site ya da web uygulaması",
      "Gerektiğinde içeriği kendinizin güncelleyebildiği yönetim paneli",
      "Temel teknik SEO: başlıklar, site haritası, yapılandırılmış veri",
    ],
    detail:
      "Sayfa yapısını ve içerik başlıklarını tasarımdan önce çıkarıyoruz. Sayfaları mümkün olduğunca önceden oluşturuyor, görselleri optimize ediyor ve erişilebilirlik ilkelerine uyuyoruz. İçeriğin sık değiştiği sitelerde, metin ve görselleri ekibinizin kendisinin güncellediği bir yönetim paneli de kuruyoruz.",
    start: "Mevcut siteniz varsa adresini, yoksa beğendiğiniz birkaç örneği gönderin.",
    claim: "BAI Technology, kurumsal web sitelerinden çok kullanıcılı yönetim panellerine kadar web yazılımı geliştirir.",
    serviceTypes: ["Kurumsal web sitesi", "Yönetim paneli geliştirme", "Web uygulaması geliştirme"],
  },
  "ozel-yazilim": {
    question: "Hazır paket mi, özel yazılım mı?",
    summary: "Hazır programların kalıbına sığmayan iş süreçleri için işletmeye özel yazılım geliştiriyoruz.",
    audience:
      "İşini Excel, mesajlaşma grupları ve birbirine bağlı olmayan programlarla yürüten ya da kullandığı hazır pakete uymak için kendi çalışma biçimini değiştirmek zorunda kalan işletmeler için. İhtiyaç standartsa hazır paket daha doğru seçimdir; bunu da söyleriz.",
    deliverables: [
      "Sürecinize göre tasarlanmış web ve/veya mobil uygulama",
      "Rol ve yetki yapısı",
      "Erkenden kullanılabilen bir ilk sürüm",
    ],
    detail:
      "İşin bugün nasıl yürüdüğünü yerinde ya da görüşmeyle inceliyoruz. En çok zaman kaybettiren adımı çözen bir ilk sürüm çıkarıyor, ekibin kullanımından gelen geri bildirimle genişletiyoruz. Örnek: inşaat proje ve saha yönetimi uygulamasında görev, personel ve ilerleme takibi tek yerde, ofis ile saha aynı kayda bakıyor.",
    start: "Bugün en çok vakit alan işi ve onu kimlerin yaptığını anlatın.",
    claim: "BAI Technology, hazır paketlerin karşılamadığı süreçler için işletmeye özel yazılım geliştirir.",
    serviceTypes: ["İşletmeye özel yazılım", "Kurumsal yazılım geliştirme", "Süreç yönetim uygulaması"],
  },
  "e-ticaret": {
    question: "Kendi alan adınızda mağaza nasıl kurulur?",
    summary: "Kendi geliştirdiğimiz Dukan altyapısıyla markanıza ait, tek kiracılı bir online mağaza kuruyoruz.",
    audience: "Pazaryerlerinin yanında kendi alan adında, kendi temasıyla satış yapmak isteyen markalar için.",
    deliverables: [
      "Müşteri tarafı: ürün listeleme, kategori ve arama, sepet, ödeme",
      "Yönetim paneli: ürün, kategori, sipariş, stok, kampanya ve kupon, temel satış raporları",
      "Markanıza göre uyarlanmış tema ve alan adı bağlantısı",
      "iyzico ve PayTR ödeme entegrasyonu",
      "Aras Kargo ve Trendyol entegrasyonu",
    ],
    detail:
      "Tek kiracılı yapı, mağazanızın verisinin ve altyapısının başka mağazalarla paylaşılmadığı anlamına gelir. Altyapı hazır olduğu için iş, sıfırdan yazmak yerine temayı uyarlamak, kataloğu yüklemek ve entegrasyonları bağlamaktan oluşur.",
    start: "Ürün sayınızı, satış yaptığınız mevcut kanalları ve kullandığınız ödeme ve kargo firmalarını bildirin.",
    claim: "BAI Technology, Dukan altyapısıyla markalara kendi alan adında çalışan tek kiracılı mağazalar kurar.",
    serviceTypes: ["E-ticaret sitesi kurulumu", "Beyaz etiket e-ticaret altyapısı", "Online mağaza yönetim paneli"],
  },
  "yapay-zeka": {
    question: "Hazır yapay zeka servisi ne zaman yetmez?",
    summary: "Görüntü işleme ve doğal dil işleme modellerini probleme özel olarak kendimiz eğitiyoruz.",
    audience:
      "Elinde veri olan ve genel amaçlı servislerin yeterince isabetli sonuç vermediği, verisini dışarı göndermek istemediği ya da kararın gerekçesini görmesi gereken kurumlar için. Genel bir servis işinizi görüyorsa onu öneririz.",
    deliverables: [
      "Probleminize göre eğitilmiş model",
      "Doğruluk ölçüm sonuçları",
      "Modelin ürününüze entegrasyonu",
      "Gerektiğinde kararın dayanağını gösteren açıklanabilirlik (XAI) çıktısı",
    ],
    detail:
      "Problemi tanımlıyor, veriyi toplayıp hazırlıyor, modeli derin öğrenmeyle eğitiyor, doğruluğunu ölçüyor ve ürüne entegre ediyoruz. Geliştirme aşamasındaki ChatEKG'de model, EKG görüntüsünü yorumlarken kararını hangi segmente dayandırdığını da gösterecek biçimde tasarlandı. Modeller PyTorch ile geliştiriliyor.",
    start: "Çözmek istediğiniz problemi ve elinizdeki verinin türünü anlatın; verinin yeterli olup olmadığını ilk görüşmede değerlendiriyoruz.",
    claim: "BAI Technology, görüntü işleme ve doğal dil işleme modellerini derin öğrenmeyle kendisi eğitir.",
    serviceTypes: ["Yapay zeka modeli geliştirme", "Görüntü işleme", "Doğal dil işleme", "Açıklanabilir yapay zeka (XAI)"],
  },
  hosting: {
    question: "Yazılım bittikten sonra nerede çalışacak?",
    summary: "Geliştirdiğimiz yazılımı sunucuya kuruyor, alan adını ve SSL'i bağlayıp yayına alıyoruz.",
    audience: "Yazılımını bizimle geliştiren ve sunucu tarafıyla ayrıca uğraşmak istemeyen işletmeler için.",
    deliverables: [
      "Projenin ölçeğine göre seçilmiş sunucu ya da barındırma ortamı",
      "Alan adı yönlendirmesi ve SSL sertifikası",
      "Proje başında birlikte belirlenen yedekleme düzeni",
    ],
    detail:
      "Ortamı kuruyor, yazılımı yayına alıyor ve ayarları belgeliyoruz. Yayından sonra sistem güncellemelerini, erişim yetkilerini ve kaynak kullanımını izliyoruz.",
    start: "Alan adınız varsa nerede kayıtlı olduğunu bildirin; yönlendirmeyi ve SSL'i biz bağlıyoruz.",
    claim: "BAI Technology, geliştirdiği yazılımların hosting kurulumunu, alan adı ve SSL bağlantısını ve sunucu yönetimini üstlenir.",
    serviceTypes: ["Hosting kurulumu", "Sunucu yönetimi", "Alan adı ve SSL kurulumu", "Yazılımı yayına alma"],
  },
  seo: {
    question: "Siteniz arama motorlarına ve yapay zeka asistanlarına ne söylüyor?",
    summary: "Sitenizin teknik temelini düzenliyoruz: sayfa yapısı, yapılandırılmış veri, hız ve mobil uyum.",
    audience:
      "Sitesi olan ama aramalarda doğru sorgularda çıkmayan ya da yapay zeka asistanlarında yanlış veya eksik tanıtılan işletmeler için.",
    deliverables: [
      "Sayfa yapısı, başlık ve açıklamaların düzenlenmesi",
      "Site haritası ve schema.org yapılandırılmış verisi",
      "Hız ve mobil uyum ölçümü ve iyileştirmesi",
    ],
    detail:
      "Önce mevcut durumu ölçüyoruz, sonra teknik eksikleri gideriyor ve içeriği açık, tutarlı ve alıntılanabilir bir biçime getiriyoruz. Sıralama ya da trafik sözü vermiyoruz; yaptığımız iş, sitenin doğru okunmasını sağlamak.",
    start: "Site adresinizi ve hangi aramalarda görünmek istediğinizi yazın.",
    claim: "BAI Technology, web siteleri için teknik SEO, yapılandırılmış veri ve site hızı çalışması yapar.",
    serviceTypes: ["SEO hizmeti", "Web sitesi SEO", "Teknik SEO", "Yapılandırılmış veri (schema.org)", "Site hızı iyileştirme"],
  },
  "bakim-destek": {
    question: "Yayından sonra yazılıma kim bakacak?",
    summary: "Yayına aldığımız yazılımları güncel tutuyor, hataları düzeltiyor ve küçük geliştirmeleri sürdürüyoruz.",
    audience: "Yazılımı bizimle geliştirmiş ve yayından sonra aynı ekiple devam etmek isteyen işletmeler için.",
    deliverables: [
      "İşletim sistemi ve mağaza gereksinimlerine göre sürüm güncellemeleri",
      "Kullanılan kütüphanelerin güvenlik yamaları",
      "Bildirilen hataların önceliğine göre düzeltilmesi",
      "Küçük geliştirmeler",
    ],
    detail:
      "Kapsamı ve süreyi proje başında birlikte belirliyoruz. Aynı işi kendi uygulamalarımızda da yapıyoruz: Baseline ve Bukira yayından sonra yeni özelliklerle güncellendi.",
    start: "Yazılımı birlikte geliştirdiysek bakım kapsamını teslimden önce konuşuyoruz.",
    claim: "BAI Technology, yayına aldığı web ve mobil yazılımlara bakım, güncelleme ve teknik destek sağlar.",
    serviceTypes: ["Yazılım bakımı", "Web sitesi bakımı", "Mobil uygulama güncelleme", "Teknik destek"],
  },
};

/**
 * projects/{slug} — metin alanları, ilgili hizmetler, durum ve "yapay zeka" işareti.
 * `sections`: görünür ara başlıklı vaka bölümleri. Doğrulanamayan bölüm (ör. teknik zorluk) hiç oluşturulmaz.
 */
export const PROJECTS = {
  baseline: {
    subtitle: "Tenis kulüpleri, antrenörler ve oyuncular için rezervasyon uygulaması",
    status: "live",
    isAI: false,
    services: ["mobil", "bakim-destek"],
    description: [
      "Baseline, tenis kulüplerinde kort rezervasyonunu, özel ders taleplerini ve üyelik takibini tek uygulamada toplar."
    ],
    sections: [
      {
        "title": "Kim ne yapıyor",
        "body": "Uygulama üç ayrı kullanıcıya göre kuruldu. Oyuncu bulunduğu şehirdeki kulüpleri görür, kort ayırır ve antrenöre ders talebi gönderir. Kulüp kortlarını, rezervasyonlarını, antrenör kadrosunu ve üyeliklerini yönetir; günlük, haftalık ve aylık istatistiklerini görür. Antrenör programını kendisi belirler, gelen talepleri kabul eder, reddeder ya da karşı teklif verir."
      },
      {
        "title": "Ödeme",
        "body": "Online ödemeler iyzico altyapısıyla alınır; kart bilgisi uygulama sunucularında tutulmaz."
      },
      {
        "title": "Yayından sonra",
        "body": "Bağımsız antrenör desteği, karşı teklif ve kort bloklama eklendi. Tenis ekipmanı satan mağazalar için bir pazaryeri modülü planlanıyor."
      }
    ],
    highlightsTitle: "",
    highlights: [
      "Uygulama içinden online ödeme ya da kulüpte nakit",
      "Kulüp profili ve galeri",
      "Kulüp ve antrenör değerlendirmeleri",
      "Anlık bildirimler"
    ],
    note: "",
    seo: {
      title: "Baseline: Tenis Kulübü Rezervasyon Uygulaması | BAI Tech",
      description:
        "Baseline; tenis oyuncuları, kulüpler ve antrenörler için kort rezervasyonu, ders talebi ve üyelik yönetimini tek uygulamada toplar. iOS ve Android'de yayında.",
    },
  },
  bukira: {
    subtitle: "Randevuyla çalışan işletmeler için randevu ve müşteri yönetimi",
    status: "live",
    isAI: false,
    services: ["mobil", "bakim-destek"],
    description: [
      "Bukira; berber, kuaför, güzellik salonu ve klinik gibi randevuyla çalışan işletmelerde randevuları, müşteri kayıtlarını ve paket takibini tek hesapta toplar."
    ],
    sections: [
      {
        "title": "Nasıl çalışıyor",
        "body": "İşletme sahibi ve ekibi aynı hesapta çalışır. Günlük ajandada randevular onaylanır, tamamlanır, iptal edilir ya da “gelmedi” olarak işaretlenir. Her personelin çalışma saati, izni ve verdiği hizmetler ayrı tanımlanır. Müşteri geçmişi, cari bakiye ve seanslı paketler aynı kayıtta tutulur. Müşteriler işletmeye özel bağlantı üzerinden kendileri randevu alabilir."
      },
      {
        "title": "Yayından sonra",
        "body": "Tek randevuda birden çok hizmet, tatil ve mola tanımı ve WhatsApp'tan hatırlatma eklendi."
      }
    ],
    highlightsTitle: "",
    highlights: [
      "Ciro, randevu ve yeni müşteri raporları",
      "Hizmet kategorileri ve fiyatlandırma",
      "Randevu değişikliklerinde bildirim"
    ],
    note: "Planlar ve ayrıntılar bukira.com.tr adresinde.",
    seo: {
      title: "Bukira: Randevu ve İşletme Yönetim Uygulaması | BAI Tech",
      description:
        "Bukira; berber, kuaför, güzellik salonu ve klinik gibi randevuyla çalışan işletmeler için takvim, müşteri, personel ve paket takibini tek uygulamada toplar.",
    },
  },
  gymbot: {
    subtitle: "Antrenman ve beslenme takibi uygulaması",
    status: "live",
    /** Yapay zeka özellikleri yayında değil: "Yapay Zeka" filtresinde ve yapay zeka hizmet kartında gösterilmez */
    isAI: false,
    services: ["mobil", "bakim-destek"],
    description: [
      "GymBot antrenman, beslenme ve ölçü takibini tek uygulamada toplar."
    ],
    sections: [
      {
        "title": "Sırada ne var",
        "body": "Egzersiz sırasında hareketin doğruluğunu görüntüden analiz eden bir model üzerinde çalışıyoruz; bu özellik henüz yayında değil."
      }
    ],
    highlightsTitle: "",
    highlights: [
      "Antrenman kaydı ve takibi",
      "Öğün günlüğü, kalori ve makro besin takibi",
      "Kişisel hedef belirleme: kilo, ölçü, aktivite düzeyi",
      "Ölçü kaydı ve ilerleme grafikleri",
      "Hatırlatma bildirimleri"
    ],
    note: "",
    seo: {
      title: "GymBot: Antrenman ve Beslenme Takip Uygulaması | BAI Tech",
      description:
        "GymBot; antrenman kaydı, öğün günlüğü, kalori ve makro takibi ile gelişim grafiklerini tek uygulamada toplar. iOS ve Android'de, App Store ve Google Play'de.",
    },
  },
  dukan: {
    subtitle: "Beyaz etiket, tek kiracılı e-ticaret altyapısı",
    /** Canlıda bir mağazada gerçek siparişlerle çalışıyor (kurucu teyidi). Mağaza adı izin alınmadığı için YAZILMAZ. */
    status: "live",
    isAI: false,
    services: ["e-ticaret", "web"],
    description: [
      "Dukan hazır bir e-ticaret altyapısıdır, ama her marka için ayrı kurulur: kendi alan adı, teması ve kataloğu; ayrı sunucu ve veritabanı."
    ],
    sections: [
      {
        "title": "Mağaza ve panel",
        "body": "Müşteri tarafında ürün listeleme, kategori ve arama, sepet ve ödeme akışı var. Yönetim panelinde ürün, kategori, sipariş, stok ve kampanya yönetimi ile temel satış raporları bulunuyor."
      },
      {
        "title": "Bugün",
        "body": "Canlıda bir mağazada gerçek siparişlerle çalışıyor."
      }
    ],
    highlightsTitle: "Entegrasyonlar",
    highlights: [
      "Ödeme: iyzico ve PayTR",
      "Kargo: Aras Kargo",
      "Pazaryeri: Trendyol"
    ],
    note: "",
    seo: {
      title: "Dukan: Beyaz Etiket E-Ticaret Altyapısı | BAI Teknoloji",
      description:
        "Dukan: beyaz etiket, tek kiracılı e-ticaret altyapısı. Her marka kendi alan adı ve temasıyla ayrı kurulur; iyzico, PayTR, Aras Kargo ve Trendyol entegrasyonlu.",
    },
  },
  "isletmelere-ozel-yazilim": {
    subtitle: "İşletmenin çalışma biçimine göre tasarlanan web ve mobil yazılım",
    status: "none",
    isAI: false,
    services: ["ozel-yazilim", "web", "mobil"],
    description: [
      "Hazır programların kalıbına sığmayan işler için, işletmenin kendi çalışma biçimine göre tasarlanan web ve mobil yazılım."
    ],
    sections: [
      {
        "title": "Kime uygun",
        "body": "İşini Excel tabloları, mesaj grupları ve birbirine bağlı olmayan programlar arasında yürüten ya da kullandığı hazır pakete uymak için kendi düzenini değiştirmek zorunda kalan işletmelere. İhtiyaç standartsa hazır paket daha doğru seçimdir."
      },
      {
        "title": "Nasıl ilerliyor",
        "body": "İşin bugün nasıl yürüdüğünü yerinde ya da görüşmeyle inceliyoruz. En çok zaman kaybettiren adımı çözen bir ilk sürüm çıkarıyor, ekibin kullanımından gelen geri bildirimle genişletiyoruz. Ofiste tarayıcıdan, sahada telefondan aynı kayıtlar kullanılır; kimin neyi görüp değiştirebileceği rol ve yetkiyle belirlenir."
      },
      {
        "title": "Ekranlardaki örnek",
        "body": "Aşağıdaki ekranlar bir inşaat proje ve saha yönetimi uygulamasından: görevler, personel ve ilerleme tek uygulamada, ofis ile saha aynı kayda bakıyor."
      }
    ],
    highlightsTitle: "",
    highlights: [],
    note: "Benzer bir ihtiyacınız varsa bugün işi nasıl yürüttüğünüzü anlatmanız yeterli.",
    seo: {
      title: "İşletmelere Özel Yazılım: Web, iOS, Android | BAI Teknoloji",
      description:
        "İşletmeye özel web, iOS ve Android yazılımı: hazır paketin yetmediği süreçler için önce çalışan bir ilk sürüm, sonra ekibin geri bildirimiyle genişleyen sistem.",
    },
  },
  chatekg: {
    subtitle: "Açıklanabilir yapay zeka ile EKG analizi ve karar destek sistemi",
    status: "development",
    isAI: true,
    services: ["yapay-zeka"],
    description: [
      "ChatEKG, EKG görüntüsünden ritim bozukluklarına yönelik ön değerlendirme sunmayı hedefleyen bir karar destek projesi."
    ],
    sections: [
      {
        "title": "Ne yapılıyor",
        "body": "EKG kağıdının ya da dijital EKG'nin görüntüsü analiz ediliyor. Sonucun sohbet arayüzünde, anlaşılır bir dille verilmesi; sistemin web ve mobilde ek donanım gerektirmeden çalışması planlanıyor."
      },
      {
        "title": "Açıklanabilirlik (XAI)",
        "body": "Sağlıkta bir modelin yalnızca sonuç vermesi yeterli değildir; hekimin o sonuca neden varıldığını görebilmesi gerekir. ChatEKG bu yüzden açıklanabilir yapay zeka (XAI) ile kararın dayandığı EKG segmentlerini görsel ve metinsel olarak gösterecek biçimde geliştiriliyor."
      }
    ],
    highlightsTitle: "",
    highlights: [],
    note: "Geliştirme aşamasında; klinik kullanımda değil.",
    seo: {
      title: "ChatEKG: Açıklanabilir Yapay Zeka ile EKG Analizi | BAI",
      description:
        "Açıklanabilir yapay zeka (XAI) ile EKG analizi ve karar destek sistemi. EKG yorumunu hızlandırmayı hedefler; geliştirme aşamasında, klinik kullanımda değil.",
    },
  },
};

/**
 * SSS — sıralı tam liste (17 soru). Kimlikler sabittir; listede olmayan eski kayıtlar (FAQ_REMOVED) silinir.
 * Her cevap 40–60 kelime ve marka adlıdır.
 */
export const FAQ = [
  {
    id: "faq-01",
    question: "BAI Technology ne yapar?",
    answer:
      "BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; markalara e-ticaret altyapısı kurar ve görüntü ile dil tabanlı yapay zeka modellerini kendisi eğitir. Geliştirdiği yazılımları yayına alır; sunucu yönetimini, SEO çalışmasını ve bakımını da üstlenir. Baseline, Bukira ve GymBot App Store ve Google Play'de yayındadır.",
  },
  {
    id: "faq-19",
    question: "BAI Technology ile bir proje nasıl başlar?",
    answer:
      "Proje bir ihtiyaç görüşmesiyle başlar; bu ilk görüşme ücretsizdir. BAI Technology görüşmede işin bugün nasıl yürüdüğünü, yazılımı kimlerin kullanacağını ve ilk sürümde nelerin şart olduğunu dinler. Ardından kapsamı, öncelikleri ve teklifi sunar. Onaydan sonra ekran akışı çıkarılır ve çalışan bir ilk sürüm erkenden paylaşılır; geliştirme bu sürüm üzerinden, geri bildirimle ilerler.",
  },
  {
    id: "faq-04",
    question: "Mobil uygulama geliştirme maliyeti nedir?",
    answer:
      "Maliyet, uygulamanın kapsamına göre değişir. Hedeflenen platformlar, ekran sayısı, ödeme veya harita gibi entegrasyonlar ve yapay zeka bileşenleri belirleyici kalemlerdir. BAI Technology sabit bir liste fiyatı vermek yerine, ihtiyaç görüşmesinin ardından net bir kapsam ve teklif sunar. Uygulamalar React Native ile iOS ve Android için tek kod tabanından geliştirilir.",
  },
  {
    id: "faq-05",
    question: "Bir mobil uygulama ne kadar sürede geliştirilir?",
    answer:
      "Süre uygulamanın kapsamına göre değişir; ekran sayısı, kullanıcı rolleri ve ödeme ya da bildirim gibi entegrasyonlar belirleyicidir. BAI Technology bu yüzden baştan tek bir süre vermez; kapsam görüşmesinde yapılacakları ve öncelikleri müşteriyle birlikte netleştirir ve takvimi buna göre çıkarır. Çalışan bir ilk sürümü erken paylaşmayı tercih eder; geliştirme bu sürüm üzerinden ilerler.",
  },
  {
    id: "faq-11",
    question: "Uygulamamı App Store ve Google Play'de siz mi yayınlıyorsunuz?",
    answer:
      "Evet. BAI Technology geliştirdiği iOS ve Android uygulamalarının mağaza başvurusunu kendisi yürütür: mağaza sayfasını hazırlar, gizlilik beyanlarını ve izin açıklamalarını doldurur, inceleme sürecini takip eder ve istenen düzeltmeleri yapar. Aynı süreçten kendi uygulamaları Baseline, Bukira ve GymBot ile de geçmiştir. Yayından sonraki sürüm güncellemeleri bakım kapsamında sürer.",
  },
  {
    id: "faq-20",
    question: "Baseline'ı kimler kullanır?",
    answer:
      "Baseline'ı tenis oyuncuları, kulüpler ve antrenörler kullanır. BAI Technology'nin geliştirdiği uygulamada oyuncular kort ayırır ve antrenörlere ders talebi gönderir; kulüpler kortlarını, rezervasyonlarını ve antrenör kadrosunu yönetir; antrenörler programını kendisi belirler. Ödeme uygulama içinden online ya da kulüpte nakit yapılabilir. Uygulama App Store ve Google Play'de yayındadır.",
  },
  {
    id: "faq-21",
    question: "Bukira hangi işletmeler için uygun?",
    answer:
      "Bukira; berber, kuaför, güzellik salonu ve klinik gibi randevuyla çalışan işletmeler içindir. BAI Technology'nin geliştirdiği uygulama randevu takvimini, müşteri geçmişini, seanslı paketleri, personel çalışma saatlerini ve ciro raporlarını tek hesapta toplar; işletme sahibi ve ekibi aynı hesapta çalışır. App Store ve Google Play'de yayındadır; planlar ve ayrıntılar bukira.com.tr adresindedir.",
  },
  {
    id: "faq-06",
    question: "E-ticaret sitesini BAI Technology ile nasıl kurarım?",
    answer:
      "BAI Technology, mağazaları kendi geliştirdiği Dukan altyapısı üzerine kurar. Her mağaza tek kiracılıdır: kendi alan adı, teması ve ürün kataloğuyla, ayrı bir kurulumda çalışır. Ödeme için iyzico ve PayTR, kargo için Aras Kargo, pazaryeri için Trendyol entegrasyonu vardır. İş, temayı markaya uyarlamak ve kataloğu yüklemekten oluşur; takvim bu kalemlerin büyüklüğüne bağlıdır. Ürün, sipariş ve stok tek panelden yönetilir.",
  },
  {
    id: "faq-02",
    question: "BAI Technology neden kendi yapay zeka modelini eğitiyor?",
    answer:
      "Hazır yapay zeka servisleri genel amaçlıdır; belirli bir probleme özel isabet ve veri üzerinde kontrol sunmaz. BAI Technology bu yüzden görüntü işleme ve doğal dil işleme modellerini PyTorch ile kendisi eğitir. Geliştirme aşamasındaki ChatEKG'de model, EKG yorumunun hangi segmente dayandığını açıklanabilir yapay zeka (XAI) ile gösterecek biçimde tasarlanmıştır. Genel bir servisin yettiği işlerde onu önerir.",
  },
  {
    id: "faq-08",
    question: "Yapay zeka modeli geliştirme nasıl bir süreçtir?",
    answer:
      "Süreç beş adımdan oluşur: problemin tanımlanması, verinin toplanıp hazırlanması, modelin eğitilmesi, doğruluğunun ölçülmesi ve ürüne güvenli biçimde entegre edilmesi. BAI Technology ilk görüşmede çözülmek istenen problemi ve eldeki verinin türünü dinler; verinin yeterli olup olmadığını bu aşamada değerlendirir. Sonuç probleme özeldir ve veri üzerindeki kontrol müşteride kalır.",
  },
  {
    id: "faq-10",
    question: "BAI Technology hangi teknolojileri kullanır?",
    answer:
      "BAI Technology mobil uygulamaları React Native ile iOS ve Android için tek kod tabanından geliştirir. Sunucu tarafında Django, PostgreSQL ve arka plan işleri için Celery kullanır. Web ve e-ticaret arayüzlerinde Next.js tercih eder; yapay zeka modellerini PyTorch ile eğitir. Seçim her projede ihtiyaca göre yapılır; müşterinin mevcut sistemi varsa ona uyum önce gelir.",
  },
  {
    id: "faq-12",
    question: "BAI Technology yazılım yayına alındıktan sonra bakım ve destek veriyor mu?",
    answer:
      "Evet. Yazılım yayına alınınca bitmez; BAI Technology işletim sistemi ve mağaza gereksinimlerine göre sürüm güncellemeleri yapar, güvenlik yamalarını uygular ve bildirilen hataları düzeltir. Baseline, Bukira ve GymBot'un mağaza güncellemeleri de bu kapsamdadır. Web ve e-ticaret projelerinde aynı yaklaşım geçerlidir; destek kapsamı ve süresi proje başında birlikte belirlenir.",
  },
  {
    id: "faq-17",
    question: "BAI Technology hosting ve sunucu kurulumu yapıyor mu?",
    answer:
      "Evet. BAI Technology, geliştirdiği web ve mobil yazılımların sunucu ya da barındırma ortamını projenin ölçeğine göre seçer, kurar ve yazılımı yayına alır. Alan adı yönlendirmesi ve SSL sertifikası bu sürecin parçasıdır. Yayından sonra sistem güncellemelerini ve erişim yetkilerini izler; yedekleme düzeni proje başında müşteriyle birlikte belirlenir.",
  },
  {
    id: "faq-18",
    question: "BAI Technology SEO hizmeti veriyor mu?",
    answer:
      "Evet. BAI Technology, web siteleri için teknik SEO çalışması yapar: sayfa yapısını, başlık ve açıklamaları, site haritasını ve schema.org yapılandırılmış verisini düzenler; yükleme hızını ve mobil uyumu iyileştirir. İçeriği, arama motorlarının ve yapay zeka asistanlarının doğru okuyup aktarabileceği açık ve tutarlı bir biçimde kurgular.",
  },
  {
    id: "faq-13",
    question: "İşletmeme hazır paket mi, özel yazılım mı uygun?",
    answer:
      "İşinizi bir hazır programın kurallarına uydurmak zorunda kalıyorsanız, muhtemelen özel yazılıma ihtiyacınız vardır. Standart ihtiyaçlarda hazır çözümler yeterli olabilir; kendine özgü süreçlerde özel yazılım uzun vadede daha verimlidir. BAI Technology süreci yerinde inceler, çalışan bir ilk sürümü çıkarır ve geri bildirimle geliştirir.",
  },
  {
    id: "faq-14",
    question: "BAI Technology nerede ve nasıl çalışıyor?",
    answer:
      "BAI Technology Uşak merkezli bir yazılım firmasıdır; 2025'te Zafer Teknopark bünyesinde kurulmuştur. Projelerin büyük kısmını uzaktan yürütür ve Türkiye'nin farklı şehirlerindeki işletmelerle çalışır. Kritik aşamalarda yüz yüze görüşülür; gerektiğinde yerinde buluşulur. Bu düzen mobil, web, e-ticaret ve özel yazılım projelerinin tamamı için geçerlidir.",
  },
  {
    id: "faq-15",
    question: "Uşak'ta mobil uygulama, web veya yapay zeka projesi için BAI Technology ile çalışabilir miyim?",
    answer:
      "Evet. BAI Technology Uşak merkezlidir ve bölgedeki işletmelerle yüz yüze görüşebilir. İlk görüşmede işin bugün nasıl yürüdüğü dinlenir, ardından kapsam ve teklif sunulur. Şehir dışındaki işletmelerle aynı süreç uzaktan işler; firma İzmir, Denizli, Manisa ve Afyonkarahisar dahil Türkiye genelindeki işletmelerle bu şekilde çalışır. Yazılımın yayını ve bakımı da aynı ekiptedir.",
  },
];

/** Birleştirilen sorular: 03 → 11, 07 → 06, 09 → 02, 16 → 14 */
export const FAQ_REMOVED = ["faq-03", "faq-07", "faq-09", "faq-16"];

/** Görsel alt metinleri: GymBot artık "yapay zeka" uygulaması olarak tanıtılmaz */
export const ALT_REPLACEMENTS = [["GymBot yapay zeka antrenman", "GymBot antrenman ve beslenme takibi"]];

/**
 * Referanslar — sıralı tam liste. Logolar `scripts/seed-data/references/<id>.png` (hazırlanmış: kenar boşluğu
 * kırpılmış, düz arka plan saydamlaştırılmış) dosyasından Cloudinary'de `bai/references/<id>` olarak durur.
 * Açıklama alanı BOŞ kalır: sitede "bu firmaya şunu yaptık" anlatımı yoktur. Web adresi yalnızca doğrulanmışsa girilir.
 * `logoFile: null` → mevcut logo korunur (dosyası depoda yok).
 */
export const REFERENCES = [
  { id: "mexxsun", name: "MEXXSUN", url: "https://www.mexxsun.com", logoFile: "mexxsun.png" },
  { id: "altin-makina", name: "Altın Makina", url: "", logoFile: "altin-makina.png" },
  { id: "deephook-dynamics", name: "DeepHook Dynamics", url: "", logoFile: "deephook-dynamics.png" },
  { id: "kompas-care", name: "Kompas Care", url: "", logoFile: "kompas-care.png" },
  { id: "ahmet-demir-mimarlik", name: "Ahmet Demir Mimarlık", url: "", logoFile: null },
  { id: "albex-media", name: "Albex Media", url: "", logoFile: "albex-media.png" },
  { id: "cetin-group", name: "Çetin Group", url: "", logoFile: "cetin-group.png" },
];

/**
 * Proje galerisi düzeltmeleri: İşletmelere Özel Yazılım sayfasında firma adlı sekmeler yok.
 * Uygulama ekranları tek (etiketsiz görünen) sekmede kalır; kurumsal site sekmeleri kaldırılır.
 */
export const GALLERY_RULES = {
  "isletmelere-ozel-yazilim": {
    removeTabLabels: ["Kompas Care", "Ahmet Demir Mimarlık"],
    renameTabs: { "Çetin Group": "Uygulama ekranları" },
    altReplacements: [["Çetin Group inşaat proje yönetim uygulaması", "İnşaat proje ve saha yönetimi uygulaması"]],
  },
};
