import { enterClass } from "@/components/motion/reveal"
import { SplitText } from "@/components/motion/fx"
import { Eyebrow } from "@/components/site/eyebrow"

/** Alt sayfa başlığı — ızgara zemin + ışıma, kelime kelime h1 (CSS, LCP beklemez). */
/** @param {any} props */
export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border pt-[4.5rem]">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -top-32 right-[-10%] -z-10 h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,var(--glow-strong),transparent)] opacity-50 blur-3xl" />
      <div className="container-site py-20 md:py-28">
        <div className={enterClass}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <SplitText
          text={title}
          className="mt-6 max-w-5xl text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[1] tracking-[-0.03em]"
          delay={0.05}
        />
        {description ? (
          <p className={`${enterClass} measure mt-7 text-lg leading-relaxed text-muted-foreground delay-200 md:text-xl`}>
            {description}
          </p>
        ) : null}
        {children ? <div className={`${enterClass} delay-300`}>{children}</div> : null}
      </div>
    </section>
  )
}
