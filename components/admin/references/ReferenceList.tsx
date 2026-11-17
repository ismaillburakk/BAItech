"use client";

/* eslint-disable @next/next/no-img-element -- küçük panel önizlemeleri */
import Link from "next/link";
import SortableList from "@/components/admin/SortableList";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { cldThumb, deleteFromCloudinary } from "@/lib/cloudinary";
import { referencesDb } from "@/lib/db/references";
import type { Reference } from "@/types";

export default function ReferenceList() {
  const { items, error } = useCollection<Reference>(referencesDb.subscribe);
  return (
    <div className="max-w-4xl">
      <PageTitle
        title="Referanslar"
        description="Ana sayfadaki referans/müşteri logo bölümü. Aktif referans yoksa bölüm sitede gizlenir."
        action={
          <Link href="/admin/referanslar/yeni" className={buttonClass.primary}>
            + Yeni Referans
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
          getId={(r) => r.id}
          getTitle={(r) => r.name}
          editHref={(r) => `/admin/referanslar/${r.id}`}
          renderThumb={(r) =>
            r.logo ? (
              // Sitedeki görünümün önizlemesi: mono → koyu zeminde beyaz, orijinal → açık plaka
              <span className={`flex h-10 w-20 items-center justify-center rounded p-1 ${r.logoMode === "mono" ? "bg-[#0a1730]" : "bg-[#eef2f8] ring-4 ring-[#0a1730] ring-inset"}`}>
                <img
                  src={cldThumb(r.logo.public_id, 128, 64, "pad")}
                  alt=""
                  className={`max-h-full max-w-full object-contain ${r.logoMode === "mono" ? "[filter:brightness(0)_invert(1)]" : ""}`}
                />
              </span>
            ) : (
              <span className="flex h-10 w-20 items-center justify-center rounded bg-zinc-100 text-[10px] text-zinc-400">logo yok</span>
            )
          }
          renderMeta={(r) => (
            <>
              {r.isActive === false ? "PASİF (sitede gizli)" : "Aktif"}
              {r.url ? ` · ${r.url}` : ""}
            </>
          )}
          onPersistOrder={(ids) => referencesDb.persistOrder(ids)}
          onDelete={async (r) => {
            await referencesDb.remove(r.id);
            if (r.logo) await deleteFromCloudinary([r.logo.public_id]);
          }}
          emptyText="Henüz referans yok — “Yeni Referans” ile logo ekleyin."
        />
      )}
    </div>
  );
}
