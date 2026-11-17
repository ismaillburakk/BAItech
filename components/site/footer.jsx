import Link from "next/link"

import { Logo } from "@/components/site/logo"
import { LEGAL_NAV, NAV } from "@/lib/nav"
import { telHref } from "@/lib/utils"

/** @param {any} props */
export function Footer({ settings }) {
  const contact = settings?.contact
  const brand = settings?.brand
  const addressLines = (contact?.address ?? "").split("\n").filter(Boolean)
  const year = new Date().getFullYear()
  return (
    <footer className="relative isolate overflow-hidden border-t border-border">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo logo={brand?.logo ?? null} />
          {brand?.tagline ? (
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-foreground">{brand.tagline}</p>
          ) : null}
          {brand?.legalName ? <p className="mt-3 text-sm text-muted-foreground">{brand.legalName}</p> : null}
          {settings?.socials?.length ? (
            <ul className="mt-5 flex flex-wrap gap-2">
              {settings.socials.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm capitalize text-muted-foreground transition-colors duration-(--dur-fast) hover:border-brand hover:text-brand-ink"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <nav aria-label="Alt menü">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Sayfalar</h2>
          <ul className="mt-4 space-y-1">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center transition-colors duration-(--dur-fast) hover:text-brand-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">İletişim</h2>
          <address className="mt-4 space-y-1 not-italic text-[0.9375rem]">
            {contact?.email ? (
              <a className="flex min-h-11 items-center [overflow-wrap:anywhere] hover:text-brand-ink" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            ) : null}
            {contact?.phone ? (
              <a className="flex min-h-11 items-center hover:text-brand-ink" href={telHref(contact.phone)}>
                {contact.phone}
              </a>
            ) : null}
            {addressLines.length ? (
              <p className="pt-1 text-muted-foreground">
                {addressLines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            ) : null}
          </address>
        </div>
      </div>
      <p
        aria-hidden="true"
        className="pointer-events-none select-none text-center font-heading text-[clamp(5rem,22vw,20rem)] font-bold leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_var(--border-strong)]"
      >
        BAI
      </p>
      <div className="container-site flex flex-col gap-2 border-t border-border py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {brand?.foundingYear && brand.foundingYear !== String(year) ? `${brand.foundingYear}–${year}` : year}{" "}
          {(brand?.name ?? "BAI Technology").toUpperCase()}. Tüm hakları saklıdır.
        </p>
        <nav aria-label="Yasal bağlantılar">
          <ul className="flex flex-wrap gap-x-5">
            {LEGAL_NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center transition-colors duration-(--dur-fast) hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
