"use client";

import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** true → onay butonu kırmızı (yıkıcı işlem) */
  danger?: boolean;
  /** Onay işlemi sürüyorsa butonları kilitle */
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Basit onay penceresi — silme gibi geri alınamaz işlemler için */
export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Sil",
  cancelLabel = "Vazgeç",
  danger = true,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Odağı dialoga taşı (güvenli varsayılan: Vazgeç butonu)
    cancelButtonRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4"
      onClick={busy ? undefined : onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-500"
                : "bg-zinc-900 hover:bg-zinc-700"
            }`}
          >
            {busy ? "İşleniyor…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
