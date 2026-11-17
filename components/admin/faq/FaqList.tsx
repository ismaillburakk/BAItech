"use client";

import Link from "next/link";
import SortableList from "@/components/admin/SortableList";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { faqDb } from "@/lib/db/faq";
import type { FaqItem } from "@/types";

export default function FaqList() {
  const { items, error } = useCollection<FaqItem>(faqDb.subscribe);
  return (
    <div className="max-w-4xl">
      <PageTitle
        title="SSS"
        description="/hizmetler sayfasındaki sorular ve FAQPage şeması. Cevaplar 40–60 kelime, “BAI Technology …” diye başlayan, tek başına anlamlı cümlelerle yazılmalı (yapay zeka motorları bunları alıntılar)."
        action={
          <Link href="/admin/sss/yeni" className={buttonClass.primary}>
            + Yeni Soru
          </Link>
        }
      />
      <ErrorBox message={error} />
      {items === null ? (
        <div className="mt-6">
          <Loading />
        </div>
      ) : (
        <SortableList
          items={items}
          getId={(f) => f.id}
          getTitle={(f) => f.question}
          editHref={(f) => `/admin/sss/${f.id}`}
          renderMeta={(f) => (
            <>
              {f.answer.split(/\s+/).filter(Boolean).length} kelime{f.isActive === false ? " · PASİF" : ""}
            </>
          )}
          onPersistOrder={(ids) => faqDb.persistOrder(ids)}
          onDelete={(f) => faqDb.remove(f.id)}
          emptyText="Henüz soru yok."
        />
      )}
    </div>
  );
}
