"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // 1) Server: session cookie'yi sil + refresh token'ları iptal et
      await fetch("/api/admin/session", { method: "DELETE" });
      // 2) Client: Firebase Auth oturumunu kapat
      await signOut(auth).catch(() => undefined);
    } finally {
      // 3) Login'e dön; RSC önbelleği tazelensin
      router.replace("/admin/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="min-h-11 shrink-0 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoggingOut ? "Çıkış yapılıyor…" : "Çıkış Yap"}
    </button>
  );
}
