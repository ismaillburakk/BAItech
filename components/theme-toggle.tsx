"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

type Theme = "light" | "dark"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("bai-theme")) as Theme | null
    const initial: Theme = stored === "dark" ? "dark" : "light"
    setTheme(initial)
    document.documentElement.setAttribute("data-theme", initial)
    setMounted(true)
  }, [])

  const apply = (next: Theme) => {
    setTheme(next)
    document.documentElement.setAttribute("data-theme", next)
    try {
      localStorage.setItem("bai-theme", next)
    } catch {}
  }

  return (
    <div
      role="group"
      aria-label="Tema seçici"
      className="inline-flex items-center gap-0 rounded-pill border border-rule bg-paper p-0.5"
    >
      <button
        type="button"
        aria-pressed={mounted && theme === "light"}
        aria-label="Açık tema"
        onClick={() => apply("light")}
        className={`flex h-7 w-7 items-center justify-center rounded-pill transition-colors ${
          mounted && theme === "light" ? "bg-ink text-bg" : "text-ink-3 hover:text-ink"
        }`}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        aria-pressed={mounted && theme === "dark"}
        aria-label="Koyu tema"
        onClick={() => apply("dark")}
        className={`flex h-7 w-7 items-center justify-center rounded-pill transition-colors ${
          mounted && theme === "dark" ? "bg-ink text-bg" : "text-ink-3 hover:text-ink"
        }`}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
