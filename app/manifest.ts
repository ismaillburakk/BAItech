import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri",
    short_name: "BAI Technology",
    description: "Yapay zeka destekli özel yazılım çözümleri. ChatEKG, GymBot, web ve mobil yönetim sistemleri.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  }
}
