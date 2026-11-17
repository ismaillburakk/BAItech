/** Firestore CRUD katmanlarının ortak yardımcıları (client tarafı). */

/**
 * İçerik mutasyonu sonrası public site ISR önbelleğini tazeler.
 * Ateşle-unut: başarısızlık admin akışını BOZMAZ (site en geç revalidate
 * süresi sonunda kendiliğinden güncellenir).
 */
export function notifySiteRevalidate(): void {
  if (typeof window === "undefined") return;
  void fetch("/api/admin/revalidate", { method: "POST" }).catch(() => undefined);
}

/** Firestore hatasını kullanıcıya gösterilebilir Türkçe mesaja çevirir */
export function mapFirestoreError(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error ? String((error as { code: unknown }).code) : "";
  if (code === "permission-denied") {
    return "Yetki hatası — oturumunuz düşmüş ya da hesabınızda admin yetkisi yok. Çıkıp yeniden giriş yapın.";
  }
  if (code === "unavailable") {
    return "Firestore'a ulaşılamadı — internet bağlantınızı kontrol edin.";
  }
  if (error instanceof Error && error.message && !code) return error.message;
  return "İşlem başarısız oldu. Lütfen tekrar deneyin.";
}

/**
 * Firestore `undefined` kabul etmez: nesneyi derinlemesine dolaşıp
 * undefined anahtarları çıkarır (null korunur).
 */
export function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => clean(item)) as T;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      if (item !== undefined) out[key] = clean(item);
    }
    return out as T;
  }
  return value;
}
