import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GTranslateWrapper } from "@/components/gtranslate-client-wrapper"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri",
    template: "%s | BAI Technology",
  },
  description:
    "BAI Technology ile yapay zeka destekli özel yazılım çözümleri. ChatEKG sağlık teknolojisi, GymBot spor asistanı, web ve mobil yönetim sistemleri, e-ticaret çözümleri. İşletmenize özel AI çözümleri geliştiriyoruz.",
  keywords: [
    "yapay zeka",
    "AI çözümleri",
    "özel yazılım",
    "ChatEKG",
    "EKG analizi",
    "GymBot",
    "spor uygulaması",
    "web yazılım",
    "mobil uygulama",
    "e-ticaret",
    "yönetim sistemi",
    "akıllı otomasyon",
    "veri analizi",
    "Çetin Group App",
    "iOS uygulama",
    "Android uygulama",
    "makine öğrenmesi",
    "derin öğrenme",
    "sağlık teknolojisi",
    "açıklanabilir yapay zeka",
    "XAI",
    "chatbot",
    "müşteri deneyimi",
    "iş süreçleri otomasyonu",
  ],
  authors: [{ name: "BAI Technology" }],
  creator: "BAI Technology",
  publisher: "BAI Technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://baitechnology.com"),
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri",
    description:
      "Yapay zeka destekli özel yazılım çözümleri. ChatEKG, GymBot, web ve mobil yönetim sistemleri, e-ticaret platformları. İşletmenize özel AI çözümleri.",
    url: "https://baitechnology.com",
    siteName: "BAI Technology",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/bai-logo.png",
        width: 1200,
        height: 630,
        alt: "BAI Technology Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri",
    description:
      "Yapay zeka destekli özel yazılım çözümleri. ChatEKG, GymBot, web ve mobil yönetim sistemleri, e-ticaret platformları.",
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
  verification: {
    // google: 'your-google-verification-code', // Google Search Console'dan alınacak
    // yandex: 'your-yandex-verification-code', // Yandex Webmaster'dan alınacak
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-tech-darker text-white font-tech relative overflow-x-hidden`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {/* GTranslate bileşeni (script dahil) sadece client'ta çalışır */}
          <GTranslateWrapper />

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
