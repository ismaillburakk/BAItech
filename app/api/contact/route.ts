import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, consent, consentAt } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "Tüm alanları doldurun" }, { status: 400 })
    }

    if (consent !== true) {
      return NextResponse.json(
        {
          success: false,
          message: "Mesajınızı gönderebilmemiz için KVKK aydınlatma metnini onaylamanız gerekir.",
        },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Geçerli bir e-posta adresi girin" }, { status: 400 })
    }

    if (!process.env.EMAIL_HOST_USER || !process.env.EMAIL_HOST_PASSWORD) {
      console.error("Email configuration missing")
      return NextResponse.json({ success: false, message: "Email yapılandırması eksik" }, { status: 500 })
    }

    // Capture audit-trail metadata for the KVKK consent record.
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const consentTimestamp = typeof consentAt === "string" ? consentAt : new Date().toISOString()

    // Create transporter using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    })

    // Basic HTML escaping to prevent injection from form input
    const esc = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")

    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: "info@baitech.com.tr",
      replyTo: email,
      subject: `BAI Technology İletişim: ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f7f4ee; color: #1f1a13;">
          <div style="padding: 32px 32px 24px; border-bottom: 1px solid #d9d2c4;">
            <p style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c; margin: 0 0 12px;">— BAI Technology · İletişim</p>
            <h1 style="font-family: Georgia, serif; font-size: 28px; font-weight: 400; color: #1f1a13; margin: 0;">Yeni iletişim mesajı</h1>
          </div>

          <div style="padding: 28px 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px dashed #d9d2c4; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c; width: 110px;">Ad Soyad</td>
                <td style="padding: 10px 0; border-bottom: 1px dashed #d9d2c4; font-size: 15px; color: #1f1a13;">${esc(name)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px dashed #d9d2c4; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c;">E-posta</td>
                <td style="padding: 10px 0; border-bottom: 1px dashed #d9d2c4; font-size: 15px; color: #1f1a13;">${esc(email)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px dashed #d9d2c4; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c;">Konu</td>
                <td style="padding: 10px 0; border-bottom: 1px dashed #d9d2c4; font-size: 15px; color: #1f1a13;">${esc(subject)}</td>
              </tr>
            </table>

            <p style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c; margin: 28px 0 12px;">— Mesaj</p>
            <p style="font-size: 15px; line-height: 1.6; color: #3d3528; white-space: pre-wrap; margin: 0;">${esc(message)}</p>

            <p style="font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c; margin: 28px 0 12px;">— KVKK Rıza Kaydı</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
              <tr>
                <td style="padding: 4px 0; color: #897e6c; width: 110px;">Onay zamanı</td>
                <td style="padding: 4px 0; color: #3d3528;">${esc(consentTimestamp)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #897e6c;">IP adresi</td>
                <td style="padding: 4px 0; color: #3d3528;">${esc(ip)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #897e6c;">Tarayıcı</td>
                <td style="padding: 4px 0; color: #3d3528;">${esc(userAgent)}</td>
              </tr>
            </table>
          </div>

          <div style="padding: 20px 32px; border-top: 1px solid #d9d2c4; font-family: 'Courier New', monospace; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #897e6c;">
            baitech.com.tr · Edition 001
          </div>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({
      success: true,
      message: "Mesajınız başarıyla gönderildi!",
    })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json(
      { success: false, message: "Mesaj gönderilemedi. Lütfen tekrar deneyin." },
      { status: 500 },
    )
  }
}
