/**
 * Cloudinary yardımcıları — client tarafında kullanılabilir.
 *
 * Yükleme: unsigned upload preset ile doğrudan Cloudinary REST API'ye
 * (progress için XMLHttpRequest). Preset Cloudinary tarafında kısıtlı
 * OLMADIĞI için tür/boyut doğrulaması yükleme ÖNCESİ burada yapılır
 * (validateImageFile) — geçersiz dosya ağa hiç çıkmaz.
 * Silme: yalnızca server tarafında, imzalı Admin API ile
 * (app/api/admin/cloudinary/delete/route.ts).
 */
import type { CloudinaryImage } from "@/types";

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

/** Kabul edilen görsel türleri: JPEG, PNG, WebP, AVIF, SVG */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
] as const;

/** Uzantı → MIME (bazı tarayıcılar file.type'ı boş bırakır) */
const EXTENSION_TYPES: Record<string, (typeof ALLOWED_IMAGE_TYPES)[number]> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
};

/** <input accept> değeri */
export const IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");

/** Üst boyut sınırı: 10 MB */
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function cldUrl(publicId: string, transform = "f_auto,q_auto"): string {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${publicId}`;
}

/** Admin panel önizlemeleri — logolar kırpılmasın diye c_pad (şeffaf dolgu; zemin rengini kapsayıcı verir) */
export function cldThumb(publicId: string, width = 160, height = 120, mode: "fill" | "pad" = "fill"): string {
  const crop = mode === "pad" ? "c_pad,b_transparent" : "c_fill";
  return cldUrl(publicId, `f_auto,q_auto,${crop},w_${width},h_${height}`);
}

function resolveType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TYPES[ext] ?? "";
}

/** Yükleme öncesi tür/boyut doğrulaması — hata mesajı ya da null */
export function validateImageFile(file: File): string | null {
  const type = resolveType(file);
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(type)) {
    return `"${file.name}" desteklenmeyen türde — JPEG, PNG, WebP, AVIF veya SVG yükleyin.`;
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `"${file.name}" çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB) — sınır 10 MB.`;
  }
  if (file.size === 0) {
    return `"${file.name}" boş bir dosya.`;
  }
  return null;
}

/** Süren yükleme sayısı — formlar yükleme bitmeden kaydetmeyi engeller (öksüz görsel önlemi) */
let activeUploads = 0;
export function hasActiveUploads(): boolean {
  return activeUploads > 0;
}
export const UPLOAD_IN_PROGRESS_MESSAGE = "Görsel yüklemesi sürüyor — tamamlanmasını bekleyip tekrar kaydedin.";

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format?: string;
}

/** Görseli unsigned preset ile yükler; onProgress 0-100 */
export function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryImage> {
  const validationError = validateImageFile(file);
  if (validationError) return Promise.reject(new Error(validationError));

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    return Promise.reject(
      new Error("Cloudinary yapılandırması eksik — NEXT_PUBLIC_CLOUDINARY_* değişkenlerini kontrol edin."),
    );
  }

  activeUploads += 1;
  const done = () => {
    activeUploads = Math.max(0, activeUploads - 1);
  };
  return new Promise<CloudinaryImage>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("loadend", done);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "bai");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText) as CloudinaryUploadResponse;
          resolve({
            public_id: data.public_id,
            url: data.secure_url,
            width: data.width,
            height: data.height,
            ...(data.format ? { format: data.format } : {}),
          });
        } catch {
          reject(new Error("Cloudinary yanıtı çözümlenemedi."));
        }
        return;
      }
      let message = `Yükleme başarısız (HTTP ${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText) as { error?: { message?: string } };
        if (body.error?.message) message += ` Detay: ${body.error.message}`;
      } catch {
        // gövde çözümlenemedi
      }
      reject(new Error(message));
    });

    xhr.addEventListener("error", () => reject(new Error("Ağ hatası — görsel yüklenemedi.")));
    xhr.addEventListener("abort", () => reject(new Error("Yükleme iptal edildi.")));

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * Görselleri server üzerinden Cloudinary'den siler (korumalı API route).
 * Fırlatmaz; sonucu döndürür.
 */
export async function deleteFromCloudinary(publicIds: string[]): Promise<{ ok: boolean; message?: string }> {
  const unique = [...new Set(publicIds.filter(Boolean))];
  if (unique.length === 0) return { ok: true };

  try {
    // Route tek istekte en fazla 30 görsel kabul eder — parçalara böl
    for (let i = 0; i < unique.length; i += 30) {
      const response = await fetch("/api/admin/cloudinary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicIds: unique.slice(i, i + 30) }),
      });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        return {
          ok: false,
          message: data?.error ?? "Cloudinary görselleri silinemedi — panelden tekrar deneyebilirsiniz.",
        };
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Cloudinary silme isteği ağ hatasıyla başarısız." };
  }
}
