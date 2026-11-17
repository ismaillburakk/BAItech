"use client";

/**
 * Kaydedilmemiş değişiklik koruması: veri yüklenince form durumunun
 * fotoğrafı alınır; mevcut durum farklıysa sekme kapatma / panel içi
 * gezinme onay ister (lib/useUnsavedChanges).
 */
import { useEffect, useRef } from "react";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";

export function useDirtyGuard(serialize: () => string, ready: boolean) {
  const snapshot = useRef<string | null>(null);
  const serializeRef = useRef(serialize);

  useEffect(() => {
    serializeRef.current = serialize;
  });

  useEffect(() => {
    if (ready && snapshot.current === null) snapshot.current = serializeRef.current();
  });

  const isDirty = () => snapshot.current !== null && snapshot.current !== serializeRef.current();
  useUnsavedChanges(isDirty);

  return {
    isDirty,
    /** Kayıt sonrası: yeni durumu temel al */
    reset() {
      snapshot.current = serializeRef.current();
    },
    /** Ayrılmadan önce korumayı kaldır */
    release() {
      snapshot.current = null;
    },
  };
}
