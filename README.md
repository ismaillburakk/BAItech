# BAI Teknoloji — kurumsal web sitesi

Next.js 16 (App Router) + Firebase (Auth, Firestore) + Cloudinary + Resend. Tüm içerik `/admin` panelinden yönetilir; public sayfalar SSR/ISR ile üretilir, panel kaydı on-demand revalidate tetikler.

## Kurulum

```bash
npm install
cp .env.example .env   # değerleri doldurun
npm run dev            # http://localhost:3000 — panel: /admin
```

## Script'ler

| Komut | Açıklama |
|---|---|
| `npm run build` / `start` | Üretim derlemesi / sunucusu |
| `npm run typecheck`, `npm run lint` | TypeScript / ESLint |
| `npm run set-admin-claim [-- e-posta] [--revoke]` | Firebase Auth kullanıcısına `admin: true` claim'i atar / kaldırır |
| `npm run deploy-rules` | `firestore.rules` dosyasını yayınlar |
| `npm run seed [-- --force] [--only=faq,pages]` | İlk içerik yüklemesi (bir kez çalıştırıldı) |
| `npm run cleanup-orphans [-- --apply]` | Cloudinary'de referanssız `bai/` görsellerini bulur / siler |
| `npm run test:e2e` | Panel uçtan uca testi (sunucu `localhost:3100`'de açıkken) |
| `npm run test:audit` | Mobil + SEO denetimi (7 viewport × 15 rota) |
| `node tests/behavior.mjs` | JS kapalı SSR, reduced-motion, mobil menü, swipe, yönlendirme |

## Yapı

- `app/(site)` public site · `app/admin` panel (proxy.ts + layout'ta admin claim doğrulaması)
- `app/api/admin/*` session, revalidate, Cloudinary silme · `app/api/contact-notify` Resend
- `lib/db/*` koleksiyon CRUD (client) + `public.ts` (server, Admin SDK) · `lib/seo.ts` metadata + JSON-LD
- `lib/page-schemas.ts` sayfa alan şemaları (panel formu bu şemadan üretilir)
- `types/index.ts` veri modeli · `firestore.rules` güvenlik kuralları
