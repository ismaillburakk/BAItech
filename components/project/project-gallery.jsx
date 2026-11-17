"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"

import UnderlineTabs from "@/components/origin/comp-429"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { BrowserFrame, PhoneFrame } from "@/components/project/device-frame"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

/** @param {any} props */
function Grid({ images, device, onOpen }) {
  const mobile = device === "mobile"
  return (
    <Stagger
      as="ul"
      className={mobile ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" : "grid gap-6 md:grid-cols-2"}
    >
      {images.map((img, i) => (
        <StaggerItem as="li" key={img.public_id}>
          <button
            type="button"
            onClick={(e) => onOpen(i, e.currentTarget)}
            className="block w-full rounded-[1.75rem] text-left outline-none transition-opacity duration-(--dur-fast) hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Büyüt: ${img.alt ?? `görsel ${i + 1}`}`}
          >
            {mobile ? (
              <PhoneFrame src={img.public_id} alt={img.alt ?? ""} />
            ) : (
              <BrowserFrame src={img.public_id} alt={img.alt ?? ""} w={img.width} h={img.height} />
            )}
          </button>
        </StaggerItem>
      ))}
    </Stagger>
  )
}

/**
 * Ekran görüntüsü galerisi: tek sekme → doğrudan ızgara; çok sekme → Origin comp-429.
 * Büyütme: shadcn Dialog (Esc / kapat butonu / ←→ — skill escape-routes, keyboard-nav).
 */
/** @param {any} props */
export function ProjectGallery({ gallery, title }) {
  const [open, setOpen] = useState(null) // { tab, index }
  const touch = useRef(null)
  // Lightbox kapanınca odak, onu açan küçük görsele döner (klavye kullanıcıları için)
  const trigger = useRef(null)
  const tabs = gallery.filter((t) => t.images?.length)
  if (!tabs.length) return null
  const current = open ? tabs[open.tab].images[open.index] : null
  const count = open ? tabs[open.tab].images.length : 0
  const step = (d) => setOpen((o) => ({ ...o, index: (o.index + d + count) % count }))

  return (
    <>
      {tabs.length > 1 ? (
        <UnderlineTabs
          tabs={tabs}
          renderPanel={(t) => <Grid images={t.images} device={t.device} onOpen={(i, el) => {
            trigger.current = el
            setOpen({ tab: tabs.indexOf(t), index: i })
          }} />}
        />
      ) : (
        <Grid images={tabs[0].images} device={tabs[0].device} onOpen={(i, el) => {
          trigger.current = el
          setOpen({ tab: 0, index: i })
        }} />
      )}

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent
          onCloseAutoFocus={(e) => {
            if (trigger.current?.isConnected) {
              e.preventDefault()
              trigger.current.focus()
            }
          }}
          className="max-h-[92dvh] w-[min(92vw,1100px)] max-w-none sm:max-w-none"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") step(1)
            if (e.key === "ArrowLeft") step(-1)
          }}
        >
          <DialogTitle className="pr-12">{title}</DialogTitle>
          <DialogDescription>
            {current?.alt} · {open ? open.index + 1 : 0}/{count}
          </DialogDescription>
          {current ? (
            <div
              className="relative mx-auto h-[70dvh] w-full touch-pan-y select-none"
              // Mobil kaydırma: yatay hareket görsel değiştirir, dikey kaydırma serbest kalır
              onTouchStart={(e) => {
                const t = e.touches[0]
                touch.current = { x: t.clientX, y: t.clientY }
              }}
              onTouchEnd={(e) => {
                const start = touch.current
                touch.current = null
                if (!start) return
                const t = e.changedTouches[0]
                const dx = t.clientX - start.x
                const dy = t.clientY - start.y
                if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1)
              }}
            >
              <Image src={current.public_id} alt={current.alt ?? ""} fill sizes="92vw" className="object-contain" />
            </div>
          ) : null}
          <div className="flex justify-between gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => step(-1)}>
              <ChevronLeftIcon data-icon="inline-start" aria-hidden="true" /> Önceki
            </Button>
            <Button variant="outline" className="min-h-11" onClick={() => step(1)}>
              Sonraki <ChevronRightIcon data-icon="inline-end" aria-hidden="true" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
