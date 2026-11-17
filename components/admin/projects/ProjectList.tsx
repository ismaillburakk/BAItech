"use client";

/* eslint-disable @next/next/no-img-element -- küçük panel önizlemeleri */
import Link from "next/link";
import SortableList from "@/components/admin/SortableList";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { cldThumb, deleteFromCloudinary } from "@/lib/cloudinary";
import { projectPublicIds, projectsDb } from "@/lib/db/projects";
import { PROJECT_STATUS_LABELS, type Project } from "@/types";

export default function ProjectList() {
  const { items, error } = useCollection<Project>(projectsDb.subscribe);

  return (
    <div className="max-w-4xl">
      <PageTitle
        title="Projeler"
        description="Ana sayfa şeridi, /projeler ızgarası ve proje detay sayfaları buradan beslenir."
        action={
          <Link href="/admin/projeler/yeni" className={buttonClass.primary}>
            + Yeni Proje
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
          getId={(p) => p.id}
          getTitle={(p) => p.title}
          editHref={(p) => `/admin/projeler/${p.id}`}
          renderThumb={(p) => {
            const img = p.coverImage ?? p.gallery?.[0]?.images?.[0];
            return img ? (
              <img src={cldThumb(img.public_id, 96, 72)} alt="" className="h-12 w-16 rounded object-cover object-top" />
            ) : (
              <span className="flex h-12 w-16 items-center justify-center rounded bg-zinc-100 text-[10px] text-zinc-400">görsel yok</span>
            );
          }}
          renderMeta={(p) => (
            <>
              /projeler/{p.slug} · {p.status !== "none" ? PROJECT_STATUS_LABELS[p.status] : "durum yok"}
              {p.isPublished === false ? " · TASLAK (sitede gizli)" : ""}
              {p.isFeatured ? " · Ana sayfada" : ""}
            </>
          )}
          onPersistOrder={(ids) => projectsDb.persistOrder(ids)}
          onDelete={async (p) => {
            await projectsDb.remove(p.id);
            await deleteFromCloudinary(projectPublicIds(p));
          }}
          emptyText="Henüz proje yok — “Yeni Proje” ile ekleyin."
        />
      )}
    </div>
  );
}
