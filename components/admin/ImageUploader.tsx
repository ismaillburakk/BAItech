"use client";

/* eslint-disable @next/next/no-img-element -- admin önizlemeleri için
   next/image gereksiz (blob URL'leri + düşük trafik) */

import { useRef, useState, type DragEvent } from "react";
import { cldThumb, IMAGE_ACCEPT, uploadToCloudinary } from "@/lib/cloudinary";
import type { CloudinaryImage } from "@/types";

interface ImageUploaderProps {
  /** Alan etiketi — örn. "Kapak Görseli" */
  label: string;
  value: CloudinaryImage | null;
  /**
   * Yeni görsel yüklendiğinde veya kaldırıldığında çağrılır.
   * Cloudinary'den fiziksel silme çağıranın sorumluluğundadır
   * (form kaydedilirken fark üzerinden yapılır — yarım kalan
   * düzenlemelerde referans kırılmasın diye).
   */
  onChange: (image: CloudinaryImage | null) => void;
  /** Önerilen oran ipucu — örn. "Önerilen oran: 21/10 (geniş yatay)" */
  hint?: string;
  /** Logolar için: kırpmadan, koyu zeminde önizle */
  contain?: boolean;
  /** Alt metin düzenleme alanı göster */
  withAlt?: boolean;
}

/** Tekli görsel yükleme alanı (kapak, portre, logo …) */
export default function ImageUploader({
  label,
  value,
  onChange,
  hint,
  contain = false,
  withAlt = true,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isUploading = progress !== null;

  async function handleFile(file: File | undefined) {
    if (!file || isUploading) return;
    setError(null);
    setProgress(0);
    try {
      const image = await uploadToCloudinary(file, setProgress);
      onChange(image);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>

      {value ? (
        <div className="relative flex flex-wrap items-start gap-4 rounded-md border border-zinc-200 bg-white p-3">
          {isUploading ? (
            <div role="status" className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md bg-white/90 px-4">
              <span className="text-sm text-zinc-700">Yeni görsel yükleniyor… %{progress}</span>
              <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : null}
          <img
            src={cldThumb(value.public_id, 240, 180, contain ? "pad" : "fill")}
            alt={value.alt ?? label}
            className={`h-24 w-32 shrink-0 rounded ${contain ? "bg-[#0a1730] object-contain" : "object-cover"}`}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <p className="truncate text-xs text-zinc-500" title={value.public_id}>
              {value.public_id}
            </p>
            {value.width && value.height && (
              <p className="text-xs text-zinc-400">
                {value.width} × {value.height}px
              </p>
            )}
            {withAlt ? (
              <input
                type="text"
                value={value.alt ?? ""}
                onChange={(event) => onChange({ ...value, alt: event.target.value })}
                placeholder="Alt metin (erişilebilirlik + SEO)"
                aria-label="Alt metin"
                className="min-h-11 w-full rounded border border-zinc-300 bg-white px-2.5 text-base text-zinc-900 outline-none focus:border-orange-500 sm:text-sm"
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
                className="min-h-11 rounded border border-zinc-300 px-3 py-1 text-xs text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
              >
                Değiştir
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                disabled={isUploading}
                className="min-h-11 rounded border border-red-200 px-3 py-1 text-xs text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                Kaldır
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`${label}: görsel seç`}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && !isUploading) {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onClick={() => !isUploading && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors ${
            isDragOver
              ? "border-zinc-500 bg-zinc-50"
              : "border-zinc-300 bg-white hover:border-zinc-400"
          }`}
        >
          {isUploading ? (
            <div className="flex w-full max-w-xs flex-col items-center gap-2">
              <span className="text-sm text-zinc-600">
                Yükleniyor… %{progress}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-zinc-700 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <span className="text-sm font-medium text-zinc-600">
                Görsel seçin veya buraya sürükleyin
              </span>
              <span className="text-xs text-zinc-400">
                JPEG, PNG, WebP, AVIF veya SVG — en fazla 10 MB
              </span>
            </>
          )}
        </div>
      )}

      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
      {error && <p role="alert" className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        data-testid="image-input"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
