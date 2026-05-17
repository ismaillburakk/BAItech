"use client"

import { useEffect, useRef } from "react"
import { useConsent } from "@/components/consent-context"

export function GTranslateWrapper() {
  const { consent } = useConsent()
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    // Only load the GTranslate widget once the user has explicitly opted in to
    // functional cookies. Loading the script transfers IP/page data to Google.
    if (!consent.functional) return
    if (scriptRef.current) return

    window.gtranslateSettings = {
      default_language: "tr",
      native_language_names: true,
      languages: ["tr", "en", "ar", "es", "de"],
      globe_color: "#a8845d",
      globe_size: 40,
      flag_size: 24,
      wrapper_selector: ".gtranslate_wrapper",
      horizontal_position: "right",
      vertical_position: "bottom",
    }

    const script = document.createElement("script")
    script.src = "https://cdn.gtranslate.net/widgets/latest/globe.js"
    script.defer = true
    document.body.appendChild(script)
    scriptRef.current = script

    return () => {
      if (scriptRef.current) {
        document.body.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
  }, [consent.functional])

  // Render the wrapper element so the script has somewhere to mount.
  // If user declined functional cookies, we still render the empty container
  // so layout doesn't shift — the script just never injects content.
  return (
    <div className="gtranslate_wrapper fixed bottom-[20px] right-[20px] z-40 h-[40px] w-[40px]" />
  )
}
