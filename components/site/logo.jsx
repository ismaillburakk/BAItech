import Image from "next/image"

/**
 * BAI logosu + kelime işareti. Logo Site Ayarları'ndan (Cloudinary) gelir;
 * yüklenmemişse yerel /img/bai-logo.png kullanılır.
 */
/** @param {any} props */
export function Logo({ className = "", logo = null }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src={logo?.public_id ?? "/img/bai-logo.png"}
        alt=""
        width={32}
        height={32}
        priority
        unoptimized={!logo}
        className="size-8 object-contain"
      />
      <span className="whitespace-nowrap font-heading text-[1.0625rem] font-semibold tracking-tight text-foreground">
        BAI <span className="font-normal text-muted-foreground">Teknoloji</span>
      </span>
    </span>
  )
}
