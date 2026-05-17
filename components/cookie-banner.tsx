"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X } from "lucide-react"
import { useConsent } from "@/components/consent-context"

export function CookieBanner() {
  const { consent, acceptAll, rejectNonEssential, savePreferences, isSettingsOpen, openSettings, closeSettings } =
    useConsent()
  const [mounted, setMounted] = useState(false)
  const [functional, setFunctional] = useState(consent.functional)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setFunctional(consent.functional)
  }, [consent.functional])

  if (!mounted) return null

  const showBanner = !consent.decided && !isSettingsOpen
  const showSettings = isSettingsOpen

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-3 bottom-3 z-[55] md:inset-auto md:bottom-6 md:left-6 md:max-w-md"
        >
          <div className="rounded-md border border-rule bg-paper p-5 shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--ink)_30%,transparent)] md:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                — Çerezler
              </span>
              <button
                type="button"
                onClick={rejectNonEssential}
                aria-label="Çerez bandını kapat ve isteğe bağlı çerezleri reddet"
                className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-sm text-ink-3 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2
              id="cookie-banner-title"
              className="mt-3 font-serif text-[22px] leading-snug text-ink"
            >
              Çerez tercihiniz
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
              Web sitemizin çalışması için zorunlu çerezler kullanıyoruz. Dil çevirisi gibi
              fonksiyonel çerezler için onayınızı almak istiyoruz. Ayrıntılı bilgi için{" "}
              <Link href="/cerez-politikasi" className="underline underline-offset-2 hover:text-ink">
                Çerez Politikası
              </Link>
              .
            </p>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-pill bg-ink px-4 py-2 text-[13px] font-medium text-bg transition-transform hover:-translate-y-px"
              >
                Tümünü Kabul Et
              </button>
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-pill border border-rule px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-bg-elev"
              >
                Reddet
              </button>
              <button
                type="button"
                onClick={openSettings}
                className="rounded-pill px-4 py-2 text-[13px] font-medium text-ink-2 underline underline-offset-2 hover:text-ink"
              >
                Tercihler
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-3 backdrop-blur-sm md:items-center md:p-6"
          onClick={closeSettings}
        >
          <div
            className="w-full max-w-lg rounded-md border border-rule bg-paper p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                — Çerez Tercihleri
              </span>
              <button
                type="button"
                onClick={closeSettings}
                aria-label="Tercihler penceresini kapat"
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-rule text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h2
              id="cookie-settings-title"
              className="mt-4 font-serif text-[clamp(24px,3vw,32px)] leading-snug text-ink"
            >
              Tercihinizi <span className="italic-amber">seçin.</span>
            </h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">
              Hangi çerezlerin kullanılmasına izin verdiğinizi belirleyebilirsiniz. Zorunlu çerezler
              web sitemizin çalışması için gereklidir ve devre dışı bırakılamaz.
            </p>

            <ul className="mt-6 space-y-4">
              <li className="rounded-md border border-rule bg-bg p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[18px] text-ink">Zorunlu çerezler</h3>
                    <p className="mt-1 text-[13.5px] text-ink-2">
                      Tema tercihi ve çerez onay kaydı gibi sitenin çalışması için gerekli olan
                      çerezler.
                    </p>
                  </div>
                  <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
                    Her zaman aktif
                  </span>
                </div>
              </li>

              <li className="rounded-md border border-rule bg-bg p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-[18px] text-ink">Fonksiyonel çerezler</h3>
                    <p className="mt-1 text-[13.5px] text-ink-2">
                      Dil çevirisi (Google Translate) gibi ek özelliklerin çalışması için. Bu
                      çerezleri kabul ettiğinizde IP adresiniz Google sunucularına gönderilebilir.
                    </p>
                  </div>
                  <label className="inline-flex shrink-0 cursor-pointer items-center gap-2">
                    <span className="sr-only">Fonksiyonel çerezleri etkinleştir</span>
                    <span
                      className={`relative inline-flex h-6 w-11 rounded-full border transition-colors ${
                        functional ? "border-ink bg-ink" : "border-rule bg-paper"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
                          functional ? "left-6 bg-bg" : "left-0.5 bg-ink-3"
                        }`}
                      />
                    </span>
                    <input
                      type="checkbox"
                      checked={functional}
                      onChange={(e) => setFunctional(e.target.checked)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={() => savePreferences({ functional: false })}
                className="rounded-pill border border-rule px-4 py-2 text-[13px] font-medium text-ink transition-colors hover:bg-bg-elev"
              >
                Yalnızca Zorunlu
              </button>
              <button
                type="button"
                onClick={() => savePreferences({ functional })}
                className="rounded-pill bg-ink px-5 py-2 text-[13px] font-medium text-bg transition-transform hover:-translate-y-px"
              >
                Tercihimi Kaydet
              </button>
            </div>

            <p className="mt-5 text-[12px] text-ink-3">
              Ayrıntılı bilgi için{" "}
              <Link href="/cerez-politikasi" className="underline underline-offset-2 hover:text-ink">
                Çerez Politikası
              </Link>
              .
            </p>
          </div>
        </div>
      )}
    </>
  )
}
