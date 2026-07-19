"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Eski tek-sayfa dönemindeki anchor linkleri yeni route'lara taşır.
// "#contact" bilinçli olarak listede yok: iletişim section'ı ana sayfada duruyor.
const HASH_ROUTES: Record<string, string> = {
  "#services": "/hizmetler",
  "#projects": "/projeler",
  "#about": "/hakkimizda",
  "#baseline": "/projeler/baseline",
  "#bukira": "/projeler/bukira",
  "#gymbot": "/projeler/gymbot",
  "#dukan": "/projeler/dukan",
  "#chatekg": "/projeler/chatekg",
  // Eski slug'lar → yeni projeler
  "#e-ticaret": "/projeler/dukan",
  "#cetin-group-app": "/projeler/isletmelere-ozel-yazilim",
  "#yonetim-sistemleri": "/projeler/isletmelere-ozel-yazilim",
  "#isletmelere-ozel-yazilim": "/projeler/isletmelere-ozel-yazilim",
}

export function HashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const target = HASH_ROUTES[window.location.hash]
    if (target) router.replace(target)
  }, [router])

  return null
}
