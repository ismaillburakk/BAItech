"use client";

import { useEffect, useState, type FormEvent } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import { StringListEditor } from "@/components/admin/editors";
import { buttonClass, CharCount, ErrorBox, Field, inputClass, Loading, PageTitle, SaveBar, Section, SuccessBox } from "@/components/admin/ui";
import { useDirtyGuard } from "@/components/admin/useDirtyGuard";
import { useImageLifecycle } from "@/components/admin/useImageLifecycle";
import { hasActiveUploads, UPLOAD_IN_PROGRESS_MESSAGE } from "@/lib/cloudinary";
import { mapFirestoreError } from "@/lib/db/common";
import { getSiteSettings, saveSiteSettings, type SiteSettingsInput } from "@/lib/db/singletons";
import { isSafeUrl, reorder } from "@/lib/utils";
import { DEFAULT_GEO, DEFAULT_OFFICIAL_PROFILES, STAT_SOURCE_LABELS, STAT_SOURCES, type StatItem } from "@/types";

const EMPTY: SiteSettingsInput = {
  brand: { name: "BAI Technology", localName: "BAI Teknoloji", logo: null, tagline: "", legalName: "", foundingYear: "2025" },
  contact: { email: "", phone: "", address: "", responseTime: "", mapEmbedUrl: "", notifyEmail: "", geo: DEFAULT_GEO },
  socials: [],
  stats: [],
  cta: { title: "", buttonLabel: "Ücretsiz Danışmanlık" },
  seo: { defaultTitle: "", defaultDescription: "", organizationDescription: "", alternateNames: [], officialProfiles: [...DEFAULT_OFFICIAL_PROFILES], ogImage: null },
};

function settingsIds(s: SiteSettingsInput): string[] {
  return [s.brand.logo?.public_id, s.seo.ogImage?.public_id].filter((x): x is string => !!x);
}

export default function SiteSettingsForm() {
  const [form, setForm] = useState<SiteSettingsInput>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const images = useImageLifecycle();
  const guard = useDirtyGuard(() => JSON.stringify(form), !isLoading);

  const setGroup = <K extends keyof SiteSettingsInput>(key: K, patch: Partial<SiteSettingsInput[K]>) =>
    setForm((f) => ({ ...f, [key]: { ...(f[key] as object), ...patch } }));

  useEffect(() => {
    getSiteSettings()
      .then((s) => {
        if (s) {
          const { id: _i, updatedAt: _u, ...rest } = s;
          void _i;
          void _u;
          const merged: SiteSettingsInput = {
            brand: { ...EMPTY.brand, ...rest.brand },
            contact: { ...EMPTY.contact, ...rest.contact, geo: { ...DEFAULT_GEO, ...rest.contact?.geo } },
            socials: rest.socials ?? [],
            stats: rest.stats ?? [],
            cta: { ...EMPTY.cta, ...rest.cta },
            seo: { ...EMPTY.seo, ...rest.seo },
          };
          setForm(merged);
          images.setSaved(settingsIds(merged));
        }
      })
      .catch((err) => setError(mapFirestoreError(err)))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca ilk yüklemede
  }, []);

  function updateStat(i: number, patch: Partial<StatItem>) {
    setForm((f) => ({ ...f, stats: f.stats.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (hasActiveUploads()) return setError(UPLOAD_IN_PROGRESS_MESSAGE);
    setError(null);
    setSaved(null);
    const emailOk = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!emailOk(form.contact.email) || !emailOk(form.contact.notifyEmail)) return setError("E-posta adreslerini kontrol edin.");
    if (form.contact.mapEmbedUrl && !form.contact.mapEmbedUrl.startsWith("https://")) return setError("Harita adresi https:// ile başlamalı.");
    const geo = form.contact.geo ?? DEFAULT_GEO;
    if (!Number.isFinite(geo.latitude) || !Number.isFinite(geo.longitude) || Math.abs(geo.latitude) > 90 || Math.abs(geo.longitude) > 180)
      return setError("Konum koordinatlarını kontrol edin: enlem −90…90, boylam −180…180 arasında ondalık sayı olmalı (örn. 38.6823).");
    const socials = form.socials.filter((s) => s.platform.trim() && s.url.trim());
    if (socials.some((s) => !isSafeUrl(s.url.trim()))) return setError("Sosyal medya bağlantıları http(s) adresi olmalı.");
    const officialProfiles = (form.seo.officialProfiles ?? []).map((u) => u.trim()).filter(Boolean);
    if (officialProfiles.some((u) => !isSafeUrl(u))) return setError("Resmi profil bağlantıları http(s) adresi olmalı.");
    setIsSaving(true);
    try {
      const input: SiteSettingsInput = {
        ...form,
        brand: { ...form.brand, legalName: (form.brand.legalName ?? "").trim() },
        contact: { ...form.contact, geo: { latitude: geo.latitude, longitude: geo.longitude } },
        socials: socials.map((s) => ({ platform: s.platform.trim().toLowerCase(), url: s.url.trim() })),
        stats: form.stats.filter((s) => s.label.trim()),
        seo: { ...form.seo, alternateNames: form.seo.alternateNames.map((n) => n.trim()).filter(Boolean), officialProfiles },
      };
      await saveSiteSettings(input);
      await images.commit(settingsIds(input));
      guard.reset();
      setSaved("Site ayarları kaydedildi.");
    } catch (err) {
      setError(mapFirestoreError(err));
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl" noValidate>
      <PageTitle title="Site Ayarları" description="Logo, iletişim, sosyal medya, istatistikler ve SEO/GEO varsayılanları." />
      <ErrorBox message={error} />
      <SuccessBox message={saved} />

      <Section title="Marka">
        <Field label="Marka adı (resmî)">
          <input type="text" value={form.brand.name} onChange={(e) => setGroup("brand", { name: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Türkçe kullanım">
          <input type="text" value={form.brand.localName} onChange={(e) => setGroup("brand", { localName: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Kuruluş yılı">
          <input type="text" inputMode="numeric" value={form.brand.foundingYear} onChange={(e) => setGroup("brand", { foundingYear: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Footer tanıtım cümlesi" wide>
          <textarea rows={3} value={form.brand.tagline} onChange={(e) => setGroup("brand", { tagline: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Şirket unvanı" wide hint="Footer'da tanıtım cümlesinin altında ve schema legalName alanında görünür. Boşsa footer'da gösterilmez, schema'da resmi unvan kullanılır.">
          <input type="text" value={form.brand.legalName ?? ""} onChange={(e) => setGroup("brand", { legalName: e.target.value })} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <ImageUploader
            label="Logo"
            contain
            value={form.brand.logo}
            onChange={(img) => {
              if (img) images.track([img.public_id]);
              setGroup("brand", { logo: img });
            }}
            hint="Header, footer ve schema logosu. Boşsa yerel /img/bai-logo.png kullanılır."
          />
        </div>
      </Section>

      <Section title="İletişim">
        <Field label="E-posta">
          <input type="email" inputMode="email" value={form.contact.email} onChange={(e) => setGroup("contact", { email: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Telefon" hint="Görünen biçim — örn. +90 506 356 1490">
          <input type="tel" inputMode="tel" value={form.contact.phone} onChange={(e) => setGroup("contact", { phone: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Adres" wide hint="Satırları Enter ile ayırın">
          <textarea rows={2} value={form.contact.address} onChange={(e) => setGroup("contact", { address: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Konum — enlem" hint="Arama motorlarına bildirilen konum (schema geo). Adresi değiştirirseniz birlikte güncelleyin. Örn. 38.6823">
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={Number.isFinite(form.contact.geo?.latitude) ? form.contact.geo?.latitude : ""}
            onChange={(e) => setGroup("contact", { geo: { ...(form.contact.geo ?? DEFAULT_GEO), latitude: e.target.value === "" ? NaN : Number(e.target.value) } })}
            className={inputClass}
          />
        </Field>
        <Field label="Konum — boylam" hint="Örn. 29.4082">
          <input
            type="number"
            inputMode="decimal"
            step="any"
            value={Number.isFinite(form.contact.geo?.longitude) ? form.contact.geo?.longitude : ""}
            onChange={(e) => setGroup("contact", { geo: { ...(form.contact.geo ?? DEFAULT_GEO), longitude: e.target.value === "" ? NaN : Number(e.target.value) } })}
            className={inputClass}
          />
        </Field>
        <Field label="Yanıt süresi">
          <input type="text" value={form.contact.responseTime} onChange={(e) => setGroup("contact", { responseTime: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Form bildirim adresi" hint="İletişim formu mailleri buraya gelir (boşsa e-posta)">
          <input type="email" inputMode="email" value={form.contact.notifyEmail} onChange={(e) => setGroup("contact", { notifyEmail: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Google Maps embed adresi (opsiyonel)" wide hint="Doluysa İletişim sayfasında harita gösterilir. Örn. https://www.google.com/maps?q=38.6823,29.4082&output=embed">
          <input type="url" inputMode="url" value={form.contact.mapEmbedUrl} onChange={(e) => setGroup("contact", { mapEmbedUrl: e.target.value })} className={inputClass} />
        </Field>
      </Section>

      <Section title="Sosyal medya" description="Footer'da gösterilir ve schema sameAs listesine eklenir.">
        <div className="flex flex-col gap-2 sm:col-span-2">
          {form.socials.map((s, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={s.platform}
                placeholder="linkedin"
                aria-label={`Platform ${i + 1}`}
                onChange={(e) => setForm((f) => ({ ...f, socials: f.socials.map((x, j) => (j === i ? { ...x, platform: e.target.value } : x)) }))}
                className={`${inputClass} sm:max-w-44`}
              />
              <input
                type="url"
                inputMode="url"
                value={s.url}
                placeholder="https://"
                aria-label={`Bağlantı ${i + 1}`}
                onChange={(e) => setForm((f) => ({ ...f, socials: f.socials.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) }))}
                className={inputClass}
              />
              <button type="button" className={buttonClass.danger} onClick={() => setForm((f) => ({ ...f, socials: f.socials.filter((_, j) => j !== i) }))}>
                Kaldır
              </button>
            </div>
          ))}
          <button type="button" className={`${buttonClass.secondary} self-start`} onClick={() => setForm((f) => ({ ...f, socials: [...f.socials, { platform: "", url: "" }] }))}>
            + Hesap ekle
          </button>
        </div>
      </Section>

      <Section title="İstatistikler (ana sayfa “Sayılarla”)" description="Otomatik kaynaklar canlı veriden sayılır — uydurma sayı girmeyin.">
        <div className="flex flex-col gap-3 sm:col-span-2">
          {form.stats.map((s, i) => (
            <div key={i} className="grid gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[1fr_1.4fr]">
              <select value={s.source} onChange={(e) => updateStat(i, { source: e.target.value as StatItem["source"] })} className={inputClass} aria-label={`İstatistik ${i + 1} kaynağı`}>
                {STAT_SOURCES.map((src) => (
                  <option key={src} value={src}>
                    {STAT_SOURCE_LABELS[src]}
                  </option>
                ))}
              </select>
              <input type="text" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="Açıklama" aria-label={`İstatistik ${i + 1} açıklaması`} className={inputClass} />
              {s.source === "manual" ? (
                <input type="text" value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="Değer (örn. 2025)" aria-label={`İstatistik ${i + 1} değeri`} className={inputClass} />
              ) : (
                <span className="flex items-center text-xs text-zinc-500">Değer otomatik hesaplanır.</span>
              )}
              <div className="flex gap-1 sm:justify-end">
                <button type="button" className={buttonClass.small} aria-label="Yukarı" disabled={i === 0} onClick={() => setForm((f) => ({ ...f, stats: reorder(f.stats, i, i - 1) }))}>
                  ↑
                </button>
                <button type="button" className={buttonClass.small} aria-label="Aşağı" disabled={i === form.stats.length - 1} onClick={() => setForm((f) => ({ ...f, stats: reorder(f.stats, i, i + 1) }))}>
                  ↓
                </button>
                <button type="button" className={`${buttonClass.small} text-red-600`} onClick={() => setForm((f) => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }))}>
                  Kaldır
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={`${buttonClass.secondary} self-start`}
            onClick={() => setForm((f) => ({ ...f, stats: [...f.stats, { label: "", value: "", source: "manual" }] }))}
          >
            + İstatistik ekle
          </button>
        </div>
      </Section>

      <Section title="Kapanış çağrısı (her sayfanın sonundaki CTA)">
        <Field label="Başlık" wide>
          <input type="text" value={form.cta.title} onChange={(e) => setGroup("cta", { title: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Buton etiketi" hint="Header ve CTA butonlarında">
          <input type="text" value={form.cta.buttonLabel} onChange={(e) => setGroup("cta", { buttonLabel: e.target.value })} className={inputClass} />
        </Field>
      </Section>

      <Section title="SEO ve GEO varsayılanları">
        <Field label="Varsayılan başlık" wide hint={<CharCount value={form.seo.defaultTitle} min={50} max={60} />}>
          <input type="text" value={form.seo.defaultTitle} onChange={(e) => setGroup("seo", { defaultTitle: e.target.value })} className={inputClass} />
        </Field>
        <Field label="Varsayılan açıklama" wide hint={<CharCount value={form.seo.defaultDescription} min={140} max={160} />}>
          <textarea rows={3} value={form.seo.defaultDescription} onChange={(e) => setGroup("seo", { defaultDescription: e.target.value })} className={inputClass} />
        </Field>
        <Field
          label="Varlık tanımı (Organization.description)"
          wide
          hint="Yapay zeka motorlarının alıntıladığı omurga tanım. Üçüncü şahıs, tek başına anlamlı cümleler: “BAI Technology … firmasıdır.”"
        >
          <textarea rows={4} value={form.seo.organizationDescription} onChange={(e) => setGroup("seo", { organizationDescription: e.target.value })} className={inputClass} />
        </Field>
        <StringListEditor
          label="Marka varyantları (schema alternateName)"
          value={form.seo.alternateNames}
          onChange={(v) => setGroup("seo", { alternateNames: v })}
          addLabel="Varyant ekle"
          hint="Olası yazımlar: BAI Teknoloji, Baı Teknoloji, BAI Tech, Baytek … Meta keywords'e değil, yapılandırılmış veriye girer."
        />
        <StringListEditor
          label="Resmi profiller (schema sameAs)"
          value={form.seo.officialProfiles ?? []}
          onChange={(v) => setGroup("seo", { officialProfiles: v })}
          placeholder="https://"
          addLabel="Profil ekle"
          hint="Yalnız yapılandırılmış veriye girer, footer'da görünmez: App Store / Google Play geliştirici sayfaları, ürün siteleri, LinkedIn şirket sayfası, Google İşletme Profili. Yalnız BAI'ye ait, açılan adresler."
        />
        <div className="sm:col-span-2">
          <ImageUploader
            label="Paylaşım görseli (Open Graph, 1200×630)"
            value={form.seo.ogImage}
            onChange={(img) => {
              if (img) images.track([img.public_id]);
              setGroup("seo", { ogImage: img });
            }}
          />
        </div>
      </Section>

      <SaveBar saving={isSaving} />
    </form>
  );
}
