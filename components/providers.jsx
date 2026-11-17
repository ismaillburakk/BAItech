"use client"

import { MotionConfig } from "framer-motion"

import { ScrollProgress } from "@/components/motion/fx"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DUR, EASE } from "@/lib/motion"

/**
 * MotionConfig: tüm geçişlerin varsayılanı tek eğri + 200 ms;
 * reducedMotion="user" → işletim sistemi "hareketi azalt" açıksa transform animasyonları kapalı.
 */
/** @param {any} props */
export function Providers({ children }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE }}>
      <TooltipProvider>
        <ScrollProgress />
        {children}
        <Toaster position="bottom-right" duration={4000} />
      </TooltipProvider>
    </MotionConfig>
  )
}
