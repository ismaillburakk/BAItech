"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="relative py-24 md:py-32">
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">— Hata</span>
          <span className="hidden h-px w-10 bg-rule sm:block" />
          <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
            500
          </span>
        </div>

        <h1 className="display mt-5 text-[clamp(40px,6vw,88px)] text-ink">
          Bir şeyler <span className="italic-amber">ters gitti.</span>
        </h1>

        <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-2">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 rounded-pill bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px"
          >
            Tekrar Dene
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-pill border border-rule px-6 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-bg-elev"
          >
            Ana Sayfa
            <span className="text-ink-3 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
