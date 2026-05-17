import type { Metadata } from "next"
import { LegalLayout } from "@/components/legal-layout"

export const metadata: Metadata = {
  title: "Aydınlatma Metni",
  description:
    "BAI Technology iletişim formu aracılığıyla işlenen kişisel verilere ilişkin 6698 sayılı KVKK kapsamında aydınlatma metni.",
  alternates: { canonical: "/aydinlatma-metni" },
  robots: { index: true, follow: true },
}

export default function AydinlatmaMetni() {
  return (
    <LegalLayout
      eyebrow="KVKK · Belge 01"
      title="İletişim Formu"
      italicWord="aydınlatma metni"
      updatedAt="17.05.2026"
      intro={
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;<strong>KVKK</strong>&rdquo;) uyarınca,
          iletişim formu aracılığıyla tarafımıza ilettiğiniz kişisel verilerin işlenmesine ilişkin
          olarak veri sorumlusu sıfatıyla sizi bilgilendirmek isteriz.
        </p>
      }
    >
      <h2>1. Veri Sorumlusu</h2>
      <p>
        Kişisel verileriniz, veri sorumlusu sıfatıyla <strong>BAI Technology</strong> (&ldquo;
        <strong>Şirket</strong>&rdquo; veya &ldquo;<strong>biz</strong>&rdquo;) tarafından, aşağıda
        açıklanan kapsam ve amaçlarla işlenmektedir.
      </p>
      <table>
        <tbody>
          <tr>
            <td>Unvan</td>
            <td className="notranslate">BAI Technology</td>
          </tr>
          <tr>
            <td>Adres</td>
            <td>Tekstil OSB Mahallesi 204. Cadde No:566/103 Merkez / Uşak, Türkiye</td>
          </tr>
          <tr>
            <td>E-posta</td>
            <td>
              <a href="mailto:info@baitech.com.tr" className="notranslate">
                info@baitech.com.tr
              </a>
            </td>
          </tr>
          <tr>
            <td>Telefon</td>
            <td className="notranslate">+90 532 369 4564</td>
          </tr>
          <tr>
            <td>Web</td>
            <td className="notranslate">baitech.com.tr</td>
          </tr>
        </tbody>
      </table>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <p>İletişim formunu doldurmanız halinde aşağıdaki kişisel verileriniz işlenmektedir:</p>
      <ul>
        <li>
          <strong>Kimlik bilgisi:</strong> Ad ve soyad
        </li>
        <li>
          <strong>İletişim bilgisi:</strong> E-posta adresi
        </li>
        <li>
          <strong>Talep/içerik bilgisi:</strong> İletişim formunda belirttiğiniz konu ve mesaj
          metninde tarafımıza aktardığınız bilgiler
        </li>
        <li>
          <strong>İşlem güvenliği bilgisi:</strong> IP adresi, tarayıcı bilgisi, gönderim zaman damgası
          (formun teknik kötüye kullanımının önlenmesi amacıyla sunucu kayıtlarında tutulur)
        </li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
      <ul>
        <li>İletişim taleplerinizin alınması, değerlendirilmesi ve tarafınıza geri dönüş sağlanması</li>
        <li>Talep ettiğiniz hizmet hakkında bilgi verilmesi, teklif iletilmesi</li>
        <li>Tarafınızla kurulabilecek ticari ilişkinin hazırlık aşamalarının yürütülmesi</li>
        <li>Hukuki yükümlülüklerin yerine getirilmesi, gerektiğinde yetkili kurum ve kuruluşlara bilgi verilmesi</li>
        <li>Form aracılığıyla gerçekleştirilebilecek kötüye kullanımın (spam, otomatik gönderim vb.) tespiti ve önlenmesi</li>
      </ul>

      <h2>4. Kişisel Verilerin İşlenmesinin Hukuki Sebebi</h2>
      <p>Kişisel verileriniz KVKK&rsquo;nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:</p>
      <ul>
        <li>
          <strong>Açık rızanız</strong> (m.5/1) &mdash; iletişim formunda ilgili kutucuğu işaretleyerek
          verdiğiniz onay
        </li>
        <li>
          <strong>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması</strong>
          (m.5/2-c) &mdash; teklif/hizmet talebinizin değerlendirilebilmesi için
        </li>
        <li>
          <strong>Veri sorumlusunun meşru menfaati</strong> (m.5/2-f) &mdash; iletişim talebinizin
          karşılanması ve form güvenliğinin sağlanması
        </li>
        <li>
          <strong>Hukuki yükümlülüğün yerine getirilmesi</strong> (m.5/2-ç) &mdash; mevzuattan
          kaynaklanan saklama ve bilgi verme yükümlülükleri
        </li>
      </ul>

      <h2>5. Kişisel Verilerin Aktarılması</h2>
      <p>
        Kişisel verileriniz, KVKK&rsquo;nın 8. ve 9. maddelerinde düzenlenen şartlara uygun olarak
        ve sadece aşağıda belirtilen amaçlarla sınırlı kalmak üzere aktarılabilir:
      </p>
      <ul>
        <li>
          <strong>E-posta altyapısı sağlayıcımız (Google LLC &mdash; Gmail / Workspace):</strong>
          {" "}İletişim formunuzdan gönderilen mesajın tarafımıza iletilmesi amacıyla. Bu hizmet
          sağlayıcı verileri Türkiye dışındaki sunucularda da işleyebilmektedir.
        </li>
        <li>
          <strong>Barındırma (hosting) sağlayıcımız:</strong> Web sitesinin sunulması ve sunucu
          kayıtlarının tutulması amacıyla. Bu hizmet sağlayıcı verileri yurt dışında bulunan
          sunucularda işleyebilmektedir.
        </li>
        <li>
          <strong>Hukuken yetkili kamu kurum ve kuruluşları:</strong> İlgili mevzuat hükümleri
          gereği talep edilmesi halinde.
        </li>
      </ul>
      <p className="note">
        Yurt dışına aktarım, KVKK&rsquo;nın 9. maddesi kapsamında ve açık rızanız çerçevesinde
        gerçekleştirilmektedir. Hizmet sağlayıcılar, sözleşmesel olarak veri güvenliği ve gizlilik
        yükümlülüklerine tabidir.
      </p>

      <h2>6. Kişisel Verilerin Toplanma Yöntemi</h2>
      <p>
        Kişisel verileriniz; web sitemiz <span className="notranslate">baitech.com.tr</span>{" "}
        üzerinde yer alan iletişim formunu doldurmanız ve formu göndermeniz suretiyle, elektronik
        ortamda otomatik ve kısmen otomatik yöntemlerle toplanmaktadır.
      </p>

      <h2>7. Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca ve her halükarda mevzuattan
        kaynaklanan zamanaşımı süreleri sonuna kadar saklanır. İletişim formundan ulaşan talep ve
        yazışmalar, ticari iletişimlerin makul süre boyunca arşivlenmesi amacıyla{" "}
        <strong>azami 3 (üç) yıl</strong> süreyle muhafaza edilir. Sürenin bitiminde veriler KVKK
        ve ilgili yönetmeliklere uygun şekilde silinir, yok edilir veya anonim hale getirilir.
      </p>

      <h2>8. İlgili Kişi Olarak Haklarınız</h2>
      <p>
        KVKK&rsquo;nın 11. maddesi uyarınca veri sorumlusuna başvurarak kendinizle ilgili aşağıdaki
        haklarınızı kullanabilirsiniz:
      </p>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
        <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
        <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
        <li>KVKK&rsquo;nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
        <li>Yapılan düzeltme, silme veya yok etme işlemlerinin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
        <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
        <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
      </ul>

      <h2>9. Başvuru Yöntemi</h2>
      <p>
        Yukarıda belirtilen haklarınızı kullanmak için talebinizi Veri Sorumlusuna Başvuru Usul ve
        Esasları Hakkında Tebliğ&rsquo;e uygun şekilde aşağıdaki yöntemlerden biriyle iletebilirsiniz:
      </p>
      <ul>
        <li>
          <strong>E-posta:</strong>{" "}
          <a href="mailto:info@baitech.com.tr" className="notranslate">
            info@baitech.com.tr
          </a>{" "}
          adresine, başvuru sahibinin kimliğini doğrulayan bilgilerle birlikte
        </li>
        <li>
          <strong>Posta:</strong> Tekstil OSB Mahallesi 204. Cadde No:566/103 Merkez / Uşak adresine
          ıslak imzalı dilekçe ile
        </li>
      </ul>
      <p>
        Talebiniz, niteliğine göre en kısa sürede ve her halükarda en geç 30 (otuz) gün içinde
        ücretsiz olarak sonuçlandırılır. Ancak işlemin ayrıca bir maliyeti gerektirmesi halinde,
        KVK Kurulu tarafından belirlenen tarifedeki ücret talep edilebilir.
      </p>

      <h2>10. Değişiklikler</h2>
      <p>
        İşbu aydınlatma metni, ihtiyaç duyulması halinde güncellenebilir. Güncel metin daima
        baitech.com.tr/aydinlatma-metni adresinde yayımlanır.
      </p>
    </LegalLayout>
  )
}
