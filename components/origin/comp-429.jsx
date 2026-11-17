"use client"

/**
 * Origin UI comp-429 — "tabs" (alt çizgili sekme)
 * Kaynak: https://coss.com/origin/r/comp-429.json (@origin/comp-429)
 * BAI uyarlaması: proje detay galerisi sekmeleri (Dukan: Müşteri Tarafı / Yönetim
 * Paneli; Özel Yazılım: Çetin Group / Kompas Care / Ahmet Demir Mimarlık).
 * Kurallar: proje-detay.md (sekmeli galeri), skill fade-crossfade (aynı kapta içerik
 * değişimi crossfade), 200 ms (--dur-base), 44px tetik yüksekliği.
 */
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { transition } from "@/lib/motion"

const trigger =
  "relative h-11 flex-none rounded-none px-4 py-2 text-[0.9375rem] after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none data-[state=active]:after:bg-brand dark:data-[state=active]:bg-transparent"

/** @param {any} props */
export default function UnderlineTabs({ tabs, renderPanel }) {
  const [value, setValue] = useState("0")
  return (
    <Tabs value={value} onValueChange={setValue} className="w-full">
      <TabsList className="h-auto w-full justify-start overflow-x-auto overflow-y-hidden rounded-none border-b bg-transparent p-0">
        {tabs.map((t, i) => (
          <TabsTrigger key={t.id ?? t.label} className={trigger} value={String(i)}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <AnimatePresence mode="wait" initial={false}>
        {tabs.map((t, i) =>
          String(i) === value ? (
            <TabsContent key={t.id ?? t.label} value={String(i)} forceMount asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: transition.base }}
                exit={{ opacity: 0, transition: transition.fast }}
                className="pt-8"
              >
                {renderPanel(t)}
              </motion.div>
            </TabsContent>
          ) : null
        )}
      </AnimatePresence>
    </Tabs>
  )
}
