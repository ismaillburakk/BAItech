"use client";

import { RotateCcwIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Eyebrow } from "@/components/site/eyebrow";
import { Button } from "@/components/ui/button";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate overflow-hidden pt-[4.5rem]">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10" />
      <div className="container-site flex min-h-[60dvh] flex-col justify-center py-20">
        <Eyebrow index="500">Hata</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1] tracking-[-0.03em]">
          Bir şeyler <span className="text-gradient">ters gitti.</span>
        </h1>
        <p className="measure mt-6 text-lg text-muted-foreground">Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="h-14 rounded-full px-8 text-base" onClick={reset}>
            <RotateCcwIcon data-icon="inline-start" aria-hidden="true" /> Tekrar dene
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-6 text-base">
            <Link href="/">Ana sayfa</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
