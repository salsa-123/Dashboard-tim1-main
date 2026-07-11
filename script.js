// Ambil semua tombol menu di sidebar dan semua halaman
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

// Ganti halaman yang aktif saat menu diklik
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    const targetPage = item.getAttribute('data-page');

    // Hapus status "active" dari semua menu, lalu aktifkan yang diklik
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Sembunyikan semua halaman, lalu tampilkan halaman yang dipilih
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('page-' + targetPage).classList.add('active');

    // Ganti judul di topbar sesuai nama menu
    pageTitle.textContent = item.textContent.trim();

    // Tutup sidebar otomatis di tampilan mobile setelah memilih menu
    sidebar.classList.remove('open');
  });
});

// Tombol hamburger untuk buka/tutup sidebar di layar kecil (mobile)
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
