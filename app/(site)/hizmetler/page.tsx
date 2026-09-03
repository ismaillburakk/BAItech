import type { Metadata } from "next"
import { PageCta } from "@/components/page-cta"
import { ServicesSection } from "@/components/services-section"
import {
  BreadcrumbStructuredData,
  FaqStructuredData,
  ServicesStructuredData,
} from "@/components/structured-data"
import { faqItems } from "@/lib/faq"
import { pageMetadata } from "@/lib/seo"

// Somut hizmetlerin detayı — süreç, teknoloji ve çıktı odaklı.
const serviceDetails = [
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
]

export const metadata: Metadata = pageMetadata({
  title: "Yazılım ve Yapay Zeka Hizmetleri",
  description:
    "BAI Technology'nin hizmetleri: mobil uygulama geliştirme, web geliştirme, özel yazılım, e-ticaret altyapısı ve yapay zeka modelleri.",
  path: "/hizmetler",
})

export default function HizmetlerPage() {
  return (
    <>
      <ServicesStructuredData />
      <FaqStructuredData />
      <BreadcrumbStructuredData
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
        ]}
      />
      <ServicesSection headingAs="h1" cardHeadingAs="h2" />

      {/* Hizmet detayları — süreç, teknoloji, çıktı */}
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
              — Hizmet Detayları
            </span>
            <span className="hidden h-px w-10 bg-rule sm:block" />
          </div>
          <div className="max-w-3xl divide-y divide-rule border-y border-rule">
            {serviceDetails.map((s) => (
              <div key={s.title} className="reveal py-8">
                <h2 className="font-serif text-[clamp(24px,3vw,32px)] leading-tight text-ink">
                  {s.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sıkça Sorulan Sorular — native accordion + FAQPage şeması aynı kaynaktan */}
      <section className="pb-24 md:pb-32">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
              — Sıkça Sorulan Sorular
            </h2>
            <span className="hidden h-px w-10 bg-rule sm:block" />
          </div>
          <div className="max-w-3xl divide-y divide-rule border-y border-rule">
            {faqItems.map((f) => (
              <details key={f.question} className="group py-5">
                {/* -my-5 py-5: tıklanabilir alan dikeyde 65px'e çıkar (≥44px dokunma
                    hedefi) ama negatif marj görsel yerleşimi birebir korur. */}
                <summary className="-my-5 flex cursor-pointer list-none items-center justify-between gap-6 py-5">
                  <span className="font-serif text-[clamp(18px,2.2vw,23px)] leading-snug text-ink">
                    {f.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[20px] leading-none text-ink-3 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
    </>
  )
}
