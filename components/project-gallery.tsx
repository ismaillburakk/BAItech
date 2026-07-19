"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryImage, GalleryTab } from "@/lib/projects"

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

export function ProjectGallery({ tabs }: { tabs: GalleryTab[] }) {
  const [activeTab, setActiveTab] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  const images = tabs[activeTab]?.images ?? []
  const hasTabs = tabs.length > 1

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const track = trackRef.current
    if (!track) return
    const slides = track.querySelectorAll<HTMLElement>("[data-slide]")
    const target = slides[index]
    if (!target) return
    const behavior: ScrollBehavior = smooth && !prefersReducedMotion() ? "smooth" : "auto"
    track.scrollTo({
      left: target.offsetLeft - (track.clientWidth - target.clientWidth) / 2,
      behavior,
    })
  }, [])

  const go = useCallback(
    (delta: number) => {
      setActiveIndex((i) => {
        const n = Math.min(Math.max(i + delta, 0), images.length - 1)
        scrollToIndex(n)
        return n
      })
    },
    [images.length, scrollToIndex]
  )

  // Sekme değişince ilk görsele dön ve track'i başa sar.
  const selectTab = (i: number) => {
    setActiveTab(i)
    setActiveIndex(0)
    requestAnimationFrame(() => scrollToIndex(0, false))
  }

  // Track kaydırıldıkça merkeze en yakın slaytı aktif indeks yap.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const update = () => {
      const slides = track.querySelectorAll<HTMLElement>("[data-slide]")
      if (!slides.length) return
      const center = track.scrollLeft + track.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      slides.forEach((s, i) => {
        const slideCenter = s.offsetLeft + s.clientWidth / 2
        const dist = Math.abs(slideCenter - center)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActiveIndex(best)
    }
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [activeTab])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      go(1)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      go(-1)
    }
  }

  if (!images.length) return null

  return (
    <div
      role="region"
      aria-roledescription="galeri"
      aria-label="Ekran görüntüleri"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="outline-none focus-visible:ring-0"
    >
      {/* Sekme çubuğu — yalnızca birden fazla grup varsa */}
      {hasTabs && (
        <div
          role="tablist"
          aria-label="Görsel grupları"
          className="mb-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-rule pb-3"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={i === activeTab}
              onClick={() => selectTab(i)}
              className={`relative inline-flex min-h-[44px] items-end pb-2 font-mono text-[11px] uppercase tracking-mono transition-colors ${
                i === activeTab ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {tab.label}
              {i === activeTab && (
                <span className="absolute -bottom-[13px] left-0 h-px w-full bg-ink" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Sahne — sabit yükseklik (slayt/sekme değişince sıçrama olmaz) */}
      <div
        ref={trackRef}
        className="gallery-track flex h-[440px] snap-x items-center gap-6 overflow-x-auto sm:h-[540px] lg:h-[620px]"
      >
        {images.map((img, i) => (
          <div
            key={img.src}
            data-slide
            data-index={i}
            aria-hidden={i !== activeIndex}
            className="flex h-full shrink-0 snap-center items-center justify-center"
          >
            {img.type === "mobile" ? (
              <PhoneMockup image={img} priority={i === 0} />
            ) : (
              <BrowserMockup image={img} priority={i === 0} />
            )}
          </div>
        ))}
      </div>

      {/* Kontrol satırı — sayaç + ok butonları (mevcut carousel buton stili) */}
      <div className="mt-6 flex items-center justify-between">
        <span
          className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3"
          aria-live="polite"
        >
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={activeIndex === 0}
            aria-label="Önceki görsel"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-rule text-ink transition-colors hover:bg-bg-elev disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={activeIndex === images.length - 1}
            aria-label="Sonraki görsel"
            className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-rule text-ink transition-colors hover:bg-bg-elev disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Thumbnail şeridi — aktif olan vurgulu */}
      <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={`thumb-${img.src}`}
            type="button"
            onClick={() => {
              setActiveIndex(i)
              scrollToIndex(i)
            }}
            aria-label={`${i + 1}. görsele git`}
            aria-current={i === activeIndex}
            className={`relative h-16 shrink-0 overflow-hidden rounded-sm border transition-opacity ${
              img.type === "mobile" ? "aspect-[9/19.5]" : "aspect-video"
            } ${
              i === activeIndex
                ? "border-ink opacity-100"
                : "border-rule opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={img.src}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── CSS mockup çerçeveleri (dış görsel dosyası yok) ────────────────────── */

function PhoneMockup({ image, priority }: { image: GalleryImage; priority?: boolean }) {
  return (
    <div className="relative h-full aspect-[9/19.5] rounded-lg border border-rule bg-paper p-2 shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--ink)_40%,transparent)]">
      <div className="relative h-full w-full overflow-hidden rounded-md bg-bg">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          className="object-cover"
          sizes="(min-width: 1024px) 300px, 220px"
        />
      </div>
    </div>
  )
}

function BrowserMockup({ image, priority }: { image: GalleryImage; priority?: boolean }) {
  // Görsel alanına en-boy oranı verilir → yükseklik, sabit genişlikten (88vw /
  // max 900px) türeyerek içeriğe göre oluşur. Böylece fill+object-contain'in
  // yüksekliği 0'a çökmesi önlenir; görsel kırpılmadan sığar. Dış kutunun
  // max-h-full'ü yüksekliği sahneyle sınırlar (mevcut yatay görsellerde asla
  // tetiklenmez; sahne yüksekliği h-[440/540/620] sabit kaldığından sekme
  // geçişinde sıçrama olmaz).
  const ratio = image.w && image.h ? image.w / image.h : 16 / 9
  return (
    <div className="flex max-h-full w-[88vw] max-w-[900px] flex-col overflow-hidden rounded-md border border-rule bg-paper shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--ink)_40%,transparent)]">
      {/* Tarayıcı barı — monokrom hairline noktalar + soluk adres çubuğu */}
      <div className="flex shrink-0 items-center gap-1.5 border-b border-rule px-3.5 py-2.5">
        <span className="h-2 w-2 rounded-full border border-rule" />
        <span className="h-2 w-2 rounded-full border border-rule" />
        <span className="h-2 w-2 rounded-full border border-rule" />
        <span className="ml-3 h-3.5 w-full max-w-[220px] rounded-full bg-bg" />
      </div>
      <div className="relative w-full bg-bg" style={{ aspectRatio: ratio }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          className="object-contain"
          sizes="(min-width: 1024px) 900px, 88vw"
        />
      </div>
    </div>
  )
}
