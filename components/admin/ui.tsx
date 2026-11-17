"use client";

/**
 * Panel form/sayfa yapı taşları — AD Mimarlık panelinin görsel dili
 * (zinc tonları, beyaz kartlar) + BAI turuncu vurgu. Tüm kontroller
 * en az 44px yükseklik ve 16px font (iOS zoom önleme) ile.
 */
import Link from "next/link";
import type { ReactNode } from "react";

export const inputClass =
  "min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:bg-zinc-50 sm:text-sm";

export const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-zinc-700";

export const buttonClass = {
  primary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60",
  secondary:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50",
  danger:
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-red-200 bg-white px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50",
  small:
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-40",
};

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-zinc-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 sm:p-5">
      <h2 className="text-sm font-semibold text-zinc-900">{title}</h2>
      {description ? <p className="mt-1 text-xs text-zinc-500">{description}</p> : null}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Field({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  // İpucu <label> DIŞINDA: kontrolün erişilebilir adı yalnızca etiket olur
  return (
    <div className={`flex flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <label className={labelClass}>
        {label}
        {children}
      </label>
      {hint ? <span className="text-xs font-normal text-zinc-500">{hint}</span> : null}
    </div>
  );
}

/** SEO alanları için karakter sayacı (hedef aralık yeşil) */
export function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const n = [...value].length;
  const ok = n >= min && n <= max;
  return (
    <span className={ok ? "text-emerald-600" : n === 0 ? "text-zinc-400" : "text-amber-600"}>
      {n} karakter · önerilen {min}–{max}
    </span>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-md border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-orange-500"
      />
      <span className="flex flex-col">
        <span className="font-medium">{label}</span>
        {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
      </span>
    </label>
  );
}

export function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}

export function SuccessBox({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="status" className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      {message}
    </p>
  );
}

/** Formun altına yapışan kaydet/vazgeç çubuğu */
export function SaveBar({
  saving,
  onCancel,
  saveLabel = "Kaydet",
  extra,
}: {
  saving: boolean;
  onCancel?: () => void;
  saveLabel?: string;
  extra?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-100/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {extra}
      {onCancel ? (
        <button type="button" onClick={onCancel} disabled={saving} className={buttonClass.secondary}>
          Vazgeç
        </button>
      ) : null}
      <button type="submit" disabled={saving} className={buttonClass.primary}>
        {saving ? "Kaydediliyor…" : saveLabel}
      </button>
    </div>
  );
}

export function Loading({ label = "Yükleniyor…" }: { label?: string }) {
  return <p className="text-sm text-zinc-500">{label}</p>;
}

export function NotFoundNotice({ backHref, label }: { backHref: string; label: string }) {
  return (
    <div>
      <p className="text-sm text-zinc-600">Kayıt bulunamadı.</p>
      <Link href={backHref} className="mt-3 inline-flex min-h-11 items-center text-sm text-zinc-900 underline">
        ← {label}
      </Link>
    </div>
  );
}
