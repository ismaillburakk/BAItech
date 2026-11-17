"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { buttonClass, ErrorBox, Loading, PageTitle } from "@/components/admin/ui";
import { useCollection } from "@/components/admin/useCollection";
import { mapFirestoreError } from "@/lib/db/common";
import { deleteSubmission, setSubmissionRead, subscribeToSubmissions } from "@/lib/db/submissions";
import { formatDateTimeTr, telHref } from "@/lib/utils";
import type { Submission } from "@/types";

export default function SubmissionList() {
  const { items, error } = useCollection<Submission>(subscribeToSubmissions);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, setPending] = useState<Submission | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const list = (items ?? []).filter((s) => filter === "all" || !s.isRead);
  const unread = (items ?? []).filter((s) => !s.isRead).length;

  async function toggle(s: Submission) {
    const next = openId === s.id ? null : s.id;
    setOpenId(next);
    if (next && !s.isRead) await setSubmissionRead(s.id, true).catch(() => undefined);
  }

  return (
    <div className="max-w-4xl">
      <PageTitle
        title="Gelen Kutusu"
        description="İletişim formundan gelen mesajlar. Her mesaj ayrıca Site Ayarları'ndaki bildirim adresine e-posta olarak gönderilir."
      />
      <ErrorBox message={error ?? actionError} />
      <div role="group" aria-label="Filtre" className="mt-6 flex gap-2">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className={filter === "all" ? buttonClass.primary : buttonClass.secondary}>
          Tümü ({items?.length ?? 0})
        </button>
        <button type="button" aria-pressed={filter === "unread"} onClick={() => setFilter("unread")} className={filter === "unread" ? buttonClass.primary : buttonClass.secondary}>
          Okunmamış ({unread})
        </button>
      </div>
      {items === null ? (
        <div className="mt-6">
          <Loading />
        </div>
      ) : list.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-500">Mesaj yok.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {list.map((s) => {
            const open = openId === s.id;
            return (
              <li key={s.id} className={`rounded-lg border bg-white ${s.isRead ? "border-zinc-200" : "border-orange-300"}`}>
                <button
                  type="button"
                  onClick={() => toggle(s)}
                  aria-expanded={open}
                  className="flex min-h-14 w-full flex-col gap-1 px-4 py-3 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {!s.isRead ? <span className="size-2 shrink-0 rounded-full bg-orange-500" aria-label="Okunmamış" /> : null}
                    <span className={`truncate ${s.isRead ? "text-zinc-700" : "font-semibold text-zinc-900"}`}>{s.name}</span>
                    <span className="truncate text-sm text-zinc-500">— {s.subject}</span>
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">{formatDateTimeTr(s.createdAt)}</span>
                </button>
                {open ? (
                  <div className="border-t border-zinc-100 px-4 py-4 text-sm">
                    <dl className="grid gap-2 sm:grid-cols-[120px_1fr]">
                      <dt className="text-zinc-500">E-posta</dt>
                      <dd>
                        <a className="break-all text-zinc-900 underline" href={`mailto:${s.email}?subject=${encodeURIComponent(`Re: ${s.subject}`)}`}>
                          {s.email}
                        </a>
                      </dd>
                      {s.phone ? (
                        <>
                          <dt className="text-zinc-500">Telefon</dt>
                          <dd>
                            <a className="text-zinc-900 underline" href={telHref(s.phone)}>
                              {s.phone}
                            </a>
                          </dd>
                        </>
                      ) : null}
                      {s.topic ? (
                        <>
                          <dt className="text-zinc-500">Proje türü</dt>
                          <dd className="text-zinc-900">{s.topic}</dd>
                        </>
                      ) : null}
                      <dt className="text-zinc-500">Mail bildirimi</dt>
                      <dd className="text-zinc-700">{s.notifiedAt ? `Gönderildi · ${formatDateTimeTr(s.notifiedAt)}` : "Gönderilmedi / bekliyor"}</dd>
                    </dl>
                    <p className="mt-4 whitespace-pre-wrap rounded-md bg-zinc-50 p-3 leading-relaxed text-zinc-800">{s.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button type="button" className={buttonClass.secondary} onClick={() => setSubmissionRead(s.id, !s.isRead).catch((e) => setActionError(mapFirestoreError(e)))}>
                        {s.isRead ? "Okunmadı işaretle" : "Okundu işaretle"}
                      </button>
                      <button type="button" className={buttonClass.danger} onClick={() => setPending(s)}>
                        Sil
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
      <ConfirmDialog
        open={pending !== null}
        title="Mesaj silinsin mi?"
        description={pending ? `${pending.name} adlı kişinin mesajı kalıcı olarak silinecek.` : ""}
        busy={busy}
        onConfirm={async () => {
          if (!pending) return;
          setBusy(true);
          try {
            await deleteSubmission(pending.id);
            setPending(null);
          } catch (e) {
            setActionError(mapFirestoreError(e));
          } finally {
            setBusy(false);
          }
        }}
        onCancel={() => setPending(null)}
      />
    </div>
  );
}
