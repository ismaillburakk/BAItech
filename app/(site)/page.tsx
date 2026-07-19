import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProjectsSection } from "@/components/projects-section"
import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { BreadcrumbStructuredData } from "@/components/structured-data"
import { HashRedirect } from "@/components/hash-redirect"

export default function Home() {
  return (
    <>
      <HashRedirect />
      <BreadcrumbStructuredData items={[{ name: "Ana Sayfa", path: "/" }]} />
      <HeroSection />
      <ServicesSection moreHref="/hizmetler" />
      <ProjectsSection />
      <AboutSection variant="summary" />
      <ContactSection />
    </>
  )
}
