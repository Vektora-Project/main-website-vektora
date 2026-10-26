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
produk/ katalog produk (index.html) dan halaman produk digital yang bisa dibeli
wrangler.jsonc konfigurasi Cloudflare Worker
robots.txt, sitemap.xml, llms.txt  SEO & GEO (lihat bagian "Mengubah isi")
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
- **Produk:** katalog lengkap ada di `produk/index.html` (vektoraproject.com/produk/); satu `<article class="prod">` = satu produk.
  - Kelompok `#siap-dibeli`: produk digital yang dibayar langsung (template, dll.). Isi harga di `.prod__price` dan tombol ke halaman produknya di `produk/<nama-produk>/`.
  - Kelompok `#bisa-dipesan`: aplikasi yang dipesan lewat konsultasi. Tombol "Coba demo" + "Konsultasi" (WhatsApp). Harga tidak dicantumkan.
  - Jumlah produk di tombol atas katalog dihitung otomatis. Kalau satu kelompok hanya berisi satu produk, kartunya otomatis melebar. Kalau tepat empat produk, kartunya dua kolom.
  - Halaman utama (`index.html`, `<section class="products">`) hanya menampilkan 3 produk pilihan + kartu "Semua produk", supaya tidak memanjang saat produk bertambah. Ganti produk pilihan di sana bila perlu, jangan menambah kartu.
- **Halaman produk digital** (`/produk/`): satu folder per produk, gaya bersama di `produk/produk.css`.
  - Link checkout Mayar diisi di `produk/produk.js` (`LINK_BELI`). Selama kosong, tombol "Beli sekarang" membuka WhatsApp dan pembayaran diatur lewat chat.
  - File produknya sendiri (mis. `.xlsx`) **tidak** disimpan di repo ini karena repo ini terbit di website. Sumbernya ada di repo `Vektora-Project/demo-produk` folder `produk/`, dan filenya diunggah ke Mayar.
  - `Template Kelola Kos`: gambar di `produk/template-kelola-kos/img/` adalah tangkapan layar file contoh (kos fiktif).
  - `Template KPI Karyawan`, `Template RAB Bangunan`, `Template Keuangan Pribadi`, `Template Administrasi Proyek`: gambar di folder `img/` masing-masing juga tangkapan layar file contoh (usaha, proyek, dan orang fiktif).
- **Demo** (`/demo/`): dibuat dari repo `Vektora-Project/demo-produk`. Ubah di sana (`sumber/src/`), lalu jalankan
  `python3 sumber/build.py --web-utama ../main-website-vektora/demo` dan commit folder `demo/` di repo ini.
  Semua demo memakai perusahaan dan angka fiktif, dengan label "Demo · data contoh".
- **Label jujur** (`Dipakai operasional`, `Demo produk`, `Dalam pengembangan`) dipertahankan. Studi kasus klien hanya ditambahkan setelah ada izin tertulis dari klien.
- **SEO & GEO** (supaya mudah ditemukan Google, Bing, dan asisten AI):
  - `index.html` `<head>`: title, description, canonical, Open Graph (`assets/og.jpg`), dan JSON-LD `@graph` (ProfessionalService + WebSite + FAQPage).
  - Bagian FAQ dan "Fakta singkat" di halaman utama (`<section class="faq">`). Isi FAQ **harus sama** dengan FAQPage di JSON-LD dan dengan `llms.txt`.
  - `robots.txt` (semua bot, termasuk bot AI, diizinkan), `sitemap.xml` (tambahkan URL saat ada produk/demo baru, perbarui `lastmod`), dan `llms.txt` (ringkasan situs untuk AI).
- **Kontak** (email, WhatsApp, Instagram): di hero dan footer `index.html`, serta nomor WhatsApp untuk form di `js/main.js`.

---
© 2026 Vektora Project
