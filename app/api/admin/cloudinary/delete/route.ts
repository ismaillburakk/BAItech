/**
 * Cloudinary görsel silme — KORUMALI admin API'si.
 *
 * Unsigned preset yalnızca yüklemeye izin verir; silme, API secret ile
 * imzalanmış Admin API çağrısı gerektirir ve secret asla client'a inmez.
 * Bu route her istekte admin session cookie'sini doğrular.
 */
import { createHash } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getAdminSession } from "@/lib/admin-session";

/** firebase-admin (session doğrulama) Node.js runtime ister */
export const runtime = "nodejs";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

/**
 * Yalnız bu sitenin klasöründeki görseller silinebilir (bai/…) — aynı
 * Cloudinary hesabındaki başka varlıklar bu uç noktadan silinemez.
 */
const ALLOWED_PREFIX = "bai/";

/** Tek istekte silinebilecek en fazla görsel */
const MAX_BATCH = 30;

interface DestroyResponse {
  result?: string;
}

/** Cloudinary imzası: parametreler alfabetik sıralı + api_secret, SHA-1 hex */
function signParams(params: Record<string, string>): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${API_SECRET}`).digest("hex");
}

async function destroyImage(publicId: string): Promise<string> {
  const params: Record<string, string> = {
    invalidate: "true",
    public_id: publicId,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };

  const body = new URLSearchParams({
    ...params,
    api_key: API_KEY as string,
    signature: signParams(params),
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    { method: "POST", body },
  );
  const data = (await response.json().catch(() => ({}))) as DestroyResponse;
  return data.result ?? `http-${response.status}`;
}

export async function POST(request: NextRequest) {
  // Koruma: geçerli admin oturumu şart — herkes silemez.
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Yetkisiz istek — oturum bulunamadı." },
      { status: 401 },
    );
  }

  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Cloudinary API anahtarları eksik — .env / Netlify ortam değişkenlerindeki CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET değerlerini doldurun.",
      },
      { status: 500 },
    );
  }

  let publicIds: unknown;
  try {
    ({ publicIds } = (await request.json()) as { publicIds?: unknown });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Geçersiz istek gövdesi." },
      { status: 400 },
    );
  }

  if (
    !Array.isArray(publicIds) ||
    publicIds.length === 0 ||
    publicIds.length > MAX_BATCH ||
    !publicIds.every(
      (id): id is string =>
        typeof id === "string" && id.length > 0 && id.startsWith(ALLOWED_PREFIX),
    )
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: `publicIds, 1-${MAX_BATCH} öğeli ve "${ALLOWED_PREFIX}" ile başlayan bir metin dizisi olmalı.`,
      },
      { status: 400 },
    );
  }

  const results: Record<string, string> = {};
  for (const publicId of publicIds) {
    try {
      results[publicId] = await destroyImage(publicId);
    } catch {
      results[publicId] = "network-error";
    }
  }

  // "ok" = silindi, "not found" = zaten yok — ikisi de başarı sayılır
  const allOk = Object.values(results).every(
    (result) => result === "ok" || result === "not found",
  );

  return NextResponse.json(
    allOk
      ? { ok: true, results }
      : {
          ok: false,
          results,
          error: "Bazı görseller silinemedi — sonuç ayrıntıları results alanında.",
        },
    { status: allOk ? 200 : 502 },
  );
}
