import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Tüm içerik görselleri Cloudinary'den: next/image public_id alır, loader
    // f_auto,q_auto + genişlik transformasyonlu URL üretir. Uzak host
    // optimizasyonu kullanılmadığı için remotePatterns GEREKMEZ.
    loader: "custom",
    loaderFile: "./lib/cloudinary-image-loader.ts",
  },
  poweredByHeader: false,
  // Eski site URL'leri → yeni yapı (kalıcı 308)
  async redirects() {
    return [
      { source: "/projeler/e-ticaret", destination: "/projeler/dukan", permanent: true },
      { source: "/projeler/cetin-group-app", destination: "/projeler/isletmelere-ozel-yazilim", permanent: true },
      { source: "/projeler/yonetim-sistemleri", destination: "/projeler/isletmelere-ozel-yazilim", permanent: true },
    ];
  },
};

export default nextConfig;
