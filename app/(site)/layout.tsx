import type React from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RevealObserver } from "@/components/reveal-observer"
import { SiteStructuredData } from "@/components/structured-data"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteStructuredData />
      <RevealObserver />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
