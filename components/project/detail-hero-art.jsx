"use client"

/** Proje detay hero görseli — 2 katman parallax (proje-detay.md v2). */
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

import { useReducedMotion } from "@/lib/use-media"
import { BrowserFrame, PhoneFrame } from "@/components/project/device-frame"

/** @param {any} props */
export function DetailHeroArt({ images, device = "mobile" }) {
  // Görsel yoksa hiç mount etme: useScroll hedefi bağlanmadan çalışmasın
  if (!images?.length) return null
  return <Art images={images} device={device} />
}

/** @param {any} props */
function Art({ images, device }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const back = useTransform(scrollYProgress, [0, 1], [40, -40])
  const front = useTransform(scrollYProgress, [0, 1], [90, -90])
  const mobile = device === "mobile"
  return (
    <div ref={ref} className="relative mx-auto flex h-full min-h-[420px] w-full max-w-[560px] items-center justify-center">
      <div aria-hidden="true" className="absolute inset-10 rounded-full bg-[radial-gradient(closest-side,var(--glow-strong),transparent)] blur-2xl" />
      {mobile ? (
        <>
          <motion.div style={reduce ? undefined : { y: back }} className="absolute left-[8%] w-[38%] -rotate-6 opacity-80">
            <PhoneFrame src={(images[1] ?? images[0]).public_id} alt={(images[1] ?? images[0]).alt ?? ""} priority sizes="220px" />
          </motion.div>
          <motion.div style={reduce ? undefined : { y: front }} className="relative z-10 w-[44%]">
            <PhoneFrame src={images[0].public_id} alt={images[0].alt ?? ""} priority sizes="260px" />
          </motion.div>
          {images[2] ? (
            <motion.div style={reduce ? undefined : { y: back }} className="absolute right-[8%] w-[38%] rotate-6 opacity-80">
              <PhoneFrame src={images[2].public_id} alt={images[2].alt ?? ""} priority sizes="220px" />
            </motion.div>
          ) : null}
        </>
      ) : (
        <>
          {images[1] ? (
            <motion.div style={reduce ? undefined : { y: back }} className="absolute top-6 right-0 w-[80%] opacity-60">
              <BrowserFrame src={images[1].public_id} alt={images[1].alt ?? ""} w={images[1].width} h={images[1].height} priority sizes="480px" />
            </motion.div>
          ) : null}
          <motion.div style={reduce ? undefined : { y: front }} className="relative z-10 mt-24 mr-12 w-[88%]">
            <BrowserFrame src={images[0].public_id} alt={images[0].alt ?? ""} w={images[0].width} h={images[0].height} priority sizes="520px" />
          </motion.div>
        </>
      )}
    </div>
  )
}
