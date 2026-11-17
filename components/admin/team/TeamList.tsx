"use client";

/* eslint-disable @next/next/no-img-element -- küçük panel önizlemeleri */
import Link from "next/link";
import SortableList from "@/components/admin/SortableList";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { cldThumb, deleteFromCloudinary } from "@/lib/cloudinary";
import { teamMembersDb } from "@/lib/db/teamMembers";
import type { TeamMember } from "@/types";

export default function TeamList() {
  const { items, error } = useCollection<TeamMember>(teamMembersDb.subscribe);
  return (
    <div className="max-w-4xl">
      <PageTitle
        title="Ekip"
        description="Hakkımızda sayfasındaki ekip bölümü. Aktif üye yoksa bölüm sitede gösterilmez."
        action={
          <Link href="/admin/ekip/yeni" className={buttonClass.primary}>
            + Yeni Üye
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
          getId={(m) => m.id}
          getTitle={(m) => m.name}
          editHref={(m) => `/admin/ekip/${m.id}`}
          renderThumb={(m) =>
            m.photo ? (
              <img src={cldThumb(m.photo.public_id, 80, 100)} alt="" className="h-12 w-10 rounded object-cover" />
            ) : (
              <span className="flex h-12 w-10 items-center justify-center rounded bg-zinc-100 text-[10px] text-zinc-400">—</span>
            )
          }
          renderMeta={(m) => (
            <>
              {m.role}
              {m.isActive === false ? " · PASİF" : ""}
            </>
          )}
          onPersistOrder={(ids) => teamMembersDb.persistOrder(ids)}
          onDelete={async (m) => {
            await teamMembersDb.remove(m.id);
            if (m.photo) await deleteFromCloudinary([m.photo.public_id]);
          }}
          emptyText="Henüz ekip üyesi yok — eklenene kadar bölüm sitede gizli kalır."
        />
      )}
    </div>
  );
}
