"use client";

/* eslint-disable @next/next/no-img-element -- admin önizlemeleri için
   next/image gereksiz (düşük trafik, sabit küçük boyutlar) */

import { useEffect, useRef, useState, type DragEvent } from "react";
import { cldThumb, IMAGE_ACCEPT, uploadToCloudinary, validateImageFile } from "@/lib/cloudinary";
import { reorder } from "@/lib/utils";
import type { GalleryImage } from "@/types";

interface UploadingItem {
  key: string;
  name: string;
  progress: number;
}

interface GalleryUploaderProps {
  label: string;
  value: GalleryImage[];
  /** Sıralama değişince order alanları 0'dan yeniden atanır */
  onChange: (images: GalleryImage[]) => void;
  hint?: string;
}

/** order alanlarını dizideki konuma göre yeniden yazar */
function withOrder(images: Omit<GalleryImage, "order">[]): GalleryImage[] {
  return images.map((image, index) => ({ ...image, order: index }));
}

/** Çoklu galeri yükleme + sürükle-bırak sıralama */
export default function GalleryUploader({
  label,
  value,
  onChange,
  hint,
}: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Yükleme sürerken kullanıcı listeyi/formu değiştirebilir: tamamlanınca
  // EN GÜNCEL değer ve callback kullanılır (eski kapanış değişiklikleri ezmesin)
  const latest = useRef({ value, onChange });
  useEffect(() => {
    latest.current = { value, onChange };
  });
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setErrors([]);

    // Geçersiz dosyaları baştan ele — geçerliler paralel yüklensin
    const invalid = files
      .map(validateImageFile)
      .filter((message): message is string => message !== null);
    const valid = files.filter((file) => validateImageFile(file) === null);
    if (invalid.length > 0) setErrors(invalid);

    // value, onChange ile parent state'e gittiği için upload'lar
    // tamamlandıkça biriktirip tek seferde ekliyoruz
    const completed: GalleryImage[] = [];

    await Promise.all(
      valid.map(async (file, index) => {
        const key = `${Date.now()}-${index}-${file.name}`;
        setUploading((current) => [
          ...current,
          { key, name: file.name, progress: 0 },
        ]);
        try {
          const image = await uploadToCloudinary(file, (percent) =>
            setUploading((current) =>
              current.map((item) =>
                item.key === key ? { ...item, progress: percent } : item,
              ),
            ),
          );
          completed.push({ ...image, order: 0 });
        } catch (err) {
          setErrors((current) => [
            ...current,
            err instanceof Error ? err.message : `"${file.name}" yüklenemedi.`,
          ]);
        } finally {
          setUploading((current) => current.filter((item) => item.key !== key));
        }
      }),
    );

    if (completed.length > 0) {
      latest.current.onChange(withOrder([...latest.current.value, ...completed]));
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDropFiles(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleRemove(publicId: string) {
    onChange(withOrder(value.filter((image) => image.public_id !== publicId)));
  }

  function handleReorderDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      return;
    }
    onChange(withOrder(reorder(value, dragIndex, targetIndex)));
    setDragIndex(null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700">{label}</span>

      {value.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((image, index) => (
            <li
              key={image.public_id}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => setDragIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleReorderDrop(index);
              }}
              className={`group relative cursor-grab overflow-hidden rounded-md border bg-white active:cursor-grabbing ${
                dragIndex === index
                  ? "border-zinc-500 opacity-60"
                  : "border-zinc-200"
              }`}
              title="Sıralamak için sürükleyin"
            >
              <img
                src={cldThumb(image.public_id, 320, 240)}
                alt={image.alt ?? `Galeri görseli ${index + 1}`}
                className="h-28 w-full object-cover object-top"
              />
              <input
                type="text"
                value={image.alt ?? ""}
                onChange={(event) =>
                  onChange(value.map((im) => (im.public_id === image.public_id ? { ...im, alt: event.target.value } : im)))
                }
                placeholder="Alt metin"
                aria-label={`Görsel ${index + 1} alt metni`}
                className="block min-h-11 w-full border-t border-zinc-200 px-2 text-base text-zinc-900 outline-none focus:bg-orange-50 sm:text-xs"
              />
              <div className="flex gap-1 border-t border-zinc-200 p-1">
                <button
                  type="button"
                  aria-label="Sola taşı"
                  disabled={index === 0}
                  onClick={() => onChange(withOrder(reorder(value, index, index - 1)))}
                  className="min-h-11 flex-1 rounded text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label="Sağa taşı"
                  disabled={index === value.length - 1}
                  onClick={() => onChange(withOrder(reorder(value, index, index + 1)))}
                  className="min-h-11 flex-1 rounded text-xs text-zinc-600 hover:bg-zinc-100 disabled:opacity-30"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(image.public_id)}
                  className="min-h-11 flex-1 rounded text-xs text-red-600 hover:bg-red-50"
                >
                  Kaldır
                </button>
              </div>
              <span className="absolute left-1.5 top-1.5 rounded bg-zinc-900/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                {index + 1}
              </span>
            </li>
          ))}
        </ul>
      )}

      {uploading.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {uploading.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2"
            >
              <span className="min-w-0 flex-1 truncate text-xs text-zinc-600">
                {item.name}
              </span>
              <div className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-zinc-700 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <span className="w-9 text-right text-xs text-zinc-500">
                %{item.progress}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label={`${label}: görsel ekle`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDropFiles}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
          isDragOver
            ? "border-zinc-500 bg-zinc-50"
            : "border-zinc-300 bg-white hover:border-zinc-400"
        }`}
      >
        <span className="text-sm font-medium text-zinc-600">
          Görsel(ler) seçin veya buraya sürükleyin
        </span>
        <span className="text-xs text-zinc-400">
          Birden çok dosya seçebilirsiniz — sıralamak için küçük görselleri
          sürükleyin
        </span>
      </div>

      {hint && <p className="text-xs text-zinc-400">{hint}</p>}
      {errors.map((message) => (
        <p key={message} className="text-xs text-red-600">
          {message}
        </p>
      ))}

      <input
        ref={inputRef}
        type="file"
        accept={IMAGE_ACCEPT}
        data-testid="gallery-input"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}
