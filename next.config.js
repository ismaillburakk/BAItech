/** @type {import('next').NextConfig} */
const nextConfig = {
  // Site yalnızca yerel görsel kullanır; uzak host'lara next/image optimizasyonu
  // açmak (remotePatterns "**") açık image-proxy riski olduğundan kaldırıldı.
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Eski proje slug'ları yeni slug'lara kalıcı (308) yönlendirilir.
  async redirects() {
    return [
      {
        source: "/projeler/e-ticaret",
        destination: "/projeler/dukan",
        permanent: true,
      },
      {
        source: "/projeler/cetin-group-app",
        destination: "/projeler/isletmelere-ozel-yazilim",
        permanent: true,
      },
      {
        source: "/projeler/yonetim-sistemleri",
        destination: "/projeler/isletmelere-ozel-yazilim",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
