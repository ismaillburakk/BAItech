"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUploader from "@/components/admin/ImageUploader";
import { StringListEditor } from "@/components/admin/editors";
import { ErrorBox, Field, inputClass, Loading, NotFoundNotice, PageTitle, SaveBar, Section, Toggle } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { useImageLifecycle } from "@/components/admin/useImageLifecycle";
import { hasActiveUploads, UPLOAD_IN_PROGRESS_MESSAGE } from "@/lib/cloudinary";
import { mapFirestoreError } from "@/lib/db/common";
import { teamMembersDb, type TeamMemberInput } from "@/lib/db/teamMembers";
import { isSafeUrl } from "@/lib/utils";

const EMPTY: TeamMemberInput = { name: "", role: "", photo: null, bio: [""], linkedin: "", isActive: true, order: 0 };

export default function TeamForm({ memberId }: { memberId?: string }) {
  const router = useRouter();
  const isEdit = memberId !== undefined;
  const [form, setForm] = useState<TeamMemberInput>(EMPTY);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const images = useImageLifecycle();
  const guard = useDirtyGuard(() => JSON.stringify({ ...form, order: 0 }), !isLoading);
  const set = <K extends keyof TeamMemberInput>(key: K, value: TeamMemberInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isEdit) {
      teamMembersDb.nextOrder().then((order) => setForm((f) => ({ ...f, order }))).catch(() => undefined);
      return;
    }
    let cancelled = false;
    teamMembersDb
      .get(memberId)
      .then((m) => {
        if (cancelled) return;
        if (!m) return setNotFound(true);
        const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = m;
        void _i;
        void _c;
        void _u;
        setForm({ ...EMPTY, ...rest, bio: rest.bio?.length ? rest.bio : [""] });
        images.setSaved(rest.photo ? [rest.photo.public_id] : []);
      })
      .catch((err) => !cancelled && setError(mapFirestoreError(err)))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk yüklemede
  }, [memberId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (hasActiveUploads()) return setError(UPLOAD_IN_PROGRESS_MESSAGE);
    setError(null);
    const input: TeamMemberInput = {
      ...form,
      name: form.name.trim(),
      role: form.role.trim(),
      linkedin: form.linkedin.trim(),
      bio: form.bio.map((b) => b.trim()).filter(Boolean),
    };
    if (!input.name || !input.role) return setError("Ad ve unvan zorunludur.");
    if (input.linkedin && !isSafeUrl(input.linkedin)) return setError("LinkedIn adresi https:// ile başlamalı.");
    setIsSaving(true);
    try {
      if (isEdit) await teamMembersDb.update(memberId, input);
      else await teamMembersDb.create(input);
      await images.commit(input.photo ? [input.photo.public_id] : []);
      guard.release();
      router.push("/admin/ekip");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;
  if (notFound) return <NotFoundNotice backHref="/admin/ekip" label="Ekip listesine dön" />;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl" noValidate>
      <PageTitle title={isEdit ? "Üyeyi Düzenle" : "Yeni Ekip Üyesi"} />
      <ErrorBox message={error} />
      <Section title="Kişi">
        <Field label="Ad Soyad *">
          <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Unvan *">
          <input type="text" value={form.role} onChange={(e) => set("role", e.target.value)} className={inputClass} />
        </Field>
        <Field label="LinkedIn (opsiyonel)" wide>
          <input type="url" inputMode="url" value={form.linkedin} onChange={(e) => set("linkedin", e.target.value)} className={inputClass} />
        </Field>
        <StringListEditor label="Kısa biyografi" value={form.bio} onChange={(v) => set("bio", v)} multiline addLabel="Paragraf ekle" />
        <Toggle label="Sitede göster" checked={form.isActive} onChange={(v) => set("isActive", v)} />
      </Section>
      <Section title="Fotoğraf">
        <div className="sm:col-span-2">
          <ImageUploader
            label="Portre (4:5 önerilir)"
            value={form.photo}
            onChange={(img) => {
              if (img) images.track([img.public_id]);
              set("photo", img);
            }}
          />
        </div>
      </Section>
      <SaveBar
        saving={isSaving}
        onCancel={() => (images.hasSessionUploads() || guard.isDirty() ? setCancelOpen(true) : router.push("/admin/ekip"))}
      />
      <ConfirmDialog
        open={cancelOpen}
        title="Değişiklikler kaydedilmedi"
        description="Kaydetmeden çıkarsanız bu oturumda yüklenen fotoğraf da silinecek."
        confirmLabel="Kaydetmeden çık"
        onConfirm={async () => {
          await images.discard();
          guard.release();
          router.push("/admin/ekip");
        }}
        onCancel={() => setCancelOpen(false)}
      />
    </form>
  );
}
