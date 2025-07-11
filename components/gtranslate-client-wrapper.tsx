"use client"

import { useEffect } from "react"

export function GTranslateWrapper() {
  useEffect(() => {
    // GTranslate ayarları
    window.gtranslateSettings = {
      default_language: "tr",
      native_language_names: true,
      languages: ["tr", "en", "ar", "es", "de"],
      globe_color: "#66aaff",
      globe_size: 40,
      flag_size: 24,
      wrapper_selector: ".gtranslate_wrapper",
      horizontal_position: "right",
      vertical_position: "top",
    }

    // Script'i dinamik olarak ekle
    const script = document.createElement("script")
    script.src = "https://cdn.gtranslate.net/widgets/latest/globe.js"
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="gtranslate_wrapper fixed top-[14px] right-[16px] z-50 w-[40px] h-[40px]" />
  )
}
