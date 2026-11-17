"use client";

/** Tekrarlanan alan editörleri: metin listesi, etiket/değer listesi, kart listesi. */
import { reorder } from "@/lib/utils";
import { buttonClass, inputClass } from "@/components/admin/ui";
import type { CardItem, LabelValue } from "@/types";

function RowControls({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" className={buttonClass.small} aria-label="Yukarı taşı" disabled={index === 0} onClick={() => onMove(index, index - 1)}>
        ↑
      </button>
      <button type="button" className={buttonClass.small} aria-label="Aşağı taşı" disabled={index === count - 1} onClick={() => onMove(index, index + 1)}>
        ↓
      </button>
      <button type="button" className={`${buttonClass.small} text-red-600`} aria-label="Kaldır" onClick={() => onRemove(index)}>
        ×
      </button>
    </div>
  );
}

export function StringListEditor({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
  addLabel = "Satır ekle",
  hint,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  multiline?: boolean;
  placeholder?: string;
  addLabel?: string;
  hint?: string;
}) {
  const update = (i: number, v: string) => onChange(value.map((item, idx) => (idx === i ? v : item)));
  return (
    <fieldset className="flex flex-col gap-2 sm:col-span-2">
      <legend className="mb-1.5 text-sm font-medium text-zinc-700">{label}</legend>
      {value.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {multiline ? (
            <textarea
              value={item}
              rows={3}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              aria-label={`${label} ${i + 1}`}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          ) : (
            <input
              type="text"
              value={item}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
              aria-label={`${label} ${i + 1}`}
              className={inputClass}
            />
          )}
          <RowControls
            index={i}
            count={value.length}
            onMove={(from, to) => onChange(reorder(value, from, to))}
            onRemove={(idx) => onChange(value.filter((_, j) => j !== idx))}
          />
        </div>
      ))}
      <button type="button" className={`${buttonClass.secondary} self-start`} onClick={() => onChange([...value, ""])}>
        + {addLabel}
      </button>
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </fieldset>
  );
}

export function LabelValueEditor({
  label,
  value,
  onChange,
  labelPlaceholder = "Etiket",
  valuePlaceholder = "Değer",
  hint,
}: {
  label: string;
  value: LabelValue[];
  onChange: (next: LabelValue[]) => void;
  labelPlaceholder?: string;
  valuePlaceholder?: string;
  hint?: string;
}) {
  const update = (i: number, patch: Partial<LabelValue>) =>
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  return (
    <fieldset className="flex flex-col gap-2 sm:col-span-2">
      <legend className="mb-1.5 text-sm font-medium text-zinc-700">{label}</legend>
      {value.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md border border-zinc-200 p-2 sm:flex-row sm:items-center sm:border-0 sm:p-0">
          <input
            type="text"
            value={item.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder={labelPlaceholder}
            aria-label={`${label} ${i + 1} etiket`}
            className={`${inputClass} sm:max-w-56`}
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder={valuePlaceholder}
            aria-label={`${label} ${i + 1} değer`}
            className={inputClass}
          />
          <RowControls
            index={i}
            count={value.length}
            onMove={(from, to) => onChange(reorder(value, from, to))}
            onRemove={(idx) => onChange(value.filter((_, j) => j !== idx))}
          />
        </div>
      ))}
      <button type="button" className={`${buttonClass.secondary} self-start`} onClick={() => onChange([...value, { label: "", value: "" }])}>
        + Satır ekle
      </button>
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </fieldset>
  );
}

export function CardsEditor({
  label,
  value,
  onChange,
  hint,
  addLabel = "Kart ekle",
  titlePlaceholder = "Başlık",
}: {
  label: string;
  value: CardItem[];
  onChange: (next: CardItem[]) => void;
  hint?: string;
  addLabel?: string;
  titlePlaceholder?: string;
}) {
  const update = (i: number, patch: Partial<CardItem>) =>
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  return (
    <fieldset className="flex flex-col gap-3 sm:col-span-2">
      <legend className="mb-1.5 text-sm font-medium text-zinc-700">{label}</legend>
      {value.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder={titlePlaceholder}
              aria-label={`${label} ${i + 1} başlık`}
              className={inputClass}
            />
            <RowControls
              index={i}
              count={value.length}
              onMove={(from, to) => onChange(reorder(value, from, to))}
              onRemove={(idx) => onChange(value.filter((_, j) => j !== idx))}
            />
          </div>
          <textarea
            value={item.body}
            rows={4}
            onChange={(e) => update(i, { body: e.target.value })}
            placeholder="Metin"
            aria-label={`${label} ${i + 1} metin`}
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>
      ))}
      <button type="button" className={`${buttonClass.secondary} self-start`} onClick={() => onChange([...value, { title: "", body: "" }])}>
        + {addLabel}
      </button>
      {hint ? <p className="text-xs text-zinc-500">{hint}</p> : null}
    </fieldset>
  );
}
