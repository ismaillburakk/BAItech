import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Giriş" };

export default async function AdminLoginPage() {
  // Geçerli (doğrulanmış + admin claim'li) oturum varsa formu atla
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <LoginForm />
    </main>
  );
}
