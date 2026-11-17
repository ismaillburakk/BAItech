"use client";

/* eslint-disable @next/next/no-img-element -- statik logo */
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "E-posta veya şifre hatalı.",
  "auth/user-not-found": "E-posta veya şifre hatalı.",
  "auth/wrong-password": "E-posta veya şifre hatalı.",
  "auth/invalid-email": "Geçerli bir e-posta adresi girin.",
  "auth/missing-password": "Şifre alanı boş bırakılamaz.",
  "auth/user-disabled": "Bu hesap devre dışı bırakılmış.",
  "auth/too-many-requests": "Çok fazla başarısız deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.",
  "auth/network-request-failed": "Ağ hatası — internet bağlantınızı kontrol edin.",
};

function resolveErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGES[error.code] ?? "Giriş yapılamadı. Lütfen tekrar deneyin.";
  }
  return "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.";
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      // 1) Firebase Auth girişi (client SDK) — Firestore yazmaları bu oturuma dayanır
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      // 2) Taze ID token (custom claim'ler dahil) → httpOnly session cookie
      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await signOut(auth).catch(() => undefined);
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(data?.error ?? "Oturum oluşturulamadı. Lütfen tekrar deneyin.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(resolveErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3">
          <img src="/img/bai-logo.png" alt="" width={36} height={36} className="size-9 rounded-md bg-[#050b18] p-1" />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-zinc-900">BAI Technology</h1>
            <p className="text-sm text-zinc-500">Yönetim paneli girişi</p>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
          E-posta
          <input
            type="email"
            name="email"
            inputMode="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@baitech.com.tr"
            className="min-h-11 rounded-md border border-zinc-300 bg-white px-3 py-2 text-base font-normal text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700">
          Şifre
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="min-h-11 rounded-md border border-zinc-300 bg-white px-3 py-2 text-base font-normal text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Giriş yapılıyor…" : "Giriş Yap"}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-zinc-500">Erişim yalnızca yetkili yöneticiler içindir.</p>
    </div>
  );
}
