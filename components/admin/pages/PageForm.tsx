"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CardsEditor, StringListEditor } from "@/components/admin/editors";
import { CharCount, ErrorBox, Field, inputClass, Loading, NotFoundNotice, PageTitle, SaveBar, Section, SuccessBox } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { mapFirestoreError } from "@/lib/db/common";
import { getPage, savePage } from "@/lib/db/pages";
import { getPageSchema, type PageFieldDef } from "@/lib/page-schemas";
import type { CardItem, PageFieldValue, PageSlug, SeoFields } from "@/types";

function emptyValue(def: PageFieldDef): PageFieldValue {
  return def.type === "list" || def.type === "cards" ? [] : "";
}

export default function PageForm({ slug }: { slug: string }) {
  const router = useRouter();
  const schema = getPageSchema(slug);
  const [fields, setFields] = useState<Record<string, PageFieldValue>>({});
  const [seo, setSeo] = useState<SeoFields>({ title: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const guard = useDirtyGuard(() => JSON.stringify({ fields, seo }), !isLoading);

  useEffect(() => {
    if (!schema) return;
    getPage(schema.slug)
      .then((page) => {
        const initial: Record<string, PageFieldValue> = {};
        for (const group of schema.groups) for (const def of group.fields) initial[def.key] = page?.fields?.[def.key] ?? emptyValue(def);
        setFields(initial);
        setSeo({ title: page?.seo?.title ?? "", description: page?.seo?.description ?? "" });
      })
      .catch((err) => setError(mapFirestoreError(err)))
      .finally(() => setIsLoading(false));
  }, [schema]);

  if (!schema) return <NotFoundNotice backHref="/admin/sayfalar" label="Sayfa listesine dön" />;
  if (isLoading) return <Loading />;

  const setField = (key: string, value: PageFieldValue) => setFields((f) => ({ ...f, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || !schema) return;
    setError(null);
    setSaved(null);
    setIsSaving(true);
    try {
      const clean: Record<string, PageFieldValue> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (typeof value === "string") clean[key] = value.trim();
        else if (value.length && typeof value[0] === "object")
          clean[key] = (value as CardItem[]).map((c) => ({ title: c.title.trim(), body: c.body.trim() })).filter((c) => c.title || c.body);
        else clean[key] = (value as string[]).map((v) => v.trim()).filter(Boolean);
      }
      await savePage(schema.slug as PageSlug, {
        slug: schema.slug,
        fields: clean,
        seo: { title: seo.title.trim(), description: seo.description.trim() },
      });
      setFields(clean);
      guard.reset();
      setSaved("Sayfa kaydedildi — site birkaç saniye içinde güncellenir.");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  function renderField(def: PageFieldDef) {
    const value = fields[def.key];
    switch (def.type) {
      case "text":
        return (
          <Field key={def.key} label={def.label} hint={def.help} wide>
            <input type="text" value={(value as string) ?? ""} onChange={(e) => setField(def.key, e.target.value)} className={inputClass} />
          </Field>
        );
      case "textarea":
        return (
          <Field key={def.key} label={def.label} hint={def.help} wide>
            <textarea rows={4} value={(value as string) ?? ""} onChange={(e) => setField(def.key, e.target.value)} className={`${inputClass} leading-relaxed`} />
          </Field>
        );
      case "markdown":
        return (
          <Field key={def.key} label={def.label} hint={def.help} wide>
            <textarea rows={24} value={(value as string) ?? ""} onChange={(e) => setField(def.key, e.target.value)} className={`${inputClass} font-mono text-sm leading-relaxed`} />
          </Field>
        );
      case "list":
        return <StringListEditor key={def.key} label={def.label} value={(value as string[]) ?? []} onChange={(v) => setField(def.key, v)} hint={def.help} />;
      case "cards":
        return <CardsEditor key={def.key} label={def.label} value={(value as CardItem[]) ?? []} onChange={(v) => setField(def.key, v)} hint={def.help} />;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl" noValidate>
      <PageTitle
        title={`Sayfa: ${schema.label}`}
        description={schema.note}
        action={
          <a href={schema.path} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-zinc-700 underline">
            Sitede görüntüle ↗
          </a>
        }
      />
      <ErrorBox message={error} />
      <SuccessBox message={saved} />
      {schema.groups.map((group) => (
        <Section key={group.title} title={group.title}>
          {group.fields.map(renderField)}
        </Section>
      ))}
      <Section title="SEO" description="Bu sayfanın arama sonucu başlığı ve açıklaması.">
        <Field label="Başlık (title)" wide hint={<CharCount value={seo.title} min={50} max={60} />}>
          <input type="text" value={seo.title} onChange={(e) => setSeo({ ...seo, title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Açıklama (meta description)" wide hint={<CharCount value={seo.description} min={140} max={160} />}>
          <textarea rows={3} value={seo.description} onChange={(e) => setSeo({ ...seo, description: e.target.value })} className={inputClass} />
        </Field>
      </Section>
      <SaveBar saving={isSaving} onCancel={() => router.push("/admin/sayfalar")} />
    </form>
  );
}
