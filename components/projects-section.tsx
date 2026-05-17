"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

type Project = {
  id: string
  slug: string
  category: string
  status?: string
  statusTone?: "active" | "live"
  title: string
  subtitle: string
  body: string[]
  bullets?: string[]
  note?: string
  meta: { label: string; value: string }[]
  links?: {
    appStore?: string
    playStore?: string
  }
}

const projects: Project[] = [
  {
    id: "case-01",
    slug: "chatekg",
    category: "Sağlık Teknolojisi",
    status: "Geliştirme Aşamasında",
    statusTone: "active",
    title: "ChatEKG",
    subtitle: "Açıklanabilir Yapay Zeka ile Akıllı EKG Analizi ve Karar Destek Sistemi",
    body: [
      "ChatEKG, acil servis ve klinik ortamlarda EKG yorumlama sürecini hızlandırmak ve standartlaştırmak için geliştirilen yapay zeka tabanlı bir sağlık teknolojisi projesidir. Sistem; EKG kağıdı veya dijital EKG görüntülerini analiz ederek ritim bozukluklarına yönelik ön değerlendirme ve klinik yönlendirme önerileri sunmayı hedefler.",
      "ChatEKG’yi farklılaştıran temel nokta, yalnızca sonuç üretmeyip açıklanabilir yapay zeka (XAI) ile kararın dayandığı EKG segmentlerini görsel ve metinsel biçimde sunmasıdır. Böylece sağlık profesyonelleri, modelin hangi örüntüler üzerinden sonuca ulaştığını daha şeffaf şekilde inceleyebilir.",
      "Görüntü işleme, derin öğrenme ve doğal dil işleme bileşenleriyle çalışan sistem; chat tabanlı arayüz üzerinden anlaşılır çıktı üretir. Web ve mobil platformlarda, ek donanım gerektirmeden çalışacak şekilde tasarlanmakta; Türkçe ve İngilizce dil desteğiyle ölçeklenebilir bir ürün hedeflemektedir.",
    ],
    note: "Durum: Aktif geliştirme sürecinde",
    meta: [
      { label: "Alan", value: "Sağlık · XAI" },
      { label: "Platform", value: "Web · Mobile" },
      { label: "Dil", value: "TR · EN" },
    ],
  },
  {
    id: "case-02",
    slug: "gymbot",
    category: "Spor & Sağlık",
    status: "Geliştirme Aşamasında",
    statusTone: "active",
    title: "GymBot",
    subtitle: "Yapay Zeka Destekli Akıllı Antrenman ve Sağlık Asistanı",
    body: [
      "GymBot, mobil platformlar için geliştirilen, yapay zeka destekli bir spor ve sağlık takip sistemidir. Sistem, spor hareketlerini analiz ederek kullanıcının hareketleri doğru yapıp yapmadığını, hareketlerin doğruluk oranlarını ve egzersiz sırasında hangi noktaların eksik veya hatalı olduğunu gerçek zamanlı olarak belirlemeyi hedefler.",
      "GymBot’un yapay zeka altyapısı yalnızca hareket analiziyle sınırlı değildir. Kullanıcının hedeflerine, fiziksel durumuna ve ilerleme verilerine göre kişiye özel antrenman programları ve diyet planları oluşturabilen bir yapı üzerine geliştirilmektedir. Aynı zamanda kullanıcılar; antrenman programlarını, ağırlık ve gelişim grafiklerini, diyet planlarını ve günlük mikro–makro besin değerlerini uygulama üzerinden takip edebilecektir.",
      "Bu bütüncül yapı sayesinde GymBot, kullanıcıya yalnızca veri sunan bir uygulama değil; antrenman, beslenme ve gelişimi tek bir merkezden yönlendiren akıllı bir spor asistanı olmayı amaçlar.",
    ],
    note: "Durum: Aktif geliştirme sürecinde",
    meta: [
      { label: "Alan", value: "Spor · Beslenme" },
      { label: "Platform", value: "iOS · Android" },
      { label: "Çekirdek", value: "Pose AI" },
    ],
  },
  {
    id: "case-03",
    slug: "cetin-group-app",
    category: "Kurumsal Yazılım",
    title: "Yönetim Sistemleri",
    subtitle: "İhtiyaca Özel Web ve Mobil Yönetim Çözümleri",
    body: [
      "BAI Teknoloji olarak, işletmelerin ihtiyaçlarına göre web, iOS ve Android tabanlı yönetim sistemleri geliştiriyoruz. Her kurumun iş yapış şeklinin farklı olduğu bilinciyle, hazır çözümler yerine talebe özel yazılımlar üretiyoruz.",
      "Bu yaklaşımın bir örneği olarak geliştirdiğimiz Çetin Group App, inşaat projelerinin yönetimini kolaylaştırmak amacıyla hayata geçirilmiştir. Uygulama sayesinde:",
    ],
    bullets: [
      "Proje ve saha süreçleri tek merkezden yönetilebilir",
      "Görev, personel ve ilerleme takibi yapılabilir",
      "Ofis ve saha arasındaki bilgi akışı hızlanır",
      "Web, iOS ve Android platformlarında aynı anda kullanılabilir",
    ],
    note: "Çetin Group’un ihtiyaçları doğrultusunda geliştirilen bu sistem, “siz istersiniz, biz geliştiririz” yaklaşımımızın somut bir örneğidir.",
    meta: [
      { label: "Sektör", value: "İnşaat" },
      { label: "Platform", value: "Web · iOS · Android" },
      { label: "Tip", value: "Talebe özel" },
    ],
  },
  {
    id: "case-04",
    slug: "e-ticaret",
    category: "E-Ticaret",
    title: "E-Ticaret Çözümleri",
    subtitle: "Özelleştirilmiş Online Satış Sistemleri",
    body: [
      "BAI Teknoloji, farklı sektörlere yönelik özelleştirilebilir e-ticaret altyapıları geliştirir. Web ve mobil uyumlu olarak tasarlanan bu sistemler; ürün yönetimi, ödeme altyapıları, sipariş takibi ve kullanıcı deneyimini ön planda tutacak şekilde planlanır.",
      "Geliştirdiğimiz e-ticaret çözümleri:",
    ],
    bullets: [
      "İşletmeye özel ihtiyaçlara göre şekillendirilir",
      "Güvenli ve ölçeklenebilir altyapı sunar",
      "Modern ödeme ve entegrasyon sistemleriyle çalışır",
    ],
    note: "Amaç, markaların dijital satış kanallarını güçlü ve sürdürülebilir hale getirmektir.",
    meta: [
      { label: "Yaklaşım", value: "Özelleştirilebilir" },
      { label: "Altyapı", value: "Ölçeklenebilir" },
      { label: "Entegrasyon", value: "Modern ödeme" },
    ],
  },
  {
    id: "case-05",
    slug: "baseline",
    category: "Spor & Pazaryeri",
    status: "Aktif / Yayında",
    statusTone: "live",
    title: "Baseline",
    subtitle: "Tenis Kulüpleri için Kapsamlı Rezervasyon, Yönetim ve Pazaryeri Platformu",
    body: [
      "Baseline, tenis kulüpleri, antrenörler ve sporseverler için geliştirilmiş kapsamlı bir rezervasyon ve yönetim platformudur. Kulüplerin kort rezervasyonlarını, özel ders süreçlerini ve üyelik yönetimini tek bir sistem üzerinden dijital ortama taşımasını sağlar.",
      "Platform; kulüp sahipleri, antrenörler ve kullanıcılar için ayrı rol yapılarıyla çalışır. Kullanıcılar uygulama üzerinden kort rezervasyonu yapabilir, sertifikalı antrenörlerden özel ders talep edebilir ve kulüp üyeliklerini yönetebilir. Kulüpler ise rezervasyonları, antrenörleri, kortları ve üyelikleri merkezi bir panelden takip edebilir.",
      "Baseline aynı zamanda tenis ekipmanları ve spor ürünleri satan mağazaların ürünlerini listeleyip sattığı entegre bir pazaryeri modülü de barındırmaktadır. Mağazalar ürünlerini platforma yükleyerek doğrudan sporseverlere ulaşabilmektedir.",
      "Baseline’ı farklılaştıran temel özellikler:",
    ],
    bullets: [
      "Gerçek zamanlı kort müsaitlik takibi ve online rezervasyon",
      "Antrenör–öğrenci eşleştirme ve özel ders yönetimi",
      "Entegre ödeme sistemi ile güvenli online tahsilat",
      "Kulüp üyelik sistemi ve üye yönetimi",
      "Tenis ekipmanları ve spor ürünleri için entegre pazaryeri modülü",
      "iOS ve Android platformlarında sorunsuz çalışan native mobil uygulama",
      "Push bildirim sistemi ile anlık kullanıcı bildirimleri",
    ],
    note: "Durum: iOS ve Android platformlarında aktif olarak yayında",
    meta: [
      { label: "Sektör", value: "Tenis · Spor" },
      { label: "Platform", value: "iOS · Android" },
      { label: "Tip", value: "Rezervasyon · Pazaryeri" },
    ],
    links: {
      appStore: "https://apps.apple.com/tr/app/baseline/id6762238661?l=tr",
      playStore: "https://play.google.com/store/apps/details?id=com.bai.baseline",
    },
  },
]

// Display order: live (yayında) → active (geliştirme) → no status. Original index ties
// are broken by their order in the `projects` array above.
const STATUS_RANK: Record<string, number> = { live: 0, active: 1 }
const orderedProjects = [...projects].sort((a, b) => {
  const aRank = a.statusTone ? STATUS_RANK[a.statusTone] : 2
  const bRank = b.statusTone ? STATUS_RANK[b.statusTone] : 2
  return aRank - bRank
})

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="wrap">
        <div className="reveal mb-14 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                — Çalışmalar
              </span>
              <span className="hidden h-px w-10 bg-rule sm:block" />
              <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                Section 03
              </span>
            </div>
            <h2 className="display mt-5 text-[clamp(36px,5vw,68px)] text-ink">
              Projelerimiz ve geliştirdiğimiz{" "}
              <span className="italic-amber">çözümler</span>
            </h2>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-ink-2 md:justify-self-end md:text-right">
            Farklı sektörlere özel, yenilikçi ve sürdürülebilir teknoloji çözümlerimiz.
          </p>
        </div>
      </div>

      <ProjectsCarousel projects={orderedProjects} />
    </section>
  )
}

function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [autoplay, setAutoplay] = useState(true)
  const userInteractedRef = useRef(false)

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll<HTMLElement>("[data-card]")
    const target = cards[index]
    if (!target) return
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" })
  }, [])

  const next = useCallback(() => {
    userInteractedRef.current = true
    setActiveIndex((i) => {
      const n = (i + 1) % projects.length
      scrollToIndex(n)
      return n
    })
  }, [projects.length, scrollToIndex])

  const prev = useCallback(() => {
    userInteractedRef.current = true
    setActiveIndex((i) => {
      const n = (i - 1 + projects.length) % projects.length
      scrollToIndex(n)
      return n
    })
  }, [projects.length, scrollToIndex])

  // Auto-advance every 8s; pauses on hover/focus/touch, when autoplay is off,
  // or when prefers-reduced-motion is set.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (prefersReducedMotion || !autoplay || isPaused) return
    const id = window.setInterval(() => {
      setActiveIndex((i) => {
        const n = (i + 1) % projects.length
        scrollToIndex(n)
        return n
      })
    }, 8000)
    return () => window.clearInterval(id)
  }, [autoplay, isPaused, projects.length, scrollToIndex])

  // Track which card is currently snapped to the start of the viewport — based on
  // the actual scrollLeft, so it stays in sync with both manual swipes and
  // programmatic scrolls without flicker.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let rafId = 0
    const update = () => {
      const cards = track.querySelectorAll<HTMLElement>("[data-card]")
      if (!cards.length) return
      const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0
      const target = track.scrollLeft + padLeft
      let bestIdx = 0
      let bestDist = Infinity
      cards.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft - track.offsetLeft - target)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = i
        }
      })
      setActiveIndex(bestIdx)
    }
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      track.removeEventListener("scroll", onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [projects.length])

  // Keyboard navigation on the carousel root
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault()
      next()
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      prev()
    }
  }

  return (
    <div
      role="region"
      aria-label="Projeler"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        // Only release pause when focus leaves the carousel entirely
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsPaused(false)
      }}
      className="reveal relative outline-none focus-visible:ring-0"
    >
      {/* Scrollable track */}
      <div
        ref={trackRef}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => {
          // Resume autoplay a moment after touch ends
          window.setTimeout(() => setIsPaused(false), 1200)
        }}
        className="carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 md:gap-8"
        style={{
          scrollPaddingLeft: "var(--carousel-pad, 28px)",
          paddingLeft: "var(--carousel-pad, 28px)",
          paddingRight: "var(--carousel-pad, 28px)",
        }}
      >
        {projects.map((p, i) => (
          <div
            key={p.id}
            data-card
            data-index={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${projects.length} — ${p.title}`}
            className="snap-start shrink-0 basis-[88vw] sm:basis-[520px] md:basis-[640px] lg:basis-[720px]"
          >
            <CaseCard project={p} index={i + 1} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="wrap mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left — counter + progress */}
        <div className="flex items-center gap-4">
          <span
            className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3"
            aria-live="polite"
          >
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <div
            className="relative h-px w-40 overflow-hidden bg-rule sm:w-56"
            aria-hidden="true"
          >
            <div
              className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-500"
              style={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Right — buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoplay((v) => !v)}
            aria-label={autoplay ? "Otomatik geçişi durdur" : "Otomatik geçişi başlat"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-rule text-ink transition-colors hover:bg-bg-elev"
          >
            {autoplay ? (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Önceki proje"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-rule text-ink transition-colors hover:bg-bg-elev"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Sonraki proje"
            className="inline-flex h-9 w-9 items-center justify-center rounded-pill border border-rule text-ink transition-colors hover:bg-bg-elev"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div
        className="wrap mt-6 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="Proje seç"
      >
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            aria-controls={`carousel-slide-${i}`}
            onClick={() => {
              userInteractedRef.current = true
              setActiveIndex(i)
              scrollToIndex(i)
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === i ? "w-8 bg-ink" : "w-1.5 bg-rule hover:bg-ink-3"
            }`}
          >
            <span className="sr-only">{p.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CaseCard({ project, index }: { project: Project; index: number }) {
  const isLive = project.statusTone === "live"
  return (
    <article
      id={project.slug}
      className="reveal group flex scroll-mt-24 flex-col"
    >
      {/* Meta bar */}
      <div className="flex items-center justify-between gap-3 border-t border-rule pb-4 pt-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
        <span>
          <span className="notranslate">— {String(index).padStart(3, "0")}</span> · {project.category}
        </span>
        {project.status ? (
          <span
            className={`inline-flex items-center gap-2 ${
              isLive ? "text-green-ink" : "text-ink-2"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                isLive ? "bg-green animate-pulse" : "bg-amber"
              }`}
            />
            {project.status}
          </span>
        ) : (
          <span className="notranslate">2025</span>
        )}
      </div>

      {/* Placeholder image */}
      <div className="striped relative aspect-[16/9] w-full overflow-hidden rounded-md border border-rule">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="font-serif text-[clamp(40px,5vw,72px)] italic text-ink/15">
            {project.title}
          </div>
        </div>
        <div className="notranslate pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
          BAI / {project.id}
        </div>
        <div className="notranslate pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
          FIG. {String(index).padStart(2, "0")}
        </div>
      </div>

      {/* Title + subtitle */}
      <h3 className="mt-7 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.02] text-ink">
        {project.title}
      </h3>
      <h4 className="mt-3 font-sans text-[15px] font-medium leading-snug text-ink-2">
        {project.subtitle}
      </h4>

      {/* Body */}
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-2">
        {project.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {project.bullets && (
          <ul className="mt-2 space-y-2 border-l border-rule pl-4">
            {project.bullets.map((b) => (
              <li key={b} className="text-[14.5px] text-ink-2">
                <span className="font-mono text-ink-3">— </span>
                {b}
              </li>
            ))}
          </ul>
        )}
        {project.note && (
          <p className="text-[13px] italic text-ink-3">{project.note}</p>
        )}
      </div>

      {/* Store links */}
      {project.links && (project.links.appStore || project.links.playStore) && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.links.appStore && (
            <StoreLink href={project.links.appStore} kind="apple" label="App Store" />
          )}
          {project.links.playStore && (
            <StoreLink href={project.links.playStore} kind="play" label="Google Play" />
          )}
        </div>
      )}

      {/* Metric strip */}
      <div className="mt-7 grid grid-cols-3 border-t border-rule pt-5">
        {project.meta.map((m) => (
          <div key={m.label} className="pr-3">
            <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
              {m.label}
            </div>
            <div className="mt-1 font-serif text-[18px] leading-tight text-ink">{m.value}</div>
          </div>
        ))}
      </div>
    </article>
  )
}

function StoreLink({
  href,
  kind,
  label,
}: {
  href: string
  kind: "apple" | "play"
  label: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/store inline-flex items-center gap-2.5 rounded-pill border border-ink bg-ink px-4 py-2 text-[12px] font-medium text-bg transition-transform hover:-translate-y-px"
      aria-label={`${label} üzerinden indir`}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center" aria-hidden="true">
        {kind === "apple" ? <AppleGlyph /> : <PlayGlyph />}
      </span>
      <span className="flex flex-col leading-none">
        <span className="notranslate font-mono text-[8.5px] uppercase tracking-mono opacity-70">
          {kind === "apple" ? "Download on" : "Get it on"}
        </span>
        <span className="notranslate mt-0.5 text-[13px] tracking-tight">{label}</span>
      </span>
    </a>
  )
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M17.05 12.04c-.03-3.06 2.5-4.52 2.62-4.59-1.43-2.09-3.65-2.38-4.44-2.41-1.89-.2-3.69 1.11-4.65 1.11-.96 0-2.45-1.08-4.03-1.05C4.5 5.13 2.7 6.32 1.7 8.18c-2.1 3.64-.54 9.03 1.51 11.99 1 1.45 2.19 3.07 3.76 3.01 1.51-.06 2.08-.97 3.91-.97 1.83 0 2.34.97 3.94.94 1.63-.03 2.66-1.47 3.65-2.93 1.15-1.68 1.62-3.31 1.64-3.39-.04-.02-3.16-1.21-3.19-4.79zM14.11 4.13c.83-1 1.39-2.4 1.24-3.79-1.2.05-2.65.8-3.5 1.81-.76.88-1.43 2.29-1.25 3.66 1.33.1 2.69-.68 3.51-1.68z" />
    </svg>
  )
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
      <path d="M3.61 1.81C3.24 2 3 2.36 3 2.81v18.38c0 .45.24.81.61 1L13.79 12 3.61 1.81zM17.61 8.81L5.84 1.99l9.16 9.17 2.61-2.35zM21.49 11.09l-2.84-1.65L15.93 12l2.72 2.56 2.84-1.65c.87-.51.87-1.61 0-2.12zM5.84 22.01l11.77-6.82-2.61-2.35-9.16 9.17z" />
    </svg>
  )
}
