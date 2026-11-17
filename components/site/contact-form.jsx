"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Loader2Icon, RotateCcwIcon, SendIcon } from "lucide-react"
import Link from "next/link"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import ConsentCheckbox from "@/components/origin/comp-136"
import FormField from "@/components/origin/comp-60"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { EASE, transition } from "@/lib/motion"
import { useReducedMotion } from "@/lib/use-media"
import { db } from "@/lib/firebase"

const EMPTY = { name: "", email: "", phone: "", topic: "", subject: "", message: "" }
const LABELS = { name: "Adınız ve Soyadınız", email: "E-posta Adresiniz", phone: "Telefon", topic: "Proje türü", subject: "Konu", message: "Mesajınız" }
const LIMITS = { name: [2, 120], email: [5, 200], phone: [7, 30], topic: [1, 80], subject: [1, 200], message: [1, 5000] }
const OPTIONAL = new Set(["phone", "topic"])

// Bot korumaları (istemci tarafı): honeypot alanı, en kısa doldurma süresi,
// cihaz başına hız sınırı. Sunucu tarafında Firestore kuralları şemayı,
// /api/contact-notify ise kayıt başına tek maili garanti eder.
const MIN_FILL_MS = 2500
const RATE_KEY = "bai-form-gonderim"
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 3

function recentSubmissions() {
  try {
    const list = JSON.parse(localStorage.getItem(RATE_KEY) ?? "[]")
    return Array.isArray(list) ? list.filter((t) => Date.now() - t < RATE_WINDOW_MS) : []
  } catch {
    return []
  }
}
function rememberSubmission() {
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify([...recentSubmissions(), Date.now()]))
  } catch {
    // depolama kapalı — sınır uygulanamaz, gönderim engellenmez
  }
}

// Hata metinleri: neden + nasıl düzeltilir (skill error-clarity)
function validate(field, value) {
  const v = value.trim()
  if (!v) return OPTIONAL.has(field) ? null : `${LABELS[field]} alanı boş bırakılamaz.`
  const [min, max] = LIMITS[field]
  if (v.length < min) return `${LABELS[field]} en az ${min} karakter olmalı.`
  if (v.length > max) return `${LABELS[field]} en fazla ${max} karakter olabilir.`
  if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Geçerli bir e-posta adresi girin (ör. ornek@firma.com)."
  if (field === "phone" && !/^[+\d][\d\s()-]{6,}$/.test(v)) return "Geçerli bir telefon numarası girin (ör. 0506 356 14 90)."
  return null
}

/** "KVKK Aydınlatma Metni" ifadesini bağlantıya çevirir (metin panelden gelir) */
/** @param {any} props */
function ConsentText({ text, href }) {
  const key = "KVKK Aydınlatma Metni"
  const value = text || `${key}'ni okudum; kişisel verilerimin iletişim talebimi karşılamak amacıyla işlenmesini kabul ediyorum.`
  const i = value.indexOf(key)
  if (i < 0) return value
  return (
    <>
      {value.slice(0, i)}
      <Link href={href} target="_blank" className="font-medium text-foreground underline underline-offset-2">
        {key}
      </Link>
      {value.slice(i + key.length)}
    </>
  )
}

/** @param {any} props */
export function ContactForm({
  topics = [],
  consentText = "",
  consentHref = "/aydinlatma-metni",
  successTitle = "Mesajınız başarıyla gönderildi.",
  successDescription = "En kısa sürede size geri döneceğiz.",
}) {
  const [data, setData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [consent, setConsent] = useState(false)
  const [consentError, setConsentError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const reduce = useReducedMotion()
  const summaryRef = useRef(null)
  const honeypotRef = useRef(null)
  const startedAt = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setData((d) => ({ ...d, [name]: value }))
    // Hata gösteriliyorsa düzeltildiği an kaldır (tuş vuruşunda yeni hata gösterme yok)
    if (errors[name] && !validate(name, value)) setErrors((er) => ({ ...er, [name]: null }))
  }
  const onBlur = (e) => {
    const { name, value } = e.target
    setErrors((er) => ({ ...er, [name]: validate(name, value) }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const next = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, validate(k, data[k])]))
    const cErr = consent ? null : "KVKK onayı gerekli. Devam etmek için aydınlatma metnini kabul etmelisiniz."
    setErrors(next)
    setConsentError(cErr)
    if (Object.values(next).some(Boolean) || cErr) {
      requestAnimationFrame(() => summaryRef.current?.focus()) // skill focus-management
      return
    }
    // Honeypot dolu ya da form insanüstü hızda dolduruldu → sessizce "başarılı" göster, kayıt yazma
    if (honeypotRef.current?.value || Date.now() - startedAt.current < MIN_FILL_MS) {
      setData(EMPTY)
      setConsent(false)
      setSent(true)
      return
    }
    if (recentSubmissions().length >= RATE_MAX) {
      toast.error("Kısa sürede çok fazla mesaj gönderildi.", {
        description: "Lütfen birkaç dakika sonra tekrar deneyin veya bize e-posta/telefonla ulaşın.",
      })
      return
    }
    setSubmitting(true)
    try {
      const phone = data.phone.trim()
      // Proje türü yalnızca panelde tanımlı seçeneklerden biri olabilir (serbest metin yazılmaz)
      const topic = topics.includes(data.topic) ? data.topic : ""
      // firestore.rules create şemasıyla birebir: izinli alanlar, consent=true,
      // isRead=false, createdAt=sunucu saati; telefon ve proje türü boşsa alan yazılmaz.
      const base = {
        name: data.name.trim(),
        email: data.email.trim(),
        ...(phone ? { phone } : {}),
        message: data.message.trim(),
        consent: true,
        isRead: false,
        createdAt: serverTimestamp(),
      }
      const subject = data.subject.trim()
      let created
      try {
        created = await addDoc(collection(db, "submissions"), { ...base, ...(topic ? { topic } : {}), subject })
      } catch (err) {
        // Site ile Firestore kuralları ayrı yayınlanır: kurallar henüz `topic` alanını tanımıyorsa
        // mesaj kaybolmasın — proje türü konu satırının başına taşınır ve alan olmadan yeniden yazılır.
        if (!topic || err?.code !== "permission-denied") throw err
        created = await addDoc(collection(db, "submissions"), { ...base, subject: `${topic} — ${subject}`.slice(0, 200) })
      }
      // Mail bildirimi — ateşle-unut: kayıt güvende, mail hatası deneyimi bozmaz
      void fetch("/api/contact-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: created.id }),
        keepalive: true,
      }).catch(() => undefined)
      rememberSubmission()
    } catch {
      setSubmitting(false)
      toast.error("Mesajınız gönderilemedi.", { description: "Lütfen tekrar deneyin veya bize e-posta/telefonla ulaşın." })
      return
    }
    setSubmitting(false)
    toast.success(successTitle, { description: successDescription })
    setData(EMPTY)
    setConsent(false)
    setSent(true)
  }

  const errorList = [
    ...Object.entries(errors).filter(([, v]) => v),
    ...(consentError ? [["consent", consentError]] : []),
  ]

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          role="status"
          className="flex flex-col items-center gap-5 py-12 text-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, transition: transition.slow }}
          exit={{ opacity: 0, transition: transition.base }}
        >
          <svg viewBox="0 0 64 64" className="size-20" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="var(--brand-soft)" stroke="var(--brand)" strokeWidth="2" />
            <motion.path
              d="M19 33 L28 42 L46 23"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.15 }}
            />
          </svg>
          <p className="font-heading text-2xl font-semibold">{successTitle}</p>
          <p className="text-muted-foreground">{successDescription}</p>
          <Button variant="outline" className="rounded-full" onClick={() => setSent(false)}>
            <RotateCcwIcon data-icon="inline-start" aria-hidden="true" /> Yeni mesaj
          </Button>
        </motion.div>
      ) : (
    <motion.form
      key="form"
      onSubmit={onSubmit}
      noValidate
      className="grid gap-5"
      aria-label="İletişim formu"
      exit={{ opacity: 0, y: -8, transition: transition.base }}
    >
      {errorList.length ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border border-destructive bg-card p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <p className="font-semibold text-destructive">Formda {errorList.length} hata var:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-foreground">
            {errorList.map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Honeypot: ekran okuyucu ve klavyeden gizli; yalnız botlar doldurur */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Web siteniz</label>
        <input ref={honeypotRef} id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={LABELS.name} name="name" autoComplete="name" placeholder="Ad Soyad" maxLength={120} value={data.name} onChange={onChange} onBlur={onBlur} error={errors.name} />
        <FormField label={LABELS.email} name="email" type="email" inputMode="email" autoComplete="email" placeholder="ornek@firma.com" maxLength={200} value={data.email} onChange={onChange} onBlur={onBlur} error={errors.email} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={LABELS.phone} name="phone" type="tel" inputMode="tel" autoComplete="tel" required={false} hint="İsteğe bağlı" placeholder="05xx xxx xx xx" maxLength={30} value={data.phone} onChange={onChange} onBlur={onBlur} error={errors.phone} />
        <FormField label={LABELS.subject} name="subject" autoComplete="off" placeholder="Mesaj konusu" maxLength={200} value={data.subject} onChange={onChange} onBlur={onBlur} error={errors.subject} />
      </div>
      {topics.length ? (
        <div className="*:not-first:mt-2">
          <Label htmlFor="cf-topic" className="text-sm font-semibold">
            {LABELS.topic}
          </Label>
          {/* Yerel <select>: Input ile aynı ölçü ve çerçeve (44px, 16px yazı) */}
          <select
            id="cf-topic"
            name="topic"
            value={data.topic}
            onChange={onChange}
            aria-describedby="cf-topic-hint"
            className="h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3.5 py-2 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Seçin</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
          <p id="cf-topic-hint" className="text-sm text-muted-foreground">
            İsteğe bağlı
          </p>
        </div>
      ) : null}
      <FormField label={LABELS.message} name="message" multiline rows={5} placeholder="Mesajınızı yazın..." maxLength={5000} value={data.message} onChange={onChange} onBlur={onBlur} error={errors.message} />

      <ConsentCheckbox
        checked={consent}
        onCheckedChange={(v) => {
          setConsent(v === true)
          if (v === true) setConsentError(null)
        }}
        error={consentError ? "Bu alan zorunludur." : null}
      >
        <ConsentText text={consentText} href={consentHref} />
      </ConsentCheckbox>

      <Button type="submit" size="lg" disabled={submitting} className="h-13 w-full rounded-full px-8 sm:w-fit">
        {submitting ? (
          <>
            <Loader2Icon className="animate-spin" data-icon="inline-start" aria-hidden="true" />
            Gönderiliyor...
          </>
        ) : (
          <>
            <SendIcon data-icon="inline-start" aria-hidden="true" />
            Mesaj Gönder
          </>
        )}
      </Button>
    </motion.form>
      )}
    </AnimatePresence>
  )
}
