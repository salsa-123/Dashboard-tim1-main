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


/* ============================================
   HALAMAN LAPORAN
============================================ */

// Data laporan
const laporanData = [

    {
        judul: "Dashboard UI",
        tanggal: "16 Juli 2026",
        penulis: "Puja Shinta",
        prioritas: "Tinggi",
        status: "selesai",
        file: "dashboard-ui.pdf",
        isi: "Dashboard proyek berhasil diperbarui dengan tampilan baru yang lebih modern. Sidebar, halaman tugas, dan halaman pengaturan telah selesai dikembangkan. Tahap selanjutnya adalah pengembangan halaman laporan."
    },

    {
        judul: "Backend API",
        tanggal: "15 Juli 2026",
        penulis: "Andi",
        prioritas: "Sedang",
        status: "review",
        file: "backend-api.pdf",
        isi: "Backend API login dan autentikasi berhasil dibuat. Saat ini masih dalam proses review sebelum digabungkan ke branch utama."
    },

    {
        judul: "Testing Sistem",
        tanggal: "14 Juli 2026",
        penulis: "Sinta",
        prioritas: "Rendah",
        status: "pending",
        file: "testing.pdf",
        isi: "Proses pengujian sistem masih berlangsung. Beberapa bug ditemukan dan sedang diperbaiki."
    },

    {
        judul: "Database",
        tanggal: "13 Juli 2026",
        penulis: "Budi",
        prioritas: "Sedang",
        status: "selesai",
        file: "database.pdf",
        isi: "Perancangan database selesai. Seluruh tabel sudah saling terhubung dan siap digunakan."
    },

    {
        judul: "Landing Page",
        tanggal: "12 Juli 2026",
        penulis: "Rina",
        prioritas: "Tinggi",
        status: "review",
        file: "landing-page.pdf",
        isi: "Landing page selesai dibuat dan sedang dilakukan revisi berdasarkan masukan dari pembimbing."
    },

    {
        judul: "Login System",
        tanggal: "11 Juli 2026",
        penulis: "Dimas",
        prioritas: "Sedang",
        status: "pending",
        file: "login.pdf",
        isi: "Fitur login masih memerlukan validasi tambahan serta peningkatan keamanan."
    }

];


/* ============================================
   ELEMENT
============================================ */

const laporanItems = document.querySelectorAll(".laporan-item");

const detailTitle = document.querySelector(".detail-header h3");

const detailBadge = document.querySelector(".badge");

const detailPenulis = document.querySelectorAll(".detail-info p")[0];

const detailTanggal = document.querySelectorAll(".detail-info p")[1];

const detailPrioritas = document.querySelectorAll(".detail-info p")[2];

const detailIsi = document.querySelector(".detail-content p");

const detailFile = document.querySelector(".detail-file");

const searchInput = document.querySelector(".search-box input");


/* ============================================
   UBAH DETAIL
============================================ */

function tampilkanLaporan(index){

    const data = laporanData[index];

    detailTitle.textContent = data.judul;

    detailPenulis.textContent = data.penulis;

    detailTanggal.textContent = data.tanggal;

    detailPrioritas.textContent = data.prioritas;

    detailIsi.textContent = data.isi;

    detailFile.innerHTML = `
        <i class="fa-solid fa-paperclip"></i>
        ${data.file}
    `;

    detailBadge.textContent =
        data.status.charAt(0).toUpperCase() +
        data.status.slice(1);

    detailBadge.className = "badge " + data.status;

}


/* ============================================
   KLIK ITEM
============================================ */

laporanItems.forEach((item,index)=>{

    item.addEventListener("click",()=>{

        laporanItems.forEach(i=>{

            i.classList.remove("active");

        });

        item.classList.add("active");

        tampilkanLaporan(index);

    });

});


/* ============================================
   SEARCH
============================================ */

searchInput.addEventListener("keyup",function(){

    const keyword = this.value.toLowerCase();

    laporanItems.forEach((item,index)=>{

        const judul = laporanData[index].judul.toLowerCase();

        if(judul.includes(keyword)){

            item.style.display="flex";

        }else{

            item.style.display="none";

        }

    });

});


/* ============================================
   EDIT
============================================ */

const btnEdit = document.querySelector(".btn-edit");

btnEdit.addEventListener("click",()=>{

    alert("Fitur Edit akan dikembangkan.");

});


/* ============================================
   HAPUS
============================================ */

const btnDelete = document.querySelector(".btn-delete");

btnDelete.addEventListener("click",()=>{

    if(confirm("Apakah Anda yakin ingin menghapus laporan ini?")){

        alert("Laporan berhasil dihapus.");

    }

});


/* ============================================
   LOAD PERTAMA
============================================ */

tampilkanLaporan(0);

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

