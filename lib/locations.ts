export type LocationRelatedProject = { slug: string; anchor: string }

export type LocationSection = { heading: string; body: string[] }

export type LocationPage = {
  slug: string
  /** Mono eyebrow, örn "Uşak · Yazılım". */
  eyebrow: string
  /** H1 — hedef kelimeyi doğal cümle içinde barındırır. */
  h1: string
  /** SectionHeading açıklaması (sağ sütun). */
  lead: string
  /** Başlık altındaki giriş paragrafları. */
  intro: string[]
  /** h2 başlıklı içerik bölümleri. */
  sections: LocationSection[]
  /** İç link verilecek ilgili projeler (doğal anchor metniyle). */
  relatedProjects: LocationRelatedProject[]
  metaTitle: string
  metaDescription: string
}

export const locations: LocationPage[] = [
  {
    slug: "usak-yazilim-firmasi",
    eyebrow: "Uşak · Yazılım",
    h1: "Uşak'ta ürün geliştiren bir yazılım firması",
    lead: "BAI Technology, Uşak merkezli; web tasarımın ötesinde kendi ürünlerini ve yapay zeka modellerini geliştiren bir yazılım firması.",
    intro: [
      "BAI Technology, Uşak'ta konumlanan ve işletmelere web, mobil ve yapay zeka tabanlı yazılım geliştiren bir teknoloji firmasıdır. Uşak'taki çoğu yazılım ve web tasarım firmasından farkımız net: yalnızca müşteri sitesi üretmiyoruz, App Store ve Google Play'de yayında olan kendi ürünlerimiz ve sıfırdan eğittiğimiz görüntü/dil modellerimiz var.",
      "Firma, Uşak Zafer Teknopark ekosisteminde faaliyet gösterir. Bu, hem Ar-Ge odaklı çalışmayı hem de Uşak'taki işletmelerle yüz yüze, yerinde ilerleyebilmeyi sağlar — projeyi uzaktan bir ajansa anlatmak yerine aynı şehirde masaya oturmak mümkündür.",
    ],
    sections: [
      {
        heading: "Uşak'ta yerinde yazılım geliştirmenin farkı",
        body: [
          "Bir yazılım projesinin en kritik aşaması, işin gerçekte nasıl yürüdüğünü anlamaktır. Uşak'ta olmak, bir tekstil atölyesinin üretim akışını, bir deri işletmesinin sipariş sürecini veya bir seramik firmasının stok yönetimini yerinde görüp ona göre yazılım kurmamızı sağlar. Süreçleri yerinde anlamak, hazır şablon çözümlerin çözemediği ihtiyaçları ortaya çıkarır.",
          "Uşak; tekstil, deri ve seramik başta olmak üzere üretim ağırlıklı bir sanayi şehridir. Bu işletmelerin çoğu hâlâ tabloya ve telefona dayalı süreçlerle çalışır. Sipariş takibi, saha yönetimi, stok ve raporlama gibi alanlarda doğru kurgulanmış bir yazılım, gözle görülür zaman ve maliyet kazancı sağlar.",
        ],
      },
      {
        heading: "Neyi farklı yapıyoruz",
        body: [
          "Portföyümüz müşteri web siteleriyle sınırlı değil. Tenis kulüpleri için geliştirdiğimiz rezervasyon ve yönetim platformu ile yapay zeka destekli bir spor asistanı, iki ayrı mağazada yayında ve gerçek kullanıcılara hizmet veriyor. İnşaat proje yönetimi, e-ticaret altyapısı ve kurumsal web siteleri gibi işletmeye özel projeler de aynı ekibin ürünüdür.",
          "Yapay zeka tarafında ise hazır servisleri süslemekle yetinmiyoruz; görüntü işleme ve doğal dil işleme üzerine kendi modellerimizi eğitiyoruz. Bu, \"yapay zeka kullanıyoruz\" demekle gerçekten model geliştirmek arasındaki farktır.",
        ],
      },
      {
        heading: "Nasıl çalışıyoruz",
        body: [
          "Her proje, ihtiyaç görüşmesiyle başlar; işin nasıl yürüdüğünü anlar, kapsamı netleştiririz. Ardından tasarım, geliştirme ve test aşamaları gelir; mobil projelerde yayın ve mağaza süreçlerini de biz yürütürüz. Teslimden sonra bakım ve geliştirme desteği veririz. Amaç, teslim edilip unutulan değil, kullanıldıkça gelişen bir yazılımdır.",
        ],
      },
      {
        heading: "Uşak sanayisine yönelik çözümler",
        body: [
          "Uşak'ın tekstil, deri ve seramik ağırlıklı üretim yapısı, kendine özgü yazılım ihtiyaçları doğurur. Sipariş ve üretim takibi, stok yönetimi, saha ve personel koordinasyonu ile ihracat süreçlerinin dijitalleştirilmesi, bu sektörlerdeki işletmelerin en sık dile getirdiği ihtiyaçlardır.",
          "Bu ihtiyaçların çoğu hazır bir programla tam karşılanmaz; çünkü her üretim hattının ve her firmanın akışı farklıdır. İşletmeye özel geliştirilen bir yazılım, bu farkları gözeterek süreci hızlandırır ve hata payını azaltır. Uşak'ta yerinde çalışıyor olmamız, bu süreçleri masabaşından değil, sahadan anlamamızı sağlar.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "baseline", anchor: "Baseline rezervasyon ve yönetim platformu" },
      { slug: "isletmelere-ozel-yazilim", anchor: "işletmelere özel yazılım çalışmalarımız" },
      { slug: "gymbot", anchor: "GymBot yapay zeka spor asistanı" },
    ],
    metaTitle: "Uşak Yazılım Firması",
    metaDescription:
      "Uşak yazılım firması BAI Technology; web, mobil ve yapay zeka yazılımı geliştirir. App Store ve Google Play'de yayında ürünlerimizi inceleyin.",
  },
  {
    slug: "usak-mobil-uygulama-gelistirme",
    eyebrow: "Uşak · Mobil",
    h1: "Uşak'ta mobil uygulama geliştirme",
    lead: "iOS ve Android için native mobil uygulama geliştiriyoruz; App Store ve Google Play'de yayında ürünlerimiz bunun kanıtı.",
    intro: [
      "Uşak'ta mobil uygulama geliştirme denince çoğu zaman aracı bir ajans üzerinden başka şehirdeki bir ekibe iş verilir. BAI Technology bu işi Uşak'ta, kendi ekibiyle yapar. iOS ve Android için native uygulamalar geliştiriyor, tasarımdan mağaza yayınına kadar tüm süreci yürütüyoruz.",
      "En somut referansımız yayında olan ürünlerdir: bir tenis kulübü rezervasyon platformu ve yapay zeka destekli bir antrenman uygulaması, hem App Store hem Google Play'de indirilebilir durumda. Bir uygulamayı yayına çıkarmanın, mağaza onay süreçlerini geçmenin ve gerçek kullanıcılarla yaşatmanın ne demek olduğunu bizzat deneyimledik.",
    ],
    sections: [
      {
        heading: "Süreç: fikirden mağazaya",
        body: [
          "Mobil uygulama projeleri; ihtiyaç ve kapsam görüşmesi, akış tasarımı, native geliştirme, test ve mağaza yayını adımlarından oluşur. Ödeme entegrasyonu, anlık bildirim (push), rol tabanlı kullanıcı yapıları ve harita/konum gibi ihtiyaçları proje başında planlarız. Yayın sonrasında güncelleme ve bakım desteği devam eder.",
          "Uygulamaların App Store ve Google Play inceleme süreçlerinden geçmesi, gizlilik ve izin kurallarına uyması gerekir. Bu adımları daha önce birden çok kez tamamladığımız için, ilk yayın deneyimi olan işletmelerde sürprizle karşılaşma ihtimalini azaltırız.",
        ],
      },
      {
        heading: "Hangi işletmeler için uygun",
        body: [
          "Randevu ve rezervasyon alan işletmeler, üyelik ve sadakat yapısı olan markalar, saha ekibi yöneten firmalar ve müşteriyle sürekli temas hâlinde olan hizmet işletmeleri mobil uygulamadan en çok fayda görenlerdir. Uşak'taki spor tesisleri, sağlık ve hizmet işletmeleri ile üretim firmalarının saha ekipleri bu kapsama girer.",
        ],
      },
      {
        heading: "Native geliştirmenin farkı",
        body: [
          "Mobil uygulamalarımızı native olarak, yani iOS ve Android'in kendi araçlarıyla geliştiriyoruz. Native yaklaşım; daha akıcı bir kullanım, cihaz özelliklerine (kamera, konum, bildirim) tam erişim ve mağaza kurallarına uyumda avantaj sağlar. Özellikle hareket analizi gibi yoğun işlem gerektiren yapay zeka bileşenlerinde bu fark belirginleşir.",
          "Uygulamanın yayına alınması kadar, sonrasında işletim sistemi güncellemeleriyle uyumlu kalması da önemlidir. Native geliştirme, uzun vadede bakım ve kararlılık açısından sağlam bir zemin sunar.",
        ],
      },
      {
        heading: "Yerinde çalışmanın avantajı",
        body: [
          "Mobil projelerde en sık yaşanan sorun, uygulamayı yaptıran ile geliştiren arasındaki kopukluktur. Uşak'ta aynı şehirde olmak, ekranları birlikte gözden geçirmeyi, geri bildirimleri hızlı almayı ve süreci şeffaf yürütmeyi kolaylaştırır. Fikir aşamasından mağazadaki uygulamaya kadar tek bir muhatapla ilerlersiniz.",
        ],
      },
      {
        heading: "Hangi tür uygulamalar geliştiriyoruz",
        body: [
          "Rezervasyon ve randevu uygulamaları, üyelik ve sadakat sistemleri, saha ekibi yöneten uygulamalar ve mevcut bir web sistemini tamamlayan mobil uygulamalar sık geliştirdiğimiz türlerdir. Yapay zeka bileşeni gerektiren, örneğin görüntü veya hareket analizi yapan uygulamalar da kapsamımızdadır. Her tür için ortak nokta, uygulamanın gerçek bir ihtiyacı çözmesi ve kullanıldıkça değer üretmesidir.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "baseline", anchor: "Baseline tenis rezervasyon uygulaması" },
      { slug: "gymbot", anchor: "GymBot yapay zeka antrenman uygulaması" },
      { slug: "bukira", anchor: "Bukira randevu ve işletme yönetim uygulaması" },
    ],
    metaTitle: "Uşak Mobil Uygulama Geliştirme",
    metaDescription:
      "Uşak'ta iOS ve Android mobil uygulama geliştirme. App Store ve Google Play'de yayında ürünlerimizle; tasarımdan mağaza yayınına kadar tüm süreç bizde.",
  },
  {
    slug: "usak-web-yazilim",
    eyebrow: "Uşak · Web",
    h1: "Uşak'ta web yazılım geliştirme",
    lead: "Web tasarımın ötesinde: yönetim panelleri, kurumsal siteler ve işlevsel web uygulamaları geliştiriyoruz.",
    intro: [
      "Uşak'ta web yazılım ihtiyacı çoğu zaman \"web sitesi\" ile sınırlı sanılır. Oysa çoğu işletmenin asıl ihtiyacı; sipariş yöneten, stok takip eden, raporlama yapan işlevsel bir web uygulamasıdır. BAI Technology, hem kurumsal web sitesi hem de arka planda gerçek iş yapan web yazılımı geliştirir.",
      "Geliştirdiğimiz e-ticaret altyapısının yönetim paneli, kurumsal hizmet siteleri ve mimari ofis web sitesi gibi işler, web tarafındaki kapsamımızı gösterir: statik bir tanıtım sayfasından çok kullanıcılı yönetim sistemlerine kadar geniş bir aralık.",
    ],
    sections: [
      {
        heading: "Kurumsal site mi, web uygulaması mı",
        body: [
          "İki ihtiyaç farklıdır. Kurumsal web sitesi; markanızı anlatan, arama motorlarında bulunan, hızlı ve mobil uyumlu bir vitrindir. Web uygulaması ise kullanıcı girişi, veri yönetimi ve iş akışları içeren bir sistemdir. Bir işletmenin çoğu zaman ikisine birden ihtiyacı olur ve biz her iki tarafı da geliştiririz.",
          "Kurumsal web sitesi kurumsal hizmet firmaları için markanın dilini yansıtan, güncellenebilir siteler kurarız; işlevsel tarafta ise sipariş, kullanıcı ve içerik yönetimi gibi modülleri projeye göre kurgularız.",
        ],
      },
      {
        heading: "Teknoloji ve performans",
        body: [
          "Modern bir web yazılımının hızlı açılması, mobilde sorunsuz çalışması ve arama motorları tarafından okunabilir olması gerekir. Sayfaların önceden oluşturulması, görsellerin optimize edilmesi ve erişilebilirlik kurallarına uyulması, hem kullanıcı deneyimini hem de arama sıralamasını doğrudan etkiler. Projelerimizi bu ilkelerle kurarız.",
        ],
      },
      {
        heading: "Arama motorlarında bulunurluk",
        body: [
          "Bir web sitesinin güzel görünmesi yeterli değildir; hedef kitlenin sizi araması gerektiğinde bulabilmesi gerekir. Sayfaların doğru başlık ve açıklamalarla yapılandırılması, hızlı açılması ve mobilde sorunsuz çalışması, arama motoru sıralamasını doğrudan etkiler.",
          "Web projelerimizi teknik SEO ilkeleriyle kurarız: anlamlı adres yapısı, sayfa başına tekil başlık ve açıklama, yapılandırılmış veri (schema) ve site haritası. Böylece site yalnızca ziyaretçi için değil, arama motorları için de okunabilir olur.",
        ],
      },
      {
        heading: "Bakım ve süreklilik",
        body: [
          "Web yazılımı yayına alınınca bitmez. İçerik güncellemeleri, güvenlik yamaları ve yeni ihtiyaçlara göre geliştirmeler için sürekli destek veririz. Uşak'ta aynı şehirde olmak, bu desteği hızlı ve doğrudan yürütmeyi kolaylaştırır.",
        ],
      },
      {
        heading: "Erişilebilirlik ve her cihazda uyum",
        body: [
          "Bir web yazılımının farklı ekran boyutlarında ve farklı kullanıcılar için sorunsuz çalışması gerekir. Sayfaları mobil, tablet ve masaüstünde tutarlı çalışacak biçimde kurar; klavye ile gezinme ve yeterli renk kontrastı gibi erişilebilirlik ilkelerini gözetiriz. Bu, hem daha geniş bir kitleye ulaşmak hem de arama motorlarının siteyi doğru değerlendirmesi için önemlidir.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "dukan", anchor: "Dukan e-ticaret altyapısı ve yönetim paneli" },
      { slug: "isletmelere-ozel-yazilim", anchor: "kurumsal web sitesi çalışmalarımız" },
    ],
    metaTitle: "Uşak Web Yazılım",
    metaDescription:
      "Uşak'ta web yazılım geliştirme: kurumsal siteler, yönetim panelleri ve işlevsel web uygulamaları. Hızlı, mobil uyumlu ve arama motoru dostu.",
  },
  {
    slug: "usak-e-ticaret-altyapisi",
    eyebrow: "Uşak · E-Ticaret",
    h1: "Uşak'ta e-ticaret altyapısı kurulumu",
    lead: "Markanıza özel, tek kiracılı e-ticaret altyapısı: ürün, sipariş, stok ve ödeme yönetimi tek sistemde.",
    intro: [
      "Uşak'ta üretim yapan pek çok işletme, ürününü artık doğrudan online satmak istiyor. Hazır pazaryerlerine bağımlı kalmadan, kendi markasıyla satış yapmanın yolu kendi e-ticaret altyapısına sahip olmaktır. BAI Technology'nin geliştirdiği Dukan, tam olarak bunu sağlar: beyaz etiket, tek kiracılı bir e-ticaret altyapısı.",
      "Uşak'ın tekstil ve ev tekstili üretimindeki gücü düşünüldüğünde, kendi alan adı ve markasıyla satış yapan bir online mağaza, aracı komisyonlarından kurtulmak ve müşteri ilişkisini doğrudan kurmak için önemli bir adımdır.",
    ],
    sections: [
      {
        heading: "Neler içeriyor",
        body: [
          "E-ticaret altyapısı iki taraftan oluşur. Müşteri tarafında ürün listeleme, kategori ve arama, sepet ve ödeme akışı yer alır. Yönetim panelinde ise ürün, kategori, sipariş, stok ve kampanya yönetimi ile temel satış raporları bulunur. Her mağaza kendi alan adı, teması ve ürün kataloğuyla bağımsız çalışır.",
          "Modern ödeme sistemleriyle entegrasyon, sipariş durum takibi ve kupon/kampanya yönetimi gibi satışı doğrudan etkileyen özellikler standart olarak sunulur.",
        ],
      },
      {
        heading: "Neden hazır pazaryeri yerine kendi altyapınız",
        body: [
          "Pazaryerleri hızlı başlangıç sağlar ama marka kimliğini, müşteri verisini ve kâr marjını sınırlar. Kendi e-ticaret altyapınızda müşteri ilişkisi size aittir, tasarımı markanıza göre şekillendirebilir ve komisyon yükü olmadan satış yapabilirsiniz. İkisi birbirini dışlamaz; çoğu işletme kendi mağazasını kurup pazaryerlerini de yan kanal olarak kullanır.",
        ],
      },
      {
        heading: "Kurulum süreci",
        body: [
          "Ürün kataloğunun yapısı, kategori mantığı ve ödeme/kargo entegrasyonları netleştirilerek başlanır. Tema markaya göre uyarlanır, ürünler yüklenir ve mağaza yayına alınır. Yayın sonrası stok, kampanya ve raporlama için yönetim paneli üzerinden tam kontrol sizde olur.",
        ],
      },
      {
        heading: "Ödeme, kargo ve büyümeye hazırlık",
        body: [
          "Bir online mağazanın satışa dönmesi, ödeme ve kargo tarafının sorunsuz çalışmasına bağlıdır. Altyapımız modern ödeme sistemleriyle entegre çalışır ve sipariş durumlarının müşteriye yansıtılmasını sağlar. Kampanya ve kupon yönetimi, satışı artıran temel araçlar olarak yönetim panelinde yer alır.",
          "Uşak'ın üretim gücü, doğru kurulmuş bir e-ticaret altyapısıyla birleştiğinde, markalar aracı komisyonlarına bağlı kalmadan kendi müşteri kitlesine ulaşabilir. Altyapı, ürün sayısının ve trafiğin artmasına göre ölçeklenecek biçimde tasarlanır.",
        ],
      },
      {
        heading: "Mobil uyum ve satışa dönüşüm",
        body: [
          "Online alışverişin büyük kısmı mobil cihazlardan yapılır; bu yüzden mağazanın telefonda hızlı ve akıcı çalışması doğrudan satışı etkiler. Ürün sayfalarının hızlı açılması, sepet ve ödeme adımlarının sade olması ve arama ile filtrelemenin kolay çalışması, ziyaretçinin alışverişi tamamlamasını kolaylaştırır. Altyapıyı bu dönüşüm odaklı ilkelerle kurar, mağazayı yalnızca açılan değil satan bir sistem olarak tasarlarız.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "dukan", anchor: "Dukan e-ticaret altyapısı" },
    ],
    metaTitle: "Uşak E-Ticaret Altyapısı",
    metaDescription:
      "Uşak'ta markanıza özel e-ticaret altyapısı kurulumu. Ürün, sipariş, stok ve ödeme yönetimi tek sistemde; kendi alan adınız ve temanızla satış yapın.",
  },
  {
    slug: "usak-yapay-zeka",
    eyebrow: "Uşak · Yapay Zeka",
    h1: "Uşak'ta yapay zeka çözümleri ve model geliştirme",
    lead: "İçi boş yapay zeka iddiaları değil; sıfırdan eğitilen görüntü ve dil modelleri üzerine kurulu gerçek çözümler.",
    intro: [
      "Uşak'ta \"yapay zeka\" pek çok firmanın tanıtımında geçer, ancak çoğu zaman hazır bir servisin arayüzüne indirgenir. BAI Technology'de yapay zeka, gerçekten model geliştirmek anlamına gelir: görüntü işleme ve doğal dil işleme üzerine kendi modellerimizi eğitir, ürünlerimizin çekirdeğine yerleştiririz.",
      "Bu yaklaşımın iki somut örneği var. Sağlık teknolojisi alanında geliştirdiğimiz ve açıklanabilir yapay zeka (XAI) ile çalışan EKG analiz sistemi, kararının hangi verilere dayandığını da gösterir. Spor tarafında ise hareket analizi yapan bir sistem, egzersizlerin doğruluğunu gerçek zamanlı değerlendirir.",
    ],
    sections: [
      {
        heading: "Model geliştirmek ile servis kullanmak arasındaki fark",
        body: [
          "Hazır bir yapay zeka servisini çağırmak kolaydır ama probleminize özel değildir. Model geliştirmek; veriyi hazırlamak, modeli eğitmek, doğruluğunu ölçmek ve ürünün içine güvenli biçimde yerleştirmek demektir. Bu, hem daha isabetli sonuçlar hem de veriniz üzerinde kontrol sağlar.",
          "Özellikle sağlık gibi hassas alanlarda, modelin neden o kararı verdiğini gösterebilmek (açıklanabilirlik) kritik önemdedir. Çözümlerimizi bu şeffaflık ilkesiyle kurgularız.",
        ],
      },
      {
        heading: "Görüntü ve dil tabanlı çözümler",
        body: [
          "Geliştirdiğimiz modeller iki temel alanda yoğunlaşır: görüntü işleme ve doğal dil işleme. Görüntü tarafında; bir fotoğraf veya taranmış belgeden veri çıkarma, sınıflandırma ve durum tespiti gibi işler mümkündür. Dil tarafında ise metin sınıflandırma, özetleme ve gelen taleplerin ön değerlendirmesi öne çıkar.",
          "Yapay zeka her problemin çözümü değildir; doğru soru, hangi işin gerçekten otomasyonla hızlanacağını belirlemektir. Bir işletmeyle önce bu değerlendirmeyi yapar, yapay zekanın anlamlı katkı sağlayacağı noktaları birlikte belirleriz. Veri gizliliği ve modelin kararının açıklanabilirliği, tüm çalışmalarımızda gözettiğimiz ilkelerdir.",
        ],
      },
      {
        heading: "İşletmeler için pratik yapay zeka",
        body: [
          "Yapay zeka yalnızca büyük projeler için değildir. Görüntüden veri çıkarma, metin sınıflandırma, tekrar eden süreçlerin otomasyonu ve müşteri taleplerinin ön değerlendirmesi gibi işler, doğru kurgulandığında bir işletmenin günlük yükünü azaltır. Uşak'taki üretim ve hizmet işletmeleri için bu tür odaklı çözümler, büyük bütçeler olmadan da hayata geçirilebilir.",
        ],
      },
      {
        heading: "Doğruluk, ölçüm ve sürdürme",
        body: [
          "Bir yapay zeka çözümünün değeri, gerçek verideki doğruluğuyla ölçülür. Modeli eğitmek kadar, doğruluğunu düzenli değerlendirmek ve gerektiğinde yeni veriyle güncellemek de sürecin parçasıdır. Çözümü teslim edip bırakmak yerine, kullanım sırasında ortaya çıkan durumlara göre modeli sürdürür ve iyileştiririz. Bu yaklaşım, yapay zekanın zamanla değer kaybetmesini önler. Modelin nasıl karar verdiğini gösterebilmek ise, özellikle sağlık ve karar destek alanlarında güvenin temelidir.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "chatekg", anchor: "ChatEKG açıklanabilir yapay zeka EKG analizi" },
      { slug: "gymbot", anchor: "GymBot hareket analizi sistemi" },
    ],
    metaTitle: "Uşak Yapay Zeka Çözümleri",
    metaDescription:
      "Uşak'ta yapay zeka çözümleri: sıfırdan eğitilen görüntü ve dil modelleri, açıklanabilir yapay zeka ve işletmelere özel pratik AI uygulamaları.",
  },
  {
    slug: "usak-ozel-yazilim",
    eyebrow: "Uşak · Özel Yazılım",
    h1: "Uşak'ta işletmeye özel yazılım geliştirme",
    lead: "Hazır paketlerin çözemediği ihtiyaçlar için, sürecinize göre baştan tasarlanan talebe özel yazılımlar.",
    intro: [
      "Her işletmenin iş yapış şekli farklıdır; hazır paket yazılımlar çoğu zaman bu farkları görmezden gelir. BAI Technology, Uşak'taki işletmeler için talebe özel yazılım geliştirir: süreci yerinde anlar, ona göre web ve mobil çözümleri baştan kurgular.",
      "Bu yaklaşımın somut örneği, bir inşaat firması için geliştirdiğimiz proje ve saha yönetim uygulamasıdır. Proje aşamaları, görev takibi, personel ve ilerleme durumu tek merkezden yönetilir; ofis ile saha arasındaki bilgi akışı hızlanır. \"Siz istersiniz, biz geliştiririz\" yaklaşımının pratikteki karşılığı budur.",
    ],
    sections: [
      {
        heading: "Ne zaman özel yazılım gerekir",
        body: [
          "Eğer işinizi bir hazır programın kurallarına uydurmak zorunda kalıyorsanız, muhtemelen özel yazılıma ihtiyacınız vardır. Kendine özgü onay süreçleri, sektöre özel takip ihtiyaçları veya birden fazla ekibin ortak çalıştığı akışlar, hazır çözümlerin sınırına çabuk gelir. Özel yazılım, süreci yazılıma değil, yazılımı sürece uydurur.",
        ],
      },
      {
        heading: "Süreç nasıl işliyor",
        body: [
          "İşin nasıl yürüdüğünü yerinde inceleyerek başlarız. İhtiyaçları ve öncelikleri netleştirir, çalışan bir ilk sürümü hızlıca ortaya koyarız. Kullanıcı geri bildirimiyle geliştirir, web ve mobil tarafları birlikte kurgularız. Amaç, ekibin gerçekten kullandığı ve zamanla gelişen bir sistemdir.",
          "Uşak'ta yerinde çalışmak, özellikle özel yazılım projelerinde belirleyicidir: gereksinimleri doğru anlamak, uzaktan yazışmalarla değil, sahayı görüp konuşarak mümkün olur.",
        ],
      },
      {
        heading: "Somut bir örnek: saha ve proje yönetimi",
        body: [
          "Bir inşaat firması için geliştirdiğimiz sistemde; proje aşamaları, müellif ve ruhsat süreçleri, kaba ve ince inşaat takibi ile iskan imzaları tek ekranda izlenebilir hâle geldi. Ofisteki yönetici ile sahadaki ekip aynı veriye baktığı için telefon trafiği ve bilgi kaybı azaldı.",
          "Özel yazılımda önemli bir konu da sahipliktir: sistem sizin süreçlerinize göre kurulur ve ihtiyaç değiştikçe geliştirilebilir. Teslimden sonra bakım, güncelleme ve yeni modül eklemeleriyle yazılımı yaşayan bir araç olarak sürdürürüz.",
        ],
      },
      {
        heading: "Ne teslim ediyoruz",
        body: [
          "Çıktı yalnızca bir yazılım değil; ekibinizin kullanabileceği, dokümante edilmiş ve zamanla büyüyebilen bir sistemdir. Web ve mobil taraflar birlikte planlandığı için, aynı veriye ofisten ve sahadan erişilebilir. Böylece hazır paketlerin dayattığı sınırlar yerine, işinize göre şekillenen bir araç elde edersiniz.",
        ],
      },
      {
        heading: "Mevcut sistemlerle entegrasyon",
        body: [
          "Özel yazılım çoğu zaman sıfırdan bir ada değil, mevcut araçlarla konuşan bir sistemdir. Muhasebe programı, e-ticaret altyapısı veya kullandığınız diğer servislerle veri alışverişi gerektiğinde, entegrasyonları proje kapsamında planlarız. Gerektiğinde mevcut verilerin yeni sisteme güvenli biçimde aktarılması da bu kapsamda ele alınır. Amaç, yeni yazılımın ekibin mevcut düzenini bozmadan onu tamamlamasıdır.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "isletmelere-ozel-yazilim", anchor: "işletmelere özel yazılım çalışmalarımız" },
      { slug: "dukan", anchor: "Dukan e-ticaret altyapısı" },
    ],
    metaTitle: "Uşak Özel Yazılım",
    metaDescription:
      "Uşak'ta işletmeye özel yazılım geliştirme. Sürecinize göre baştan tasarlanan web ve mobil çözümler; hazır paketlerin çözemediği ihtiyaçlar için.",
  },
  {
    slug: "ege-yazilim-firmasi",
    eyebrow: "Ege · Yazılım",
    h1: "Ege bölgesine yazılım geliştiren firma",
    lead: "Uşak merkezli; Ege bölgesindeki işletmelere web, mobil ve yapay zeka yazılımı geliştiriyoruz.",
    intro: [
      "BAI Technology Uşak merkezlidir ve hizmetlerini tüm Ege bölgesine sunar. İzmir, Denizli, Manisa ve Afyonkarahisar başta olmak üzere bölgedeki işletmelerle hem uzaktan hem de gerektiğinde yerinde çalışırız.",
      "Ege bölgesi, tekstilden gıdaya, turizmden üretime geniş bir işletme yelpazesi barındırır. Bu işletmelerin ortak ihtiyacı; süreçlerini dijitalleştiren, mobil ve web tarafında gerçekten çalışan yazılımlardır. App Store ve Google Play'de yayında ürünlerimiz, iş bitirme kapasitemizin somut göstergesidir.",
    ],
    sections: [
      {
        heading: "Uzaktan ve yerinde çalışma",
        body: [
          "Yazılım projelerinin büyük kısmı uzaktan yürütülebilir; ekran paylaşımı, düzenli görüşmeler ve şeffaf ilerleme takibiyle bölge fark etmeksizin verimli çalışırız. Gereksinim analizi veya kritik teslim aşamaları gibi yüz yüze olmanın değer kattığı anlarda ise bölge içinde yerinde buluşuruz.",
        ],
      },
      {
        heading: "Hangi hizmetler",
        body: [
          "Mobil uygulama geliştirme, kurumsal ve işlevsel web yazılımı, e-ticaret altyapısı, işletmeye özel yazılım ve yapay zeka çözümleri bölgedeki tüm işletmeler için sunduğumuz başlıca hizmetlerdir. İhtiyacın ölçeğine göre tek bir üründen bütünleşik bir sisteme kadar farklı kapsamlarda çalışırız.",
        ],
      },
      {
        heading: "Farklı sektörlere aynı disiplin",
        body: [
          "Ege bölgesi; üretimden turizme, gıdadan hizmete geniş bir yelpaze barındırır. Bu çeşitlilik, her projeye sektörü anlayarak başlamayı gerektirir. Bir tesis rezervasyon uygulaması ile bir e-ticaret altyapısının teknik temeli benzer olsa da, iş mantığı tamamen farklıdır.",
          "Bölgedeki işletmelere mobil uygulama, web yazılımı, e-ticaret ve özel yazılım alanlarında, App Store ve Google Play'de ürün yayınlamış bir ekibin disipliniyle hizmet veriyoruz.",
        ],
      },
      {
        heading: "Nasıl başlıyoruz",
        body: [
          "Bölgedeki bir işletmeyle çalışma, çoğu zaman kısa bir tanışma görüşmesiyle başlar. İhtiyacı ve önceliği anlar, kapsamı ve yaklaşık süreyi netleştiririz. Mesafe fark etmeksizin süreci şeffaf yürütür; düzenli görüşmeler ve ilerleme paylaşımıyla nerede olduğumuzu net tutarız. Uzaklık, doğru iletişimle bir engel olmaktan çıkar.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "baseline", anchor: "Baseline rezervasyon platformu" },
      { slug: "dukan", anchor: "Dukan e-ticaret altyapısı" },
    ],
    metaTitle: "Ege Bölgesi Yazılım Firması",
    metaDescription:
      "Ege bölgesine yazılım geliştiren Uşak merkezli firma. İzmir, Denizli, Manisa ve Afyon'a mobil uygulama, web yazılım ve e-ticaret çözümleri.",
  },
  {
    slug: "izmir-yazilim-mobil-uygulama",
    eyebrow: "İzmir · Yazılım",
    h1: "İzmir'e yazılım ve mobil uygulama geliştirme",
    lead: "Uşak merkezli ekibimizle İzmir'deki işletmelere mobil uygulama ve web yazılımı geliştiriyoruz.",
    intro: [
      "İzmir, Ege'nin en büyük ekonomik merkezidir ve yazılım hizmeti veren pek çok firma barındırır. BAI Technology, İzmir'deki işletmelere Uşak'tan hizmet verir; farkımız, ajans konumlanmasının ötesinde App Store ve Google Play'de yayında kendi ürünlerimize ve eğittiğimiz yapay zeka modellerine sahip olmamızdır.",
      "İzmir'deki bir işletme için doğru soru \"kim en yakın?\" değil, \"kim işi bitirip yayına alabiliyor?\" olmalıdır. Yayında ürünlerimiz bu sorunun cevabıdır.",
    ],
    sections: [
      {
        heading: "İzmir işletmeleri için ne yapıyoruz",
        body: [
          "iOS ve Android mobil uygulama geliştirme, kurumsal ve işlevsel web yazılımı, e-ticaret altyapısı ve işletmeye özel yazılım başlıca hizmetlerimizdir. Randevu ve üyelik yöneten hizmet işletmeleri, online satış yapmak isteyen markalar ve saha ekibi olan firmalar için uygun çözümler kurarız.",
        ],
      },
      {
        heading: "Uzaktan çalışma pratiğimiz",
        body: [
          "Projeleri düzenli görüşmeler, ekran paylaşımı ve şeffaf ilerleme takibiyle uzaktan yürütürüz; kritik aşamalarda İzmir'de yerinde buluşuruz. Uşak ile İzmir arasındaki yakınlık, gerektiğinde yüz yüze çalışmayı pratik kılar.",
        ],
      },
      {
        heading: "Ajans yerine geliştirici ekip",
        body: [
          "İzmir'de yazılım hizmeti veren pek çok ajans işi alt yüklenicilere veya başka şehirlerdeki ekiplere aktarır. Biz projeyi kendi ekibimizle geliştiririz; bu, kararların hızlı alınmasını ve sorumluluğun tek elde toplanmasını sağlar.",
          "App Store ve Google Play'de yayında olan ürünlerimiz, bir uygulamayı yalnızca tasarlamakla kalmayıp yayına alıp sürdürebildiğimizin göstergesidir. İzmir'deki işletmeler için bu, fikir aşamasından mağazadaki uygulamaya kadar tek bir muhatapla ilerlemek demektir.",
        ],
      },
      {
        heading: "Hangi işler için başvuruluyor",
        body: [
          "İzmir'den bize en sık; mobil uygulama fikri olan girişimler, online satışa geçmek isteyen markalar ve mevcut süreçlerini dijitalleştirmek isteyen işletmeler başvurur. İster tek bir mobil uygulama, ister web ve mobil tarafı birlikte çalışan bütünleşik bir sistem olsun, kapsamı işletmenin gerçek ihtiyacına göre belirleriz.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "gymbot", anchor: "GymBot yapay zeka antrenman uygulaması" },
      { slug: "baseline", anchor: "Baseline mobil rezervasyon uygulaması" },
    ],
    metaTitle: "İzmir Yazılım ve Mobil Uygulama",
    metaDescription:
      "İzmir'e mobil uygulama ve web yazılımı geliştiren Uşak merkezli firma. App Store ve Google Play'de yayında ürünlerimizle iş bitirme kapasitesi.",
  },
  {
    slug: "denizli-yazilim-mobil-uygulama",
    eyebrow: "Denizli · Yazılım",
    h1: "Denizli'ye yazılım ve mobil uygulama geliştirme",
    lead: "Uşak'a komşu Denizli'deki işletmelere mobil uygulama, web yazılım ve e-ticaret altyapısı geliştiriyoruz.",
    intro: [
      "Denizli, tekstil ve ev tekstili üretiminde Türkiye'nin önde gelen şehirlerindendir ve Uşak'a komşudur. Bu yakınlık, Denizli'deki işletmelerle hem uzaktan hem yerinde rahat çalışmamızı sağlar. BAI Technology, Denizli'ye mobil uygulama, web yazılımı ve e-ticaret altyapısı geliştirir.",
      "Denizli'nin üretim ve ihracat ağırlıklı yapısı, online satış ve süreç dijitalleştirme ihtiyacını öne çıkarır. Kendi markasıyla online satış yapmak isteyen üreticiler için e-ticaret altyapısı, saha ve sipariş yöneten firmalar için ise özel yazılım doğrudan fayda sağlar.",
    ],
    sections: [
      {
        heading: "Denizli işletmeleri için ne yapıyoruz",
        body: [
          "Markaya özel e-ticaret altyapısı, iOS ve Android mobil uygulama, kurumsal ve işlevsel web yazılımı ile işletmeye özel yazılım başlıca hizmetlerimizdir. Özellikle üretim yapan ve doğrudan online satışa geçmek isteyen firmalar için kendi mağaza altyapılarını kurarız.",
        ],
      },
      {
        heading: "Komşu şehir avantajı",
        body: [
          "Uşak ile Denizli arasındaki kısa mesafe, gereksinim analizi ve kritik teslim aşamalarında yüz yüze çalışmayı kolaylaştırır. Projelerin büyük kısmını uzaktan verimli yürütür, gerektiğinde yerinde buluşuruz.",
        ],
      },
      {
        heading: "Üreticiden son kullanıcıya",
        body: [
          "Denizli'nin ev tekstili ve tekstil üretimindeki gücü, doğrudan online satış için önemli bir fırsat sunar. Kendi markasıyla satış yapmak isteyen üreticiler için, aracı pazaryerlerine bağımlı kalmadan çalışan bir e-ticaret altyapısı hem marj hem de müşteri ilişkisi açısından avantaj sağlar.",
          "Üretim yapan firmaların bir diğer ihtiyacı, sipariş ve üretim süreçlerini dijitalleştiren özel yazılımlardır. Uşak'a komşu olmamız, bu tür projelerde yüz yüze çalışmayı ve süreçleri yerinde anlamayı kolaylaştırır.",
        ],
      },
      {
        heading: "Nasıl ilerliyoruz",
        body: [
          "Denizli'deki bir projede önce ihtiyacı yerinde veya görüşmeyle anlar, kapsamı netleştiririz. Komşu şehir olmanın sağladığı yakınlık, özellikle üretim ve saha süreçlerini konu alan projelerde yüz yüze çalışmayı kolaylaştırır. Projenin büyük kısmını uzaktan verimli yürütür, kritik aşamalarda yerinde oluruz.",
        ],
      },
    ],
    relatedProjects: [
      { slug: "dukan", anchor: "Dukan e-ticaret altyapısı" },
      { slug: "baseline", anchor: "Baseline mobil uygulaması" },
    ],
    metaTitle: "Denizli Yazılım ve Mobil Uygulama",
    metaDescription:
      "Denizli'ye e-ticaret altyapısı, mobil uygulama ve web yazılımı geliştiren Uşak merkezli firma. Komşu şehir avantajıyla uzaktan ve yerinde çalışma.",
  },
]

export function getLocation(slug: string): LocationPage | undefined {
  return locations.find((l) => l.slug === slug)
}
