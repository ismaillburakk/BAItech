import type { Metadata } from "next"
import Link from "next/link"
import { LegalLayout } from "@/components/legal-layout"

export const metadata: Metadata = {
  title: "Çerez Politikası",
  description:
    "BAI Technology web sitesinde kullanılan çerezler, kategorileri ve çerez tercihlerinizi nasıl yönetebileceğiniz hakkında bilgi.",
  alternates: { canonical: "/cerez-politikasi" },
  robots: { index: true, follow: true },
}

export default function CerezPolitikasi() {
  return (
    <LegalLayout
      eyebrow="KVKK · Belge 03"
      title="Çerez"
      italicWord="politikası"
      updatedAt="17.05.2026"
      intro={
        <p>
          Bu Çerez Politikası, <span className="notranslate">baitech.com.tr</span> üzerinde
          kullandığımız çerezleri, bunların hangi amaçlarla kullanıldığını ve çerez tercihlerinizi
          nasıl yönetebileceğinizi açıklar. Politika, 6698 sayılı KVKK ve Kişisel Verileri Koruma
          Kurumu&rsquo;nun{" "}
          <em>Çerez Uygulamaları Hakkında Rehber</em>&rsquo;i ile uyumlu olarak hazırlanmıştır.
        </p>
      }
    >
      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler; bir web sitesini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza (bilgisayar,
        telefon, tablet vb.) yerleştirilen küçük metin dosyalarıdır. Çerezler, sitenin işlevselliği
        için gerekli bilgileri saklamak, kullanım tercihlerinizi hatırlamak ve ziyaret deneyiminizi
        iyileştirmek amacıyla kullanılır.
      </p>
      <p>
        Çerezler, &ldquo;<strong>oturum çerezleri</strong>&rdquo; (tarayıcı kapatıldığında silinen)
        ve &ldquo;<strong>kalıcı çerezler</strong>&rdquo; (belirli bir tarihe veya silinene kadar
        cihazda kalan) olarak ikiye ayrılır. Ayrıca, yerleştirildikleri taraf bakımından{" "}
        <strong>birinci taraf</strong> (siteyi ziyaret ettiğiniz alan adı tarafından yerleştirilen)
        ve <strong>üçüncü taraf</strong> (siteye gömülü hizmetler tarafından yerleştirilen) çerezler
        olarak da sınıflandırılır.
      </p>

      <h2>2. Web Sitemizde Kullanılan Çerezler</h2>
      <p>
        Web sitemizde aşağıdaki çerez kategorileri kullanılmaktadır. Yalnızca <em>zorunlu</em>{" "}
        çerezler sizin onayınız olmadan çalışır; diğer çerezler ancak çerez bandında verdiğiniz
        açık rıza ile etkinleştirilir.
      </p>

      <h3>2.1 Zorunlu Çerezler (Açık rıza gerekmez)</h3>
      <table>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Amaç</th>
            <th>Süre</th>
            <th>Tip</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="notranslate">bai-theme</td>
            <td>Açık/koyu tema tercihinizi hatırlar.</td>
            <td>Kalıcı (silene kadar)</td>
            <td>Birinci taraf (localStorage)</td>
          </tr>
          <tr>
            <td className="notranslate">bai-consent</td>
            <td>Çerez bandındaki tercihinizi (kabul/ret) hatırlar; bandın tekrar gösterilmesini engeller.</td>
            <td>12 ay</td>
            <td>Birinci taraf (localStorage)</td>
          </tr>
        </tbody>
      </table>

      <h3>2.2 Fonksiyonel Çerezler (Açık rıza ile etkinleşir)</h3>
      <table>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Amaç</th>
            <th>Süre</th>
            <th>Tip</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="notranslate">googtrans</td>
            <td>
              GTranslate / Google Translate aracılığıyla seçtiğiniz dilin hatırlanması ve sayfanın
              çevirisi.
            </td>
            <td>Oturum / 1 yıl</td>
            <td>Üçüncü taraf (Google)</td>
          </tr>
        </tbody>
      </table>

      <h2>3. Üçüncü Taraf Çerezler ve Yurt Dışına Aktarım</h2>
      <p>
        Web sitemizde dil çevirisi için <strong className="notranslate">GTranslate</strong>{" "}
        aracılığıyla Google Translate altyapısı kullanılmaktadır. Bu hizmeti kullanmanız halinde
        IP adresiniz ve sayfa içeriğine ilişkin bilgiler Google sunucularına aktarılır; bu
        sunucular Türkiye dışında konumlanabilmektedir.
      </p>
      <p>
        Üçüncü taraf çerez kullanımı, fonksiyonel çerezleri kabul etmeniz halinde etkin olur.
        Çerez tercihinizi reddetmeniz halinde GTranslate aracı yüklenmez ve Google&rsquo;a herhangi
        bir veri gönderilmez.
      </p>

      <h2>4. Çerez Tercihlerinizi Nasıl Yönetirsiniz?</h2>
      <p>Çerez tercihlerinizi aşağıdaki yöntemlerle yönetebilirsiniz:</p>
      <ul>
        <li>
          <strong>Çerez bandı üzerinden:</strong> Site ilk açıldığında görüntülenen çerez bandında{" "}
          <em>Tümünü Kabul Et</em>, <em>Reddet</em> veya <em>Tercihler</em> seçeneklerini
          kullanabilirsiniz.
        </li>
        <li>
          <strong>Tercihinizi sonradan değiştirmek için:</strong> Tarayıcınızdaki localStorage
          ayarlarından <span className="notranslate">bai-consent</span> kaydını silerek bandı
          yeniden görüntüleyebilir, ya da bize{" "}
          <a href="mailto:info@baitech.com.tr" className="notranslate">
            info@baitech.com.tr
          </a>{" "}
          adresinden ulaşabilirsiniz.
        </li>
        <li>
          <strong>Tarayıcı ayarları üzerinden:</strong> Çoğu tarayıcı çerezleri otomatik olarak
          kabul etmektedir; ancak ayarlar üzerinden çerezleri reddedebilir, silebilir veya
          yerleştirilmeden önce uyarı almasını sağlayabilirsiniz. Her tarayıcının yöntemi farklıdır;
          kullandığınız tarayıcının yardım sayfalarını inceleyebilirsiniz.
        </li>
      </ul>
      <p className="note">
        Zorunlu çerezleri devre dışı bırakmanız halinde web sitemizin bazı işlevleri (örneğin tema
        tercihinin hatırlanması) düzgün çalışmayabilir.
      </p>

      <h2>5. Verilerin Saklanması ve Korunması</h2>
      <p>
        Çerezler aracılığıyla elde edilen verilerin saklanma süreleri yukarıdaki tabloda
        belirtilmiştir. Bu veriler, kişisel verilerinizin korunması amacıyla uygun teknik ve idari
        tedbirlerle korunmaktadır.
      </p>

      <h2>6. İletişim ve Daha Fazla Bilgi</h2>
      <p>
        Çerez kullanımına ilişkin sorularınız ve haklarınızı kullanma talepleriniz için{" "}
        <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link> ve{" "}
        <Link href="/aydinlatma-metni">Aydınlatma Metni</Link>&rsquo;ne başvurabilir, ayrıca{" "}
        <a href="mailto:info@baitech.com.tr" className="notranslate">
          info@baitech.com.tr
        </a>{" "}
        adresinden bizimle iletişime geçebilirsiniz.
      </p>

      <h2>7. Politikadaki Değişiklikler</h2>
      <p>
        İşbu Çerez Politikası ihtiyaç duyulduğunda güncellenir. Önemli değişikliklerde çerez
        bandı yeniden gösterilerek tercihinizi tazelemenizi rica ederiz.
      </p>
    </LegalLayout>
  )
}
