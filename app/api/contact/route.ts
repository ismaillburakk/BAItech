import { type NextRequest, NextResponse } from "next/server"
import { createTransport } from "nodemailer" // createTransport olarak güncellendi

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: "Tüm alanları doldurun" }, { status: 400 })
    }

    // Create transporter using your email credentials
    const transporter = createTransport({
      // createTransport olarak güncellendi
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_HOST_USER,
      to: "info@baitech.com.tr",
      subject: `BAI Technology İletişim: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #9333ea); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">BAI TECHNOLOGY</h1>
            <p style="color: white; margin: 5px 0;">Yeni İletişim Mesajı</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">İletişim Bilgileri</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p><strong>Ad Soyad:</strong> ${name}</p>
              <p><strong>E-posta:</strong> ${email}</p>
              <p><strong>Konu:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #1e293b; margin-top: 0;">Mesaj:</h3>
              <p style="line-height: 1.6; color: #475569;">${message}</p>
            </div>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              Bu mesaj BAI Technology web sitesi iletişim formu üzerinden gönderilmiştir.
            </p>
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
