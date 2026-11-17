/** Site rotaları — yapı koddadır (route = kod), etiketler sabit menü öğeleridir. */
export const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/projeler", label: "Projeler" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const LEGAL_NAV = [
  { href: "/aydinlatma-metni", label: "Aydınlatma Metni" },
  { href: "/gizlilik-politikasi", label: "Gizlilik Politikası" },
  { href: "/cerez-politikasi", label: "Çerez Politikası" },
] as const;
