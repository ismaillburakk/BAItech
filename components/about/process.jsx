"use client"

/** Origin comp-531 timeline'ı + kaydırmayla dolan turuncu ilerleme çizgisi (hakkimizda.md v2). */
import { motion, useScroll } from "framer-motion"
import { useRef } from "react"

import { useReducedMotion } from "@/lib/use-media"
import ProcessTimeline from "@/components/origin/comp-531"

/** @param {any} props */
export function ScrollProcess({ steps, note }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  return (
    <div ref={ref} className="relative">
      <motion.div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[-1.5rem] w-0.5 origin-top rounded-full bg-brand max-sm:hidden"
        style={reduce ? undefined : { scaleY: scrollYProgress }}
      />
      <ProcessTimeline steps={steps} note={note} />
    </div>
  )
}
