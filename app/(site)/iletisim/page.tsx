import type { Metadata } from "next"
import { ContactSection } from "@/components/contact-section"
import { BreadcrumbStructuredData } from "@/components/structured-data"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "İletişim",
  description:
    "Uşak'ta yazılım, mobil uygulama veya yapay zeka projeniz için BAI Technology ile iletişime geçin. E-posta, telefon ve iletişim formu.",
  path: "/iletisim",
})

export default function IletisimPage() {
  return (
    <>
      <BreadcrumbStructuredData
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "İletişim", path: "/iletisim" },
        ]}
      />
      <ContactSection headingAs="h1" />
    </>
  )
}
