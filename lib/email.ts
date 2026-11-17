/**
 * Resend mail gönderimi — YALNIZCA server tarafı.
 *
 * RESEND_API_KEY boşsa hiçbir şey gönderilmez ve hata üretilmez
 * (attempted: false). SDK yok — Resend REST API'ye native fetch.
 * Kullanıcı girdileri HTML şablonlarına daima escape edilerek gömülür.
 */
import "server-only";

import type { SiteSettings } from "@/types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function fromAddress(settings: SiteSettings | null): string {
  const raw = process.env.RESEND_FROM_EMAIL?.trim() || "noreply@baitech.com.tr";
  // "Ad <adres>" biçiminde verilmişse olduğu gibi kullan
  if (raw.includes("<")) return raw;
  const name = settings?.brand.name || "BAI Technology";
  return `${name} <${raw}>`;
}

export interface ContactEmailInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  /** Formdaki "Proje türü" seçimi (opsiyonel) */
  topic?: string;
  message: string;
  createdAtText: string;
}

export interface ContactEmailResult {
  attempted: boolean;
  teamSent: boolean;
  customerSent: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function multiline(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

/* Marka paleti: zemin #050b18, kart #0a1730, turuncu #f08418, metin #eef2f8 */
function shell(content: string, footer: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<body style="margin:0;padding:0;background-color:#050b18;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#eef2f8;">
    <div style="border-top:3px solid #f08418;background:#0a1730;border-radius:12px;padding:32px 28px;">
      ${content}
    </div>
    <p style="margin:16px 4px 0;font-size:11px;letter-spacing:.08em;color:#9aa8bf;">${footer}</p>
  </div>
</body>
</html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 12px 10px 0;font-size:11px;letter-spacing:.12em;color:#9aa8bf;text-transform:uppercase;vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:10px 0;font-size:15px;color:#eef2f8;border-bottom:1px solid #1a2c4e;">${value}</td>
  </tr>`;
}

function teamEmailHtml(input: ContactEmailInput, brand: string): string {
  return shell(
    `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.2em;color:#f6a04a;text-transform:uppercase;">Yeni İletişim Mesajı</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:600;color:#eef2f8;">${escapeHtml(input.name)}</h1>
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
      ${infoRow("E-posta", `<a href="mailto:${escapeHtml(input.email)}" style="color:#f6a04a;">${escapeHtml(input.email)}</a>`)}
      ${input.phone ? infoRow("Telefon", `<a href="tel:${escapeHtml(input.phone.replace(/[^\d+]/g, ""))}" style="color:#eef2f8;">${escapeHtml(input.phone)}</a>`) : ""}
      ${input.topic ? infoRow("Proje türü", escapeHtml(input.topic)) : ""}
      ${infoRow("Konu", escapeHtml(input.subject))}
      ${infoRow("Tarih", escapeHtml(input.createdAtText))}
    </table>
    <p style="margin:20px 0 6px;font-size:11px;letter-spacing:.12em;color:#9aa8bf;text-transform:uppercase;">Mesaj</p>
    <p style="margin:0;padding:16px;background:#050b18;border-radius:8px;font-size:15px;line-height:1.7;color:#eef2f8;">${multiline(input.message)}</p>
    <p style="margin:20px 0 0;font-size:12px;color:#9aa8bf;">Bu maili yanıtladığınızda cevabınız doğrudan gönderene gider. Kayıt panelde Gelen Kutusu'nda da duruyor.</p>
  `,
    `${escapeHtml(brand.toUpperCase())} &middot; Yönetim bildirimi`,
  );
}

function customerEmailHtml(input: ContactEmailInput, settings: SiteSettings | null): string {
  const brand = settings?.brand.name || "BAI Technology";
  const contact = settings?.contact;
  const signature = [
    contact?.phone
      ? `<a href="tel:${escapeHtml(contact.phone.replace(/[^\d+]/g, ""))}" style="color:#f6a04a;text-decoration:none;">${escapeHtml(contact.phone)}</a>`
      : "",
    contact?.email ? `<a href="mailto:${escapeHtml(contact.email)}" style="color:#eef2f8;">${escapeHtml(contact.email)}</a>` : "",
    contact?.address ? multiline(contact.address) : "",
  ]
    .filter(Boolean)
    .join("<br>");

  return shell(
    `
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.2em;color:#f6a04a;text-transform:uppercase;">${escapeHtml(brand)}</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:600;color:#eef2f8;">Mesajınız alındı.</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#eef2f8;">Merhaba ${escapeHtml(input.name)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#b4c0d4;">
      "${escapeHtml(input.subject)}" konulu mesajınız bize ulaştı. En kısa sürede size geri döneceğiz.
    </p>
    <div style="border-top:1px solid #1a2c4e;padding-top:18px;margin-top:24px;font-size:13px;line-height:1.8;color:#b4c0d4;">
      <strong style="color:#eef2f8;">${escapeHtml(brand)}</strong><br>${signature}
    </div>
  `,
    `${escapeHtml(brand.toUpperCase())} &middot; baitech.com.tr`,
  );
}

interface ResendPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

async function sendViaResend(apiKey: string, payload: ResendPayload): Promise<boolean> {
  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[email] Resend hatası (${response.status}): ${body.slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Resend isteği başarısız:", error);
    return false;
  }
}

/**
 * İki taraflı iletişim maili:
 * 1) Ekibe bildirim (alıcı: Site Ayarları notifyEmail || email; reply-to: gönderen)
 * 2) Gönderene otomatik yanıt
 */
export async function sendContactEmails(
  input: ContactEmailInput,
  settings: SiteSettings | null,
): Promise<ContactEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info("[email] RESEND_API_KEY boş — mail adımı atlandı.");
    return { attempted: false, teamSent: false, customerSent: false };
  }

  const brand = settings?.brand.name || "BAI Technology";
  const from = fromAddress(settings);
  const teamAddress = settings?.contact.notifyEmail?.trim() || settings?.contact.email?.trim();

  let teamSent = false;
  if (teamAddress) {
    teamSent = await sendViaResend(apiKey, {
      from,
      to: [teamAddress],
      subject: `${brand} — Yeni iletişim mesajı: ${input.subject.slice(0, 80)}`,
      html: teamEmailHtml(input, brand),
      reply_to: input.email,
    });
  } else {
    console.warn("[email] Site Ayarları'nda e-posta tanımlı değil — ekip bildirimi atlandı.");
  }

  const customerSent = await sendViaResend(apiKey, {
    from,
    to: [input.email],
    subject: `Mesajınız alındı — ${brand}`,
    html: customerEmailHtml(input, settings),
    ...(teamAddress ? { reply_to: teamAddress } : {}),
  });

  return { attempted: true, teamSent, customerSent };
}
