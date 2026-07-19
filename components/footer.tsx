"use client"

import Image from "next/image"
import Link from "next/link"
import { useConsent } from "@/components/consent-context"
import { orderedProjects } from "@/lib/projects"
import { services } from "@/lib/services"

// Footer proje linkleri lib/projects.ts'ten türetilir (tek kaynak).
// "İşletmelere Özel Yazılım" tanımlayıcı bir başlık olduğundan çeviriye açık;
// marka adları (Baseline, Bukira, GymBot, Dukan, ChatEKG) notranslate kalır.
const projectLinks = orderedProjects.map((p) => ({
  href: `/projeler/${p.slug}`,
  label: p.title,
  brand: p.slug !== "isletmelere-ozel-yazilim",
}))

const quickLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
]

const legalLinks = [
  { href: "/aydinlatma-metni", label: "Aydınlatma Metni" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
]

// Lokasyon-hizmet sayfaları — site geneli erişim (orphan sayfa kalmasın).
const serviceAreas = [
  { href: "/usak-yazilim-firmasi", label: "Uşak Yazılım Firması" },
  { href: "/usak-mobil-uygulama-gelistirme", label: "Uşak Mobil Uygulama" },
  { href: "/usak-web-yazilim", label: "Uşak Web Yazılım" },
  { href: "/usak-e-ticaret-altyapisi", label: "Uşak E-Ticaret" },
  { href: "/usak-yapay-zeka", label: "Uşak Yapay Zeka" },
  { href: "/usak-ozel-yazilim", label: "Uşak Özel Yazılım" },
  { href: "/ege-yazilim-firmasi", label: "Ege Bölgesi" },
  { href: "/izmir-yazilim-mobil-uygulama", label: "İzmir Yazılım" },
  { href: "/denizli-yazilim-mobil-uygulama", label: "Denizli Yazılım" },
]

export function Footer() {
  const { openSettings } = useConsent()

  return (
    <footer className="border-t border-rule bg-bg">
      <div className="wrap py-16 md:py-24">
        {/* Top mark row */}
        <div className="flex flex-col gap-10 border-b border-rule pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <Image
                src="/bai-logo.png"
                alt="BAI Technology"
                width={40}
                height={40}
                className="object-contain"
              />
              <div className="leading-tight">
                <div className="notranslate font-serif text-[20px] text-ink">BAI Technology</div>
                <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                  Yazılım ve Yapay Zeka
                </div>
              </div>
            </div>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-2">
              İşletmenizin geleceğini yapay zeka ile şekillendiriyoruz. Verimliliği artıran,
              maliyetleri düşüren AI çözümleri.
            </p>
          </div>

          <div className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
            <div>Edition · 2025 / Q4</div>
            <div className="mt-1">Uşak · Türkiye</div>
          </div>
        </div>

        {/* Link groups */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <FooterGroup title="Hızlı Linkler">
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-ink-2 transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterGroup>

          <FooterGroup title="İletişim">
            <ul className="space-y-2.5 text-[15px] text-ink-2">
              <li>
                <a href="mailto:info@baitech.com.tr" className="notranslate hover:text-ink">
                  info@baitech.com.tr
                </a>
              </li>
              <li>
                <a href="tel:+905323694564" className="notranslate hover:text-ink">
                  +90 532 369 4564
                </a>
              </li>
              <li className="text-ink-2">
                Tekstil OSB Mah. 204. Cd. No:566/103
                <br />
                Merkez Uşak
              </li>
            </ul>
          </FooterGroup>

          <FooterGroup title="Çözümler">
            <ul className="space-y-2.5 text-[15px] text-ink-2">
              {services.map((s) => (
                <li key={s.n}>
                  <Link href="/hizmetler" className="transition-colors hover:text-ink">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterGroup>

          <FooterGroup title="Projeler">
            <ul className="space-y-2.5 text-[15px] text-ink-2">
              {projectLinks.map((p) => (
                <li key={p.href} className={p.brand ? "notranslate" : undefined}>
                  <Link href={p.href} className="transition-colors hover:text-ink">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterGroup>

          <FooterGroup title="Hizmet Bölgeleri">
            <ul className="space-y-2.5 text-[15px] text-ink-2">
              {serviceAreas.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="transition-colors hover:text-ink">
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterGroup>

          <FooterGroup title="Yasal">
            <ul className="space-y-2.5 text-[15px] text-ink-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openSettings}
                  className="text-left text-ink-2 underline decoration-rule decoration-1 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                >
                  Çerez Tercihleri
                </button>
              </li>
            </ul>
          </FooterGroup>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-rule pt-8 text-[13px] text-ink-3 md:flex-row md:items-center md:justify-between">
          <p>
            © <span className="notranslate">2025 BAI TECHNOLOGY</span>. Tüm hakları saklıdır.
          </p>
          <p className="notranslate font-mono text-[10px] uppercase tracking-mono">
            baitech.com.tr · Edition 001
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      {/* h2: footer, contentinfo landmark'ının üst düzey bölümleri — yalnızca h1
          içeren sayfalarda (ör. /iletisim, detay) h1→h3 atlamasını önler. */}
      <h2 className="mb-5 font-mono text-[10px] uppercase tracking-mono text-ink-3">— {title}</h2>
      {children}
    </div>
  )
}
