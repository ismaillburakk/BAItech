import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";

/**
 * Korumalı panel layout'u — ikinci ve ASIL güvenlik kademesi.
 * proxy.ts yalnızca cookie varlığına bakar; burada Admin SDK ile
 * kriptografik doğrulama + admin claim kontrolü yapılır.
 */
export default async function AdminPanelLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh w-full">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-zinc-200 bg-white/95 py-0 pr-4 pl-16 backdrop-blur md:px-6">
          <span className="truncate text-sm text-zinc-500">Yönetim Paneli</span>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden truncate text-sm text-zinc-600 sm:inline">{session.email ?? "Yönetici"}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
