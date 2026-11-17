/**
 * On-demand ISR tetikleyicisi — KORUMALI admin API'si.
 * Panelde her içerik mutasyonundan sonra çağrılır (lib/db/common.ts);
 * tüm public sayfa önbelleğini ve sitemap'i geçersiz kılar.
 */
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session";

export const runtime = "nodejs";

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Yetkisiz istek — oturum bulunamadı." }, { status: 401 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ ok: true, revalidatedAt: Date.now() });
}
