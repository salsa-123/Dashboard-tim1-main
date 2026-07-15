// ===========================
// NAVIGASI SIDEBAR & HALAMAN
// ===========================
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const pageTitle = document.getElementById('pageTitle');
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();

    const targetPage = item.getAttribute('data-page');
    if (!targetPage) return;

    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    pages.forEach(page => page.classList.remove('active'));
    const target = document.getElementById('page-' + targetPage);
    if (target) target.classList.add('active');

    if (pageTitle) pageTitle.textContent = item.textContent.trim();

    if (sidebar) sidebar.classList.remove('open');
  });
});

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}


// ===========================
// TAMBAH PROYEK
// ===========================
const btnTambahProyek = document.getElementById('btnTambahProyek');
const modalProyek = document.getElementById('modalProyek');
const btnBatalProyek = document.getElementById('btnBatalProyek');
const btnSimpanProyek = document.getElementById('btnSimpanProyek');
const projectGrid = document.getElementById('projectGrid');

if (btnTambahProyek && modalProyek) {
  btnTambahProyek.addEventListener('click', () => {
    modalProyek.classList.add('active');
  });
}

if (btnBatalProyek && modalProyek) {
  btnBatalProyek.addEventListener('click', () => {
    modalProyek.classList.remove('active');
  });
}

if (btnSimpanProyek && projectGrid) {
  btnSimpanProyek.addEventListener('click', () => {
    const inputNama = document.getElementById('inputNamaProyek');
    const inputDesk = document.getElementById('inputDeskProyek');
    const inputDeadline = document.getElementById('inputDeadlineProyek');
    const inputStatus = document.getElementById('inputStatusProyek');

    if (!inputNama || !inputDeadline || !inputStatus) return;

    const nama = inputNama.value.trim();
    const desk = inputDesk ? inputDesk.value.trim() : '';
    const deadline = inputDeadline.value;
    const status = inputStatus.value;

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

    inputNama.value = '';
    if (inputDesk) inputDesk.value = '';
    inputDeadline.value = '';
    modalProyek.classList.remove('active');
  });
}


// ===========================
// TAMBAH TUGAS
// ===========================
const btnTambahTugas = document.getElementById('btnTambahTugas');
const modalTugas = document.getElementById('modalTugas');
const btnBatalTugas = document.getElementById('btnBatalTugas');
const btnSimpanTugas = document.getElementById('btnSimpanTugas');
const taskTableBody = document.getElementById('taskTableBody');

if (btnTambahTugas && modalTugas) {
  btnTambahTugas.addEventListener('click', () => {
    modalTugas.classList.add('active');
  });
}

if (btnBatalTugas && modalTugas) {
  btnBatalTugas.addEventListener('click', () => {
    modalTugas.classList.remove('active');
  });
}

if (btnSimpanTugas && taskTableBody) {
  btnSimpanTugas.addEventListener('click', () => {
    const inputNama = document.getElementById('inputNamaTugas');
    const inputPenanggung = document.getElementById('inputPenanggungTugas');
    const inputDeadline = document.getElementById('inputDeadlineTugas');
    const inputStatus = document.getElementById('inputStatusTugas');

    if (!inputNama || !inputPenanggung || !inputDeadline || !inputStatus) return;

    const nama = inputNama.value.trim();
    const penanggung = inputPenanggung.value.trim();
    const deadline = inputDeadline.value;
    const status = inputStatus.value;

    if (!nama || !penanggung || !deadline) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const statusMap = {
      pending: { label: 'Belum Mulai', badge: 'badge-pending' },
      progress: { label: 'Berjalan', badge: 'badge-progress' },
      done: { label: 'Selesai', badge: 'badge-done' }
    };
    const s = statusMap[status];

    const deadlineFormatted = new Date(deadline).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${nama}</td>
      <td>${penanggung}</td>
      <td>${deadlineFormatted}</td>
      <td><span class="badge ${s.badge}">${s.label}</span></td>
    `;

    taskTableBody.appendChild(row);

    inputNama.value = '';
    inputPenanggung.value = '';
    inputDeadline.value = '';
    modalTugas.classList.remove('active');
  });
}


// ===========================
// TAMBAH LAPORAN
// ===========================
const btnSubmitLaporan = document.querySelector('.btn-submit');
if (btnSubmitLaporan) {
  btnSubmitLaporan.addEventListener('click', function () {
    const judulEl = document.getElementById('judulLaporan');
    const isiEl = document.getElementById('isiLaporan');
    const reportList = document.getElementById('riwayatLaporan');

    if (!judulEl || !isiEl || !reportList) return;

    const judul = judulEl.value;
    const isi = isiEl.value;

    if (judul === '' || isi === '') {
      alert('Mohon isi judul dan isi laporan!');
      return;
    }

    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const newReport = document.createElement('div');
    newReport.style.cssText = "background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #00b894;";
    newReport.innerHTML = `
      <h4 style="margin: 0 0 5px 0;">${judul}</h4>
      <p style="margin: 0;">${isi}</p>
    `;

    reportList.appendChild(newReport);
    judulEl.value = '';
    isiEl.value = '';
  });
}


// ===========================
// LOGOUT
// ===========================
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
  btnLogout.addEventListener('click', function (e) {
    e.preventDefault();
    if (confirm('Yakin ingin logout?')) {
      alert('Anda telah logout. Sampai jumpa lagi!');
    }
  });
}


// ===========================
// DARK MODE
// ===========================
const themeSelect = document.getElementById('themeSelect');
if (themeSelect) {
  themeSelect.addEventListener('change', function () {
    if (this.value === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    themeSelect.value = savedTheme === 'dark-mode' ? 'dark' : 'light';
  }
}


// ===========================
// TOMBOL SIMPAN (PENGATURAN / GENERIK)
// ===========================
document.addEventListener('DOMContentLoaded', function () {
  const btnSimpanPengaturan = document.getElementById('btn-simpan');
  if (btnSimpanPengaturan) {
    btnSimpanPengaturan.addEventListener('click', function (event) {
      event.preventDefault();
      alert('Perubahan Berhasil Disimpan!');
    });
  }
});

const btnSimpanById = document.getElementById('btnSimpan');
if (btnSimpanById) {
  btnSimpanById.addEventListener('click', function () {
    console.log('Tombol Simpan diklik!');
    const inputNamaTugasEl = document.querySelector('input[name="namaTugas"]');
    if (inputNamaTugasEl) {
      alert("Tugas '" + inputNamaTugasEl.value + "' berhasil disimpan!");
    }
  });
}

const btnSimpanByClass = document.querySelector('.btn-simpan');
if (btnSimpanByClass) {
  btnSimpanByClass.addEventListener('click', function () {
    alert('Tombol berhasil diklik!');
  });
}

/* ==========================
   DATA TIM
