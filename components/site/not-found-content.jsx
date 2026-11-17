import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { SplitText } from "@/components/motion/fx"
import { enterClass } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/site/eyebrow"
import { Button } from "@/components/ui/button"

/** 404 içeriği — PageHeader dili (ızgara zemin + ışıma + kelime kelime h1). */
export function NotFoundContent() {
  return (
    <section className="relative isolate overflow-hidden pt-[4.5rem]">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -top-32 right-[-10%] -z-10 h-[420px] w-[620px] rounded-full bg-[radial-gradient(closest-side,var(--glow-strong),transparent)] opacity-50 blur-3xl" />
      <div className="container-site flex min-h-[70dvh] flex-col justify-center py-20 md:py-28">
        <div className={enterClass}>
          <Eyebrow index="404">Sayfa bulunamadı</Eyebrow>
        </div>
        <SplitText
          text="Aradığınız sayfa *bulunamadı.*"
          className="mt-6 max-w-4xl text-[clamp(2.5rem,6.5vw,5rem)] font-semibold leading-[1] tracking-[-0.03em]"
        />
        <p className={`${enterClass} measure mt-7 text-lg leading-relaxed text-muted-foreground delay-200`}>
          Sayfa taşınmış ya da kaldırılmış olabilir. Ana sayfadan veya projelerimizden devam edebilirsiniz.
        </p>
        <div className={`${enterClass} mt-10 flex flex-col gap-3 delay-300 sm:flex-row`}>
          <Button asChild size="lg" className="h-14 rounded-full px-8 text-base">
            <Link href="/">
              Ana sayfaya dön
              <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-6 text-base">
            <Link href="/projeler">Projeleri incele</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
