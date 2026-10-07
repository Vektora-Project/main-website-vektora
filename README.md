# Main Website — Vektora

Website resmi Vektora Project: **https://vektoraproject.com**

Studio sistem digital dari Bandung: implementasi ERP, aplikasi internal, dashboard, dan integrasi data untuk operasional bisnis.

## Teknologi
- HTML, CSS, dan JavaScript statis, tanpa build step
- Animasi: GSAP + ScrollTrigger; smooth scroll Lenis (khusus desktop) — dimuat via CDN
- Font: Anton + Space Grotesk (Google Fonts)
- Hosting: Cloudflare Workers (static assets) dengan domain `vektoraproject.com` dan `www.vektoraproject.com`
- Mode ringan otomatis di HP/layar sentuh (class `is-lite`) supaya animasi tetap mulus

## Struktur
index.html halaman utama
css/style.css tampilan & warna brand
js/main.js animasi & interaksi
assets/logo-mark.png logo terang (untuk latar gelap)
assets/logo-mark-ink.png logo warna asli (untuk latar terang & favicon)
demo/ demo produk yang bisa dicoba (HASIL BUILD dari repo demo-produk — jangan edit di sini)
wrangler.jsonc konfigurasi Cloudflare Worker
.assetsignore file yang tidak ikut dipublikasikan

## Warna brand
| Peran | Warna |
|---|---|
| Hitam (latar utama) | `#05090D` |
| Biru Vektora | `#014468` |
| Biru terang (aksen di latar gelap) | `#3FA3DB` |
| Putih | `#EEF3F6` |

## Menjalankan lokal
```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

## Deploy
Otomatis: setiap push ke branch `main` dibangun oleh Cloudflare Workers Builds dan tayang di vektoraproject.com dalam ±1 menit.

Penting:
- Jangan ubah `"name": "vektora-portfolio"` di `wrangler.jsonc` — domain terpasang di Worker dengan nama itu.
- File yang tidak boleh terlihat publik didaftarkan di `.assetsignore`.

## Mengubah isi
- **Karya:** `index.html` → bagian `<section class="works">`; satu `<article class="card">` = satu karya.
- **Produk:** `index.html` → bagian `<section class="products">`; satu `<article class="prod">` = satu produk.
  - Produk yang dipesan lewat konsultasi: tombol "Coba demo" + "Konsultasi" (WhatsApp). Harga tidak dicantumkan.
  - Produk digital yang dibeli langsung (template, dll.): isi harga di `.prod__price`, ubah label `Segera hadir` jadi `Tersedia`, dan arahkan tombol utama ke halaman pembayaran (Mayar, Lynk.id, Shopee, dll.).
  - Produk yang belum siap diberi label `Segera hadir` dan tombol "Kabari saya".
- **Demo** (`/demo/`): dibuat dari repo `Vektora-Project/demo-produk`. Ubah di sana (`sumber/src/`), lalu jalankan
  `python3 sumber/build.py --web-utama ../main-website-vektora/demo` dan commit folder `demo/` di repo ini.
  Semua demo memakai perusahaan dan angka fiktif, dengan label "Demo · data contoh".
- **Label jujur** (`Dipakai operasional`, `Demo produk`, `Dalam pengembangan`) dipertahankan. Studi kasus klien hanya ditambahkan setelah ada izin tertulis dari klien.
- **Kontak** (email, WhatsApp, Instagram): di hero dan footer `index.html`, serta nomor WhatsApp untuk form di `js/main.js`.

---
© 2026 Vektora Project
