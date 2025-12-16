# BAI Technology - SEO Optimizasyon Rehberi

Bu döküman, BAI Technology web sitesinin SEO optimizasyonunu tamamlamak için gerekli adımları içerir.

## ✅ Tamamlanan Optimizasyonlar

### 1. Meta Tags ve Metadata
- ✅ Detaylı title ve description
- ✅ Keywords listesi (25+ adet hedef anahtar kelime)
- ✅ Open Graph tags (sosyal medya paylaşımları için)
- ✅ Twitter Card metadata
- ✅ Canonical URL
- ✅ Robots meta tags
- ✅ Viewport ve theme-color ayarları

### 2. Structured Data (JSON-LD)
- ✅ Organization schema
- ✅ WebSite schema
- ✅ Service schema
- ✅ SoftwareApplication schema (ChatEKG ve GymBot için)
- ✅ BreadcrumbList schema

### 3. Teknik SEO
- ✅ robots.txt dosyası
- ✅ XML Sitemap
- ✅ Web App Manifest
- ✅ Semantic HTML kullanımı
- ✅ ARIA labels ve accessibility

### 4. İçerik Optimizasyonu
- ✅ H1, H2, H3 başlık hiyerarşisi
- ✅ Detaylı alt text'ler
- ✅ Internal linking (anchor linkler)
- ✅ Mobil uyumlu tasarım

## 🔧 Tamamlanması Gereken Adımlar

### 1. Google Search Console Kurulumu
```typescript
// app/layout.tsx dosyasında verification kodunu ekleyin:
verification: {
  google: 'BURAYA_GOOGLE_VERIFICATION_KODUNUZ',
}
```

**Adımlar:**
1. https://search.google.com/search-console adresine gidin
2. "Mülk ekle" ile domain'inizi ekleyin
3. HTML tag doğrulama yöntemini seçin
4. Verification kodunu yukarıdaki yere yapıştırın

### 2. Yandex Webmaster Kurulumu
```typescript
verification: {
  yandex: 'BURAYA_YANDEX_VERIFICATION_KODUNUZ',
}
```

**Adımlar:**
1. https://webmaster.yandex.com.tr adresine gidin
2. Sitenizi ekleyin
3. Meta tag doğrulama kodunu alın

### 3. Google Analytics Kurulumu
```bash
npm install @next/third-parties
```

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### 4. Sosyal Medya Entegrasyonu
`components/structured-data.tsx` dosyasındaki `sameAs` array'ine sosyal medya hesaplarınızı ekleyin:

```typescript
sameAs: [
  "https://twitter.com/baitechnology",
  "https://www.linkedin.com/company/baitechnology",
  "https://www.instagram.com/baitechnology",
  "https://www.facebook.com/baitechnology"
],
```

### 5. Domain Ayarları
Aşağıdaki dosyalarda `https://baitechnology.com` yerine gerçek domain'inizi kullanın:
- `app/layout.tsx` (metadataBase)
- `app/robots.ts` (host ve sitemap)
- `app/sitemap.ts` (baseUrl)
- `components/structured-data.tsx` (tüm URL'ler)

### 6. Open Graph Image Oluşturma
1200x630 boyutunda bir Open Graph image oluşturun:
```bash
# public/og-image.jpg veya public/og-image.png
```

Sonra `app/layout.tsx` dosyasında güncelleyin:
```typescript
openGraph: {
  images: [
    {
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri',
    },
  ],
}
```

### 7. Blog Bölümü Ekleme (İsteğe Bağlı)
SEO için en önemli faktörlerden biri düzenli içerik üretimidir. Blog bölümü eklemeyi düşünün:

**Önerilen Blog Konuları:**
- "Yapay Zeka ile İş Süreçlerini Nasıl Optimize Edersiniz?"
- "ChatEKG: Sağlık Sektöründe Yapay Zeka Devrimi"
- "E-Ticaret Sitenizi Başarıya Taşıyacak 10 Özellik"
- "Mobil Uygulama Geliştirme: iOS vs Android"
- "Özel Yazılım Neden Hazır Çözümlerden Daha İyidir?"

### 8. Performance Optimizasyonu

**Image Optimization:**
```bash
# Tüm resimleri WebP formatına çevirin
# next/image otomatik optimizasyon yapar ama kaynak dosyalar da küçük olmalı
```

**Core Web Vitals:**
- Lighthouse ile test edin
- PageSpeed Insights ile kontrol edin
- Mobile ve Desktop performansını ölçün

## 📊 SEO Kontrol Listesi

### Haftalık Kontroller
- [ ] Google Search Console'da hata var mı kontrol edin
- [ ] Yeni içerik ekleyin (blog, proje güncellemeleri)
- [ ] Backlink'leri kontrol edin

### Aylık Kontroller
- [ ] Keyword ranking'lerini takip edin
- [ ] Rakip analizi yapın
- [ ] Site hızını test edin (PageSpeed Insights)
- [ ] Mobile usability test edin

### Hedef Keywords (Türkçe)
- yapay zeka çözümleri
- özel yazılım geliştirme
- mobil uygulama geliştirme
- web yazılım şirketi
- AI otomasyon
- EKG analiz yazılımı
- spor uygulaması geliştirme
- e-ticaret platformu
- yönetim sistemi yazılımı
- yapay zeka Türkiye

### Hedef Keywords (İngilizce)
- AI solutions Turkey
- custom software development
- mobile app development
- web development company
- AI automation
- EKG analysis software
- fitness app development
- e-commerce platform
- management system software

## 🔗 Yararlı Linkler

- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com
- Yandex Webmaster: https://webmaster.yandex.com.tr
- PageSpeed Insights: https://pagespeed.web.dev
- Schema.org: https://schema.org
- Open Graph Debugger: https://www.opengraph.xyz

## 📈 Beklenen Sonuçlar

Bu optimizasyonlar tamamlandıktan sonra:
- Google'da ilk 3 sayfa içinde görünme (3-6 ay içinde)
- Organik trafik artışı
- Daha iyi sosyal medya paylaşımları
- Artan dönüşüm oranları
- Daha iyi kullanıcı deneyimi

## 💡 Ekstra Öneriler

1. **Google My Business:** Yerel SEO için Google İşletme Profilini oluşturun
2. **Backlink Stratejisi:** Kaliteli sitelerden backlink almak için guest posting yapın
3. **Video İçerik:** YouTube'da proje tanıtım videoları yayınlayın
4. **Case Study:** Müşteri başarı hikayelerini detaylı anlatın
5. **Email Marketing:** SEO ile gelen trafiği email listesine çevirin
