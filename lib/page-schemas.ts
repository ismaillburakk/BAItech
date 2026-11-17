/**
 * Sayfa içerik şemaları — her sayfanın panelden düzenlenebilir alanları.
 *
 * Kod yalnızca YAPIYI (hangi sayfada hangi alan var, hangi tipte) tanımlar;
 * metnin kendisi Firestore `pages/{slug}.fields` içindedir. Admin panel
 * (components/admin/pages/PageForm) formu bu şemadan üretir; public sayfalar
 * pageText / pageList / pageCards yardımcılarıyla okur.
 */
import type { CardItem, Page, PageSlug } from "@/types";

export type PageFieldType = "text" | "textarea" | "list" | "cards" | "markdown";

export interface PageFieldDef {
  key: string;
  label: string;
  type: PageFieldType;
  help?: string;
}

export interface PageGroupDef {
  title: string;
  fields: PageFieldDef[];
}

export interface PageSchema {
  slug: PageSlug;
  label: string;
  path: string;
  note: string;
  groups: PageGroupDef[];
}

const header = (extra = ""): PageGroupDef => ({
  title: "Sayfa başlığı",
  fields: [
    { key: "headerEyebrow", label: "Üst etiket", type: "text" },
    { key: "headerTitle", label: "Başlık (H1)", type: "text", help: `Sayfadaki tek H1. ${extra}`.trim() },
    { key: "headerDescription", label: "Açıklama", type: "textarea" },
  ],
});

const legal = (slug: PageSlug, label: string, path: string): PageSchema => ({
  slug,
  label,
  path,
  note: "Yasal metin — gövde basit Markdown destekler (## başlık, - madde, **kalın**, [bağlantı](url)).",
  groups: [
    {
      title: "Belge",
      fields: [
        { key: "headerEyebrow", label: "Üst etiket", type: "text" },
        { key: "headerTitle", label: "Başlık (H1)", type: "text" },
        { key: "updatedAt", label: "Son güncelleme tarihi", type: "text", help: "Örn. 14.11.2026" },
        { key: "intro", label: "Giriş paragrafı", type: "textarea" },
        { key: "body", label: "Metin (Markdown)", type: "markdown" },
      ],
    },
  ],
});

export const PAGE_SCHEMAS: PageSchema[] = [
  {
    slug: "anasayfa",
    label: "Ana Sayfa",
    path: "/",
    note: "Bölüm başlıkları ve metinleri. Hero kendi modülünden, projeler/hizmetler/referanslar kendi modüllerinden gelir.",
    groups: [
      {
        title: "01 — Sayılarla",
        fields: [
          { key: "statsEyebrow", label: "Etiket", type: "text" },
          { key: "statsTitle", label: "Başlık", type: "textarea", help: "Sayıların kendisi Site Ayarları › İstatistikler'den gelir." },
        ],
      },
      {
        title: "02 — Hizmetler",
        fields: [
          { key: "servicesEyebrow", label: "Etiket", type: "text" },
          { key: "servicesTitle", label: "Başlık", type: "text" },
          { key: "servicesDescription", label: "Açıklama", type: "textarea" },
          { key: "servicesCta", label: "Bağlantı etiketi", type: "text" },
        ],
      },
      {
        title: "03 — Projeler",
        fields: [
          { key: "projectsEyebrow", label: "Etiket", type: "text" },
          { key: "projectsTitle", label: "Başlık", type: "text" },
          { key: "projectsCta", label: "Bağlantı etiketi", type: "text" },
        ],
      },
      {
        title: "04 — Referanslar",
        fields: [
          { key: "referencesEyebrow", label: "Etiket", type: "text" },
          { key: "referencesTitle", label: "Başlık", type: "text" },
          { key: "referencesDescription", label: "Açıklama", type: "textarea", help: "Logolar Referanslar modülünden gelir; aktif referans yoksa bölüm gizlenir." },
        ],
      },
      {
        title: "05 — Neden BAI",
        fields: [
          { key: "whyEyebrow", label: "Etiket", type: "text" },
          { key: "whyTitle", label: "Başlık", type: "text" },
          { key: "whyDescription", label: "Açıklama", type: "textarea" },
          { key: "whyBullets", label: "Adımlar", type: "list" },
          { key: "whyCta", label: "Bağlantı etiketi", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "hakkimizda",
    label: "Hakkımızda",
    path: "/hakkimizda",
    note: "Kurumsal kimlik, kuruluş, çalışma ilkeleri, Ar-Ge bölümleri ve model geliştirme süreci.",
    groups: [
      header(),
      {
        title: "01 — Kurumsal kimlik",
        fields: [
          { key: "identityEyebrow", label: "Etiket", type: "text" },
          {
            key: "identityText",
            label: "Kimlik metni",
            type: "textarea",
            help: "Kaydırdıkça kelime kelime aydınlanan büyük paragraf. Varlık tanımıyla tutarlı tutun.",
          },
          {
            key: "foundingText",
            label: "Kuruluş paragrafı",
            type: "textarea",
            help: "Kimlik metninin altında, normal paragraf olarak görünür. Boşsa gösterilmez.",
          },
        ],
      },
      {
        title: "Nasıl çalışırız (ilkeler)",
        fields: [
          { key: "principlesEyebrow", label: "Etiket", type: "text" },
          { key: "principlesTitle", label: "Bölüm başlığı", type: "text" },
          { key: "principles", label: "İlkeler", type: "cards", help: "Numaralı kartlar. Üç kart yan yana dengeli durur." },
        ],
      },
      {
        title: "02 — Ar-Ge ve yaklaşım",
        fields: [
          { key: "rdEyebrow", label: "Etiket", type: "text" },
          { key: "rdTitle", label: "Başlık", type: "text" },
          { key: "rdSections", label: "Bölümler", type: "cards" },
        ],
      },
      {
        title: "03 — Süreç",
        fields: [
          { key: "processEyebrow", label: "Etiket", type: "text" },
          { key: "processTitle", label: "Başlık", type: "text" },
          { key: "processSteps", label: "Adımlar", type: "list" },
          { key: "processNote", label: "Son adım notu", type: "textarea" },
        ],
      },
      {
        title: "Ekip (opsiyonel)",
        fields: [
          { key: "teamEyebrow", label: "Etiket", type: "text" },
          { key: "teamTitle", label: "Başlık", type: "text", help: "Ekip modülünde aktif üye yoksa bölüm gizlenir." },
        ],
      },
    ],
  },
  {
    slug: "hizmetler",
    label: "Hizmetler",
    path: "/hizmetler",
    note: "Sayfa başlığı, kart bölüm etiketleri, proje süreci ve SSS başlığı. Hizmet kartları Hizmetler, sorular SSS modülünden gelir.",
    groups: [
      header(),
      {
        title: "Hizmet kartları (bölüm etiketleri)",
        fields: [
          { key: "audienceLabel", label: "“Kime uygun” etiketi", type: "text" },
          { key: "deliverablesLabel", label: "“Ne teslim edilir” etiketi", type: "text" },
          { key: "processLabel", label: "“Süreç” etiketi", type: "text" },
          { key: "startLabel", label: "“Nasıl başlanır” etiketi", type: "text", help: "Kartların içeriği Hizmetler modülünden gelir; burada yalnızca dört bölümün adı düzenlenir." },
        ],
      },
      {
        title: "Proje süreci (kartların altında)",
        fields: [
          { key: "workEyebrow", label: "Etiket", type: "text" },
          { key: "workTitle", label: "Bölüm başlığı", type: "text" },
          { key: "workSteps", label: "Süreç adımları", type: "cards", help: "Sırayla numaralanır. Adım yoksa bölüm gizlenir." },
        ],
      },
      {
        title: "SSS",
        fields: [
          { key: "faqEyebrow", label: "Etiket", type: "text" },
          { key: "faqTitle", label: "Başlık", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "projeler",
    label: "Projeler",
    path: "/projeler",
    note: "Yalnızca sayfa başlığı — liste Projeler modülünden gelir.",
    groups: [header()],
  },
  {
    slug: "iletisim",
    label: "İletişim",
    path: "/iletisim",
    note: "Sayfa başlığı ve form metinleri — iletişim bilgileri Site Ayarları'ndan gelir.",
    groups: [
      header(),
      {
        title: "Form",
        fields: [
          { key: "formTitle", label: "Form başlığı", type: "text" },
          { key: "formHint", label: "Form üstü yardımcı metin", type: "textarea", help: "Form başlığının altında görünür. Boşsa gösterilmez." },
          { key: "formTopics", label: "Proje türü seçenekleri", type: "list", help: "Formdaki “Proje türü” seçim kutusu. Liste boşsa kutu gösterilmez. Her seçenek en çok 80 karakter." },
          { key: "consentText", label: "KVKK onay metni", type: "textarea", help: "\"KVKK Aydınlatma Metni\" ifadesi otomatik bağlantıya dönüşür." },
          { key: "successTitle", label: "Başarı başlığı", type: "text" },
          { key: "successDescription", label: "Başarı açıklaması", type: "text" },
        ],
      },
    ],
  },
  legal("aydinlatma-metni", "Aydınlatma Metni", "/aydinlatma-metni"),
  legal("gizlilik-politikasi", "Gizlilik Politikası", "/gizlilik-politikasi"),
  legal("cerez-politikasi", "Çerez Politikası", "/cerez-politikasi"),
];

export function getPageSchema(slug: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((schema) => schema.slug === slug);
}

/* ---------------- Public okuma yardımcıları ---------------- */

export function pageText(page: Page | null, key: string): string {
  const value = page?.fields?.[key];
  return typeof value === "string" ? value : "";
}

export function pageList(page: Page | null, key: string): string[] {
  const value = page?.fields?.[key];
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "") : [];
}

export function pageCards(page: Page | null, key: string): CardItem[] {
  const value = page?.fields?.[key];
  return Array.isArray(value)
    ? value.filter((v): v is CardItem => typeof v === "object" && v !== null && "title" in v)
    : [];
}
