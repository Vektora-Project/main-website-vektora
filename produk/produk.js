// Link halaman pembayaran (checkout Mayar) per produk.
// Kosong = tombol "Beli" diarahkan ke WhatsApp dan pembayaran diatur manual lewat chat.
// Setelah produk dibuat di Mayar, salin link produknya dari dashboard Mayar dan tempel di sini.
const LINK_BELI = {
  "template-kelola-kos": "",
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
