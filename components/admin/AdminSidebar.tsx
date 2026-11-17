"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { subscribeToUnreadCount } from "@/lib/db/submissions";

interface NavItem {
  href: string;
  label: string;
  /** true → yalnızca birebir eşleşmede aktif (dashboard için) */
  exact?: boolean;
}

/** İçerik modülleri */
const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Panel", exact: true },
  { href: "/admin/projeler", label: "Projeler" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/referanslar", label: "Referanslar" },
  { href: "/admin/hero", label: "Hero" },
  { href: "/admin/ekip", label: "Ekip" },
  { href: "/admin/sss", label: "SSS" },
  { href: "/admin/sayfalar", label: "Sayfalar" },
  { href: "/admin/site-ayarlari", label: "Site Ayarları" },
  { href: "/admin/gelen-kutusu", label: "Gelen Kutusu" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  /** Mobil çekmece durumu (masaüstünde sidebar daima görünür) */
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sayfa değişince çekmeceyi kapat (render sırasında state uyarlama deseni)
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setIsDrawerOpen(false);
  }

  // Gelen Kutusu rozeti: okunmamış mesaj sayısını canlı izle
  useEffect(() => {
    const unsubscribe = subscribeToUnreadCount(setUnreadCount);
    return unsubscribe;
  }, []);

  // Çekmece açıkken arka plan kaydırması kilitli + Escape ile kapanır
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsDrawerOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen]);

  const navContent = (
    <>
      <div className="border-b border-zinc-800 px-5 py-5">
        <p className="text-sm font-semibold text-white">BAI Technology</p>
        <p className="mt-1 text-xs text-zinc-500">Yönetim Paneli</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const showBadge =
            item.href === "/admin/gelen-kutusu" && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-11 items-center rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-800 font-medium text-white shadow-[inset_3px_0_0_#f08418]"
                  : "text-zinc-400 hover:bg-zinc-800/60 hover:text-white"
              }`}
            >
              {item.label}
              {showBadge && (
                <span className="ml-auto rounded-full bg-orange-500 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-zinc-900">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-white"
        >
          Siteyi Görüntüle ↗
        </a>
      </div>
    </>
  );

  return (
    <>
      {/* Masaüstü: sabit sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-zinc-800 bg-zinc-900 md:flex">
        {navContent}
      </aside>

      {/* Mobil: üst barda menü butonu (44px dokunma hedefi) */}
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Menüyü aç"
        aria-expanded={isDrawerOpen}
        aria-controls="admin-cekmece"
        className="fixed left-2 top-1.5 z-40 flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 rounded-md text-zinc-700 md:hidden"
      >
        <span className="h-0.5 w-5 bg-current" />
        <span className="h-0.5 w-5 bg-current" />
        <span className="h-0.5 w-5 bg-current" />
      </button>

      {/* Mobil çekmece */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/50"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden
          />
          <aside
            id="admin-cekmece"
            className="absolute inset-y-0 left-0 flex w-64 flex-col bg-zinc-900 shadow-xl"
          >
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Menüyü kapat"
              className="absolute right-2 top-2 flex min-h-11 min-w-11 items-center justify-center text-2xl leading-none text-zinc-400 hover:text-white"
            >
              ×
            </button>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
