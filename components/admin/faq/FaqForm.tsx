"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ErrorBox, Field, inputClass, Loading, NotFoundNotice, PageTitle, SaveBar, Section, Toggle } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { mapFirestoreError } from "@/lib/db/common";
import { faqDb, type FaqInput } from "@/lib/db/faq";

const EMPTY: FaqInput = { question: "", answer: "", isActive: true, order: 0 };

export default function FaqForm({ faqId }: { faqId?: string }) {
  const router = useRouter();
  const isEdit = faqId !== undefined;
  const [form, setForm] = useState<FaqInput>(EMPTY);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [notFound, setNotFound] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const guard = useDirtyGuard(() => JSON.stringify({ ...form, order: 0 }), !isLoading);
  const words = form.answer.split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (!isEdit) {
      faqDb.nextOrder().then((order) => setForm((f) => ({ ...f, order }))).catch(() => undefined);
      return;
    }
    let cancelled = false;
    faqDb
      .get(faqId)
      .then((f) => {
        if (cancelled) return;
        if (!f) return setNotFound(true);
        setForm({ question: f.question, answer: f.answer, isActive: f.isActive !== false, order: f.order });
      })
      .catch((err) => !cancelled && setError(mapFirestoreError(err)))
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [faqId, isEdit]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    const input = { ...form, question: form.question.trim(), answer: form.answer.trim() };
    if (!input.question || !input.answer) return setError("Soru ve cevap zorunludur.");
    setIsSaving(true);
    setError(null);
    try {
      if (isEdit) await faqDb.update(faqId, input);
      else await faqDb.create(input);
      guard.release();
      router.push("/admin/sss");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;
  if (notFound) return <NotFoundNotice backHref="/admin/sss" label="SSS listesine dön" />;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl" noValidate>
      <PageTitle title={isEdit ? "Soruyu Düzenle" : "Yeni Soru"} />
      <ErrorBox message={error} />
      <Section title="Soru ve cevap">
        <Field label="Soru *" wide>
          <input type="text" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className={inputClass} />
        </Field>
        <Field
          label="Cevap *"
          wide
          hint={<span className={words >= 40 && words <= 60 ? "text-emerald-600" : "text-amber-600"}>{words} kelime · önerilen 40–60</span>}
        >
          <textarea rows={6} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className={inputClass} />
        </Field>
        <Toggle label="Sitede göster" checked={form.isActive} onChange={(v) => setForm({ ...form, isActive: v })} />
      </Section>
      <SaveBar saving={isSaving} onCancel={() => router.push("/admin/sss")} />
    </form>
  );
}
