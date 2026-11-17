"use client";

import { useEffect, useState, type FormEvent } from "react";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { LabelValueEditor } from "@/components/admin/editors";
import { ErrorBox, Field, inputClass, Loading, PageTitle, SaveBar, Section, SuccessBox } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { useImageLifecycle } from "@/components/admin/useImageLifecycle";
import { hasActiveUploads, UPLOAD_IN_PROGRESS_MESSAGE } from "@/lib/cloudinary";
import { mapFirestoreError } from "@/lib/db/common";
import { getHero, saveHero, type HeroInput } from "@/lib/db/singletons";
import type { GalleryImage } from "@/types";

const EMPTY: HeroInput = {
  badge: "",
  badgeNote: "",
  title: "",
  lead: "",
  primaryCta: { label: "", href: "/iletisim" },
  secondaryCta: { label: "", href: "/hizmetler" },
  meta: [],
  phones: [],
};

export default function HeroForm() {
  const [form, setForm] = useState<HeroInput>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const images = useImageLifecycle();
  const guard = useDirtyGuard(() => JSON.stringify(form), !isLoading);
  const set = <K extends keyof HeroInput>(key: K, value: HeroInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    getHero()
      .then((h) => {
        if (h) {
          const { id: _i, updatedAt: _u, ...rest } = h;
          void _i;
          void _u;
          setForm({ ...EMPTY, ...rest });
          images.setSaved(rest.phones.map((p) => p.public_id));
        }
      })
      .catch((err) => setError(mapFirestoreError(err)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk yüklemede
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (hasActiveUploads()) return setError(UPLOAD_IN_PROGRESS_MESSAGE);
    setError(null);
    setSaved(null);
    if (!form.title.trim()) return setError("Başlık zorunludur (sayfanın H1'i).");
    if (form.phones.length !== 0 && form.phones.length !== 3) return setError("Telefon yelpazesi için tam 3 ekran görüntüsü gerekir (ya da hiç).");
    setIsSaving(true);
    try {
      const input: HeroInput = {
        ...form,
        title: form.title.trim(),
        lead: form.lead.trim(),
        meta: form.meta.filter((m) => m.label.trim() && m.value.trim()),
        phones: form.phones.map(({ public_id, url, width, height, alt, format }) => ({ public_id, url, width, height, alt: alt ?? "", ...(format ? { format } : {}) })),
      };
      await saveHero(input);
      await images.commit(input.phones.map((p) => p.public_id));
      guard.reset();
      setSaved("Hero kaydedildi — ana sayfa birkaç saniye içinde güncellenir.");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl" noValidate>
      <PageTitle title="Hero" description="Ana sayfanın giriş bölümü: başlık, açıklama, butonlar ve telefon yelpazesi." />
      <ErrorBox message={error} />
      <SuccessBox message={saved} />
      <Section title="Metinler">
        <Field label="Durum rozeti">
          <input type="text" value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="Aktif / Yayında" className={inputClass} />
        </Field>
        <Field label="Rozet notu">
          <input type="text" value={form.badgeNote} onChange={(e) => set("badgeNote", e.target.value)} placeholder="Baseline · Bukira · GymBot" className={inputClass} />
        </Field>
        <Field label="Başlık (H1) *" wide hint="Vurgulanacak kelimeyi *yıldız* içine alın — sitede turuncu degrade görünür.">
          <input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Açıklama" wide>
          <textarea rows={3} value={form.lead} onChange={(e) => set("lead", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Birincil buton etiketi">
          <input type="text" value={form.primaryCta.label} onChange={(e) => set("primaryCta", { ...form.primaryCta, label: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Birincil buton bağlantısı">
          <input type="text" value={form.primaryCta.href} onChange={(e) => set("primaryCta", { ...form.primaryCta, href: e.target.value })} className={`${inputClass} font-mono`} />
        </Field>
        <Field label="İkincil buton etiketi">
          <input type="text" value={form.secondaryCta.label} onChange={(e) => set("secondaryCta", { ...form.secondaryCta, label: e.target.value })} className={inputClass} />
        </Field>
        <Field label="İkincil buton bağlantısı">
          <input type="text" value={form.secondaryCta.href} onChange={(e) => set("secondaryCta", { ...form.secondaryCta, href: e.target.value })} className={`${inputClass} font-mono`} />
        </Field>
        <LabelValueEditor label="Alt bilgi satırı" value={form.meta} onChange={(v) => set("meta", v)} labelPlaceholder="Konum" valuePlaceholder="Türkiye" />
      </Section>
      <Section title="Telefon yelpazesi" description="Tam 3 dikey ekran görüntüsü: 1 = sol, 2 = orta (önde), 3 = sağ. Kaydırdıkça yelpaze açılır.">
        <div className="sm:col-span-2">
          <GalleryUploader
            label="Ekranlar"
            value={form.phones.map((p, i) => ({ ...p, order: i })) as GalleryImage[]}
            onChange={(imgs) => {
              images.track(imgs.map((i) => i.public_id));
              set("phones", imgs);
            }}
          />
        </div>
      </Section>
      <SaveBar saving={isSaving} />
    </form>
  );
}
