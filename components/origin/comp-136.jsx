"use client"

/**
 * Origin UI comp-136 — "checkbox, label"
 * Kaynak: https://coss.com/origin/r/comp-136.json (@origin/comp-136)
 * BAI uyarlaması: İletişim formu KVKK onay kutusu (metin mevcut siteden).
 * Kurallar: iletisim.md, skill form-labels (label for), touch-target (satırın tamamı
 * tıklanabilir, min 44px), error-placement (FieldError — Origin comp-64).
 */
import { useId } from "react"

import FieldError from "@/components/origin/comp-64"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** @param {any} props */
export default function ConsentCheckbox({ checked, onCheckedChange, error, children }) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className="space-y-2">
      <div
        className={cn(
          "flex min-h-11 items-start gap-3 rounded-lg border p-3 transition-colors duration-(--dur-fast)",
          error ? "border-destructive" : "border-border hover:bg-accent"
        )}
      >
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-required="true"
          className="relative mt-0.5 after:absolute after:-inset-3 after:content-['']"
        />
        <Label htmlFor={id} className="block text-sm font-normal leading-relaxed text-muted-foreground">
          {children}
        </Label>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}
