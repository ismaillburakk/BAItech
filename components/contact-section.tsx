"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Check, Loader2, Send } from "lucide-react"
import { toast } from "sonner"

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) {
      setConsentError(true)
      toast.error("KVKK onayı gerekli.", {
        description: "Devam etmek için aydınlatma metnini kabul etmelisiniz.",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, consent: true, consentAt: new Date().toISOString() }),
      })
      const result = await response.json()
      if (result.success) {
        toast.success("Mesajınız başarıyla gönderildi.", {
          description: "En kısa sürede size geri döneceğiz.",
        })
        setFormData({ name: "", email: "", subject: "", message: "" })
        setConsent(false)
      } else {
        toast.error("Mesaj gönderilemedi.", {
          description: result.message ?? "Lütfen tekrar deneyin.",
        })
      }
    } catch {
      toast.error("Bağlantı hatası.", {
        description: "Lütfen birkaç saniye sonra tekrar deneyin.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleConsentChange = (checked: boolean) => {
    setConsent(checked)
    if (checked) setConsentError(false)
  }

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="wrap">
        <div className="reveal relative overflow-hidden rounded-lg border border-rule bg-paper">
          {/* Radial accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklch, var(--amber) 35%, transparent), transparent)",
            }}
          />

          <div className="relative grid gap-12 p-8 md:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-16">
            {/* Left — heading + contact */}
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  — İletişim
                </span>
                <span className="hidden h-px w-10 bg-rule sm:block" />
                <span className="notranslate font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  Section 05
                </span>
              </div>
              <h2 className="display mt-6 text-[clamp(40px,5vw,76px)] text-ink">
                İletişime{" "}
                <span className="italic-amber">geçin.</span>
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-2">
                AI çözümlerimiz hakkında daha fazla bilgi almak için bizimle iletişime geçin.
              </p>

              <address className="mt-10 grid grid-cols-1 gap-6 not-italic sm:grid-cols-2 lg:grid-cols-1">
                <ContactRow label="E-posta">
                  <a
                    href="mailto:info@baitech.com.tr"
                    className="notranslate font-serif text-[22px] text-ink hover:text-amber-ink"
                  >
                    info@baitech.com.tr
                  </a>
                </ContactRow>
                <ContactRow label="Telefon">
                  <a
                    href="tel:+905323694564"
                    className="notranslate font-serif text-[22px] text-ink hover:text-amber-ink"
                  >
                    +90 532 369 4564
                  </a>
                </ContactRow>
                <ContactRow label="Adres">
                  <span className="font-serif text-[20px] leading-snug text-ink">
                    Tekstil OSB Mahallesi 204. Cadde
                    <br />
                    No:566/103 Merkez Uşak, Türkiye
                  </span>
                </ContactRow>
                <ContactRow label="Yanıt Süresi">
                  <span className="font-serif text-[22px] text-ink italic">~ 24 saat</span>
                </ContactRow>
              </address>
            </div>

            {/* Right — form */}
            <div className="lg:border-l lg:border-rule lg:pl-16">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-mono text-ink-3">
                  — Mesaj Bırakın
                </span>
                <span className="notranslate font-mono text-[10px] uppercase tracking-mono text-ink-3">
                  Form 01
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" aria-label="İletişim formu">
                <Field
                  label="Adınız ve Soyadınız"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ad Soyad"
                  required
                />
                <Field
                  label="E-posta Adresiniz"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ornek@firma.com"
                  required
                />
                <Field
                  label="Konu"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Mesaj konusu"
                  required
                />
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block font-mono text-[10px] uppercase tracking-mono text-ink-3"
                  >
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mesajınızı yazın..."
                    required
                    className="w-full resize-none border-b border-rule bg-transparent py-2 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink"
                  />
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="kvkk-consent"
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors ${
                      consentError ? "border-amber bg-amber/5" : "border-rule hover:bg-bg-elev"
                    }`}
                  >
                    <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
                      <input
                        id="kvkk-consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => handleConsentChange(e.target.checked)}
                        aria-required="true"
                        className="peer sr-only"
                      />
                      <span
                        className={`absolute inset-0 rounded-sm border ${
                          consent ? "border-ink bg-ink" : "border-rule bg-paper"
                        } transition-colors`}
                      />
                      {consent && <Check className="relative h-3.5 w-3.5 text-bg" />}
                    </span>
                    <span className="text-[13px] leading-relaxed text-ink-2">
                      <Link
                        href="/aydinlatma-metni"
                        target="_blank"
                        rel="noopener"
                        className="underline underline-offset-2 hover:text-ink"
                      >
                        KVKK Aydınlatma Metni
                      </Link>
                      &rsquo;ni okudum; kişisel verilerimin iletişim talebimi karşılamak amacıyla
                      işlenmesini kabul ediyorum.
                    </span>
                  </label>
                  {consentError && (
                    <p
                      role="alert"
                      className="font-mono text-[10px] uppercase tracking-mono text-amber-ink"
                    >
                      Bu alan zorunludur.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-pill bg-ink px-6 py-3 text-[14px] font-medium text-bg transition-transform hover:-translate-y-px disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Mesaj Gönder
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-mono text-ink-3">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block font-mono text-[10px] uppercase tracking-mono text-ink-3">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border-b border-rule bg-transparent py-2 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-3 focus:border-ink"
      />
    </div>
  )
}
