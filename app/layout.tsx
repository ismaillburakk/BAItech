import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { GTranslateWrapper } from "@/components/gtranslate-client-wrapper" // Script içeride yönetiliyor

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BAI TECHNOLOGY - AI Çözümleri",
  description: "İşinizi Kolaylaştıran AI Çözümleri",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body
        className={`${inter.className} min-h-screen bg-tech-darker text-white font-tech relative overflow-x-hidden`}
      >
        {/* GTranslate bileşeni (script dahil) sadece client'ta çalışır */}
        <GTranslateWrapper />

        {children}
      </body>
    </html>
  )
}
