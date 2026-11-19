import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BAI Technology — Yazılım ve Yapay Zeka",
    short_name: "BAI",
    description: "BAI Technology (BAI Teknoloji): mobil uygulama, web, özel yazılım ve kendi eğittiği yapay zeka modelleri.",
    start_url: "/",
    display: "standalone",
    background_color: "#050b18",
    theme_color: "#050b18",
    lang: "tr-TR",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/bai-logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
