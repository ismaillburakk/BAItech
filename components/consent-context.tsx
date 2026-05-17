"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type ConsentState = {
  necessary: true
  functional: boolean
  decided: boolean
}

const STORAGE_KEY = "bai-consent"
const STORAGE_VERSION = 1

type StoredConsent = {
  v: number
  functional: boolean
  ts: string
}

type ConsentContextValue = {
  consent: ConsentState
  acceptAll: () => void
  rejectNonEssential: () => void
  savePreferences: (next: { functional: boolean }) => void
  openSettings: () => void
  isSettingsOpen: boolean
  closeSettings: () => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

const defaultState: ConsentState = {
  necessary: true,
  functional: false,
  decided: false,
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(defaultState)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as StoredConsent
      if (parsed?.v === STORAGE_VERSION) {
        setConsent({
          necessary: true,
          functional: !!parsed.functional,
          decided: true,
        })
      }
    } catch {
      // ignore
    }
  }, [])

  const persist = useCallback((next: { functional: boolean }) => {
    setConsent({ necessary: true, functional: next.functional, decided: true })
    try {
      const payload: StoredConsent = {
        v: STORAGE_VERSION,
        functional: next.functional,
        ts: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore
    }
  }, [])

  const acceptAll = useCallback(() => {
    persist({ functional: true })
    setIsSettingsOpen(false)
  }, [persist])

  const rejectNonEssential = useCallback(() => {
    persist({ functional: false })
    setIsSettingsOpen(false)
    // Reset GTranslate cookie if user opted out — language goes back to TR.
    try {
      document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
      document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
    } catch {
      // ignore
    }
  }, [persist])

  const savePreferences = useCallback(
    (next: { functional: boolean }) => {
      persist(next)
      setIsSettingsOpen(false)
      if (!next.functional) {
        try {
          document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;"
          document.cookie = `googtrans=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
        } catch {
          // ignore
        }
      }
    },
    [persist]
  )

  const openSettings = useCallback(() => setIsSettingsOpen(true), [])
  const closeSettings = useCallback(() => setIsSettingsOpen(false), [])

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      acceptAll,
      rejectNonEssential,
      savePreferences,
      openSettings,
      isSettingsOpen,
      closeSettings,
    }),
    [consent, acceptAll, rejectNonEssential, savePreferences, openSettings, isSettingsOpen, closeSettings]
  )

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) {
    throw new Error("useConsent must be used inside <ConsentProvider>")
  }
  return ctx
}
