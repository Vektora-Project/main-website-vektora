// Link halaman pembayaran (checkout Mayar) per produk.
// Kosong = tombol "Beli" diarahkan ke WhatsApp dan pembayaran diatur manual lewat chat.
// Setelah produk dibuat di Mayar, salin link produknya dari dashboard Mayar dan tempel di sini.
const LINK_BELI = {
  "template-kelola-kos": "https://vektora-project.myr.id/pl/template-kelola-kos-excel-google-sheets",
  "template-kpi-karyawan": "https://vektora-project.myr.id/pl/template-kpi-karyawan-excel-google-sheets",
  "template-rab-bangunan": "https://vektora-project.myr.id/pl/template-rab-bangunan-excel-google-sheets",
  "template-keuangan-pribadi": "https://vektora-project.myr.id/pl/template-keuangan-pribadi-excel-google-sheets",
};

document.querySelectorAll("[data-beli]").forEach((el) => {
  const link = LINK_BELI[el.dataset.beli];
  if (!link) return;
  el.href = link;
  el.target = "_blank";
  el.rel = "noopener";
});

// Keterangan cara bayar: tampilkan yang sesuai (WhatsApp atau Mayar).
document.querySelectorAll("[data-cara]").forEach((el) => {
  const link = LINK_BELI[el.dataset.produk];
  el.hidden = (el.dataset.cara === "mayar") !== Boolean(link);
});

// Katalog (/produk/): jumlah produk per kelompok di tombol atas.
document.querySelectorAll("[data-hitung]").forEach((el) => {
  const kelompok = document.getElementById(el.dataset.hitung);
  if (kelompok) el.textContent = kelompok.querySelectorAll(".prod").length;
});
