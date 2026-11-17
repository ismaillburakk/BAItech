/** Script'ler için imzalı Cloudinary yükleme / silme (anahtarlar .env'den, --env-file ile). */
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

async function call(action, params, file) {
  const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const KEY = process.env.CLOUDINARY_API_KEY;
  const SECRET = process.env.CLOUDINARY_API_SECRET;
  if (!CLOUD || !KEY || !SECRET) throw new Error("Cloudinary değişkenleri eksik (.env).");
  const signed = { ...params, timestamp: String(Math.floor(Date.now() / 1000)) };
  const toSign = Object.keys(signed).sort().map((k) => `${k}=${signed[k]}`).join("&");
  const form = new FormData();
  if (file) form.append("file", new Blob([file.data], { type: file.mime }), file.name);
  for (const [k, v] of Object.entries(signed)) form.append(k, v);
  form.append("api_key", KEY);
  form.append("signature", createHash("sha1").update(toSign + SECRET).digest("hex"));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/${action}`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(`Cloudinary ${action} hatası: ${JSON.stringify(data).slice(0, 240)}`);
  return data;
}

/** Yerel dosyayı sabit public_id ile yükler (aynı id'ye tekrar yükleme kopya üretmez) */
export async function uploadImage(absPath, publicId) {
  const ext = path.extname(absPath).slice(1).toLowerCase();
  const mime = { webp: "image/webp", png: "image/png", svg: "image/svg+xml", jpg: "image/jpeg", jpeg: "image/jpeg" }[ext] ?? "application/octet-stream";
  const data = await call("upload", { overwrite: "true", invalidate: "true", public_id: publicId }, { data: await readFile(absPath), mime, name: path.basename(absPath) });
  return { public_id: data.public_id, url: data.secure_url, width: data.width, height: data.height, format: data.format };
}

export async function destroyImage(publicId) {
  return call("destroy", { public_id: publicId, invalidate: "true" });
}
