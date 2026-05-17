import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BAI Technology - Yapay Zeka ve Özel Yazılım Çözümleri",
    short_name: "BAI Technology",
    description: "Yapay zeka destekli özel yazılım çözümleri. ChatEKG, GymBot, web ve mobil yönetim sistemleri.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f4ee",
    theme_color: "#f7f4ee",
    icons: [
      {
        src: "/favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  }
}
