import Image from "next/image"

import { cn } from "@/lib/utils"

/** Telefon çerçevesi — sabit 9:19.5 oran (CLS yok). */
/** @param {any} props */
export function PhoneFrame({ src, alt, className, priority = false, sizes }) {
  return (
    <div className={cn("rounded-[2rem] border border-border-strong bg-[#0b1426] p-1.5 shadow-xl", className)}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.6rem] bg-muted">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? "(min-width: 1024px) 240px, 40vw"}
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  )
}

/** Tarayıcı çerçevesi — gerçek en-boy oranı korunur. */
/** @param {any} props */
export function BrowserFrame({ src, alt, w = 16, h = 9, className, priority = false, sizes }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border-strong bg-card shadow-xl", className)}>
      <div className="flex h-7 items-center gap-1.5 border-b border-border px-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="size-2.5 rounded-full bg-border-strong" />
        <span className="size-2.5 rounded-full bg-border-strong" />
      </div>
      <div className="relative bg-muted" style={{ aspectRatio: `${w} / ${h}` }}>
        <Image src={src} alt={alt} fill sizes={sizes ?? "(min-width: 1024px) 640px, 100vw"} className="object-cover object-top" priority={priority} />
      </div>
    </div>
  )
}
