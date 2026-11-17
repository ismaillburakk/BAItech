"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import GalleryUploader from "@/components/admin/GalleryUploader";
import ImageUploader from "@/components/admin/ImageUploader";
import { CardsEditor, LabelValueEditor, StringListEditor } from "@/components/admin/editors";
import {
  buttonClass,
  CharCount,
  ErrorBox,
  Field,
  inputClass,
  Loading,
  NotFoundNotice,
  PageTitle,
  SaveBar,
  Section,
  Toggle,
} from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { useImageLifecycle } from "@/components/admin/useImageLifecycle";
import { hasActiveUploads, UPLOAD_IN_PROGRESS_MESSAGE } from "@/lib/cloudinary";
import { mapFirestoreError } from "@/lib/db/common";
import { isProjectSlugTaken, projectPublicIds, projectsDb, type ProjectInput } from "@/lib/db/projects";
import { servicesDb } from "@/lib/db/services";
import { isSafeUrl, reorder, SLUG_PATTERN, slugifyTr } from "@/lib/utils";
import {
  PLATFORM_LABELS,
  PLATFORMS,
  PROJECT_STATUS_LABELS,
  PROJECT_STATUSES,
  type GalleryTab,
  type Platform,
  type Project,
} from "@/types";

const EMPTY: ProjectInput = {
  slug: "",
  title: "",
  subtitle: "",
  category: "",
  status: "live",
  description: [""],
  sections: [],
  highlightsTitle: "",
  highlights: [],
  note: "",
  meta: [],
  tech: [],
  services: [],
  platforms: [],
  isAI: false,
  links: { appStore: "", playStore: "", web: "" },
  coverImage: null,
  gallery: [],
  metrics: [],
  seo: { title: "", description: "" },
  isFeatured: true,
  isPublished: true,
  order: 0,
};

function newTab(label = "Ekranlar"): GalleryTab {
  return { id: crypto.randomUUID().slice(0, 12), label, device: "mobile", images: [] };
}

export default function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const isEdit = projectId !== undefined;
  const [form, setForm] = useState<ProjectInput>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const images = useImageLifecycle();
  const guard = useDirtyGuard(() => JSON.stringify({ ...form, order: 0 }), !isLoading);
  const [serviceOptions, setServiceOptions] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    servicesDb
      .list()
      .then((list) => setServiceOptions(list.map((s) => ({ slug: s.slug, title: s.title }))))
      .catch(() => undefined);
  }, []);

  const set = <K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isEdit) {
      projectsDb.nextOrder().then((order) => setForm((f) => ({ ...f, order }))).catch(() => undefined);
      return;
    }
    let cancelled = false;
    projectsDb
      .get(projectId)
      .then((p: Project | null) => {
        if (cancelled) return;
        if (!p) return setNotFound(true);
        const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = p;
        void _id;
        void _c;
        void _u;
        const merged: ProjectInput = {
          ...EMPTY,
          ...rest,
          links: { ...EMPTY.links, ...rest.links },
          seo: { ...EMPTY.seo, ...rest.seo },
          description: rest.description?.length ? rest.description : [""],
          gallery: (rest.gallery ?? []).map((t) => ({ ...t, images: [...t.images].sort((a, b) => a.order - b.order) })),
        };
        setForm(merged);
        images.setSaved(projectPublicIds(merged));
      })
      .catch((err) => !cancelled && setError(mapFirestoreError(err)))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk yüklemede
  }, [projectId]);

  function updateGallery(next: GalleryTab[]) {
    images.track(next.flatMap((t) => t.images.map((i) => i.public_id)));
    set("gallery", next);
  }

  /** Sekmeyi kimliğiyle günceller (fonksiyonel state — eşzamanlı yükleme güvenli) */
  function updateTab(id: string, patch: Partial<GalleryTab>) {
    if (patch.images) images.track(patch.images.map((i) => i.public_id));
    setForm((f) => ({ ...f, gallery: f.gallery.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }

  function buildInput(): ProjectInput {
    const trim = (v: string) => v.trim();
    return {
      ...form,
      slug: form.slug.trim(),
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      category: form.category.trim(),
      description: form.description.map(trim).filter(Boolean),
      sections: (form.sections ?? []).map((s) => ({ title: s.title.trim(), body: s.body.trim() })).filter((s) => s.title && s.body),
      highlightsTitle: form.highlightsTitle.trim(),
      highlights: form.highlights.map(trim).filter(Boolean),
      note: form.note.trim(),
      meta: form.meta.filter((m) => m.label.trim() && m.value.trim()),
      tech: form.tech.map(trim).filter(Boolean),
      services: [...new Set(form.services ?? [])],
      metrics: form.metrics.filter((m) => m.label.trim() && m.value.trim()),
      links: { appStore: form.links.appStore.trim(), playStore: form.links.playStore.trim(), web: form.links.web.trim() },
      seo: { title: form.seo.title.trim(), description: form.seo.description.trim() },
      gallery: form.gallery
        .map((t) => ({ ...t, label: t.label.trim() || "Ekranlar", images: t.images.map((im, i) => ({ ...im, order: i })) }))
        .filter((t) => t.images.length > 0),
    };
  }

  async function validate(input: ProjectInput): Promise<string | null> {
    if (!input.title) return "Proje başlığı zorunludur.";
    if (!SLUG_PATTERN.test(input.slug)) return "Slug yalnızca küçük harf, rakam ve tire içerebilir (örn. gymbot).";
    if (!input.subtitle) return "Alt başlık zorunludur (kartlarda ve detayda görünür).";
    for (const [key, url] of Object.entries(input.links)) {
      if (url && !isSafeUrl(url)) return `${key} bağlantısı geçerli bir http(s) adresi olmalı.`;
    }
    if (await isProjectSlugTaken(input.slug, projectId)) return `"${input.slug}" slug'ı başka bir projede kullanılıyor.`;
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (hasActiveUploads()) return setError(UPLOAD_IN_PROGRESS_MESSAGE);
    setError(null);
    setIsSaving(true);
    try {
      const input = buildInput();
      const message = await validate(input);
      if (message) return setError(message);
      if (isEdit) await projectsDb.update(projectId, input);
      else await projectsDb.create(input);
      await images.commit(projectPublicIds(input));
      guard.release();
      router.push("/admin/projeler");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  async function cancelConfirmed() {
    await images.discard();
    guard.release();
    router.push("/admin/projeler");
  }

  if (isLoading) return <Loading label="Proje yükleniyor…" />;
  if (notFound) return <NotFoundNotice backHref="/admin/projeler" label="Proje listesine dön" />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl" noValidate>
      <PageTitle title={isEdit ? "Projeyi Düzenle" : "Yeni Proje"} />
      <ErrorBox message={error} />

      <Section title="Temel Bilgiler">
        <Field label="Başlık *" wide>
          <input
            type="text"
            value={form.title}
            required
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, ...(slugTouched ? {} : { slug: slugifyTr(title) }) }));
            }}
            placeholder="GymBot"
            className={inputClass}
          />
        </Field>
        <Field label="Slug (URL) *" hint={`Adres: /projeler/${form.slug || "…"}`}>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            className={`${inputClass} font-mono`}
          />
        </Field>
        <Field label="Kategori" hint="Kart ve detayda görünen etiket — örn. Spor & Sağlık">
          <input type="text" value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Alt başlık *" wide>
          <input type="text" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Durum">
          <select value={form.status} onChange={(e) => set("status", e.target.value as ProjectInput["status"])} className={inputClass}>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm font-medium text-zinc-700">Platformlar (filtre + schema)</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p: Platform) => (
              <label key={p} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm">
                <input
                  type="checkbox"
                  className="size-5 accent-orange-500"
                  checked={form.platforms.includes(p)}
                  onChange={(e) =>
                    set("platforms", e.target.checked ? [...form.platforms, p] : form.platforms.filter((x) => x !== p))
                  }
                />
                {PLATFORM_LABELS[p]}
              </label>
            ))}
          </div>
        </fieldset>
        <Toggle label="Yapay zeka projesi" hint="“Yapay Zeka” filtresinde görünür" checked={form.isAI} onChange={(v) => set("isAI", v)} />
        <Toggle label="Ana sayfada göster" hint="Ana sayfa yatay proje şeridi" checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
        <Toggle label="Yayında" hint="Kapalıysa sitede görünmez (taslak)" checked={form.isPublished} onChange={(v) => set("isPublished", v)} />
      </Section>

      <Section title="Açıklama">
        <StringListEditor
          label="Paragraflar"
          value={form.description}
          onChange={(v) => set("description", v)}
          multiline
          addLabel="Paragraf ekle"
          hint="Ara başlıksız giriş metni. Vaka bölümleri kullanılıyorsa boş bırakılabilir."
        />
        <CardsEditor
          label="Vaka bölümleri"
          value={form.sections ?? []}
          onChange={(v) => set("sections", v)}
          addLabel="Bölüm ekle"
          titlePlaceholder="Ara başlık — örn. İhtiyaç, Ne yapıldı, Bugün"
          hint="Sitede görünür ara başlıklarla, paragrafların altında sıralanır. Yalnızca doğrulanmış bilgi yazın; başlığı ya da metni boş olan bölüm gösterilmez. Metinde boş satır yeni paragraf açar."
        />
        <Field label="Öne çıkanlar başlığı" wide hint="Boşsa “Öne çıkanlar” yazılır">
          <input type="text" value={form.highlightsTitle} onChange={(e) => set("highlightsTitle", e.target.value)} className={inputClass} />
        </Field>
        <StringListEditor label="Öne çıkan maddeler" value={form.highlights} onChange={(v) => set("highlights", v)} addLabel="Madde ekle" />
        <Field label="Bilgi notu" wide hint="Metnin altındaki bilgi kutusu — örn. Geliştirme aşamasında; klinik kullanımda değil.">
          <input type="text" value={form.note} onChange={(e) => set("note", e.target.value)} className={inputClass} />
        </Field>
      </Section>

      <Section title="Künye, teknoloji ve metrikler">
        <LabelValueEditor label="Künye satırları" value={form.meta} onChange={(v) => set("meta", v)} labelPlaceholder="Sektör" valuePlaceholder="Tenis · Spor" />
        <StringListEditor label="Teknoloji etiketleri" value={form.tech} onChange={(v) => set("tech", v)} placeholder="React Native" addLabel="Teknoloji ekle" />
        <fieldset className="flex flex-col gap-2 sm:col-span-2">
          <legend className="mb-1.5 text-sm font-medium text-zinc-700">İlgili hizmetler</legend>
          <p className="text-xs text-zinc-500">
            Proje sayfasında “İlgili hizmetler” bağlantısı, /hizmetler kartında “İlgili projeler” olarak görünür. Yalnızca bu projede gerçekten
            verilen hizmetleri işaretleyin.
          </p>
          {serviceOptions.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {serviceOptions.map((s) => (
                <Toggle
                  key={s.slug}
                  label={s.title}
                  checked={(form.services ?? []).includes(s.slug)}
                  onChange={(v) =>
                    set("services", v ? [...(form.services ?? []), s.slug] : (form.services ?? []).filter((x) => x !== s.slug))
                  }
                />
              ))}
            </div>
          ) : (
            <Loading label="Hizmetler yükleniyor…" />
          )}
        </fieldset>
        <LabelValueEditor
          label="Metrikler (opsiyonel)"
          value={form.metrics}
          onChange={(v) => set("metrics", v)}
          labelPlaceholder="Açıklama"
          valuePlaceholder="Değer"
          hint="Yalnızca doğrulanmış sayılar girin; boşsa bölüm gösterilmez."
        />
      </Section>

      <Section title="Bağlantılar" description="Boş bırakılan butonlar sitede gösterilmez.">
        <Field label="App Store">
          <input type="url" inputMode="url" value={form.links.appStore} onChange={(e) => set("links", { ...form.links, appStore: e.target.value })} className={inputClass} placeholder="https://apps.apple.com/…" />
        </Field>
        <Field label="Google Play">
          <input type="url" inputMode="url" value={form.links.playStore} onChange={(e) => set("links", { ...form.links, playStore: e.target.value })} className={inputClass} placeholder="https://play.google.com/…" />
        </Field>
        <Field label="Web sitesi" wide>
          <input type="url" inputMode="url" value={form.links.web} onChange={(e) => set("links", { ...form.links, web: e.target.value })} className={inputClass} placeholder="https://…" />
        </Field>
      </Section>

      <Section title="Görseller" description="Kapak; paylaşım (OG) görseli ve schema için kullanılır — boşsa galerinin ilk görseli.">
        <div className="sm:col-span-2">
          <ImageUploader
            label="Kapak görseli"
            value={form.coverImage}
            onChange={(img) => {
              if (img) images.track([img.public_id]);
              set("coverImage", img);
            }}
            hint="Önerilen oran 1200×630 (yatay)."
          />
        </div>
        <div className="flex flex-col gap-4 sm:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-medium text-zinc-700">Galeri sekmeleri</span>
            <button type="button" className={buttonClass.secondary} onClick={() => setForm((f) => ({ ...f, gallery: [...f.gallery, newTab(`Sekme ${f.gallery.length + 1}`)] }))}>
              + Sekme ekle
            </button>
          </div>
          {form.gallery.length === 0 ? (
            <p className="text-xs text-zinc-500">Galeri boş. Tek sekme varsa sitede sekme başlığı gösterilmez.</p>
          ) : null}
          {form.gallery.map((tab, i) => (
            <div key={tab.id} className="flex flex-col gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_200px_auto]">
                <Field label="Sekme adı">
                  <input type="text" value={tab.label} onChange={(e) => updateTab(tab.id, { label: e.target.value })} className={inputClass} />
                </Field>
                <Field label="Çerçeve">
                  <select value={tab.device} onChange={(e) => updateTab(tab.id, { device: e.target.value as GalleryTab["device"] })} className={inputClass}>
                    <option value="mobile">Telefon (mobil ekran)</option>
                    <option value="web">Tarayıcı (web ekran)</option>
                  </select>
                </Field>
                <div className="flex items-end gap-1">
                  <button type="button" className={buttonClass.small} aria-label="Sekmeyi yukarı taşı" disabled={i === 0} onClick={() => updateGallery(reorder(form.gallery, i, i - 1))}>
                    ↑
                  </button>
                  <button type="button" className={buttonClass.small} aria-label="Sekmeyi aşağı taşı" disabled={i === form.gallery.length - 1} onClick={() => updateGallery(reorder(form.gallery, i, i + 1))}>
                    ↓
                  </button>
                  <button type="button" className={`${buttonClass.small} text-red-600`} onClick={() => updateGallery(form.gallery.filter((_, j) => j !== i))}>
                    Sekmeyi sil
                  </button>
                </div>
              </div>
              <GalleryUploader label={`${tab.label || "Sekme"} görselleri`} value={tab.images} onChange={(imgs) => updateTab(tab.id, { images: imgs })} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="SEO" description="Boş bırakılırsa başlık ve alt başlıktan otomatik üretilir.">
        <Field label="Sayfa başlığı (title)" wide hint={<CharCount value={form.seo.title} min={50} max={60} />}>
          <input type="text" value={form.seo.title} onChange={(e) => set("seo", { ...form.seo, title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Açıklama (meta description)" wide hint={<CharCount value={form.seo.description} min={140} max={160} />}>
          <textarea rows={3} value={form.seo.description} onChange={(e) => set("seo", { ...form.seo, description: e.target.value })} className={inputClass} />
        </Field>
      </Section>

      <SaveBar
        saving={isSaving}
        onCancel={() => (images.hasSessionUploads() || guard.isDirty() ? setCancelOpen(true) : router.push("/admin/projeler"))}
      />

      <ConfirmDialog
        open={cancelOpen}
        title="Değişiklikler kaydedilmedi"
        description="Kaydetmeden çıkarsanız bu oturumda yüklenen görseller de silinecek. Devam edilsin mi?"
        confirmLabel="Kaydetmeden çık"
        onConfirm={cancelConfirmed}
        onCancel={() => setCancelOpen(false)}
      />
    </form>
  );
}
