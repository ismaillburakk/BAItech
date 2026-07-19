import type { Metadata } from "next"
import { AboutSection } from "@/components/about-section"
import { PageCta } from "@/components/page-cta"
import { BreadcrumbStructuredData } from "@/components/structured-data"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Hakkımızda",
  description:
    "BAI Technology; Uşak Zafer Teknopark'ta konumlanan, kendi yapay zeka modellerini geliştiren yazılım firması. Ekibimizi ve çalışma yaklaşımımızı tanıyın.",
  path: "/hakkimizda",
})

// Teknopark, Ar-Ge ve kuruluş hikayesi — içerik derinliği.
const aboutDepth = [
  {
    heading: "Uşak Zafer Teknopark'ta Ar-Ge odaklı çalışma",
    body: "BAI Technology — Türkçe kullanımıyla BAI Teknoloji, kısa adıyla BAI — Uşak Zafer Teknopark bünyesinde faaliyet gösterir. Teknopark statüsü, firmanın yalnızca proje teslim eden bir yazılım evi değil, Ar-Ge odaklı bir ekip olarak çalışmasını sağlar. Bu ortam, üniversite-sanayi yakınlığı ve teknoloji geliştirmeye ayrılmış bir zemin sunar; günlük müşteri işlerinin yanında araştırma ve model geliştirme çalışmalarını sürdürmeyi mümkün kılar.",
  },
  {
    heading: "Kendi yapay zeka modellerimizi geliştiriyoruz",
    body: "Yazılım firmalarının çoğu hazır yapay zeka servislerini kullanır; biz görüntü işleme ve doğal dil işleme üzerine kendi modellerimizi eğitiyoruz. Sağlık alanında açıklanabilir yapay zeka (XAI) ile çalışan EKG analiz sistemi ve spor alanında hareket analizi yapan bir sistem, bu Ar-Ge yaklaşımının somut çıktılarıdır. Model geliştirmek; veriyi hazırlamaktan doğruluğu ölçmeye kadar uzanan, zaman ve uzmanlık isteyen bir süreçtir.",
  },
  {
    heading: "Ürün geliştiren bir ekip",
    body: "2024'te kurulan BAI Technology, kısa sürede App Store ve Google Play'de yayında ürünlere ulaştı. Bir uygulamayı yayına almak, mağaza süreçlerini geçmek ve gerçek kullanıcılarla yaşatmak, ajans işlerinden farklı bir disiplin gerektirir; bu deneyimi bizzat edindik. Aynı ekip; işletmelere özel yazılım, e-ticaret altyapısı ve kurumsal web projeleri de geliştirir. Amacımız, teslim edilip unutulan değil, kullanıldıkça gelişen yazılımlar üretmektir.",
  },
]

export default function HakkimizdaPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ]}
      />
      <AboutSection headingAs="h1" />

      {/* Ar-Ge, Teknopark ve kuruluş — içerik derinliği */}
      <section className="pb-16 md:pb-24">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
              — Ar-Ge ve Yaklaşım
            </span>
            <span className="hidden h-px w-10 bg-rule sm:block" />
          </div>
          <div className="max-w-3xl divide-y divide-rule border-y border-rule">
            {aboutDepth.map((s) => (
              <div key={s.heading} className="reveal py-8">
                <h2 className="font-serif text-[clamp(24px,3vw,32px)] leading-tight text-ink">
                  {s.heading}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
    </>
  )
}
