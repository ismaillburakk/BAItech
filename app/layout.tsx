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
    default: "Uşak Yazılım ve Yapay Zeka Firması — BAI Technology",
    template: "%s | BAI Technology",
  },
  description:
    "Uşak merkezli yazılım ve yapay zeka firması BAI Technology; mobil uygulama, web yazılım, e-ticaret altyapısı ve işletmeye özel yazılım geliştirir.",
  keywords: [
    "Uşak yazılım firması",
    "Uşak mobil uygulama geliştirme",
    "Uşak web yazılım",
    "Uşak e-ticaret altyapısı",
    "Uşak yapay zeka",
    "Uşak özel yazılım",
    "Ege bölgesi yazılım firması",
    "mobil uygulama geliştirme",
    "yapay zeka model geliştirme",
    "BAI Technology",
    "BAI Teknoloji",
    "BAI",
    "baitech",
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
    languages: { "tr-TR": "/" },
  },
  openGraph: {
    title: "Uşak Yazılım ve Yapay Zeka Firması — BAI Technology",
    description:
      "Uşak merkezli yazılım ve yapay zeka firması. Mobil uygulama, web yazılım, e-ticaret altyapısı ve işletmeye özel yazılım; App Store ve Google Play'de yayında ürünler.",
    url: "https://baitech.com.tr",
    siteName: "BAI Technology",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BAI Technology — Uşak yazılım ve yapay zeka firması",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Uşak Yazılım ve Yapay Zeka Firması — BAI Technology",
    description:
      "Uşak merkezli yazılım ve yapay zeka firması. Mobil uygulama, web yazılım, e-ticaret ve işletmeye özel yazılım geliştiriyoruz.",
    images: ["/og-image.png"],
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
      suppressHydrationWarning
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
