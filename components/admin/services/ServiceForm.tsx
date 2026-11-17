"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import GalleryUploader from "@/components/admin/GalleryUploader";
import { StringListEditor } from "@/components/admin/editors";
import { ErrorBox, Field, inputClass, Loading, NotFoundNotice, PageTitle, SaveBar, Section } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { useImageLifecycle } from "@/components/admin/useImageLifecycle";
import { hasActiveUploads, UPLOAD_IN_PROGRESS_MESSAGE } from "@/lib/cloudinary";
import { mapFirestoreError } from "@/lib/db/common";
import { servicePublicIds, servicesDb, type ServiceInput } from "@/lib/db/services";
import { SLUG_PATTERN, slugifyTr } from "@/lib/utils";
import { SERVICE_ART_LABELS, SERVICE_ARTS, SERVICE_ICON_LABELS, SERVICE_ICONS, type GalleryImage } from "@/types";

const EMPTY: ServiceInput = {
  title: "",
  slug: "",
  icon: "sparkles",
  summary: "",
  question: "",
  audience: "",
  deliverables: [],
  detail: "",
  start: "",
  claim: "",
  serviceTypes: [],
  bentoSize: "small",
  bentoArt: "none",
  images: [],
  homeOrder: 99,
  order: 0,
};

export default function ServiceForm({ serviceId }: { serviceId?: string }) {
  const router = useRouter();
  const isEdit = serviceId !== undefined;
  const [form, setForm] = useState<ServiceInput>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const images = useImageLifecycle();
  const guard = useDirtyGuard(() => JSON.stringify({ ...form, order: 0 }), !isLoading);
  const set = <K extends keyof ServiceInput>(key: K, value: ServiceInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isEdit) {
      servicesDb.nextOrder().then((order) => setForm((f) => ({ ...f, order, homeOrder: order }))).catch(() => undefined);
      return;
    }
    let cancelled = false;
    servicesDb
      .get(serviceId)
      .then((s) => {
        if (cancelled) return;
        if (!s) return setNotFound(true);
        const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = s;
        void _i;
        void _c;
        void _u;
        const merged = { ...EMPTY, ...rest };
        setForm(merged);
        images.setSaved(servicePublicIds(merged));
      })
      .catch((err) => !cancelled && setError(mapFirestoreError(err)))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk yüklemede
  }, [serviceId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (hasActiveUploads()) return setError(UPLOAD_IN_PROGRESS_MESSAGE);
    setError(null);
    const input: ServiceInput = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      summary: form.summary.trim(),
      question: (form.question ?? "").trim(),
      audience: (form.audience ?? "").trim(),
      deliverables: (form.deliverables ?? []).map((t) => t.trim()).filter(Boolean),
      detail: form.detail.trim(),
      start: (form.start ?? "").trim(),
      claim: (form.claim ?? "").trim(),
      serviceTypes: (form.serviceTypes ?? []).map((t) => t.trim()).filter(Boolean),
      images: form.images.map(({ public_id, url, width, height, alt, format }) => ({ public_id, url, width, height, alt: alt ?? "", ...(format ? { format } : {}) })),
      homeOrder: Number(form.homeOrder) || 0,
    };
    if (!input.title) return setError("Başlık zorunludur.");
    if (!SLUG_PATTERN.test(input.slug)) return setError("Çapa (slug) yalnızca küçük harf, rakam ve tire içerebilir.");
    if (!input.summary) return setError("Kısa açıklama zorunludur.");
    setIsSaving(true);
    try {
      if (isEdit) await servicesDb.update(serviceId, input);
      else await servicesDb.create(input);
      await images.commit(servicePublicIds(input));
      guard.release();
      router.push("/admin/hizmetler");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;
  if (notFound) return <NotFoundNotice backHref="/admin/hizmetler" label="Hizmet listesine dön" />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl" noValidate>
      <PageTitle title={isEdit ? "Hizmeti Düzenle" : "Yeni Hizmet"} />
      <ErrorBox message={error} />
      <Section title="İçerik">
        <Field label="Başlık *" wide>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({ ...f, title, ...(slugTouched ? {} : { slug: slugifyTr(title) }) }));
            }}
            className={inputClass}
          />
        </Field>
        <Field label="Sayfa içi çapa (slug) *" hint={`Bağlantı: /hizmetler#${form.slug || "…"}`}>
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
        <Field label="İkon">
          <select value={form.icon} onChange={(e) => set("icon", e.target.value as ServiceInput["icon"])} className={inputClass}>
            {SERVICE_ICONS.map((i) => (
              <option key={i} value={i}>
                {SERVICE_ICON_LABELS[i]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Kısa açıklama *" wide hint="Ana sayfa bento kartı ve hizmet kartının sol sütunu">
          <textarea rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} className={inputClass} />
        </Field>
      </Section>
      <Section
        title="Hizmet kartı (/hizmetler)"
        description="Kartın sağ sütunu: soru başlığı ve dört bölüm. Boş bırakılan bölüm kartta görünmez. Geniş ekranda bölümler sekme olarak, telefonda alt alta gösterilir."
      >
        <Field label="Soru cümlesi" wide hint="Okurun kendi sorusu — örn. “Hazır paket mi, özel yazılım mı?”">
          <input type="text" value={form.question ?? ""} onChange={(e) => set("question", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Kime uygun" wide hint="Bir iki cümle: bu hizmet kimin, hangi durumda işine yarar.">
          <textarea rows={3} value={form.audience ?? ""} onChange={(e) => set("audience", e.target.value)} className={inputClass} />
        </Field>
        <StringListEditor
          label="Ne teslim edilir"
          value={form.deliverables ?? []}
          onChange={(v) => set("deliverables", v)}
          placeholder="Örn. App Store ve Google Play başvurusu ve yayını"
          addLabel="Madde ekle"
          hint="Kısa maddeler; 3–4 madde kartta dengeli durur."
        />
        <Field label="Süreç" wide hint="İşin nasıl yürüdüğü; 3–5 cümle.">
          <textarea rows={6} value={form.detail} onChange={(e) => set("detail", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Nasıl başlanır" wide hint="İlk adımda müşteriden ne beklendiği; bir iki cümle.">
          <textarea rows={2} value={form.start ?? ""} onChange={(e) => set("start", e.target.value)} className={inputClass} />
        </Field>
      </Section>
      <Section title="Arama ve yapay zeka görünürlüğü" description="Arama motorları ve yapay zeka asistanları bu alanları hizmetin tanımı olarak okur.">
        <Field
          label="Beyan cümlesi"
          wide
          hint="Üçüncü şahıs, marka adıyla başlayan, tek başına anlamlı 9–16 kelimelik cümle. Örn. “BAI Technology, … yapar.” Kartta görünmez; yalnızca sayfanın yapılandırılmış verisinde (Service schema) yer alır."
        >
          <textarea rows={2} value={form.claim ?? ""} onChange={(e) => set("claim", e.target.value)} className={inputClass} />
        </Field>
        <StringListEditor
          label="Kapsam (hizmet türleri)"
          value={form.serviceTypes ?? []}
          onChange={(v) => set("serviceTypes", v)}
          placeholder="Örn. Web sitesi bakımı"
          addLabel="Tür ekle"
          hint="İnsanların bu hizmeti arama biçimleri. /hizmetler kartında “Kapsam” olarak, schema'da serviceType olarak yer alır. Kısa ve doğal tutun."
        />
      </Section>
      <Section title="Ana sayfa bento" description="Büyük kutular 3 sütun, küçükler 2 sütun genişliğindedir.">
        <Field label="Kutu boyutu">
          <select value={form.bentoSize} onChange={(e) => set("bentoSize", e.target.value as ServiceInput["bentoSize"])} className={inputClass}>
            <option value="large">Büyük</option>
            <option value="small">Küçük</option>
          </select>
        </Field>
        <Field label="Bento sırası" hint="Küçük sayı önce gelir">
          <input type="number" inputMode="numeric" value={form.homeOrder} onChange={(e) => set("homeOrder", Number(e.target.value))} className={inputClass} />
        </Field>
        <Field label="Kutu görseli" wide>
          <select value={form.bentoArt} onChange={(e) => set("bentoArt", e.target.value as ServiceInput["bentoArt"])} className={inputClass}>
            {SERVICE_ARTS.map((a) => (
              <option key={a} value={a}>
                {SERVICE_ART_LABELS[a]}
              </option>
            ))}
          </select>
        </Field>
        {form.bentoArt === "phones" || form.bentoArt === "browser" ? (
          <div className="sm:col-span-2">
            <GalleryUploader
              label={form.bentoArt === "phones" ? "Telefon ekranları (ilk 2 görsel kullanılır)" : "Tarayıcı ekranı (ilk görsel kullanılır)"}
              value={form.images.map((im, i) => ({ ...im, order: i })) as GalleryImage[]}
              onChange={(imgs) => {
                images.track(imgs.map((i) => i.public_id));
                set("images", imgs);
              }}
            />
          </div>
        ) : null}
      </Section>
      <SaveBar
        saving={isSaving}
        onCancel={() => (images.hasSessionUploads() || guard.isDirty() ? setCancelOpen(true) : router.push("/admin/hizmetler"))}
      />
      <ConfirmDialog
        open={cancelOpen}
        title="Değişiklikler kaydedilmedi"
        description="Kaydetmeden çıkarsanız bu oturumda yüklenen görseller de silinecek."
        confirmLabel="Kaydetmeden çık"
        onConfirm={async () => {
          await images.discard();
          guard.release();
          router.push("/admin/hizmetler");
        }}
        onCancel={() => setCancelOpen(false)}
      />
    </form>
  );
}
