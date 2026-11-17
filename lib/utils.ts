/** Genel yardımcılar — client ve server tarafında kullanılabilir. */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Türkçe karakterleri sadeleştirerek URL dostu slug üretir */
export function slugifyTr(input: string): string {
  const charMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return input
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (ch) => charMap[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function reorder<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

export function formatDateTimeTr(timestamp?: { seconds: number } | null): string {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(new Date(timestamp.seconds * 1000));
}

/** "+90 506 356 1490" → "tel:+905063561490" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Güvenli dış bağlantı: yalnız http(s) */
export function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** `*kelime*` vurgu işaretlerini temizler (metadata, schema, alt metin) */
export function stripEm(text: string): string {
  return text.replace(/\*/g, "");
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function pad3(n: number): string {
  return String(n).padStart(3, "0");
}
