"use client";

/* eslint-disable @next/next/no-img-element -- canlı önizleme */
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";
import { ErrorBox, Field, inputClass, Loading, NotFoundNotice, PageTitle, SaveBar, Section, Toggle } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { useImageLifecycle } from "@/components/admin/useImageLifecycle";
import { cldUrl, hasActiveUploads, UPLOAD_IN_PROGRESS_MESSAGE } from "@/lib/cloudinary";
import { mapFirestoreError } from "@/lib/db/common";
import { referencesDb, type ReferenceInput } from "@/lib/db/references";
import { isSafeUrl } from "@/lib/utils";

const EMPTY: ReferenceInput = { name: "", logo: null, logoMode: "original", url: "", description: "", isActive: true, order: 0 };

export default function ReferenceForm({ referenceId }: { referenceId?: string }) {
  const router = useRouter();
  const isEdit = referenceId !== undefined;
  const [form, setForm] = useState<ReferenceInput>(EMPTY);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const images = useImageLifecycle();
  const guard = useDirtyGuard(() => JSON.stringify({ ...form, order: 0 }), !isLoading);
  const set = <K extends keyof ReferenceInput>(key: K, value: ReferenceInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isEdit) {
      referencesDb.nextOrder().then((order) => setForm((f) => ({ ...f, order }))).catch(() => undefined);
      return;
    }
    let cancelled = false;
    referencesDb
      .get(referenceId)
      .then((r) => {
        if (cancelled) return;
        if (!r) return setNotFound(true);
        const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = r;
        void _i;
        void _c;
        void _u;
        setForm({ ...EMPTY, ...rest });
        images.setSaved(rest.logo ? [rest.logo.public_id] : []);
      })
      .catch((err) => !cancelled && setError(mapFirestoreError(err)))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk yüklemede
  }, [referenceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (hasActiveUploads()) return setError(UPLOAD_IN_PROGRESS_MESSAGE);
    setError(null);
    // Açıklama alanı panelden kaldırıldı: sitede "bu firmaya şunu yaptık" anlatımı gösterilmez; kayıtta hep boş tutulur
    const input: ReferenceInput = { ...form, name: form.name.trim(), url: form.url.trim(), description: "" };
    if (!input.name) return setError("Firma adı zorunludur.");
    // Alt metin her zaman firma adıdır (logonun erişilebilir adı)
    if (input.logo) input.logo = { ...input.logo, alt: input.name };
    if (input.url && !isSafeUrl(input.url)) return setError("Web sitesi https:// ile başlayan geçerli bir adres olmalı.");
    setIsSaving(true);
    try {
      if (isEdit) await referencesDb.update(referenceId, input);
      else await referencesDb.create(input);
      await images.commit(input.logo ? [input.logo.public_id] : []);
      guard.release();
      router.push("/admin/referanslar");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;
  if (notFound) return <NotFoundNotice backHref="/admin/referanslar" label="Referans listesine dön" />;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl" noValidate>
      <PageTitle title={isEdit ? "Referansı Düzenle" : "Yeni Referans"} />
      <ErrorBox message={error} />
      <Section title="Firma">
        <Field label="Firma adı *" wide>
          <input type="text" name="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Web sitesi (opsiyonel)" wide hint="Doluysa kart tıklanabilir olur (yeni sekmede açılır).">
          <input type="url" name="url" inputMode="url" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://" className={inputClass} />
        </Field>
        <Toggle label="Sitede göster" checked={form.isActive} onChange={(v) => set("isActive", v)} />
      </Section>
      <Section title="Logo" description="Şeffaf zeminli SVG veya PNG önerilir. Logo yoksa sitede firma adı yazı olarak gösterilir.">
        <div className="sm:col-span-2">
          <ImageUploader
            label="Logo"
            contain
            value={form.logo}
            onChange={(img) => {
              if (img) images.track([img.public_id]);
              set("logo", img ? { ...img, alt: form.name.trim() } : null);
            }}
          />
        </div>
        <Field label="Görünüm">
          <select value={form.logoMode} onChange={(e) => set("logoMode", e.target.value as ReferenceInput["logoMode"])} className={inputClass}>
            <option value="original">Orijinal renkler (varsayılan)</option>
            <option value="mono">Tek renk (beyaz)</option>
          </select>
        </Field>
        <p className="self-end text-xs text-zinc-500 sm:pb-3">
          Orijinal renkli logolar sitede açık bir zemin üzerinde gösterilir. Beyaz veya çok açık renkli bir logo bu zeminde
          kaybolursa “Tek renk (beyaz)” seçin.
        </p>
        {form.logo ? (
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700">Sitedeki önizleme</span>
            <div className="flex h-28 items-center justify-center rounded-xl border border-[#1a2c4e] bg-[#0a1730] p-4">
              {form.logoMode === "mono" ? (
                <img src={cldUrl(form.logo.public_id, "f_auto,q_auto,h_96")} alt="" className="max-h-16 max-w-[150px] object-contain [filter:brightness(0)_invert(1)]" />
              ) : (
                <span className="flex h-20 w-full max-w-[182px] items-center justify-center rounded-lg bg-[#eef2f8] px-4 py-2">
                  <img src={cldUrl(form.logo.public_id, "f_auto,q_auto,h_128")} alt="" className="max-h-16 max-w-[150px] object-contain" />
                </span>
              )}
            </div>
          </div>
        ) : null}
      </Section>
      <SaveBar
        saving={isSaving}
        onCancel={() => (images.hasSessionUploads() || guard.isDirty() ? setCancelOpen(true) : router.push("/admin/referanslar"))}
      />
      <ConfirmDialog
        open={cancelOpen}
        title="Değişiklikler kaydedilmedi"
        description="Kaydetmeden çıkarsanız bu oturumda yüklenen logo da silinecek."
        confirmLabel="Kaydetmeden çık"
        onConfirm={async () => {
          await images.discard();
          guard.release();
          router.push("/admin/referanslar");
        }}
        onCancel={() => setCancelOpen(false)}
      />
    </form>
  );
}
