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


// TAMBAH PROYEK
const btnTambahProyek = document.getElementById('btnTambahProyek');
const modalProyek = document.getElementById('modalProyek');
const btnBatalProyek = document.getElementById('btnBatalProyek');
const btnSimpanProyek = document.getElementById('btnSimpanProyek');
const projectGrid = document.getElementById('projectGrid');

btnTambahProyek.addEventListener('click', () => {
  modalProyek.classList.add('active');
});

btnBatalProyek.addEventListener('click', () => {
  modalProyek.classList.remove('active');
});

btnSimpanProyek.addEventListener('click', () => {
  const nama = document.getElementById('inputNamaProyek').value.trim();
  const desk = document.getElementById('inputDeskProyek').value.trim();
  const deadline = document.getElementById('inputDeadlineProyek').value;
  const status = document.getElementById('inputStatusProyek').value;

  if (!nama || !deadline) {
    alert('Nama proyek dan deadline wajib diisi!');
    return;
  }

  const statusMap = {
    pending: { label: 'Belum Mulai', badge: 'badge-pending', progress: 0 },
    progress: { label: 'Berjalan', badge: 'badge-progress', progress: 50 },
    done: { label: 'Selesai', badge: 'badge-done', progress: 100 }
  };
  const s = statusMap[status];

  const deadlineFormatted = new Date(deadline).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const card = document.createElement('div');
  card.classList.add('project-card');
  card.innerHTML = `
    <div class="project-header">
      <h3>${nama}</h3>
      <span class="badge ${s.badge}">${s.label}</span>
    </div>
    <p class="project-desc">${desk}</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${s.progress}%;"></div>
    </div>
    <div class="project-footer">
      <span>${s.progress}% selesai</span>
      <span>Deadline: ${deadlineFormatted}</span>
    </div>
  `;

  projectGrid.appendChild(card);

  document.getElementById('inputNamaProyek').value = '';
  document.getElementById('inputDeskProyek').value = '';
  document.getElementById('inputDeadlineProyek').value = '';
  modalProyek.classList.remove('active');
});
