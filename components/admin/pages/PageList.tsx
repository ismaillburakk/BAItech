"use client";

import Link from "next/link";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { subscribeToPages } from "@/lib/db/pages";
import { PAGE_SCHEMAS } from "@/lib/page-schemas";
import { formatDateTimeTr } from "@/lib/utils";
import type { Page } from "@/types";

export default function PageList() {
  const { items, error } = useCollection<Page>(subscribeToPages);
  return (
    <div className="max-w-4xl">
      <PageTitle title="Sayfalar" description="Her sayfanın başlıkları, bölüm metinleri ve SEO alanları." />
      <ErrorBox message={error} />
      {items === null ? (
        <div className="mt-6">
          <Loading />
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-2">
          {PAGE_SCHEMAS.map((schema) => {
            const page = items.find((p) => p.id === schema.slug);
            return (
              <li key={schema.slug} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-zinc-900">
                    {schema.label} <span className="font-mono text-xs text-zinc-400">{schema.path}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">{schema.note}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {page ? `Son güncelleme: ${formatDateTimeTr(page.updatedAt)}` : "Henüz oluşturulmadı"}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a href={schema.path} target="_blank" rel="noopener noreferrer" className={buttonClass.secondary}>
                    Görüntüle ↗
                  </a>
                  <Link href={`/admin/sayfalar/${schema.slug}`} className={buttonClass.primary}>
                    Düzenle
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
