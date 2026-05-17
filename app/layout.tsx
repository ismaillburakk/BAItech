import type React from "react"
import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Manrope, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { GTranslateWrapper } from "@/components/gtranslate-client-wrapper"
import { ConsentProvider } from "@/components/consent-context"
import { CookieBanner } from "@/components/cookie-banner"

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri",
    template: "%s | BAI Technology",
  },
  description:
    "BAI Technology — yapay zeka destekli özel yazılım çözümleri. ChatEKG (XAI tabanlı EKG analizi), GymBot (AI antrenör), Baseline (tenis kulübü rezervasyon platformu — App Store / Play Store), Çetin Group App (inşaat yönetimi), web ve mobil yönetim sistemleri, e-ticaret altyapıları.",
  keywords: [
    // Brand & general
    "BAI Technology",
    "BAI Teknoloji",
    "baitech",
    "yapay zeka",
    "AI çözümleri",
    "özel yazılım",
    "yazılım geliştirme",
    "makine öğrenmesi",
    "derin öğrenme",
    "iş süreçleri otomasyonu",
    "akıllı otomasyon",
    "veri analizi",
    "chatbot",
    "müşteri deneyimi",
    // ChatEKG
    "ChatEKG",
    "EKG analizi",
    "yapay zeka EKG",
    "açıklanabilir yapay zeka",
    "XAI",
    "sağlık teknolojisi",
    "klinik karar destek",
    // GymBot
    "GymBot",
    "spor uygulaması",
    "AI antrenör",
    "hareket analizi",
    "Pose AI",
    "fitness uygulaması",
    "diyet uygulaması",
    // Baseline
    "Baseline",
    "Baseline tenis",
    "Baseline app",
    "tenis uygulaması",
    "tenis kort rezervasyon",
    "tenis kulübü yönetim",
    "tenis antrenör platformu",
    "kort rezervasyon uygulaması",
    "tenis ekipmanı pazaryeri",
    // Çetin Group App
    "Çetin Group App",
    "inşaat yönetim sistemi",
    "saha yönetim uygulaması",
    // E-Ticaret
    "e-ticaret",
    "online satış sistemi",
    "özelleştirilmiş e-ticaret",
    // Platform
    "iOS uygulama",
    "Android uygulama",
    "mobil uygulama",
    "web yazılım",
    "yönetim sistemi",
    // Location
    "Uşak yazılım",
    "Türkiye AI",
  ],
  authors: [{ name: "BAI Technology" }],
  creator: "BAI Technology",
  publisher: "BAI Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://baitech.com.tr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BAI Technology — Yapay Zeka ve Özel Yazılım Çözümleri",
    description:
      "ChatEKG (XAI tabanlı EKG analizi), GymBot (AI antrenör), Baseline (tenis kulübü rezervasyon platformu, App Store + Play Store'da yayında), Çetin Group App (inşaat yönetimi), web ve mobil yönetim sistemleri, özelleştirilmiş e-ticaret altyapıları.",
    url: "https://baitech.com.tr",
    siteName: "BAI Technology",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/bai-logo.png",
        width: 1200,
        height: 630,
        alt: "BAI Technology — Yapay Zeka ve Özel Yazılım Çözümleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAI Technology — Yapay Zeka ve Özel Yazılım Çözümleri",
    description:
      "ChatEKG, GymBot, Baseline (tenis platformu — App Store + Play Store), Çetin Group App ve özelleştirilmiş yönetim & e-ticaret çözümleri.",
    images: ["/bai-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#23211d" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4ee" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

const themeInit = `
  try {
    var t = localStorage.getItem('bai-theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="tr"
      data-theme="light"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <ConsentProvider>
          <GTranslateWrapper />
          {children}
          <CookieBanner />
          <Toaster
            position="bottom-left"
            toastOptions={{
              classNames: {
                toast:
                  "!bg-paper !border !border-rule !text-ink !rounded-md !shadow-none !font-sans",
                description: "!text-ink-2",
              },
            }}
          />
        </ConsentProvider>
      </body>
    </html>
  )
}
