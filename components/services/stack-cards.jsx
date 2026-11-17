"use client"

/**
 * Yapışkan, üst üste binen hizmet kartları — hizmetler.md v2 "feature showcase".
 * Her kart sticky; sonraki kart üstüne gelirken arkadaki hafifçe küçülür ve kararır (scrub).
 * Mobil, reduced-motion ve kart görünür alana sığmayan kısa ekranlar: normal dikey liste.
 *
 * Yerleşim (sticky, 40vh aralık) yalnızca CSS medya sorgusuyla (`stack:` varyantı) kurulur;
 * böylece SSR ↔ hidrasyon arasında yükseklik değişmez. `#slug` hedefi kartın kendisi değil,
 * kartın hemen önündeki akış içi (sticky olmayan) görünmez çapadır: Next.js hash kaydırması
 * `scrollIntoView()` çağırır ve sticky bir hedefte o an yapıştığı konumu ölçer — önceki
 * sayfanın kaydırma ofsetiyle gelindiğinde yanlış (komşu) karta iniliyordu.
 *
 * JS kapalıyken sekmeler çalışmaz: globals.css › `@media (scripting: none)` yığını kapatır,
 * bütün bölümleri açık gösterir.
 */
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { CheckIcon } from "lucide-react"
import { Fragment, useId, useRef, useState } from "react"

import { useMedia, useReducedMotion } from "@/lib/use-media"
import { ServiceIcon } from "@/lib/services-ui"

/** globals.css › @custom-variant stack ile birebir aynı olmalı (yerleşim CSS'te, ölçek/karartma JS'te) */
const STACK_QUERY =
  "(min-width: 80rem) and (min-height: 44rem) and (prefers-reduced-motion: no-preference), (min-width: 48rem) and (min-height: 56rem) and (prefers-reduced-motion: no-preference)"

/**
 * Kartın sağ sütunu: soru başlığı + dört bölüm (kime uygun · ne teslim edilir · süreç · nasıl başlanır).
 * Liste düzeninde (mobil, kısa ekran, reduced-motion) bölümler alt alta, hepsi açık durur.
 * Yığın düzeninde kart yapışkan olduğu için yüksekliği sabit kalmalı: bölümler sekmeye döner,
 * aynı anda biri görünür. Geçiş yalnızca CSS (`stack:`) ile yapılır — SSR ↔ hidrasyon arasında
 * yükseklik değişmez; tüm metin her iki düzende de HTML'dedir.
 */
/** @param {any} props */
function ServicePanels({ s, labels, tabbed }) {
  const [active, setActive] = useState(0)
  const uid = useId()
  const panels = [
    s.audience ? { key: "audience", label: labels.audience, body: <p className="measure text-[1.0625rem] leading-relaxed">{s.audience}</p> } : null,
    s.deliverables?.length
      ? {
          key: "deliverables",
          label: labels.deliverables,
          body: (
            <ul className="measure space-y-2.5 text-[1.0625rem] leading-snug">
              {s.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3">
                  <CheckIcon className="mt-1 size-4 shrink-0 text-brand-ink" aria-hidden="true" />
                  {d}
                </li>
              ))}
            </ul>
          ),
        }
      : null,
    s.detail ? { key: "detail", label: labels.process, body: <p className="measure text-[1.0625rem] leading-relaxed">{s.detail}</p> } : null,
    s.start ? { key: "start", label: labels.start, body: <p className="measure text-[1.0625rem] leading-relaxed">{s.start}</p> } : null,
  ].filter(Boolean)
  if (!panels.length) return null
  const multi = panels.length > 1
  const current = Math.min(active, panels.length - 1)
  const onKeyDown = (e) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (current + step + panels.length) % panels.length
    setActive(next)
    document.getElementById(`${uid}-tab-${panels[next].key}`)?.focus()
  }
  return (
    <>
      {multi ? (
        <div role="tablist" aria-label={`${s.title}: bölümler`} className="svc-tabs mt-6 hidden flex-wrap gap-2 stack:flex">
          {panels.map((p, k) => (
            <button
              key={p.key}
              type="button"
              role="tab"
              id={`${uid}-tab-${p.key}`}
              aria-selected={k === current}
              aria-controls={`${uid}-panel-${p.key}`}
              tabIndex={k === current ? 0 : -1}
              onClick={() => setActive(k)}
              onKeyDown={onKeyDown}
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card/60 px-4 text-sm font-medium text-muted-foreground transition-colors duration-(--dur-fast) hover:border-brand hover:text-brand-ink aria-selected:border-brand aria-selected:bg-brand-soft aria-selected:text-brand-ink"
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}
      <div className={`mt-8 grid gap-8 ${multi ? "stack:mt-6 stack:block stack:max-xl:min-h-[19rem] stack:xl:min-h-[11.5rem]" : ""}`}>
        {panels.map((p, k) => (
          <section
            key={p.key}
            id={`${uid}-panel-${p.key}`}
            role={tabbed && multi ? "tabpanel" : undefined}
            aria-labelledby={tabbed && multi ? `${uid}-tab-${p.key}` : `${uid}-title-${p.key}`}
            className={`svc-panel ${multi && k !== current ? "stack:hidden" : ""}`}
          >
            <h3 id={`${uid}-title-${p.key}`} className={`svc-panel-title mb-3 text-xs font-medium uppercase tracking-[0.14em] text-brand-ink ${multi ? "stack:sr-only" : ""}`}>
              {p.label}
            </h3>
            {p.body}
          </section>
        ))}
      </div>
    </>
  )
}

/** @param {any} props */
function StackCard({ s, labels, i, total, progress, enabled, related }) {
  const id = s.slug
  // Kart ancak bir sonraki kart üstüne binmeye başlayınca küçülür/kararır; aktif kart net kalır.
  const from = Math.min((i + 0.6) / total, 0.99)
  // Yığının toplam derinliği kart sayısından bağımsız: 5 kartta tasarlanan değerler
  // (adım 1.5rem / ölçek 0.035) üst sınır; kart arttıkça adım küçülür, en üst ofset 12rem'i,
  // en arkadaki kartın küçülmesi %14'ü geçmez (8 kartta son kart kısa ekranlarda da sığar).
  const steps = Math.max(1, total - 1)
  const scale = useTransform(progress, [from, 1], [1, 1 - (total - 1 - i) * Math.min(0.035, 0.14 / steps)])
  const dim = useTransform(progress, [from, Math.min((i + 1.2) / total, 1)], [0, i === total - 1 ? 0 : 0.5])
  const stick = `${6 + i * Math.min(1.5, 6 / steps)}rem`
  return (
    <Fragment>
      {/* Çapa: kartın akıştaki yeri; masaüstünde kart tam yapışma noktasına gelecek şekilde */}
      <span
        id={id}
        aria-hidden="true"
        className={`svc-anchor block h-0 scroll-mt-28 stack:scroll-mt-[calc(var(--stick)-5rem)] ${i > 0 ? "mt-6 stack:mt-[40vh]" : ""}`}
        style={{ "--stick": stick }}
      />
      <div className="svc-stick stack:sticky stack:top-(--stick)" style={{ "--stick": stick }}>
      <motion.article
        style={enabled ? { scale } : undefined}
        className="relative origin-top overflow-hidden rounded-3xl border border-border-strong bg-card shadow-xl"
      >
        {enabled ? <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 bg-background" style={{ opacity: dim }} /> : null}
        <div className="grid md:grid-cols-[1fr_1.3fr]">
          <div className="relative flex flex-col gap-6 border-b border-border p-8 md:border-r md:border-b-0 md:p-12 stack:gap-5 stack:p-10">
            <div aria-hidden="true" className="absolute -top-20 -left-20 size-64 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]" />
            <div className="relative flex items-center justify-between">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-brand text-brand-foreground">
                <ServiceIcon name={s.icon} className="size-7" aria-hidden="true" />
              </span>
              <span className="tabular font-heading text-5xl font-bold text-transparent [-webkit-text-stroke:1px_var(--border-strong)]">{String(i + 1).padStart(3, "0")}</span>
            </div>
            <h2 className="relative font-heading text-3xl font-semibold tracking-tight md:text-4xl">{s.title}</h2>
            <p className="relative text-lg leading-relaxed text-muted-foreground">{s.summary}</p>
            {s.serviceTypes?.length || related.length ? (
              <dl className="relative mt-auto grid gap-3 border-t border-border pt-5 text-sm">
                {s.serviceTypes?.length ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Kapsam</dt>
                    <dd className="mt-1.5 font-mono text-xs leading-relaxed tracking-wide text-muted-foreground">{s.serviceTypes.join(" · ")}</dd>
                  </div>
                ) : null}
                {related.length ? (
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">İlgili projeler</dt>
                    <dd className="flex flex-wrap gap-x-4">
                      {related.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/projeler/${p.slug}`}
                          className="inline-flex min-h-11 items-center font-medium underline decoration-border-strong underline-offset-4 transition-colors duration-(--dur-fast) hover:text-brand-ink hover:decoration-brand"
                        >
                          {p.title}
                        </Link>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </div>
          <div className="flex flex-col p-8 md:p-12 stack:p-10">
            {/* Soru başlığı: okurun kendi cümlesi. Beyan cümlesi (claim) kartta gösterilmez, yalnızca schema'da. */}
            {s.question ? <p className="measure font-heading text-xl font-medium leading-snug md:text-2xl">{s.question}</p> : null}
            <ServicePanels s={s} labels={labels} tabbed={enabled} />
          </div>
        </div>
      </motion.article>
      </div>
    </Fragment>
  )
}

/** @param {any} props */
export function StackCards({ services, projects = [], labels }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  // Yalnızca ölçek/karartma (yerleşimi etkilemeyen transform/opacity) JS'e bağlı
  const fits = useMedia(STACK_QUERY)
  const enabled = fits && !reduce
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  return (
    <div ref={ref} className="flex flex-col stack:pb-[10vh]">
      {services.map((s, i) => (
        <StackCard
          key={s.id}
          s={s}
          i={i}
          total={services.length}
          labels={labels}
          progress={scrollYProgress}
          enabled={enabled}
          related={projects.filter((p) => p.services?.includes(s.slug))}
        />
      ))}
    </div>
  )
}
