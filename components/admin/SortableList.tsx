"use client";

/**
 * Sıralanabilir içerik listesi — AD Mimarlık liste ekranlarının ortak hali.
 * Masaüstünde sürükle-bırak, her cihazda ↑/↓ butonları (dokunmatik ve
 * klavye erişimi). Sıra değişince toplu kaydedilir; silme onay ister.
 */
import Link from "next/link";
import { useState, type ReactNode } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { buttonClass } from "@/components/admin/ui";
import { reorder } from "@/lib/utils";

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  getTitle: (item: T) => string;
  renderMeta?: (item: T) => ReactNode;
  renderThumb?: (item: T) => ReactNode;
  editHref: (item: T) => string;
  onPersistOrder: (orderedIds: string[]) => Promise<void>;
  onDelete: (item: T) => Promise<void>;
  emptyText: string;
  deleteDescription?: (item: T) => string;
}

export default function SortableList<T>({
  items,
  getId,
  getTitle,
  renderMeta,
  renderThumb,
  editHref,
  onPersistOrder,
  onDelete,
  emptyText,
  deleteDescription,
}: SortableListProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [pending, setPending] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  async function move(from: number, to: number) {
    if (to < 0 || to >= items.length || from === to) return;
    const next = reorder(items, from, to);
    setSavingOrder(true);
    setError(null);
    try {
      await onPersistOrder(next.map(getId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sıralama kaydedilemedi.");
    } finally {
      setSavingOrder(false);
    }
  }

  async function confirmDelete() {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      await onDelete(pending);
      setPending(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return <p className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">{emptyText}</p>;
  }

  return (
    <>
      {error ? (
        <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <p className="mt-4 text-xs text-zinc-500" aria-live="polite">
        {savingOrder ? "Sıralama kaydediliyor…" : "Sıralamak için satırları sürükleyin veya ↑/↓ kullanın."}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {items.map((item, index) => (
          <li
            key={getId(item)}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragEnd={() => setDragIndex(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (dragIndex !== null) void move(dragIndex, index);
              setDragIndex(null);
            }}
            className={`flex flex-col gap-3 rounded-lg border bg-white p-3 sm:flex-row sm:items-center ${
              dragIndex === index ? "border-orange-400 opacity-60" : "border-zinc-200"
            }`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="hidden w-6 shrink-0 cursor-grab text-center text-zinc-400 select-none sm:block" aria-hidden="true">
                ⋮⋮
              </span>
              <span className="w-6 shrink-0 text-xs tabular-nums text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
              {renderThumb ? <span className="shrink-0">{renderThumb(item)}</span> : null}
              <div className="min-w-0">
                <Link href={editHref(item)} className="block truncate font-medium text-zinc-900 hover:underline">
                  {getTitle(item) || "(başlıksız)"}
                </Link>
                {renderMeta ? <div className="mt-0.5 text-xs text-zinc-500">{renderMeta(item)}</div> : null}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass.small} aria-label="Yukarı taşı" disabled={index === 0 || savingOrder} onClick={() => move(index, index - 1)}>
                ↑
              </button>
              <button
                type="button"
                className={buttonClass.small}
                aria-label="Aşağı taşı"
                disabled={index === items.length - 1 || savingOrder}
                onClick={() => move(index, index + 1)}
              >
                ↓
              </button>
              <Link href={editHref(item)} className={buttonClass.secondary}>
                Düzenle
              </Link>
              <button type="button" className={buttonClass.danger} onClick={() => setPending(item)}>
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={pending !== null}
        title="Silinsin mi?"
        description={
          pending
            ? deleteDescription?.(pending) ??
              `"${getTitle(pending)}" kalıcı olarak silinecek; bağlı görseller Cloudinary'den de kaldırılır. Bu işlem geri alınamaz.`
            : ""
        }
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setPending(null)}
      />
    </>
  );
}
