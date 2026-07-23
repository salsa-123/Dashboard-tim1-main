// ==========================================================================
// NAVIGASI SIDEBAR, BUKA-TUTUP, & HALAMAN (VERSI FULL INTEGRATED)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const pageTitle = document.getElementById('pageTitle');
  const sidebar = document.querySelector('.sidebar');
  
  // 🟢 ID disesuaikan dengan tombol kotak hijau utama
  const brandToggle = document.getElementById('brandToggle'); 

  // FUNGSI 1: Logika Buka-Tutup Sidebar (Toggle Collapse)
  if (brandToggle && sidebar) {
    brandToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Mencegah bentrokan klik dengan elemen di luarnya
      sidebar.classList.toggle('collapsed');
    });
  }

  // FUNGSI 2: Pindah Halaman & Navigasi Menu Aktif
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // Abaikan jika yang diklik adalah tombol khusus seperti logout
      if (item.classList.contains('logout-item')) return;
      
      e.preventDefault();

      const targetPage = item.getAttribute('data-page');
      if (!targetPage) return;

      // 1. Ubah status menu aktif
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // 2. Pindah tampilan halaman aktif
      pages.forEach(page => page.classList.remove('active'));
      const target = document.getElementById('page-' + targetPage);
      if (target) target.classList.add('active');

      // 3. Update Judul Halaman di atas dashboard jika ada
      if (pageTitle) {
        // Membersihkan ikon simbol/emoji bawaan agar teks judul rapi
        const cleanText = item.textContent.replace(/[\u25A0-\u25FF\u2700-\u27BF\u2600-\u26FF\u2B50]/g, '').trim();
        pageTitle.textContent = cleanText;
      }

      // Sidebar tetap kokoh (fixed/sticky) di posisinya saat menu diklik
    });
  });
});

// ==========================================
// KONTROL BUKA/TUTUP (HANYA DARI TOMBOL HAMBURGER)
// ==========================================
const menuToggleBtn = document.querySelector('.menu-toggle');
const sidebarEl = document.querySelector('.sidebar');
if (menuToggleBtn && sidebarEl) {
  menuToggleBtn.addEventListener('click', () => {
    sidebarEl.classList.toggle('collapsed');
  });
}
// ==========================================================================
// INTEGRASI FITUR: MODAL DETAIL PROYEK & FUNGSI TAMBAH PROYEK
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const modalDetail = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  const track = document.getElementById('dashboardTrack');
  
  
  //===============================================================
  // proyek modal 
  //=================================================================

  // Fungsi untuk membuka halaman detail
function tampilkanDetailProyek(btn) {
    // 1. Sembunyikan Dashboard, Tampilkan Detail Full Screen
    const dashboard = document.getElementById('container-dashboard');
    if (dashboard) dashboard.style.display = 'none';

    const detailView = document.getElementById('full-detail-view');
    if (detailView) detailView.style.display = 'block';

    // 2. Isi konten detail dengan data dari atribut tombol
    document.getElementById('detail-nama').innerText = btn.dataset.nama;
    document.getElementById('detail-status').innerText = btn.dataset.status;
    document.getElementById('detail-pj').innerText = btn.dataset.pj;
    document.getElementById('detail-deadline').innerText = btn.dataset.deadline;
    document.getElementById('detail-tugas').innerText = btn.dataset.tugas;
    document.getElementById('detail-lanjutan').innerText = btn.dataset.lanjutan;
    document.getElementById('detail-logo').src = btn.dataset.logo;
}

// Fungsi untuk tombol kembali ke dashboard
function tutupDetail() {
    // Sembunyikan detail, tampilkan kembali dashboard
    document.getElementById('full-detail-view').style.display = 'none';
    
    const dashboard = document.getElementById('container-dashboard');
    if (dashboard) dashboard.style.display = 'block';
}
  // ==========================================
  // KODE KHUSUS UTK PANAH (MANDIRI & TERISOLASI)
  // ==========================================
  const tombolKiriTerisolasi = document.querySelector('.prev-btn') || document.querySelector('.arrow-left');
  const tombolKananTerisolasi = document.querySelector('.next-btn') || document.querySelector('.arrow-right');
  const trackUtama = document.getElementById('dashboardTrack');

  if (tombolKiriTerisolasi && trackUtama) {
    tombolKiriTerisolasi.onclick = function(e) {
      e.preventDefault();
      trackUtama.scrollBy({ left: -340, behavior: 'smooth' });
    };
  }

  if (tombolKananTerisolasi && trackUtama) {
    tombolKananTerisolasi.onclick = function(e) {
      e.preventDefault();
      trackUtama.scrollBy({ left: 340, behavior: 'smooth' });
    };
  }

document.addEventListener('DOMContentLoaded', () => {
  console.log("JavaScript Berhasil Dimuat!"); // CEK DI CONSOLE F12

  const projectCards = document.querySelectorAll('.project-item');
  const total = projectCards.length;

  // Update Angka
  const elTotal = document.getElementById('statTotalproyek');
  if (elTotal) {
    elTotal.textContent = total;
    console.log("Angka Total Berhasil Diupdate!");
  } else {
    console.error("ID 'statTotalproyek' tidak ditemukan di HTML!");
  }

  // Fungsi Filter
  const setupClick = (id, status) => {
    const el = document.getElementById(id);
    if (el) {
      el.onclick = () => {
        console.log("Filter dijalankan untuk:", status);
        projectCards.forEach(card => {
          const badge = card.querySelector('.badge');
          const badgeText = badge ? badge.textContent.trim() : '';
          card.style.display = (status === 'Semua' || badgeText === status) ? '' : 'none';
        });
      };
    } else {
      console.warn("ID tidak ditemukan untuk filter:", id);
    }
  };

  setupClick('cardTotal', 'Semua');
  setupClick('cardSelesai', 'Selesai');
  setupClick('cardBerjalan', 'Berjalan');
  setupClick('cardBelum', 'Belum Mulai');
});
});

// ==========================================
// FITUR PENCARIAN PROYEK AMAN (TERISOLASI)
// ==========================================
(function() {
  const searchInput = document.getElementById('searchProject');
  const track = document.getElementById('dashboardTrack');

  if (searchInput && track) {
    searchInput.addEventListener('input', function(e) {
      // Ambil kata kunci pencarian (huruf kecil & hapus spasi samping)
      const keyword = e.target.value.toLowerCase().trim();
      
      // Ambil semua kartu proyek langsung di dalam track
      const projectItems = track.querySelectorAll('.project-item');
      
      projectItems.forEach(item => {
        // Cari tag judul <h3> di dalam kartu proyek tersebut
        const titleElement = item.querySelector('.project-header h3');
        
        if (titleElement) {
          const projectTitle = titleElement.innerText.toLowerCase();
          
          // Filter: Jika judul mengandung keyword, tampilkan. Jika tidak, sembunyikan.
          if (projectTitle.includes(keyword)) {
            item.style.display = ''; // Mengembalikan ke display bawaan (flex/block)
          } else {
            item.style.display = 'none'; // Disembunyikan secara total
          }
        }
      });
    });
  }
})();


// ======================================================
// HALAMAN TUGAS: helper avatar & warna
// ======================================================
const avatarColors = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#ec4899'];

function getInisial(nama) {
  const parts = nama.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getWarnaAcak(nama) {
  let hash = 0;
  for (let i = 0; i < nama.length; i++) hash = nama.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

const statusMapTugas = {
  pending: { key: 'belum', label: 'Belum Mulai', icon: 'fa-circle' },
  progress: { key: 'proses', label: 'Sedang Berjalan', icon: 'fa-spinner' },
  done: { key: 'selesai', label: 'Selesai', icon: 'fa-check' }
};

// key (belum/proses/selesai) -> value select (pending/progress/done)
const statusKeyToValue = { belum: 'pending', proses: 'progress', selesai: 'done' };

// ======================================================
// LANJUTAN HALAMAN TUGAS: update kartu statistik
// ======================================================
function updateStatTugas() {
  const rows = document.querySelectorAll('#taskTableBody tr');
  let total = rows.length, selesai = 0, proses = 0, belum = 0;

  rows.forEach(row => {
    const status = row.getAttribute('data-status');
    if (status === 'selesai') selesai++;
    else if (status === 'proses') proses++;
    else if (status === 'belum') belum++;
  });

  const elTotal = document.getElementById('statTotalTugas');
  const elSelesai = document.getElementById('statSelesaiTugas');
  const elProses = document.getElementById('statProsesTugas');
  const elBelum = document.getElementById('statBelumTugas');

  if (elTotal) elTotal.textContent = total;
  if (elSelesai) elSelesai.textContent = selesai;
  if (elProses) elProses.textContent = proses;
  if (elBelum) elBelum.textContent = belum;
}

// ======================================================
//  LANJUTAN HALAMAN TUGAS: penomoran ulang kolom No
// ======================================================
function renomorTugas() {
  const rows = document.querySelectorAll('#taskTableBody tr');
  rows.forEach((row, i) => {
    row.children[0].textContent = i + 1;
  });
}

// ======================================================
// KONEKSI KE BACKEND API (DATABASE)
// ======================================================
const API_URL = 'http://localhost:3000/api/tugas';

function buatBadgeHTML(statusKey) {
  const found = Object.values(statusMapTugas).find(s => s.key === statusKey);
  return `<span class="status ${found.key}"><i class="fa-solid ${found.icon}"></i> ${found.label}</span>`;
}

// Ambil semua data tugas dari database dan tampilkan di tabel
async function muatTugasDariDatabase() {
  const taskTableBodyEl = document.getElementById('taskTableBody');
  if (!taskTableBodyEl) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    taskTableBodyEl.innerHTML = ''; // kosongkan tabel dulu

    data.forEach((tugas) => {
      const deadlineFormatted = new Date(tugas.deadline).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      const statusKeyMap = { 'Selesai': 'selesai', 'Sedang Berjalan': 'proses', 'Belum Mulai': 'belum' };
      const statusKey = statusKeyMap[tugas.status] || 'belum';

      const row = document.createElement('tr');
      row.setAttribute('data-status', statusKey);
      row.setAttribute('data-id', tugas.id); // simpan id database di baris ini
      row.innerHTML = `
        <td></td>
        <td>${tugas.nama_tugas}</td>
        <td>${deadlineFormatted}</td>
        <td>${buatBadgeHTML(statusKey)}</td>
        <td>
          <div class="action-cell">
            <button class="icon-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn delete" title="Hapus"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;
      taskTableBodyEl.appendChild(row);
    });

    renomorTugas();
    updateStatTugas();
  } catch (error) {
    console.error('Gagal ambil data tugas:', error);
    alert('Gagal terhubung ke server. Pastikan backend (node server.js) sedang jalan.');
  }
}

document.addEventListener('DOMContentLoaded', muatTugasDariDatabase);

// =====================================================================
// LANJUTAN HALAMAN TUGASTAMBAH / EDIT TUGAS (modal sama, mode berbeda)
// =====================================================================
const btnTambahTugas = document.getElementById('btnTambahTugas');
const modalTugas = document.getElementById('modalTugas');
const modalTugasTitle = document.getElementById('modalTugasTitle');
const btnBatalTugas = document.getElementById('btnBatalTugas');
const btnSimpanTugas = document.getElementById('btnSimpanTugas');
const taskTableBody = document.getElementById('taskTableBody');

const inputNamaTugas = document.getElementById('inputNamaTugas');

const inputDeadlineTugas = document.getElementById('inputDeadlineTugas');
const inputStatusTugas = document.getElementById('inputStatusTugas');

let editingRow = null; // null = mode tambah, berisi <tr> = mode edit

function resetModalTugas() {
  inputNamaTugas.value = '';

  inputDeadlineTugas.value = '';
  inputStatusTugas.value = 'pending';
  editingRow = null;
  if (modalTugasTitle) modalTugasTitle.textContent = 'Tambah Tugas Baru';
}

if (btnTambahTugas && modalTugas) {
  btnTambahTugas.addEventListener('click', () => {
    resetModalTugas();
    modalTugas.classList.add('active');
  });
}

if (btnBatalTugas && modalTugas) {
  btnBatalTugas.addEventListener('click', () => {
    modalTugas.classList.remove('active');
    resetModalTugas();
  });
}

// ==================================================================
// SIMPAN TUGAS (TAMBAH / EDIT) — TERHUBUNG KE DATABASE
// ==================================================================
if (btnSimpanTugas && taskTableBody) {
  btnSimpanTugas.addEventListener('click', async () => {
    const nama = inputNamaTugas.value.trim();

    const deadline = inputDeadlineTugas.value;
    const status = inputStatusTugas.value;

    if (!nama || !deadline) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const statusLabelMap = { pending: 'Belum Mulai', progress: 'Sedang Berjalan', done: 'Selesai' };
    const statusLabel = statusLabelMap[status];

    try {
      if (editingRow) {
        // MODE EDIT: kirim ke database lewat PUT
        const id = editingRow.getAttribute('data-id');
        await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
      nama_tugas: nama, 
      deadline: deadline, 
      status: statusLabel })
        });
      } else {
        // MODE TAMBAH: kirim ke database lewat POST
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama_tugas: nama, deadline: deadline, status: statusLabel })
        });
      }

      modalTugas.classList.remove('active');
      resetModalTugas();
      await muatTugasDariDatabase(); // refresh tabel dari database
    } catch (error) {
      console.error('Gagal simpan tugas:', error);
      alert('Gagal menyimpan ke server. Pastikan backend sedang jalan.');
    }
  });
}

// ==================================================================
// LANJUTAN HALAMAN TUGAS: klik tombol Edit / Hapus di tabel — TERHUBUNG KE DATABASE
// ==================================================================
if (taskTableBody) {
  taskTableBody.addEventListener('click', async (e) => {
    const btnHapus = e.target.closest('.icon-btn.delete');
    const btnEdit = e.target.closest('.icon-btn:not(.delete)');

    if (btnHapus) {
      if (confirm('Yakin ingin menghapus tugas ini?')) {
        const row = btnHapus.closest('tr');
        const id = row.getAttribute('data-id');
        try {
          await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          await muatTugasDariDatabase();
        } catch (error) {
          console.error('Gagal hapus tugas:', error);
          alert('Gagal menghapus di server.');
        }
      }
      return;
    }

    if (btnEdit) {
      const row = btnEdit.closest('tr');
      editingRow = row;

      const nama = row.children[1].textContent.trim();
      const deadlineText = row.children[2].textContent.trim();
      const statusKey = row.getAttribute('data-status');

      inputNamaTugas.value = nama;

      inputStatusTugas.value = statusKeyToValue[statusKey] || 'pending';

      // Konversi "15 Jul 2026" -> format input date (yyyy-mm-dd)
      const parsedDate = new Date(deadlineText);
      if (!isNaN(parsedDate)) {
        const yyyy = parsedDate.getFullYear();
        const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(parsedDate.getDate()).padStart(2, '0');
        inputDeadlineTugas.value = `${yyyy}-${mm}-${dd}`;
      } else {
        inputDeadlineTugas.value = '';
      }

      if (modalTugasTitle) modalTugasTitle.textContent = 'Edit Tugas';
      modalTugas.classList.add('active');
    }
  });
}

// ======================================================
// LANJUTAN HALAMAN TUGAS: search & filter status
// ======================================================
const searchTugas = document.getElementById('searchTugas');
const filterStatusTugas = document.getElementById('filterStatusTugas');
const tugasEmpty = document.getElementById('tugasEmpty');

function terapkanFilterTugas() {
  if (!taskTableBody) return;
  const keyword = searchTugas ? searchTugas.value.toLowerCase() : '';
  const statusFilter = filterStatusTugas ? filterStatusTugas.value : '';
  const rows = taskTableBody.querySelectorAll('tr');
  let visibleCount = 0;

  rows.forEach(row => {
    const teks = row.textContent.toLowerCase();
    const statusRow = row.getAttribute('data-status');
    const cocokKeyword = teks.includes(keyword);
    const cocokStatus = !statusFilter || statusRow === statusFilter;

    if (cocokKeyword && cocokStatus) {
      row.classList.remove('row-hidden');
      visibleCount++;
    } else {
      row.classList.add('row-hidden');
    }
  });

  if (tugasEmpty) tugasEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
}

if (searchTugas) searchTugas.addEventListener('keyup', terapkanFilterTugas);
if (filterStatusTugas) filterStatusTugas.addEventListener('change', terapkanFilterTugas);

// ======================================================
// LANJUTAN HALAMAN TUGAS: sorting kolom (klik header)
// ======================================================
document.querySelectorAll('#tabelTugas .th-sort').forEach(th => {
  let ascending = true;
  th.addEventListener('click', () => {
    const sortKey = th.getAttribute('data-sort');
    const tbody = document.getElementById('taskTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
      let valA, valB;
      if (sortKey === 'status') {
        valA = a.getAttribute('data-status');
        valB = b.getAttribute('data-status');
      } else if (sortKey === 'deadline') {
        valA = new Date(a.children[2].textContent.trim());
        valB = new Date(b.children[2].textContent.trim());
      } else {
        valA = a.children[1].textContent.trim().toLowerCase();
        valB = b.children[1].textContent.trim().toLowerCase();
      }
      if (valA < valB) return ascending ? -1 : 1;
      if (valA > valB) return ascending ? 1 : -1;
      return 0;
    });

    rows.forEach(row => tbody.appendChild(row));
    ascending = !ascending;
    renomorTugas();
  });
});

/* ============================================
   HALAMAN LAPORAN (TERHUBUNG KE DATABASE)
============================================ */

const API_URL_LAPORAN = 'http://localhost:3000/api/laporan';

let laporanData = [];
let laporanAktifIndex = 0;
let modeEditLaporan = null;

const detailTitle = document.querySelector(".detail-header h3");
const detailBadge = document.querySelector(".detail-header .badge");
const detailPenulis = document.querySelectorAll(".detail-info p")[0];
const detailTanggal = document.querySelectorAll(".detail-info p")[1];
const detailPrioritas = document.querySelectorAll(".detail-info p")[2];
const detailIsi = document.querySelector(".detail-content p");
const detailFile = document.querySelector(".detail-file");

async function muatLaporanDariDatabase() {
  try {
    const response = await fetch(API_URL_LAPORAN);
    laporanData = await response.json();
    renderLaporanList();
    if (laporanData.length > 0) {
      tampilkanLaporan(0);
    } else {
      const detailEl = document.querySelector('.laporan-detail');
      if (detailEl) detailEl.innerHTML = '<p style="padding:20px;">Belum ada laporan.</p>';
    }
  } catch (error) {
    console.error('Gagal ambil data laporan:', error);
    alert('Gagal terhubung ke server. Pastikan backend (node server.js) sedang jalan.');
  }
}

function renderLaporanList() {
  const container = document.querySelector('.laporan-list');
  if (!container) return;
  container.innerHTML = '';

  laporanData.forEach((data, index) => {
    const item = document.createElement('div');
    item.classList.add('laporan-item');
    if (index === laporanAktifIndex) item.classList.add('active');

    item.innerHTML = `
      <div class="laporan-icon ${data.status}">
        <i class="fa-solid fa-file"></i>
      </div>
      <div class="laporan-info">
        <h4>${data.judul}</h4>
        <span>${formatTanggalLaporan(data.tanggal)}</span>
      </div>
    `;

    item.addEventListener('click', () => {
      document.querySelectorAll('.laporan-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      tampilkanLaporan(index);
    });

    container.appendChild(item);
  });
}

function tampilkanLaporan(index) {
  laporanAktifIndex = index;
  const data = laporanData[index];
  if (!data) return;

  detailTitle.textContent = data.judul;
  detailPenulis.textContent = data.penulis;
  detailTanggal.textContent = formatTanggalLaporan(data.tanggal);
  detailPrioritas.textContent = data.prioritas;
  detailIsi.textContent = data.isi;

  detailFile.innerHTML = `<i class="fa-solid fa-paperclip"></i> ${data.file || '-'}`;
  detailBadge.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
  detailBadge.className = "badge " + data.status;
}

function formatTanggalLaporan(tanggalISO) {
  const d = new Date(tanggalISO);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function cariLaporan() {
  const keyword = document.getElementById('searchLaporan').value.toLowerCase().trim();
  const items = document.querySelectorAll('.laporan-item');
  items.forEach((item, index) => {
    const judul = laporanData[index].judul.toLowerCase();
    item.style.display = judul.includes(keyword) ? '' : 'none';
  });
}

function bukaFormLaporan() {
  modeEditLaporan = null;
  document.getElementById('judulLaporan').value = '';
  document.getElementById('penulisLaporan').value = '';
  document.getElementById('prioritasLaporan').value = 'Rendah';
  document.getElementById('statusLaporan').value = 'pending';
  document.getElementById('isiLaporan').value = '';
  document.getElementById('modal-laporan').classList.add('active');
}

function editLaporan() {
  const data = laporanData[laporanAktifIndex];
  if (!data) return;
  modeEditLaporan = data.id;

  document.getElementById('judulLaporan').value = data.judul;
  document.getElementById('penulisLaporan').value = data.penulis;
  document.getElementById('prioritasLaporan').value = data.prioritas;
  document.getElementById('statusLaporan').value = data.status;
  document.getElementById('isiLaporan').value = data.isi;
  document.getElementById('modal-laporan').classList.add('active');
}

async function hapusLaporan() {
  const data = laporanData[laporanAktifIndex];
  if (!data) return;
  if (!confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;

  try {
    await fetch(`${API_URL_LAPORAN}/${data.id}`, { method: 'DELETE' });
    alert('Laporan berhasil dihapus.');
    await muatLaporanDariDatabase();
  } catch (error) {
    console.error('Gagal hapus laporan:', error);
    alert('Gagal menghapus laporan di server.');
  }
}

async function simpanLaporan() {
  const judul = document.getElementById('judulLaporan').value.trim();
  const penulis = document.getElementById('penulisLaporan').value.trim();
  const prioritas = document.getElementById('prioritasLaporan').value;
  const status = document.getElementById('statusLaporan').value;
  const isi = document.getElementById('isiLaporan').value.trim();
  const fileInput = document.getElementById('fileLaporan');
  const namaFile = fileInput.files.length > 0 ? fileInput.files[0].name : '-';

  if (!judul || !penulis || !isi) {
    alert('Judul, penulis, dan isi laporan wajib diisi!');
    return;
  }

  const tanggalSekarang = new Date().toISOString().split('T')[0];
  const dataLamaTanggal = modeEditLaporan ? laporanData[laporanAktifIndex].tanggal.split('T')[0] : tanggalSekarang;
  const dataLamaFile = modeEditLaporan ? laporanData[laporanAktifIndex].file : '-';

  const bodyLaporan = {
    judul, penulis,
    tanggal: dataLamaTanggal,
    prioritas, status, isi,
    file: namaFile !== '-' ? namaFile : dataLamaFile
  };

  try {
    let response;
    if (modeEditLaporan) {
      response = await fetch(`${API_URL_LAPORAN}/${modeEditLaporan}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyLaporan)
      });
    } else {
      response = await fetch(API_URL_LAPORAN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyLaporan)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      alert('Gagal menyimpan: ' + (errorData.error || 'Terjadi kesalahan di server'));
      console.error('Detail error server:', errorData);
      return;
    }

    tutupModalLaporan();
    await muatLaporanDariDatabase();
    alert('Laporan berhasil disimpan!');
  } catch (error) {
    console.error('Gagal simpan laporan:', error);
    alert('Gagal menyimpan laporan ke server. Cek apakah backend sedang jalan.');
  }
}

function tutupModalLaporan() {
  const modal = document.getElementById('modal-laporan');
  if (modal) modal.classList.remove('active');

  document.getElementById('judulLaporan').value = '';
  document.getElementById('penulisLaporan').value = '';
  document.getElementById('isiLaporan').value = '';
  document.getElementById('prioritasLaporan').value = 'Rendah';
  document.getElementById('statusLaporan').value = 'pending';

  const fileEl = document.getElementById('fileLaporan');
  if (fileEl) fileEl.value = '';
  const fileNamaEl = document.getElementById('fileLaporanNama');
  if (fileNamaEl) fileNamaEl.textContent = 'Klik untuk lampirkan file';
}

document.addEventListener('DOMContentLoaded', muatLaporanDariDatabase);

const fileLaporanInput = document.getElementById('fileLaporan');
if (fileLaporanInput) {
  fileLaporanInput.addEventListener('change', function () {
    const namaFile = this.files.length > 0 ? this.files[0].name : 'Klik untuk lampirkan file';
    document.getElementById('fileLaporanNama').textContent = namaFile;
  });
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






// =====================================================
// PENGATURAN DASHBOARD (VERSI BERSIH, TANPA DUPLIKAT)
// =====================================================
const STORAGE_KEY = 'pengaturan_dashboard';

// Terapkan warna tema ke kartu halaman Pengaturan saja
function terapkanTema(tema) {
  if (tema === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Muat pengaturan tersimpan saat halaman dibuka
function muatPengaturan() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;

  const s = JSON.parse(data);
  const elTema = document.getElementById('tema');
  const elNotif = document.getElementById('notifEmail');
  const elPeran = document.getElementById('peranAkses');
  const elProyek = document.getElementById('proyekAktif');

  if (s.tema && elTema) elTema.value = s.tema;
  if (s.notifEmail && elNotif) elNotif.value = s.notifEmail;
  if (s.peranAkses && elPeran) elPeran.value = s.peranAkses;
  if (s.proyekAktif && elProyek) elProyek.value = s.proyekAktif;

  terapkanTema(s.tema);
}

// Simpan semua perubahan (HANYA SATU fungsi ini di seluruh file)
function simpanSemuaPerubahan() {
  const elTema = document.getElementById('tema');
  if (!elTema) {
    alert('Elemen tema tidak ditemukan, cek id="tema" di HTML.');
    return;
  }

  const pengaturan = {
    tema: elTema.value,
    notifEmail: document.getElementById('notifEmail')?.value || '',
    peranAkses: document.getElementById('peranAkses')?.value || '',
    proyekAktif: document.getElementById('proyekAktif')?.value || ''
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(pengaturan));
  terapkanTema(pengaturan.tema);

  alert('Semua perubahan berhasil disimpan!');
  console.log('Pengaturan tersimpan:', pengaturan);
}

// Cukup gunakan ini satu kali saja
function bukaModal() {
  const modal = document.getElementById('modal-password');
  if (modal) modal.classList.add('active');
}

function tutupModal() {
  const modal = document.getElementById('modal-password');
  if (modal) modal.classList.remove('active');
}

function simpanPasswordBaru() {
  const modal = document.getElementById('modal-password');
  if (!modal) return;

  const inputs = modal.querySelectorAll('input[type="password"]');
  const passLama = inputs[0].value.trim();
  const passBaru = inputs[1].value.trim();

  if (!passLama || !passBaru) {
    alert('Password lama dan password baru wajib diisi!');
    return;
  }

  // Kosongkan input setelah disimpan
  inputs[0].value = '';
  inputs[1].value = '';

  tutupModal();
  alert('Password berhasil diubah!');
}

const btnUbahPassword = document.getElementById('btnUbahPassword');
if (btnUbahPassword) {
  btnUbahPassword.addEventListener('click', bukaModal);
}

// Semua event listener didaftarkan setelah DOM siap, dan semua dicek null dulu
document.addEventListener('DOMContentLoaded', function () {
  muatPengaturan();

  // Update tema langsung saat dropdown diganti (real-time)
  const elTema = document.getElementById('tema');
  if (elTema) {
    elTema.addEventListener('change', function () {
      terapkanTema(this.value);
    });
  }

  // Tombol Unduh CSV
  const btnCSV = document.getElementById('btnEksporCSV');
  if (btnCSV) {
    btnCSV.addEventListener('click', function () {
      const data = [
        ["Nama", "Email", "Proyek"],
        ["Budi Santoso", "budi@example.com", "Proyek Alpha"]
      ];
      let csvContent = "data:text/csv;charset=utf-8,";
      data.forEach(row => csvContent += row.join(",") + "\r\n");

      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", "data_pengaturan.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Tombol Hubungkan GitHub/Slack
  const btnHubungkan = document.getElementById('btnHubungkan');
  if (btnHubungkan) {
    btnHubungkan.addEventListener('click', function () {
      alert("Mengarahkan ke halaman otorisasi GitHub/Slack...");
    });
  }
});


// ===========================
// RENDER DAFTAR LAPORAN (dinamis dari array laporanData)
// ===========================
function renderLaporanList() {
    const container = document.querySelector('.laporan-list');
    if (!container) return;

    container.innerHTML = '';

    laporanData.forEach((data, index) => {
        const item = document.createElement('div');
        item.classList.add('laporan-item');
        if (index === 0) item.classList.add('active');

        item.innerHTML = `
            <div class="laporan-icon ${data.status}">
                <i class="fa-solid fa-file"></i>
            </div>
            <div class="laporan-info">
                <h4>${data.judul}</h4>
                <span>${formatTanggalLaporan(data.tanggal)}</span>
            </div>
        `;

        item.addEventListener('click', () => {
            document.querySelectorAll('.laporan-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            tampilkanLaporan(index);
        });

        container.appendChild(item);
    });
}


function cariLaporan() {
    const keyword = document.getElementById('searchLaporan').value.toLowerCase().trim();
    const items = document.querySelectorAll('.laporan-item');

    items.forEach(item => {
        const judul = item.querySelector('.laporan-info h4').textContent.toLowerCase();
        
        if (judul.includes(keyword)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}


// Update nama file yang tampil saat user memilih file
document.getElementById('fileLaporan').addEventListener('change', function () {
    const namaFile = this.files.length > 0 ? this.files[0].name : 'Klik untuk lampirkan file';
    document.getElementById('fileLaporanNama').textContent = namaFile;
});
    
function bukaFormLaporan() {
    const modal = document.getElementById('modal-laporan');
    if (modal) {
        modal.classList.add('active');
    }
}