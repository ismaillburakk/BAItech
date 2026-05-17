import type { Metadata } from "next"
import Link from "next/link"
import { LegalLayout } from "@/components/legal-layout"

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "BAI Technology web sitesinde kişisel verilerinizin nasıl işlendiğine ilişkin gizlilik politikası.",
  alternates: { canonical: "/gizlilik-politikasi" },
  robots: { index: true, follow: true },
}

export default function GizlilikPolitikasi() {
  return (
    <LegalLayout
      eyebrow="KVKK · Belge 02"
      title="Gizlilik"
      italicWord="politikası"
      updatedAt="17.05.2026"
      intro={
        <p>
          BAI Technology olarak, kişisel verilerinizin gizliliğine ve güvenliğine önem veriyoruz.
          İşbu Gizlilik Politikası, <span className="notranslate">baitech.com.tr</span> web sitesini
          ziyaret etmeniz veya hizmetlerimizden faydalanmanız sırasında kişisel verilerinizin nasıl
          işlendiğini açıklamaktadır.
        </p>
      }
    >
      <h2>1. Kapsam</h2>
      <p>
        İşbu politika; <span className="notranslate">baitech.com.tr</span> web sitesi üzerinden
        toplanan, işlenen ve saklanan tüm kişisel veriler bakımından geçerlidir. Web sitemizin
        bağlantı verdiği üçüncü taraf siteler bu politikanın kapsamı dışındadır; söz konusu sitelerin
        kendi gizlilik politikalarına başvurmanızı öneririz.
      </p>

      <h2>2. Veri Sorumlusu</h2>
      <p>
        Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;)
        kapsamında, veri sorumlusu sıfatıyla{" "}
        <strong className="notranslate">BAI Technology</strong> tarafından işlenmektedir. İletişim
        bilgilerimiz aşağıdaki gibidir:
      </p>
      <ul>
        <li>Adres: Tekstil OSB Mahallesi 204. Cadde No:566/103 Merkez / Uşak, Türkiye</li>
        <li>
          E-posta:{" "}
          <a href="mailto:info@baitech.com.tr" className="notranslate">
            info@baitech.com.tr
          </a>
        </li>
        <li className="notranslate">Telefon: +90 532 369 4564</li>
      </ul>

      <h2>3. İşlenen Veri Kategorileri</h2>
      <p>Web sitemizi kullanmanız sırasında aşağıdaki kişisel veri kategorileri işlenebilir:</p>
      <ul>
        <li>
          <strong>İletişim verisi:</strong> İletişim formu üzerinden ilettiğiniz ad-soyad, e-posta
          adresi, konu ve mesaj içeriği.
        </li>
        <li>
          <strong>İşlem güvenliği verisi:</strong> Sunucu kayıtları kapsamında IP adresi, tarayıcı
          türü, işletim sistemi, ziyaret tarih/saati ve referans (referrer) bilgisi.
        </li>
        <li>
          <strong>Çerez verisi:</strong> Web sitemizin doğru çalışması ve tercihlerinizin
          hatırlanması amacıyla cihazınıza yerleştirilen çerezler aracılığıyla toplanan veriler.
          Ayrıntılı bilgi için{" "}
          <Link href="/cerez-politikasi">Çerez Politikası</Link> sayfamıza bakabilirsiniz.
        </li>
      </ul>

      <h2>4. Verilerin Toplanma Yöntemi</h2>
      <p>Kişisel verileriniz aşağıdaki kanallar üzerinden, otomatik veya kısmen otomatik yollarla toplanmaktadır:</p>
      <ul>
        <li>İletişim formunu doldurmanız</li>
        <li>E-posta veya telefon yoluyla bizimle iletişime geçmeniz</li>
        <li>Web sitemizi ziyaret etmeniz sırasında çerez teknolojileri</li>
        <li>Web sunucularımızın otomatik kayıtları</li>
      </ul>

      <h2>5. Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>İletişim taleplerinizin alınması ve yanıtlanması</li>
        <li>Sunduğumuz hizmetlere ilişkin sorularınızın cevaplandırılması ve teklif iletilmesi</li>
        <li>Yasal yükümlülüklerimizin yerine getirilmesi</li>
        <li>Web sitemizin güvenliğinin sağlanması, kötüye kullanım girişimlerinin tespiti</li>
        <li>Kullanıcı deneyiminin iyileştirilmesi (tema/dil tercihlerinin hatırlanması vb.)</li>
      </ul>

      <h2>6. Verilerin İşlenmesinin Hukuki Sebebi</h2>
      <p>
        Kişisel verileriniz KVKK&rsquo;nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere
        dayanılarak işlenmektedir:
      </p>
      <ul>
        <li>Açık rızanız (m.5/1)</li>
        <li>
          Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (m.5/2-c) &mdash;
          tarafınızla kurulabilecek ticari ilişki çerçevesinde
        </li>
        <li>
          Veri sorumlusunun meşru menfaati (m.5/2-f) &mdash; iletişim taleplerinizin karşılanması,
          web sitesi güvenliğinin sağlanması
        </li>
        <li>Hukuki yükümlülüğün yerine getirilmesi (m.5/2-ç)</li>
      </ul>

      <h2>7. Üçüncü Taraflarla Paylaşım ve Yurt Dışına Aktarım</h2>
      <p>
        Kişisel verileriniz, yalnızca yasal yükümlülüklerimiz ve hizmetlerimizin sürdürülmesi için
        gerekli olduğu ölçüde aşağıdaki taraflarla paylaşılabilir:
      </p>
      <ul>
        <li>
          <strong>E-posta hizmet sağlayıcısı (Google LLC):</strong> İletişim formundan gelen mesajları
          almak amacıyla Gmail / Google Workspace altyapısı kullanılmaktadır. Verileriniz, Google
          tarafından yurt dışında bulunan sunucularda işlenebilir.
        </li>
        <li>
          <strong>Web sitesi barındırma sağlayıcısı:</strong> Web sitemiz uluslararası bir bulut
          barındırma sağlayıcısı üzerinde çalışmakta olup sunucu kayıtları yurt dışında işlenebilir.
        </li>
        <li>
          <strong>Çeviri hizmeti (GTranslate / Google Translate):</strong> Dil değiştirme aracını
          kullanmanız halinde sayfa içeriğinin çevirisi amacıyla Google&rsquo;a istek gönderilir;
          bu kapsamda IP adresiniz Google sunucularına iletilir.
        </li>
        <li>
          <strong>Yetkili kamu kurum ve kuruluşları:</strong> İlgili mevzuat çerçevesinde talep
          edilmesi halinde.
        </li>
      </ul>
      <p className="note">
        Yurt dışına aktarım, KVKK&rsquo;nın 9. maddesi kapsamında ve açık rızanız çerçevesinde
        gerçekleştirilmektedir. Üçüncü taraf hizmet sağlayıcıları, sözleşmesel olarak KVKK
        düzeyinde veya buna eşdeğer güvenlik standartlarına tabidir.
      </p>

      <h2>8. Saklama Süresi</h2>
      <p>
        Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve her halükarda mevzuattan
        kaynaklanan zamanaşımı süreleri sonuna kadar saklanır. İletişim talepleri için bu süre
        kural olarak <strong>3 (üç) yıldır</strong>. Sürenin sonunda veriler KVKK&rsquo;ya uygun
        olarak silinir, yok edilir veya anonim hale getirilir.
      </p>

      <h2>9. Veri Güvenliği</h2>
      <p>
        Kişisel verilerinizin hukuka aykırı işlenmesini, erişilmesini ve kaybolmasını önlemek
        amacıyla uygun teknik ve idari tedbirleri almaktayız. Bu kapsamda:
      </p>
      <ul>
        <li>Sunucu ve veri aktarımlarında SSL/TLS şifreleme kullanılmaktadır</li>
        <li>Sistemlere erişim ilkesel olarak yetkili personelle sınırlandırılmıştır</li>
        <li>Üçüncü taraf hizmet sağlayıcıları sözleşmesel veri koruma yükümlülüklerine tabidir</li>
        <li>İhlal durumunda yasal süreler içinde KVK Kurulu&rsquo;na bildirim yapılır</li>
      </ul>

      <h2>10. İlgili Kişi Olarak Haklarınız</h2>
      <p>
        KVKK&rsquo;nın 11. maddesi kapsamında sahip olduğunuz haklara ve başvuru usulüne ilişkin
        ayrıntılı bilgi için{" "}
        <Link href="/aydinlatma-metni">Aydınlatma Metni</Link>&rsquo;ne bakabilirsiniz.
      </p>

      <h2>11. Politikadaki Değişiklikler</h2>
      <p>
        BAI Technology, işbu Gizlilik Politikası&rsquo;nı dilediği zaman güncelleyebilir.
        Güncellemeler, web sitemizde yayımlandığı tarihte yürürlüğe girer. Önemli değişikliklerde
        kullanıcılar uygun yollarla bilgilendirilir.
      </p>

      <h2>12. İletişim</h2>
      <p>
        Gizlilik Politikası&rsquo;na ilişkin soru, talep ve şikayetleriniz için bize{" "}
        <a href="mailto:info@baitech.com.tr" className="notranslate">
          info@baitech.com.tr
        </a>{" "}
        adresinden ulaşabilirsiniz.
      </p>
    </LegalLayout>
  )
}
