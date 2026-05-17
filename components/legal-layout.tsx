import type React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type LegalLayoutProps = {
  eyebrow: string
  title: string
  italicWord?: string
  intro?: React.ReactNode
  updatedAt: string
  children: React.ReactNode
}

export function LegalLayout({
  eyebrow,
  title,
  italicWord,
  intro,
  updatedAt,
  children,
}: LegalLayoutProps) {
  return (
    <article className="relative pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="wrap">
        {/* Back link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-mono text-ink-3 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Ana sayfaya dön
        </Link>

        {/* Header */}
        <header className="mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
              — {eyebrow}
            </span>
            <span className="hidden h-px w-10 bg-rule sm:block" />
            <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
              Edition 001
            </span>
          </div>

          <h1 className="display mt-5 text-[clamp(36px,5vw,68px)] text-ink">
            {italicWord ? (
              <>
                {title}{" "}
                <span className="italic-amber">{italicWord}</span>
              </>
            ) : (
              title
            )}
          </h1>

          {intro && (
            <div className="mt-6 text-[16px] leading-relaxed text-ink-2">{intro}</div>
          )}

          <div className="mt-8 flex items-center gap-3 border-t border-rule pt-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
            <span>Son güncelleme</span>
            <span className="notranslate">{updatedAt}</span>
          </div>
        </header>

        {/* Body */}
        <div className="legal-body mt-12 max-w-3xl">{children}</div>

        {/* Cross-links */}
        <nav
          aria-label="Hukuki belgeler"
          className="mt-20 grid gap-px border-y border-rule sm:grid-cols-3"
        >
          <LegalCrossLink href="/aydinlatma-metni" label="Aydınlatma Metni" n="01" />
          <LegalCrossLink href="/gizlilik-politikasi" label="Gizlilik Politikası" n="02" />
          <LegalCrossLink href="/cerez-politikasi" label="Çerez Politikası" n="03" />
        </nav>
      </div>
    </article>
  )
}

function LegalCrossLink({ href, label, n }: { href: string; label: string; n: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-4 bg-bg px-6 py-5 transition-colors hover:bg-bg-elev sm:border-r sm:border-rule sm:last:border-r-0"
    >
      <span className="flex items-center gap-3">
        <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
          — {n}
        </span>
        <span className="font-serif text-lg text-ink">{label}</span>
      </span>
      <span
        aria-hidden="true"
        className="text-ink-3 transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  )
}
