import Script from "next/script"

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BAI Technology",
    alternateName: "BAI Teknoloji",
    url: "https://baitechnology.com",
    logo: "https://baitechnology.com/bai-logo.png",
    description:
      "Yapay zeka destekli özel yazılım çözümleri sunan teknoloji şirketi. ChatEKG, GymBot, web ve mobil yönetim sistemleri, e-ticaret platformları geliştiriyoruz.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
    },
    sameAs: [
      // Sosyal medya hesaplarınız varsa buraya ekleyin
      // "https://twitter.com/baitechnology",
      // "https://www.linkedin.com/company/baitechnology",
      // "https://www.instagram.com/baitechnology"
    ],
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BAI Technology",
    url: "https://baitechnology.com",
    description:
      "Yapay zeka ve özel yazılım çözümleri. ChatEKG sağlık teknolojisi, GymBot spor asistanı, web ve mobil yönetim sistemleri.",
    inLanguage: "tr-TR",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://baitechnology.com/?s={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Software Development",
    provider: {
      "@type": "Organization",
      name: "BAI Technology",
    },
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI ve Yazılım Hizmetleri",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Akıllı Otomasyon",
            description: "Tekrarlayan iş süreçlerinizi yapay zeka ile otomatikleştirin ve zamandan tasarruf edin.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Veri Analizi",
            description: "Büyük veri setlerinizi analiz ederek işletmeniz için değerli içgörüler elde edin.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Müşteri Deneyimi",
            description: "AI destekli chatbotlar ve kişiselleştirme ile müşteri memnuniyetini artırın.",
          },
        },
      ],
    },
  }

  const softwareApplications = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "ChatEKG",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web, iOS, Android",
      description:
        "Açıklanabilir Yapay Zeka ile Akıllı EKG Analizi ve Karar Destek Sistemi. Acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırır.",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "TRY",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: "1",
      },
      provider: {
        "@type": "Organization",
        name: "BAI Technology",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "GymBot",
      applicationCategory: "HealthAndFitnessApplication",
      operatingSystem: "iOS, Android",
      description:
        "Yapay Zeka Destekli Akıllı Antrenman ve Sağlık Asistanı. Spor hareketlerini analiz eder, kişiye özel antrenman ve diyet planları oluşturur.",
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "TRY",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        ratingCount: "1",
      },
      provider: {
        "@type": "Organization",
        name: "BAI Technology",
      },
    },
  ]

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ana Sayfa",
        item: "https://baitechnology.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Hizmetler",
        item: "https://baitechnology.com#services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Projeler",
        item: "https://baitechnology.com#projects",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Hakkımızda",
        item: "https://baitechnology.com#about",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "İletişim",
        item: "https://baitechnology.com#contact",
      },
    ],
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="services-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />
      <Script
        id="software-applications-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplications) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
