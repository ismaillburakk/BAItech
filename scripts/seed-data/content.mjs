// OTOMATİK AKTARIM — kaynak: ../lib/projects.ts, ../lib/services.ts, ../lib/faq.ts
// Metinler mevcut siteden birebir alınmıştır (structuredData/SEO alanları hariç).
// Görsel yolları taslak/public/img/ altına kopyalanan dosyalara göre güncellendi.

export const projects = [
  {
    "id": "case-01",
    "slug": "baseline",
    "category": "Spor & Rezervasyon",
    "status": "Aktif / Yayında",
    "statusTone": "live",
    "title": "Baseline",
    "subtitle": "Tenis Kulüpleri için Kapsamlı Rezervasyon ve Yönetim Platformu",
    "metaDescription": "Tenis kulüpleri için rezervasyon ve yönetim platformu. Kort rezervasyonu, antrenör eşleştirme ve üyelik yönetimini iOS ve Android uygulamasında toplar.",
    "body": [
      "Baseline, tenis kulüpleri, antrenörler ve sporseverler için geliştirilmiş kapsamlı bir rezervasyon ve yönetim platformudur. Kulüplerin kort rezervasyonlarını, özel ders süreçlerini ve üyelik yönetimini tek bir sistem üzerinden dijital ortama taşımasını sağlar.",
      "Platform; kulüp sahipleri, antrenörler ve kullanıcılar için ayrı rol yapılarıyla çalışır. Kullanıcılar uygulama üzerinden kort rezervasyonu yapabilir, sertifikalı antrenörlerden özel ders talep edebilir ve kulüp üyeliklerini yönetebilir. Kulüpler ise rezervasyonları, antrenörleri, kortları ve üyelikleri merkezi bir panelden takip edebilir.",
      "Baseline aynı zamanda tenis ekipmanları ve spor ürünleri satan mağazaların ürünlerini listeleyip satacağı entegre bir pazaryeri modülü de içerecek şekilde planlanmaktadır. Bu modülle mağazalar, ürünlerini platforma yükleyerek doğrudan sporseverlere ulaşabilecektir.",
      "Baseline’ı farklılaştıran temel özellikler:"
    ],
    "bullets": [
      "Gerçek zamanlı kort müsaitlik takibi ve online rezervasyon",
      "Antrenör–öğrenci eşleştirme ve özel ders yönetimi",
      "Entegre ödeme sistemi ile güvenli online tahsilat",
      "Kulüp üyelik sistemi ve üye yönetimi",
      "Tenis ekipmanları ve spor ürünleri için planlanan entegre pazaryeri modülü",
      "iOS ve Android platformlarında sorunsuz çalışan native mobil uygulama",
      "Push bildirim sistemi ile anlık kullanıcı bildirimleri"
    ],
    "note": "Durum: iOS ve Android platformlarında aktif olarak yayında",
    "meta": [
      {
        "label": "Sektör",
        "value": "Tenis · Spor"
      },
      {
        "label": "Platform",
        "value": "iOS · Android"
      }
    ],
    "storeLinks": {
      "appStore": "https://apps.apple.com/tr/app/baseline/id6762238661?l=tr",
      "playStore": "https://play.google.com/store/apps/details?id=com.bai.baseline"
    },
    "gallery": {
      "tabs": [
        {
          "label": "Baseline",
          "images": [
            {
              "src": "/img/projects-ss/baseline/baseline-01.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 1",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-02.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 2",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-03.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 3",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-04.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 4",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-05.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 5",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-06.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 6",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-07.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 7",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/baseline/baseline-08.webp",
              "alt": "Baseline tenis kulübü rezervasyon uygulaması — ekran 8",
              "type": "mobile"
            }
          ]
        }
      ]
    },
    "tech": "React Native · Django · PostgreSQL"
  },
  {
    "id": "case-02",
    "slug": "bukira",
    "category": "Randevu & Yönetim",
    "status": "Aktif / Yayında",
    "statusTone": "live",
    "title": "Bukira",
    "subtitle": "Randevuyla Çalışan İşletmeler için Randevu ve Yönetim Platformu",
    "metaDescription": "Randevuyla çalışan işletmeler için randevu ve yönetim platformu. Takvim, müşteri kayıtları, hizmet ve personel programını iOS ve Android'de birleştirir.",
    "body": [
      "Bukira, randevuyla çalışan işletmeler için geliştirilen bir randevu ve işletme yönetim platformudur. İşletmeler; randevu takvimini, müşteri kayıtlarını, hizmet tanımlarını ve personel programını tek bir mobil uygulama üzerinden yönetebilir.",
      "Uygulama, gün içi akışı takvim üzerinden görünür kılar: randevular saat bazında listelenir, personele ve duruma (onaylı, bekliyor) göre filtrelenebilir. Müşteri geçmişi ve hizmet tanımları aynı sistemde tutulur; böylece işletme sahibi dağınık araçlar yerine tek bir yerden çalışır.",
      "Bukira, farklı hizmet sektörlerinin ortak ihtiyaçlarını temel alır; iOS ve Android platformlarında yayındadır."
    ],
    "bullets": [
      "Haftalık ve günlük randevu takvimi",
      "Personel bazlı program ve filtreleme",
      "Müşteri kayıtları ve geçmiş takibi",
      "Hizmet tanımları ve süre yönetimi"
    ],
    "note": "Durum: iOS ve Android platformlarında aktif olarak yayında",
    "meta": [
      {
        "label": "Alan",
        "value": "Randevu · Yönetim"
      },
      {
        "label": "Platform",
        "value": "iOS · Android"
      }
    ],
    "storeLinks": {
      "appStore": "https://apps.apple.com/tr/app/bukira/id6789983975?l=tr",
      "playStore": "https://play.google.com/store/apps/details?id=com.bukira.admin"
    },
    "webUrl": "https://bukira.com.tr",
    "gallery": {
      "tabs": [
        {
          "label": "Bukira",
          "images": [
            {
              "src": "/img/projects-ss/bukira/bukira-01.webp",
              "alt": "Bukira randevu ve işletme yönetim uygulaması — ekran 1",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/bukira/bukira-02.webp",
              "alt": "Bukira randevu ve işletme yönetim uygulaması — ekran 2",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/bukira/bukira-03.webp",
              "alt": "Bukira randevu ve işletme yönetim uygulaması — ekran 3",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/bukira/bukira-04.webp",
              "alt": "Bukira randevu ve işletme yönetim uygulaması — ekran 4",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/bukira/bukira-05.webp",
              "alt": "Bukira randevu ve işletme yönetim uygulaması — ekran 5",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/bukira/bukira-06.webp",
              "alt": "Bukira randevu ve işletme yönetim uygulaması — ekran 6",
              "type": "mobile"
            }
          ]
        }
      ]
    },
    "tech": "React Native · Django · PostgreSQL"
  },
  {
    "id": "case-03",
    "slug": "gymbot",
    "category": "Spor & Sağlık",
    "status": "Aktif / Yayında",
    "statusTone": "live",
    "title": "GymBot",
    "subtitle": "Yapay Zeka Destekli Akıllı Antrenman ve Sağlık Asistanı",
    "metaDescription": "Yapay zeka destekli antrenman ve sağlık asistanı. Spor hareketlerini gerçek zamanlı analiz eder, kişiye özel antrenman ve diyet planları sunar. iOS ve Android.",
    "body": [
      "GymBot, mobil platformlar için geliştirilen, yapay zeka destekli bir spor ve sağlık takip sistemidir. Sistem, spor hareketlerini analiz ederek kullanıcının hareketleri doğru yapıp yapmadığını, hareketlerin doğruluk oranlarını ve egzersiz sırasında hangi noktaların eksik veya hatalı olduğunu gerçek zamanlı olarak belirler.",
      "GymBot’un yapay zeka altyapısı yalnızca hareket analiziyle sınırlı değildir. Kullanıcının hedeflerine, fiziksel durumuna ve ilerleme verilerine göre kişiye özel antrenman programları ve diyet planları oluşturabilen bir yapıya sahiptir. Aynı zamanda kullanıcılar; antrenman programlarını, ağırlık ve gelişim grafiklerini, diyet planlarını ve günlük mikro–makro besin değerlerini uygulama üzerinden takip edebilir.",
      "Bu bütüncül yapı sayesinde GymBot, kullanıcıya yalnızca veri sunan bir uygulama değil; antrenman, beslenme ve gelişimi tek bir merkezden yönlendiren akıllı bir spor asistanıdır."
    ],
    "note": "Durum: iOS ve Android platformlarında aktif olarak yayında",
    "meta": [
      {
        "label": "Alan",
        "value": "Spor · Beslenme"
      },
      {
        "label": "Platform",
        "value": "iOS · Android"
      }
    ],
    "storeLinks": {
      "appStore": "https://apps.apple.com/tr/app/gymbot/id6784051250?l=tr",
      "playStore": "https://play.google.com/store/apps/details?id=com.gymbot.app"
    },
    "gallery": {
      "tabs": [
        {
          "label": "GymBot",
          "images": [
            {
              "src": "/img/projects-ss/gymbot/gymbot-01.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 1",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-02.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 2",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-03.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 3",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-04.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 4",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-05.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 5",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-06.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 6",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-07.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 7",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-08.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 8",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-09.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 9",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/gymbot/gymbot-10.webp",
              "alt": "GymBot antrenman ve beslenme takibi uygulaması — ekran 10",
              "type": "mobile"
            }
          ]
        }
      ]
    },
    "tech": "React Native · Django · Celery"
  },
  {
    "id": "case-04",
    "slug": "dukan",
    "category": "E-Ticaret",
    "status": "Aktif / Yayında",
    "statusTone": "live",
    "title": "Dukan",
    "subtitle": "Beyaz Etiket, Tek Kiracılı E-Ticaret Altyapısı",
    "metaDescription": "Beyaz etiket, tek kiracılı e-ticaret altyapısı. Markalar kendi alan adı ve temasıyla web mağazası kurar; satış ile yönetim paneli tek sistemde birleşir.",
    "body": [
      "Dukan, markaların kendi online mağazalarını kurup yönetebilmesi için geliştirilen beyaz etiket bir e-ticaret altyapısıdır. Her mağaza kendi alan adı, teması ve ürün kataloğuyla tek kiracılı olarak çalışır; müşteri tarafı ve yönetim paneli tek sistemde birleşir.",
      "Müşteri tarafında ürün listeleme, kategori ve arama, sepet ve ödeme akışı yer alır. Yönetim panelinde ise ürün, kategori, sipariş, stok ve kampanya yönetimi ile temel satış raporları bulunur.",
      "Amaç, işletmelerin sıfırdan geliştirme yapmadan kendi markalı satış kanalını hızlıca kurabilmesidir."
    ],
    "bullets": [
      "Beyaz etiket, markaya özel mağaza",
      "Ürün, kategori ve stok yönetimi",
      "Sipariş takibi ve durum yönetimi",
      "Kampanya, kupon ve satış raporları"
    ],
    "note": "Durum: Aktif olarak kullanımda",
    "meta": [
      {
        "label": "Sektör",
        "value": "E-Ticaret"
      },
      {
        "label": "Platform",
        "value": "Web"
      }
    ],
    "gallery": {
      "tabs": [
        {
          "label": "Müşteri Tarafı",
          "images": [
            {
              "src": "/img/projects-ss/dukan/dukan-01-anasayfa.webp",
              "alt": "Dukan e-ticaret mağazası — ana sayfa",
              "type": "web",
              "w": 1920,
              "h": 1080
            },
            {
              "src": "/img/projects-ss/dukan/dukan-02-urun-detay.webp",
              "alt": "Dukan e-ticaret mağazası — ürün detay",
              "type": "web",
              "w": 1920,
              "h": 1080
            },
            {
              "src": "/img/projects-ss/dukan/dukan-03-sepet.webp",
              "alt": "Dukan e-ticaret mağazası — sepet",
              "type": "web",
              "w": 1920,
              "h": 1080
            },
            {
              "src": "/img/projects-ss/dukan/dukan-03b-odeme.webp",
              "alt": "Dukan e-ticaret mağazası — ödeme",
              "type": "web",
              "w": 1920,
              "h": 1080
            }
          ]
        },
        {
          "label": "Yönetim Paneli",
          "images": [
            {
              "src": "/img/projects-ss/dukan/dukan-04-dashboard.webp",
              "alt": "Dukan e-ticaret yönetim paneli — genel bakış",
              "type": "web",
              "w": 1920,
              "h": 1080
            },
            {
              "src": "/img/projects-ss/dukan/dukan-05-siparisler.webp",
              "alt": "Dukan e-ticaret yönetim paneli — siparişler",
              "type": "web",
              "w": 1920,
              "h": 1080
            },
            {
              "src": "/img/projects-ss/dukan/dukan-06-urun-yonetimi.webp",
              "alt": "Dukan e-ticaret yönetim paneli — ürün yönetimi",
              "type": "web",
              "w": 1920,
              "h": 1080
            },
            {
              "src": "/img/projects-ss/dukan/dukan-06b-urun-duzenle.webp",
              "alt": "Dukan e-ticaret yönetim paneli — ürün düzenle",
              "type": "web",
              "w": 1920,
              "h": 1080
            }
          ]
        }
      ]
    },
    "tech": "Django · Next.js · PostgreSQL"
  },
  {
    "id": "case-05",
    "slug": "isletmelere-ozel-yazilim",
    "category": "Kurumsal Yazılım",
    "title": "İşletmelere Özel Yazılım",
    "subtitle": "İhtiyaca Özel Web ve Mobil Yazılım Çözümleri",
    "metaDescription": "İşletmelere özel web, iOS ve Android yazılım geliştirme. Hazır paketler yerine sürece göre tasarlanan çözümler; inşaat yönetimi ve kurumsal web siteleri dahil.",
    "body": [
      "BAI Teknoloji olarak, işletmelerin ihtiyaçlarına göre web, iOS ve Android tabanlı yazılımlar geliştiriyoruz. Her kurumun iş yapış şekli farklı olduğundan, hazır çözümler yerine talebe özel yazılımlar üretiyoruz.",
      "Bu sayfadaki işlerin ortak bir ürünü yok; ortak noktaları, her birinin o işletmenin çalışma biçimine göre baştan tasarlanmış olması.",
      "Her proje, ilgili işletmenin süreçlerine göre baştan tasarlanır; ortak nokta, işi yerinde anlayıp ona göre yazılım üretmektir."
    ],
    "bullets": [
      "Web, iOS ve Android platformlarda geliştirme"
    ],
    "note": "Benzer bir ihtiyacınız varsa bugün işi nasıl yürüttüğünüzü anlatmanız yeterli.",
    "meta": [
      {
        "label": "Alan",
        "value": "Kurumsal Yazılım"
      },
      {
        "label": "Platform",
        "value": "Web · Mobil"
      }
    ],
    "gallery": {
      "tabs": [
        {
          "label": "Uygulama ekranları",
          "images": [
            {
              "src": "/img/projects-ss/cetin-group/cetin-group-01.webp",
              "alt": "İnşaat proje ve saha yönetimi uygulaması — ekran 1",
              "type": "mobile"
            },
            {
              "src": "/img/projects-ss/cetin-group/cetin-group-02.webp",
              "alt": "İnşaat proje ve saha yönetimi uygulaması — ekran 2",
              "type": "mobile"
            }
          ]
        }
      ]
    },
    "tech": "Web · iOS · Android"
  },
  {
    "id": "case-06",
    "slug": "chatekg",
    "category": "Sağlık Teknolojisi",
    "status": "Geliştirme Aşamasında",
    "statusTone": "active",
    "title": "ChatEKG",
    "subtitle": "Açıklanabilir Yapay Zeka ile Akıllı EKG Analizi ve Karar Destek Sistemi",
    "metaDescription": "Açıklanabilir yapay zeka (XAI) ile EKG analizi ve klinik karar destek sistemi. Acil serviste EKG yorumlamayı hızlandırır; web ve mobil için geliştiriliyor.",
    "body": [
      "ChatEKG, acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırmak ve standartlaştırmak için geliştirilen yapay zeka tabanlı bir sağlık teknolojisi projesidir. Sistem; EKG kağıdı veya dijital EKG görüntülerini analiz ederek ritim bozukluklarına yönelik ön değerlendirme ve klinik yönlendirme önerileri sunmayı hedefler.",
      "ChatEKG’yi farklılaştıran temel nokta, yalnızca sonuç üretmeyip açıklanabilir yapay zeka (XAI) ile kararın dayandığı EKG segmentlerini görsel ve metinsel biçimde sunmasıdır. Böylece sağlık profesyonelleri, modelin hangi örüntüler üzerinden sonuca ulaştığını daha şeffaf şekilde inceleyebilir.",
      "Görüntü işleme, derin öğrenme ve doğal dil işleme bileşenleriyle çalışan sistem; chat tabanlı arayüz üzerinden anlaşılır çıktı üretir. Web ve mobil platformlarda, ek donanım gerektirmeden çalışacak şekilde tasarlanmakta; Türkçe ve İngilizce dil desteğiyle ölçeklenebilir bir ürün hedeflemektedir."
    ],
    "note": "Durum: Aktif geliştirme sürecinde",
    "meta": [
      {
        "label": "Alan",
        "value": "Sağlık · XAI"
      },
      {
        "label": "Platform",
        "value": "Web · Mobile"
      }
    ],
    "tech": "Derin Öğrenme · PyTorch · Görüntü İşleme"
  }
]

export const services = [
  {
    "n": "001",
    "title": "Mobil Uygulama Geliştirme",
    "body": "iOS ve Android için native mobil uygulamalar geliştiriyoruz; App Store ve Google Play'de yayında ürünlerimiz bunun kanıtı."
  },
  {
    "n": "002",
    "title": "Web Geliştirme",
    "body": "Kurumsal sitelerden çok kullanıcılı yönetim panellerine kadar, arka planda gerçek iş yapan web yazılımları geliştiriyoruz."
  },
  {
    "n": "003",
    "title": "Özel Yazılım",
    "body": "İşletmenizin sürecine göre baştan tasarlanan, hazır paketlerin çözemediği talebe özel yazılımlar geliştiriyoruz."
  },
  {
    "n": "004",
    "title": "E-Ticaret Altyapısı",
    "body": "Markanıza özel, tek kiracılı e-ticaret altyapıları kuruyoruz; ürün, sipariş, stok ve ödeme tek sistemde birleşir."
  },
  {
    "n": "005",
    "title": "Yapay Zeka Modelleri",
    "body": "Görüntü ve dil tabanlı yapay zeka modellerini sıfırdan eğitiyoruz; süreç otomasyonu ve veri analizini hazır servislerle değil, kendi modellerimizle çözeriz."
  },
  {
    "n": "006",
    "title": "Hosting & Sunucu Yönetimi",
    "body": "Geliştirdiğimiz yazılımları yayına alıyor; sunucu kurulumundan alan adı ve SSL bağlantısına kadar barındırma tarafını yönetiyoruz."
  },
  {
    "n": "007",
    "title": "SEO & Dijital Görünürlük",
    "body": "Sitenizin arama motorlarında ve yapay zeka asistanlarında doğru anlaşılması için teknik SEO, yapılandırılmış veri ve hız üzerinde çalışıyoruz."
  },
  {
    "n": "008",
    "title": "Bakım & Teknik Destek",
    "body": "Yayına aldığımız yazılımların güncellemelerini, hata düzeltmelerini ve teknik desteğini yayından sonra da sürdürüyoruz."
  }
]

export const faqItems = [
  {
    "question": "BAI Technology ne yapar?",
    "answer": "BAI Technology, 2025'te kurulan bir yazılım ve yapay zeka firmasıdır. Mobil uygulama, web ve işletmeye özel yazılım geliştirir; markalara e-ticaret altyapısı kurar ve görüntü ile dil tabanlı yapay zeka modellerini kendisi eğitir. Geliştirdiği yazılımları yayına alır; sunucu yönetimini, SEO çalışmasını ve bakımını da üstlenir. Baseline, Bukira ve GymBot App Store ve Google Play'de yayındadır."
  },
  {
    "question": "BAI Technology kendi yapay zeka modelini mi geliştiriyor?",
    "answer": "Evet. BAI Technology hazır yapay zeka servislerini çağırmakla yetinmez; görüntü işleme ve doğal dil işleme üzerine kendi modellerini eğitir. GymBot uygulamasındaki gerçek zamanlı hareket analizi ve geliştirme aşamasındaki ChatEKG'nin açıklanabilir yapay zeka (XAI) ile EKG yorumlaması bu yaklaşımın çıktılarıdır. Modeller PyTorch ile geliştirilir."
  },
  {
    "question": "BAI Technology'nin uygulamaları hangi mağazalarda yayında?",
    "answer": "BAI Technology'nin Baseline, Bukira ve GymBot uygulamaları App Store ve Google Play'de yayındadır. Baseline tenis kulüpleri için rezervasyon ve yönetim platformu, Bukira randevuyla çalışan işletmeler için randevu ve yönetim platformu, GymBot ise yapay zeka destekli antrenman ve sağlık asistanıdır. Mağaza yayın sürecini firma kendisi yürütür."
  },
  {
    "question": "Mobil uygulama geliştirme maliyeti nedir?",
    "answer": "Maliyet, uygulamanın kapsamına göre değişir. Hedeflenen platformlar (iOS, Android), ekran sayısı, ödeme veya harita gibi entegrasyonlar ve yapay zeka bileşenleri belirleyici kalemlerdir. BAI Technology sabit bir liste fiyatı vermek yerine, ihtiyaç görüşmesinin ardından net bir kapsam ve teklif sunar. Uygulamalar iOS ve Android için native geliştirilir."
  },
  {
    "question": "Bir mobil uygulama ne kadar sürede geliştirilir?",
    "answer": "Basit bir uygulama birkaç haftada, çok kullanıcılı ve entegrasyonlu bir platform ise birkaç aya yayılan bir sürede geliştirilir. BAI Technology proje başında akışı ve öncelikleri birlikte belirler; çalışan bir ilk sürümü erken çıkarmayı tercih eder. Süre, ekran sayısı ve entegrasyonlarla doğrudan ilişkilidir."
  },
  {
    "question": "E-ticaret altyapısını nereden alabilirim?",
    "answer": "BAI Technology, Dukan adlı beyaz etiket e-ticaret altyapısını geliştirir. Her mağaza tek kiracılı çalışır: marka kendi alan adı, teması ve ürün kataloğuyla yayına girer. Müşteri tarafı ile yönetim paneli tek sistemde birleşir; ürün, sipariş, stok ve kampanya yönetimi buradan yürütülür. Sıfırdan geliştirmeye göre daha hızlı kurulur."
  },
  {
    "question": "E-ticaret sitesi kurmak ne kadar sürer?",
    "answer": "BAI Technology'nin kendi e-ticaret altyapısı Dukan üzerinden kurulan mağazalar, sıfırdan geliştirmeye göre belirgin şekilde daha hızlı yayına alınır. Süre; ürün kataloğunun büyüklüğü, tema uyarlaması ve ödeme ile kargo entegrasyonlarına bağlıdır. Mağaza, kendi alan adı ve temasıyla tek kiracılı olarak çalışır."
  },
  {
    "question": "Yapay zeka modeli geliştirme nasıl bir süreçtir?",
    "answer": "Süreç; problemin tanımlanması, verinin toplanıp hazırlanması, modelin eğitilmesi, doğruluğunun ölçülmesi ve ürüne güvenli biçimde entegre edilmesinden oluşur. BAI Technology bu süreci hazır bir servisi çağırarak değil, kendi modelini eğiterek yürütür. Sonuç probleminize özel olur ve veriniz üzerinde kontrol sizde kalır."
  },
  {
    "question": "Neden hazır yapay zeka servisi yerine kendi modelinizi geliştiriyorsunuz?",
    "answer": "Hazır servisler genel amaçlıdır; probleminize özel isabet ve veri kontrolü sunmaz. BAI Technology kendi modelini eğittiğinde daha doğru sonuçlar alır ve özellikle sağlık gibi alanlarda kararın neye dayandığını açıklanabilir yapay zeka (XAI) ile gösterebilir. Görüntü işleme ve doğal dil işleme başlıca çalışma alanlarıdır."
  },
  {
    "question": "Uygulamayı App Store ve Google Play'de yayınlıyor musunuz?",
    "answer": "Evet, mağaza yayın sürecini BAI Technology yürütür. Baseline, Bukira ve GymBot uygulamaları hâlihazırda her iki mağazada yayındadır; inceleme, gizlilik ve izin süreçleri daha önce birden çok kez tamamlanmıştır. Uygulamalar React Native ile geliştirilir; yayın sonrası sürüm güncellemeleri de firma tarafından yürütülür."
  },
  {
    "question": "BAI Technology yazılım yayına alındıktan sonra bakım ve destek veriyor mu?",
    "answer": "Evet. Yazılım yayına alınınca bitmez; BAI Technology işletim sistemi ve mağaza gereksinimlerine göre sürüm güncellemeleri yapar, güvenlik yamalarını uygular ve bildirilen hataları düzeltir. Baseline, Bukira ve GymBot'un mağaza güncellemeleri de bu kapsamdadır. Web ve e-ticaret projelerinde aynı yaklaşım geçerlidir; destek kapsamı ve süresi proje başında birlikte belirlenir."
  },
  {
    "question": "İşletmeme hazır paket mi, özel yazılım mı uygun?",
    "answer": "İşinizi bir hazır programın kurallarına uydurmak zorunda kalıyorsanız, muhtemelen özel yazılıma ihtiyacınız vardır. Standart ihtiyaçlarda hazır çözümler yeterli olabilir; kendine özgü süreçlerde özel yazılım uzun vadede daha verimlidir. BAI Technology süreci yerinde inceler, çalışan bir ilk sürümü çıkarır ve geri bildirimle geliştirir."
  },
  {
    "question": "BAI Technology nerede?",
    "answer": "BAI Technology, Uşak merkezli bir yazılım ve yapay zeka firmasıdır; 2025'te Zafer Teknopark bünyesinde kurulmuştur. Projelerin büyük kısmını uzaktan yürütür ve Türkiye genelindeki işletmelerle çalışır. Mobil uygulama, web, özel yazılım ve yapay zeka projelerinin yanında hosting, SEO ve bakım desteği de verir; gerektiğinde müşterileriyle yüz yüze görüşür."
  },
  {
    "question": "Farklı şehirlerdeki işletmelerle çalışıyor musunuz?",
    "answer": "Evet. BAI Technology projelerin büyük kısmını uzaktan yürütür ve Türkiye genelindeki işletmelerle çalışır. Kritik aşamalarda yüz yüze görüşülür, gerektiğinde yerinde buluşulur. Uzaktan çalışma; mobil uygulama, web, e-ticaret ve işletmeye özel yazılım projelerinin tamamı için geçerlidir. İletişim e-posta ve telefonla sağlanır."
  }
]

export function getProject(slug) {
  return projects.find((p) => p.slug === slug)
}
