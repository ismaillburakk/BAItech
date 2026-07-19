export type Service = {
  n: string
  title: string
  body: string
}

// Tek kaynak: hem /hizmetler kartları hem JSON-LD hizmet kataloğu buradan beslenir.
// Konumlandırma: yazılım geliştirme ana iş; yapay zeka model geliştirme bunun bir
// parçası (hazır servis tüketmiyoruz, kendi modellerimizi eğitiyoruz).
export const services: Service[] = [
  {
    n: "001",
    title: "Mobil Uygulama Geliştirme",
    body: "iOS ve Android için native mobil uygulamalar geliştiriyoruz; App Store ve Google Play'de yayında ürünlerimiz bunun kanıtı.",
  },
  {
    n: "002",
    title: "Web Geliştirme",
    body: "Kurumsal sitelerden çok kullanıcılı yönetim panellerine kadar, arka planda gerçek iş yapan web yazılımları geliştiriyoruz.",
  },
  {
    n: "003",
    title: "Özel Yazılım",
    body: "İşletmenizin sürecine göre baştan tasarlanan, hazır paketlerin çözemediği talebe özel yazılımlar geliştiriyoruz.",
  },
  {
    n: "004",
    title: "E-Ticaret Altyapısı",
    body: "Markanıza özel, tek kiracılı e-ticaret altyapıları kuruyoruz; ürün, sipariş, stok ve ödeme tek sistemde birleşir.",
  },
  {
    n: "005",
    title: "Yapay Zeka Modelleri",
    body: "Görüntü ve dil tabanlı yapay zeka modellerini sıfırdan eğitiyoruz; süreç otomasyonu ve veri analizini hazır servislerle değil, kendi modellerimizle çözeriz.",
  },
]

// JSON-LD hizmet kataloğu doğrudan 5 hizmetten beslenir (ayrı ekstra kalem yok).
export const serviceCatalogItems: Pick<Service, "title" | "body">[] = services.map(
  ({ title, body }) => ({ title, body })
)
