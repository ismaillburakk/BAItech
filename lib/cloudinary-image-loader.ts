"use client";

/**
 * next/image için global Cloudinary loader (next.config.ts → images.loaderFile).
 *
 * `src` olarak Cloudinary public_id verilir; loader her genişlik için
 * `f_auto,q_auto,w_…,c_limit` transformasyonlu URL üretir — responsive
 * srcset tamamen Cloudinary'den servis edilir (Netlify image CDN'i
 * kullanılmaz, uzak host için remotePatterns gerekmez).
 *
 * Yerel dosyalar ("/img/...") ve tam URL'ler olduğu gibi döner.
 */
import type { ImageLoaderProps } from "next/image";

export default function cloudinaryImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith("http") || src.startsWith("/")) return src;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const q = quality && quality !== 75 ? `q_${quality}` : "q_auto";
  const params = ["f_auto", q, `w_${width}`, "c_limit"];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params.join(",")}/${src}`;
}
