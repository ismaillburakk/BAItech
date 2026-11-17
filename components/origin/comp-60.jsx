/**
 * Origin UI comp-60 — "label, textarea, required"
 * Kaynak: https://coss.com/origin/r/comp-60.json (@origin/comp-60)
 * BAI uyarlaması: iletişim formu metin alanları (Input ve Textarea için ortak alan).
 * Hata durumu Origin comp-64 desenini kullanır (FieldError).
 * Kurallar: iletisim.md — görünür <label for>, zorunlu işareti, hata alanın
 * altında + aria-describedby, 44px yükseklik, 16px font.
 */
import { useId } from "react"

import FieldError from "@/components/origin/comp-64"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

/** @param {any} props */
export default function FormField({ label, error, multiline = false, required = true, hint, ...props }) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const Control = multiline ? Textarea : Input
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined
  return (
    <div className="*:not-first:mt-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
        {required ? (
          <>
            {" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(zorunlu)</span>
          </>
        ) : null}
      </Label>
      <Control
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {hint && !error ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <FieldError id={errorId} message={error} />
    </div>
  )
}
