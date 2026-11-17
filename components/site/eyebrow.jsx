import { cn } from "@/lib/utils"

/** Bölüm etiketi — numaralı "bölüm" çipi (storytelling: Bölüm 01, 02 …). */
/** @param {any} props */
export function Eyebrow({ index, children, className }) {
  return (
    <p className={cn("inline-flex items-center gap-3 rounded-full border border-border bg-card/60 py-1 pr-4 pl-1 text-sm text-muted-foreground", className)}>
      {index ? (
        <span className="tabular inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-brand px-2 font-heading text-xs font-bold text-brand-foreground">
          {index}
        </span>
      ) : (
        <span aria-hidden="true" className="ml-2 size-1.5 rounded-full bg-brand" />
      )}
      {children}
    </p>
  )
}
