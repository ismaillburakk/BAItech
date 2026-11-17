"use client";

import Link from "next/link";
import SortableList from "@/components/admin/SortableList";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { servicePublicIds, servicesDb } from "@/lib/db/services";
import { SERVICE_ART_LABELS, type Service } from "@/types";

export default function ServiceList() {
  const { items, error } = useCollection<Service>(servicesDb.subscribe);
  return (
    <div className="max-w-4xl">
      <PageTitle
        title="Hizmetler"
        description="Bu sıra /hizmetler sayfasındaki sıradır (001, 002 …). Ana sayfa bento sırası ve boyutu her hizmetin içinden ayarlanır."
        action={
          <Link href="/admin/hizmetler/yeni" className={buttonClass.primary}>
            + Yeni Hizmet
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
          getId={(s) => s.id}
          getTitle={(s) => s.title}
          editHref={(s) => `/admin/hizmetler/${s.id}`}
          renderMeta={(s) => (
            <>
              #{s.slug} · bento: {s.bentoSize === "large" ? "büyük" : "küçük"}, {SERVICE_ART_LABELS[s.bentoArt]?.split(" (")[0]}
            </>
          )}
          onPersistOrder={(ids) => servicesDb.persistOrder(ids)}
          onDelete={async (s) => {
            await servicesDb.remove(s.id);
            await deleteFromCloudinary(servicePublicIds(s));
          }}
          emptyText="Henüz hizmet yok."
        />
      )}
    </div>
  );
}
