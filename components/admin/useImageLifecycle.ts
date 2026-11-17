"use client";

/**
 * Görsel yaşam döngüsü (AD Mimarlık deseni, tek hook'ta):
 * - savedIds  : dokümanda kayıtlı görseller (düzenleme yüklenince set edilir)
 * - session   : bu form oturumunda yüklenenler
 * Kaydet  → kayıtlıyken formdan çıkarılan görseller Cloudinary'den silinir.
 * Vazgeç  → bu oturumda yüklenip kayda girmeyen görseller silinir (öksüz kalmaz).
 * Sil     → listelerde: doküman silinince tüm görselleri silinir.
 */
import { useRef } from "react";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export function useImageLifecycle() {
  const savedIds = useRef<Set<string>>(new Set());
  const session = useRef<Set<string>>(new Set());

  return {
    /** Düzenlenen dokümanın mevcut görsellerini kaydet */
    setSaved(ids: string[]) {
      savedIds.current = new Set(ids);
    },
    /** Upload bileşenlerinden gelen güncel id listesini izle */
    track(ids: string[]) {
      for (const id of ids) if (!savedIds.current.has(id)) session.current.add(id);
    },
    hasSessionUploads() {
      return session.current.size > 0;
    },
    /** Kayıt başarılı: artık kullanılmayan (eski kayıtlı + bu oturumda yüklenip çıkarılan) görselleri sil */
    async commit(currentIds: string[]) {
      const current = new Set(currentIds);
      const removed = [...savedIds.current, ...session.current].filter((id) => !current.has(id));
      savedIds.current = current;
      session.current = new Set();
      if (removed.length) await deleteFromCloudinary(removed);
    },
    /** Vazgeç: oturumda yüklenip kayda girmeyenleri sil */
    async discard() {
      const orphans = [...session.current].filter((id) => !savedIds.current.has(id));
      session.current = new Set();
      if (orphans.length) await deleteFromCloudinary(orphans);
    },
  };
}
