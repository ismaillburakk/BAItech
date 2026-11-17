"use client";

import { useEffect, useRef } from "react";

/**
 * Kaydedilmemiş form değişikliği koruması (admin panel).
 *
 * `isDirty` bir CALLBACK'tir ve yalnızca olay anında (beforeunload /
 * link tıklaması) çağrılır — böylece ref tabanlı fark hesapları render
 * sırasında okunmaz (react-hooks/refs kuralı) ve daima taze sonuç verir.
 *
 * Koruma kapsamı:
 * - Sekme kapatma / yenileme / adres çubuğu → tarayıcının yerel uyarısı,
 * - Panel içi link tıklamaları → Türkçe onay; reddedilirse gezinme iptal.
 *
 * Formların kendi "Vazgeç" butonları (button, link değil) buraya takılmaz;
 * onlar kendi onay dialoglarını yönetir.
 */
export function useUnsavedChanges(isDirty: () => boolean): void {
  const isDirtyRef = useRef(isDirty);

  // Her render'da güncel callback'i sakla (state kapanışları taze kalsın)
  useEffect(() => {
    isDirtyRef.current = isDirty;
  });

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirtyRef.current()) return;
      event.preventDefault();
    }

    function onClickCapture(event: MouseEvent) {
      if (!isDirtyRef.current()) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      // Yalnız uygulama içi gezinmeleri yakala; yeni sekmeler serbest
      if (!href.startsWith("/") || anchor.target === "_blank") return;

      const confirmed = window.confirm(
        "Kaydedilmemiş değişiklikleriniz var — sayfadan ayrılırsanız kaybolacak. Devam edilsin mi?",
      );
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClickCapture, true);
    };
  }, []);
}
