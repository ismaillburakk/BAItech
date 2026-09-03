import Image from "next/image"
import Link from "next/link"
import { SectionHeading } from "@/components/section-heading"
import { orderedProjects, type Project } from "@/lib/projects"

export function ProjectsSection({
  variant = "featured",
  headingAs = "h2",
}: {
  /**
   * "featured": ana sayfa — öne çıkan (yayındaki) proje tam kart, kalanlar
   * numaralı indeks listesi. "grid": /projeler — 2 kolonlu, tamamı tıklanabilir
   * kart grid'i (Hizmetler bölümündeki border-grid kalıbı).
   */
  variant?: "featured" | "grid"
  /** Ayrık sayfada ana başlık h1 olur; görünüm aynı kalır (stiller class'lardan gelir). */
  headingAs?: "h1" | "h2"
}) {
  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          eyebrow="Çalışmalar"
          sectionNo="Section 03"
          title={
            <>
              Projelerimiz ve geliştirdiğimiz{" "}
              <span className="italic-amber">çözümler</span>
            </>
          }
          description="Mobil uygulama, web ve işletmeye özel yazılım projelerimiz; App Store ve Google Play'de yayında olanlar dahil."
          headingAs={headingAs}
        />

        {variant === "featured" ? <FeaturedProjects /> : <ProjectsGrid />}
      </div>
    </section>
  )
}

/* ─── Ana sayfa: öne çıkan kart + indeks listesi ─────────────────────────── */

function FeaturedProjects() {
  const [featured, ...rest] = orderedProjects

  return (
    <div className="max-w-3xl">
      <CaseCard project={featured} index={1} variant="summary" />

      {/* Kalan projeler — Hakkımızda'daki numaralı liste kalıbı */}
      <ul className="reveal mt-14 divide-y divide-rule border-y border-rule">
        {rest.map((p, i) => (
          <ProjectIndexRow key={p.id} project={p} index={i + 2} />
        ))}
      </ul>

      <div className="reveal mt-8">
        <Link
          href="/projeler"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-mono text-ink-3 transition-colors hover:text-ink"
        >
          Tüm projeler
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </div>
  )
}

function ProjectIndexRow({ project, index }: { project: Project; index: number }) {
  return (
    <li>
      <Link
        href={`/projeler/${project.slug}`}
        className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 py-5"
      >
        <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
          {String(index).padStart(2, "0")}
        </span>
        <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="font-serif text-[clamp(22px,2.4vw,28px)] leading-tight text-ink">
            {project.title}
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-mono text-ink-3 sm:inline">
            {project.category}
          </span>
        </span>
        <span className="flex items-center gap-4">
          <StatusBadge project={project} className="hidden sm:inline-flex" />
          <span
            aria-hidden="true"
            className="text-ink-3 transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </Link>
    </li>
  )
}

/* ─── /projeler: 2 kolonlu, tamamı tıklanabilir kart grid'i ──────────────── */

function ProjectsGrid() {
  return (
    <div className="reveal grid grid-cols-1 border-y border-rule md:grid-cols-2">
      {orderedProjects.map((p, i) => (
        <ProjectCardCell key={p.id} project={p} index={i + 1} isLast={i === orderedProjects.length - 1} isLeftColumn={i % 2 === 0} />
      ))}
    </div>
  )
}

function ProjectCardCell({
  project,
  index,
  isLast,
  isLeftColumn,
}: {
  project: Project
  index: number
  isLast: boolean
  isLeftColumn: boolean
}) {
  return (
    <article
      className={`group relative flex flex-col p-8 transition-colors hover:bg-bg-elev md:p-10 ${
        isLast ? "" : "border-b border-rule"
      } ${isLeftColumn ? "md:border-r md:border-rule" : ""}`}
    >
      {/* Meta bar — hücrenin kendi çerçevesi olduğu için üst çizgisiz */}
      <div className="flex items-center justify-between gap-3 pb-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
        <span>
          <span className="notranslate">— {String(index).padStart(3, "0")}</span> ·{" "}
          {project.category}
        </span>
        <StatusBadge project={project} />
      </div>

      <CaseFigure project={project} index={index} />

      <h2 className="mt-7 font-serif text-[clamp(26px,2.6vw,36px)] leading-[1.04] text-ink">
        {project.title}
      </h2>
      <p className="mt-3 font-sans text-[15px] font-medium leading-snug text-ink-2">
        {project.subtitle}
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-ink-2">{project.body[0]}</p>

      {project.storeLinks && (project.storeLinks.appStore || project.storeLinks.playStore) && (
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
          {project.storeLinks.appStore && (
            <StoreLink href={project.storeLinks.appStore} kind="apple" label="App Store" />
          )}
          {project.storeLinks.playStore && (
            <StoreLink href={project.storeLinks.playStore} kind="play" label="Google Play" />
          )}
        </div>
      )}

      {/* Metrikler + Detay satırı hücre tabanına yaslanır — satırdaki kartlar hizalı biter */}
      <div className="mt-auto">
        {project.meta.length > 0 && (
          <div className="mt-7 grid grid-cols-2 border-t border-rule pt-5">
            {project.meta.map((m) => (
              <div key={m.label} className="pr-3">
                <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                  {m.label}
                </div>
                <div className="mt-1 font-serif text-[18px] leading-tight text-ink">{m.value}</div>
              </div>
            ))}
          </div>
        )}
        {project.tech && (
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-mono text-ink-3">
            <span>— Teknoloji</span>
            <span className="hidden h-px w-6 bg-rule sm:block" />
            <span>{project.tech}</span>
          </div>
        )}
        <div className="mt-7 flex items-center justify-between border-t border-rule-2 pt-4">
          <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">Detay</span>
          <span
            aria-hidden="true"
            className="text-ink transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      </div>

      {/* Stretched link — kartın tamamı tıklanabilir; store butonları z-10 ile üstte kalır */}
      <Link
        href={`/projeler/${project.slug}`}
        className="absolute inset-0"
        aria-label={project.title}
      />
    </article>
  )
}

/* ─── Paylaşılan parçalar ────────────────────────────────────────────────── */

function StatusBadge({ project, className = "" }: { project: Project; className?: string }) {
  const isLive = project.statusTone === "live"
  if (!project.status) {
    return (
      <span className={`font-mono text-[10px] uppercase tracking-mono text-ink-3 ${className}`}>
        Hizmet
      </span>
    )
  }
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-mono ${
        isLive ? "text-green-ink" : "text-ink-2"
      } ${className}`}
    >
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          isLive ? "bg-green animate-pulse" : "bg-amber"
        }`}
      />
      {project.status}
    </span>
  )
}

function CaseFigure({ project, index }: { project: Project; index: number }) {
  return (
    <div className="striped relative aspect-[16/9] w-full overflow-hidden rounded-md border border-rule">
      {project.image ? (
        <Image
          src={project.image.src}
          alt={project.image.alt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 640px, 100vw"
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="font-serif text-[clamp(40px,5vw,72px)] italic text-ink/15">
            {project.title}
          </div>
        </div>
      )}
      <div className="notranslate pointer-events-none absolute left-4 top-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
        BAI / {project.id}
      </div>
      <div className="notranslate pointer-events-none absolute right-4 top-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
        FIG. {String(index).padStart(2, "0")}
      </div>
    </div>
  )
}

/* ─── Tam/özet kart — detay sayfası ve ana sayfadaki öne çıkan kart ──────── */

export function CaseCard({
  project,
  index,
  variant = "full",
  titleAs: TitleTag = "h3",
  subtitleAs: SubtitleTag = "h4",
}: {
  project: Project
  index: number
  /**
   * "summary": kısaltılmış gövde (alt başlık + ilk paragraf + metrikler) ve
   * "Detay →" linki. "full": tam içerik — /projeler/[slug] detay sayfası.
   */
  variant?: "summary" | "full"
  /** Detay sayfasında ana başlık h1 olur; görünüm aynı kalır (stiller class'lardan gelir). */
  titleAs?: "h1" | "h3"
  subtitleAs?: "p" | "h4"
}) {
  const isSummary = variant === "summary"
  return (
    <article id={project.slug} className="reveal group flex scroll-mt-24 flex-col">
      {/* Meta bar */}
      <div className="flex items-center justify-between gap-3 border-t border-rule pb-4 pt-4 font-mono text-[10px] uppercase tracking-mono text-ink-3">
        <span>
          <span className="notranslate">— {String(index).padStart(3, "0")}</span> ·{" "}
          {project.category}
        </span>
        <StatusBadge project={project} />
      </div>

      <CaseFigure project={project} index={index} />

      {/* Title + subtitle */}
      <TitleTag className="mt-7 font-serif text-[clamp(30px,3.4vw,44px)] leading-[1.02] text-ink">
        {project.title}
      </TitleTag>
      <SubtitleTag className="mt-3 font-sans text-[15px] font-medium leading-snug text-ink-2">
        {project.subtitle}
      </SubtitleTag>

      {/* Body — özet varyantında yalnızca ilk paragraf */}
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink-2">
        {(isSummary ? project.body.slice(0, 1) : project.body).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {!isSummary && project.bullets && (
          <ul className="mt-2 space-y-2 border-l border-rule pl-4">
            {project.bullets.map((b) => (
              <li key={b} className="text-[14.5px] text-ink-2">
                <span className="font-mono text-ink-3">— </span>
                {b}
              </li>
            ))}
          </ul>
        )}
        {!isSummary && project.note && (
          <p className="text-[13px] italic text-ink-3">{project.note}</p>
        )}
      </div>

      {/* Store links + web linki (webUrl yalnızca detay/tam varyantta) */}
      {(project.storeLinks?.appStore ||
        project.storeLinks?.playStore ||
        (!isSummary && project.webUrl)) && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {project.storeLinks?.appStore && (
            <StoreLink href={project.storeLinks.appStore} kind="apple" label="App Store" />
          )}
          {project.storeLinks?.playStore && (
            <StoreLink href={project.storeLinks.playStore} kind="play" label="Google Play" />
          )}
          {!isSummary && project.webUrl && <WebLink href={project.webUrl} />}
        </div>
      )}

      {/* Metric strip */}
      {project.meta.length > 0 && (
        <div className="mt-7 grid grid-cols-2 border-t border-rule pt-5">
          {project.meta.map((m) => (
            <div key={m.label} className="pr-3">
              <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">
                {m.label}
              </div>
              <div className="mt-1 font-serif text-[18px] leading-tight text-ink">{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Teknoloji/stack etiketi — mono eyebrow satırı */}
      {project.tech && (
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-mono text-ink-3">
          <span>— Teknoloji</span>
          <span className="hidden h-px w-6 bg-rule sm:block" />
          <span>{project.tech}</span>
        </div>
      )}

      {/* Detay linki — yalnızca özet varyantında */}
      {isSummary && (
        <Link
          href={`/projeler/${project.slug}`}
          className="group/detay mt-7 flex items-center justify-between border-t border-rule-2 pt-4"
        >
          <span className="font-mono text-[10px] uppercase tracking-mono text-ink-3">Detay</span>
          <span
            aria-hidden="true"
            className="text-ink transition-transform group-hover/detay:translate-x-1"
          >
            →
          </span>
        </Link>
      )}
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
      className="group/store inline-flex min-h-[44px] items-center gap-2.5 rounded-pill border border-ink bg-ink px-4 py-2 text-[12px] font-medium text-bg transition-transform hover:-translate-y-px"
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

function WebLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/web relative z-10 inline-flex min-h-[44px] items-center gap-2 rounded-pill border border-rule px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-bg-elev"
    >
      Web sitesini ziyaret et
      <span className="text-ink-3 transition-transform group-hover/web:translate-x-0.5">→</span>
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
