import { ArrowRightIcon, MailIcon, PhoneIcon } from "lucide-react"
import Link from "next/link"

import { Magnetic } from "@/components/motion/fx"
import { Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { telHref } from "@/lib/utils"

/** Final CTA — storytelling "climax"; mıknatıslı birincil buton. İçerik: Site Ayarları. */
/** @param {any} props */
export function FinalCta({ settings, title }) {
  if (!settings) return null
  const { cta, contact } = settings
  return (
    <section className="container-site py-24">
      <Reveal className="relative isolate overflow-hidden rounded-3xl border border-border-strong bg-band px-6 py-16 text-center md:px-16 md:py-24">
        <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 opacity-60" />
        <div aria-hidden="true" className="absolute -bottom-40 left-1/2 -z-10 h-80 w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow-strong),transparent)] blur-2xl" />
        <h2 className="mx-auto max-w-3xl text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-band-foreground">
          {title ?? cta.title}
        </h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <Button asChild size="lg" className="h-14 rounded-full px-8 text-base shadow-[0_0_48px_var(--glow-strong)]">
              <Link href="/iletisim">
                {cta.buttonLabel}
                <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </Magnetic>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-band-muted">
          {contact.email ? (
            <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center gap-2 [overflow-wrap:anywhere] hover:text-band-foreground">
              <MailIcon className="size-4 shrink-0" aria-hidden="true" /> {contact.email}
            </a>
          ) : null}
          {contact.phone ? (
            <a href={telHref(contact.phone)} className="inline-flex min-h-11 items-center gap-2 hover:text-band-foreground">
              <PhoneIcon className="size-4 shrink-0" aria-hidden="true" /> {contact.phone}
            </a>
          ) : null}
          {contact.responseTime ? <span>Yanıt süresi {contact.responseTime}</span> : null}
        </div>
      </Reveal>
    </section>
  )
}
