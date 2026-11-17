/**
 * Origin UI comp-421 — "badge, chip, status"
 * Kaynak: https://coss.com/origin/r/comp-421.json (@origin/comp-421)
 * BAI uyarlaması: projelerin durum alanı (statusTone) için noktalı durum rozeti.
 * Kural: skill color-not-only — renk tek başına anlam taşımaz, metin her zaman yazılı.
 */
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const TONES = {
  live: { dot: "bg-success", text: "text-success" },
  active: { dot: "bg-brand", text: "text-brand-ink" },
  soon: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

/** @param {any} props */
export default function StatusBadge({ tone = "live", children, className }) {
  const t = TONES[tone] ?? TONES.soon
  return (
    <Badge className={cn("h-6 gap-1.5 bg-card px-2.5 text-xs", t.text, className)} variant="outline">
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", t.dot)} />
      {children}
    </Badge>
  )
}
