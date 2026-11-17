/**
 * Origin UI comp-64 — "label, textarea, error"
 * Kaynak: https://coss.com/origin/r/comp-64.json (@origin/comp-64)
 * BAI uyarlaması: Origin'in hata mesajı deseni (aria-live="polite" + role="alert",
 * destructive renk) ayrı bileşen olarak; FormField ve KVKK onay kutusu kullanır.
 * Kurallar: iletisim.md, skill error-placement, aria-live-errors, error-clarity.
 */
/** @param {any} props */
export default function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} aria-live="polite" role="alert" className="text-sm text-destructive">
      {message}
    </p>
  )
}
