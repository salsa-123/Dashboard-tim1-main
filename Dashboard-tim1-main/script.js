/* =====================================================================
   SCRIPT DASHBOARD — VERSI RAPI
   Semua kode ASLI dipertahankan (tidak ada yang dihapus), hanya
   dikelompokkan ulang per halaman + dirapikan indentasinya, supaya
   lebih gampang dicari. Urutan section:

     1. SIDEBAR — Navigasi & Toggle
     2. DASHBOARD & PROYEK
     3. HALAMAN TUGAS
     4. HALAMAN LAPORAN
     5. HALAMAN PENGATURAN
     6. CATATAN: fungsi laporan versi lama (duplikat, dibiarkan sesuai
        permintaan — lihat catatan di bagian bawah)
   ===================================================================== */


/* =====================================================================
   1. SIDEBAR — NAVIGASI, BUKA/TUTUP, & PINDAH HALAMAN
   ===================================================================== */
/* =====================================================================
   1. SIDEBAR — NAVIGASI, BUKA/TUTUP, & PINDAH HALAMAN
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('.page');
  const pageTitle = document.getElementById('pageTitle');
  const sidebar = document.querySelector('.sidebar');

  // ID disesuaikan dengan tombol kotak hijau utama
  const brandToggle = document.getElementById('brandToggle');

  // 🔹 TAMBAHAN: pulihkan status collapsed dari localStorage
  if (sidebar && localStorage.getItem('sidebarCollapsed') === 'true') {
    sidebar.classList.add('collapsed');
  }

  // FUNGSI 1: Logika Buka-Tutup Sidebar (Toggle Collapse)
  if (brandToggle && sidebar) {
    brandToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
    });
  }

  // FUNGSI 2: Tandai menu aktif otomatis sesuai file yang sedang dibuka
  const currentPage = window.location.pathname.split('/').pop();
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === currentPage) {
      item.classList.add('active');
    }
  });
  document.body.classList.add('ready');
});


// KONTROL BUKA/TUTUP (HANYA DARI TOMBOL HAMBURGER)
const menuToggleBtn = document.querySelector('.menu-toggle');
const sidebarEl = document.querySelector('.sidebar');
if (menuToggleBtn && sidebarEl) {
  menuToggleBtn.addEventListener('click', () => {
    sidebarEl.classList.toggle('collapsed');
    // 🔹 TAMBAHAN
    localStorage.setItem('sidebarCollapsed', sidebarEl.classList.contains('collapsed'));
  });
}


let currentProyekRow = null;
/* =====================================================================
   2. DASHBOARD & PROYEK
   ===================================================================== */

/* ---------- 2a. Modal Detail Proyek & Tambah Proyek ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const modalDetail = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.querySelector('.close-modal-btn');
  const track = document.getElementById('dashboardTrack');


  // Fungsi untuk tombol kembali ke dashboard
  function tutupDetail() {
    // Sembunyikan detail, tampilkan kembali dashboard
    document.getElementById('full-detail-view').style.display = 'none';

    const dashboard = document.getElementById('container-dashboard');
    if (dashboard) dashboard.style.display = 'block';
  }

  // ---- Kode khusus untuk tombol panah carousel (mandiri & terisolasi) ----
  const tombolKiriTerisolasi = document.querySelector('.prev-btn') || document.querySelector('.arrow-left');
  const tombolKananTerisolasi = document.querySelector('.next-btn') || document.querySelector('.arrow-right');
  const trackUtama = document.getElementById('dashboardTrack');

  if (tombolKiriTerisolasi && trackUtama) {
    tombolKiriTerisolasi.onclick = function (e) {
      e.preventDefault();
      trackUtama.scrollBy({ left: -340, behavior: 'smooth' });
    };
  }

  if (tombolKananTerisolasi && trackUtama) {
    tombolKananTerisolasi.onclick = function (e) {
      e.preventDefault();
      trackUtama.scrollBy({ left: 340, behavior: 'smooth' });
    };
  }

  // ---- Kartu statistik proyek (total/selesai/berjalan/belum) + filter ----
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
    setupClick('cardSelesai', 'Selesai');1
    setupClick('cardBerjalan', 'Berjalan');
    setupClick('cardBelum', 'Belum Mulai');
  });
});


async function muatKartuProyekDashboard() {
  const track = document.getElementById('dashboardTrack');
  if (!track) return;

  try {
    const res = await fetch('http://localhost:3000/api/proyek');
    const proyekList = await res.json();
// Hitung statistik
    const total = proyekList.length;
    const selesai = proyekList.filter(p => p.Status === 'Selesai').length;
    const berjalan = proyekList.filter(p => p.Status === 'Berjalan').length;
    const belumMulai = proyekList.filter(p => p.Status === 'Belum Mulai').length;

    const elTotal = document.getElementById('statTotal');
    const elSelesai = document.getElementById('statSelesai');
    const elProgress = document.getElementById('statProgress');
    const elPending = document.getElementById('statPending');

    if (elTotal) elTotal.textContent = total;
    if (elSelesai) elSelesai.textContent = selesai;
    if (elProgress) elProgress.textContent = berjalan;
    if (elPending) elPending.textContent = belumMulai;
    if (!proyekList.length) {
      track.innerHTML = '<p>Belum ada proyek.</p>';
      return;
    }

    track.innerHTML = proyekList.map(p => {
      const badgeClass = p.Status === 'Selesai' ? 'badge-done' : (p.Status === 'Berjalan' ? 'badge-progress' : 'badge-pending');
      const percent = p.Status === 'Selesai' ? 100 : (p.Status === 'Berjalan' ? 50 : 0);
      const bg = `https://picsum.photos/seed/proyek${p.id}/400/600`;

      return `
        <div class="project-item" style="background-image: url('${bg}');">
          <div class="project-card-top">
            <div class="project-logo-emblem"><i class="fas fa-folder"></i></div>
            <div class="project-header">
              <h3>${p.Nama_proyek}</h3>
              <span class="badge ${badgeClass}">${p.Status}</span>
            </div>
          </div>
          <div class="project-card-bottom">
            <div class="project-progress-below">
              <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%"></div></div>
              <span class="progress-percent">${percent}%</span>
            </div>
            <button class="btn-view"
              onclick="tampilkanDetailProyek(this)"
              data-id="${p.id}"
              data-nama="${p.Nama_proyek}"
              data-status="${p.Status}"
              data-pj="${p.Pj}"
              data-deadline="${p.Deadline}"
              data-logo="${bg}"
              data-tugas="${p.Deskripsi || ''}">View</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error('Gagal memuat proyek dashboard:', error);
    track.innerHTML = '<p>Gagal memuat proyek.</p>';
  }
}

document.addEventListener('DOMContentLoaded', muatKartuProyekDashboard);
/* ---------- 2b. Pencarian Proyek (aman, terisolasi) ---------- */
(function () {
  const searchInput = document.getElementById('searchProject');
  const track = document.getElementById('dashboardTrack');

  if (searchInput && track) {
    searchInput.addEventListener('input', function (e) {
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

// Fungsi untuk fitur pencarian proyek
const searchInput = document.getElementById('searchProyek');








if (searchInput) {
  searchInput.addEventListener('input', function() {
      // Mengubah nilai input menjadi huruf kecil agar pencarian tidak sensitif huruf besar/kecil
      const query = this.value.toLowerCase();

      // Query ulang di sini supaya baris baru hasil "Tambah Proyek" ikut ke-search
      const tableRows = document.querySelectorAll('.project-table tbody tr');

      tableRows.forEach(row => {
          const rowText = row.textContent.toLowerCase();
          if (rowText.includes(query)) {
              row.style.display = '';
          } else {
              row.style.display = 'none';
          }
      });
  });
}





// ================= 2. FUNGSI TAMBAH DATA PROYEK =================
// Fungsi bantu untuk format tanggal jadi "31 Juli 2026"
function formatTanggal(deadline) {
    if (!deadline) return '-';
    const tgl = new Date(deadline);
    return tgl.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function getBadgeClass(status) {
    switch (status) {
        case 'Berjalan': return 'status-berjalan';
        case 'Selesai': return 'status-selesai';
        case 'Belum Mulai': return 'status-belum';
        default: return '';
    }
}
async function loadProyek() {
    try {
        const response = await fetch("http://localhost:3000/api/proyek");
        const data = await response.json();
        
        const tbody = document.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = ''; // Kosongkan tabel
            data.forEach(item => {
                tbody.innerHTML += `
                    <tr><td>${item.Nama_proyek}</td>
                        <td><span class="badge ${getBadgeClass(item.Status)}">${item.Status}</span></td>
                        <td>${item.Pj}</td>
                        <td>${formatTanggal(item.Deadline)}</td>
                        <td>
                            <button class="btn-view" onclick="tampilkanDetailProyek(this)"
    data-id="${item.id}"
    data-nama="${item.Nama_proyek}"
    data-status="${item.Status}"
    data-pj="${item.Pj}"
    data-deadline="${formatTanggal(item.Deadline)}">
    View
</button>
                        </td>
                    </tr>
                `;
            });
        }
    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

// Fungsi untuk menangani simpan data
function setupFormTambahProyek() {
    const btnSimpan = document.querySelector("#btnSimpanProyek");
    if (!btnSimpan) return;

    btnSimpan.addEventListener("click", async function(e) {
        e.preventDefault();

       const payload = {
    Nama_proyek: document.querySelector("#inputNamaProyek")?.value,
    Pj: document.querySelector("#inputPJProyek")?.value,
    Deadline: document.querySelector("#inputDeadlineProyek")?.value,
    Status: document.querySelector("#inputStatusProyek")?.value,
    Deskripsi: document.querySelector("#idInputDeskripsi")?.value
};

        try {
            const response = await fetch("http://localhost:3000/api/proyek", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
    alert("Berhasil!");
    loadProyek(); // Refresh tabel
    document.getElementById('ID_MODAL_KAMU').style.display = 'none';
} else {
    alert("Gagal menyimpan.");
}
        } catch (error) {
            console.error("Error:", error);
        }
    });
}
// Jalankan fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadProyek();
    setupFormTambahProyek();
});


/* =====================================================================
   3. tombol view yang di proyek dan dashboard
   ===================================================================== */
function tampilkanDetailProyek(btn) {
  const data = {
    id: btn.getAttribute('data-id'),
    nama: btn.getAttribute('data-nama'),
    status: btn.getAttribute('data-status'),
    pj: btn.getAttribute('data-pj'),
    deadline: btn.getAttribute('data-deadline'),
    logo: btn.getAttribute('data-logo'),
    tugas: btn.getAttribute('data-tugas')
  };

  const fullDetailModal = document.getElementById('full-detail-view');

  if (fullDetailModal) {
    // Kita SUDAH di proyek.html -> tampilkan langsung
    currentProyekRow = btn.closest('tr');
    isiDetailProyek(data);
    fullDetailModal.style.display = 'block';
  } else {
    // Kita di dashboard.html -> simpan data, lalu pindah ke proyek.html
    sessionStorage.setItem('bukaDetailProyek', JSON.stringify(data));
    window.location.href = 'proyek.html';
  }
}


function isiDetailProyek(data) {
  if (document.getElementById('detail-nama')) document.getElementById('detail-nama').textContent = data.nama || '-';
  if (document.getElementById('detail-status')) document.getElementById('detail-status').textContent = data.status || '-';
  if (document.getElementById('detail-pj')) document.getElementById('detail-pj').textContent = data.pj || '-';
  if (document.getElementById('detail-deadline')) {
    const tgl = new Date(data.deadline);
    document.getElementById('detail-deadline').textContent = isNaN(tgl) ? (data.deadline || '-') : tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  if (document.getElementById('detail-logo')) document.getElementById('detail-logo').src = data.logo || '';
  if (document.getElementById('detail-tugas')) document.getElementById('detail-tugas').textContent = data.tugas || '-';
muatLaporanTerkaitProyek(data.id);
muatTugasTerkaitProyek(data.id);
async function muatTugasTerkaitProyek(idProyek) {
  const container = document.getElementById('tugas-terkait-list');
  if (!container) return;

  try {
    const res = await fetch(`http://localhost:3000/api/proyek/${idProyek}/tugas`);
    const tugasList = await res.json();

    if (!tugasList.length) {
      container.innerHTML = '<p>Belum ada tugas untuk proyek ini.</p>';
      return;
    }

    container.innerHTML = tugasList.map(t => `
      <div class="tugas-item">
        <span>${t.nama_tugas}</span>
        <span class="badge">${t.status}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Gagal memuat tugas proyek:', error);
    container.innerHTML = '<p>Gagal memuat tugas.</p>';
  }
}

  /* ---------- Laporan Terkait di Detail Proyek ---------- */
async function muatLaporanTerkaitProyek(idProyek) {
  const container = document.getElementById('laporanTerkaitList');
  if (!container) return;

  if (!idProyek) {
    container.innerHTML = '<p style="color:#9ca3af;font-size:14px;">Proyek ini belum tersimpan di database, jadi laporan terkait belum bisa ditampilkan.</p>';
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/proyek/${idProyek}/laporan`);
    const data = await response.json();

    if (data.length === 0) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:14px;">Belum ada laporan untuk proyek ini.</p>';
      return;
    }

    container.innerHTML = data.map(l => `
      <div class="laporan-terkait-item">
        <span>${l.judul}</span>
        <span class="badge ${l.status}">${l.status}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Gagal memuat laporan terkait proyek:', error);
    container.innerHTML = '<p style="color:#9ca3af;font-size:14px;">Gagal memuat laporan terkait.</p>';
  }
}

  const badgeElement = document.getElementById('detail-status');
  if (badgeElement) {
    badgeElement.className = 'badge';
    if (data.status === 'Berjalan') badgeElement.classList.add('status-berjalan');
    else if (data.status === 'Selesai') badgeElement.classList.add('status-selesai');
    else badgeElement.classList.add('status-belum');
  }
}

function tutupDetail() {
  const fullDetailModal = document.getElementById('full-detail-view');
  if (fullDetailModal) {
    fullDetailModal.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const stored = sessionStorage.getItem('bukaDetailProyek');
  const fullDetailModal = document.getElementById('full-detail-view');
  if (stored && fullDetailModal) {
    const data = JSON.parse(stored);
    isiDetailProyek(data);
    fullDetailModal.style.display = 'block';
    sessionStorage.removeItem('bukaDetailProyek');

    // Cari baris tabel proyek yang namanya cocok, supaya tombol Edit tetap berfungsi
    const semuaBarisProyek = document.querySelectorAll('.project-table tbody tr');
    semuaBarisProyek.forEach((row) => {
      const viewBtn = row.querySelector('.btn-view');
      if (viewBtn && viewBtn.getAttribute('data-nama') === data.nama) {
        currentProyekRow = row;
      }
    });
  }
});

/* =====================================================================
   3. hitungKorelasiProyek
   ===================================================================== */

function hitungKorelasiProyek() {
    const tableRows = document.querySelectorAll('.project-table tbody tr');
    let statusValues = []; // Y
    let deadlineValues = []; // X (Sisa hari)
    
    const today = new Date("2026-07-27"); // Tanggal hari ini

    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return; // Skip jika baris tidak lengkap

        // 1. Ambil Status dan mapping ke angka
        const statusText = cells[1].innerText.trim();
        let statusVal = 0;
        if (statusText.includes("Belum Mulai")) statusVal = 1;
        else if (statusText.includes("Berjalan")) statusVal = 2;
        else if (statusText.includes("Selesai")) statusVal = 3;

        // 2. Ambil Deadline dan hitung sisa hari
        const deadlineText = cells[3].innerText.trim();
        // Mengubah format "22 Juli 2026" agar bisa dibaca JS
        const deadlineDate = new Date(deadlineText.replace("Juli", "Jul")); 
        const timeDiff = deadlineDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        statusValues.push(statusVal);
        deadlineValues.push(daysLeft);
    });

    // 3. Rumus Korelasi Pearson
    const n = statusValues.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += deadlineValues[i];
        sumY += statusValues[i];
        sumXY += (deadlineValues[i] * statusValues[i]);
        sumX2 += (deadlineValues[i] * deadlineValues[i]);
        sumY2 += (statusValues[i] * statusValues[i]);
    }

    const num = (n * sumXY) - (sumX * sumY);
    const den = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    const r = (den === 0) ? 0 : (num / den);
    
    console.log("Skor Korelasi (Deadline vs Status):", r.toFixed(2));
    return r;
}

// Jalankan fungsi saat halaman dimuat
window.addEventListener('DOMContentLoaded', (event) => {
    const korelasi = hitungKorelasiProyek();
    console.log("Analisis Otomatis: Korelasi ditemukan sebesar " + korelasi);
});

function simpanProyekBaru() {
    // ... kode simpan Anda ...
    
    // Setelah data tabel diupdate, hitung ulang korelasinya
    hitungKorelasiProyek();
}
/* =====================================================================
   3. MODAL TAMBAH PROYEK 
   ===================================================================== */


/* Helper: ubah "22 Juli 2026" -> "2026-07-22" (buat isi ulang <input type="date"> saat Edit) */
function tanggalIndoKeInputDate(teks) {
  const bulanIndoMap = {
    januari: '01', februari: '02', maret: '03', april: '04', mei: '05', juni: '06',
    juli: '07', agustus: '08', september: '09', oktober: '10', november: '11', desember: '12'
  };
  if (!teks) return '';
  const parts = teks.trim().split(' ');
  if (parts.length < 3) return '';
  const [hari, bulanNama, tahun] = parts;
  const bulan = bulanIndoMap[bulanNama.toLowerCase()];
  if (!bulan) return '';
  return `${tahun}-${bulan}-${hari.padStart(2, '0')}`;
}

/* Helper: ubah "2026-07-22" (dari <input type="date">) -> "22 Juli 2026" (buat ditampilkan di tabel) */
function formatTanggalKeIndo(yyyyMmDd) {
  const bulanIndo = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  if (!yyyyMmDd) return '';
  const [tahun, bulan, hari] = yyyyMmDd.split('-');
  const namaBulan = bulanIndo[parseInt(bulan, 10) - 1] || bulan;
  return `${parseInt(hari, 10)} ${namaBulan} ${tahun}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil elemen-elemen yang diperlukan
    const modal = document.getElementById('modalProyek');
    const btnTambah = document.querySelector('.btn-tambah-proyek');
    const btnBatal = document.getElementById('btnBatalProyek');
    const btnSimpan = document.getElementById('btnSimpanProyek');
    const btnEditProyek = document.getElementById('btnEditProyek');
    const tbody = document.querySelector('.project-table tbody');

    let editingProyekRow = null; // null = mode Tambah, berisi <tr> = mode Edit

    // 2. Fungsi Buka Modal (mode Tambah)
    btnTambah.addEventListener('click', () => {
        editingProyekRow = null;
        modal.style.display = 'flex';
    });

    // 2b. Fungsi Buka Modal (mode Edit) — isi otomatis dari proyek yang sedang dibuka di Detail
    if (btnEditProyek) {
        btnEditProyek.addEventListener('click', () => {
            if (!currentProyekRow) return;
            const viewBtn = currentProyekRow.querySelector('.btn-view');
            if (!viewBtn) return;

            document.getElementById('inputNamaProyek').value = viewBtn.getAttribute('data-nama') || '';
            document.getElementById('inputPJProyek').value = viewBtn.getAttribute('data-pj') || '';
            document.getElementById('inputDeskProyek').value = viewBtn.getAttribute('data-tugas') || '';

            document.getElementById('inputDeadlineProyek').value = tanggalIndoKeInputDate(viewBtn.getAttribute('data-deadline'));

            const statusValueMap = { 'Belum Mulai': 'pending', 'Berjalan': 'progress', 'Selesai': 'done' };
            document.getElementById('inputStatusProyek').value = statusValueMap[viewBtn.getAttribute('data-status')] || 'pending';

            editingProyekRow = currentProyekRow; // aktifkan mode Edit
            modal.style.display = 'flex';
        });
    }

    // 3. Fungsi Tutup Modal (Batal)
    btnBatal.addEventListener('click', () => {
        modal.style.display = 'none';
        editingProyekRow = null;
    });

    // 4. Fungsi Simpan — Tambah baris baru ATAU update baris yang sedang diedit
    btnSimpan.addEventListener('click', () => {
        const nama = document.getElementById('inputNamaProyek')?.value || '';
        const pj = document.getElementById('inputPJProyek')?.value || '';
        const deskripsi = document.getElementById('inputDeskProyek')?.value || '';

        const deadlineInput = document.getElementById('inputDeadlineProyek')?.value || '';
        const statusValue = document.getElementById('inputStatusProyek')?.value || 'pending';

        if (nama === "" || deadlineInput === "" || pj === "") {
            alert("Harap isi Nama Proyek, PJ, dan Deadline!");
            return;
        }

        const deadline = formatTanggalKeIndo(deadlineInput); // "2026-07-22" -> "22 Juli 2026"

        let statusBadge = "";
        let statusText = "";
        if (statusValue === "pending") {
            statusBadge = '<span class="badge status-belum">Belum Mulai</span>';
            statusText = "Belum Mulai";
        } else if (statusValue === "progress") {
            statusBadge = '<span class="badge status-berjalan">Berjalan</span>';
            statusText = "Berjalan";
        } else {
            statusBadge = '<span class="badge status-selesai">Selesai</span>';
            statusText = "Selesai";
        }

        if (editingProyekRow) {
            // ===== MODE EDIT: update baris yang sudah ada, TIDAK bikin baris baru =====
            const cells = editingProyekRow.querySelectorAll('td');
            cells[0].textContent = nama;
            cells[1].innerHTML = statusBadge;
            cells[2].textContent = pj;
            cells[3].textContent = deadline;

            const viewBtn = editingProyekRow.querySelector('.btn-view');
            if (viewBtn) {
                viewBtn.setAttribute('data-nama', nama);
                viewBtn.setAttribute('data-status', statusText);
                viewBtn.setAttribute('data-pj', pj);
                viewBtn.setAttribute('data-deadline', deadline);
                viewBtn.setAttribute('data-tugas', deskripsi);
                
            }

            editingProyekRow = null; // balik ke mode Tambah setelah selesai
        } else {
            // ===== MODE TAMBAH: bikin baris baru (sama seperti sebelumnya) =====
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${nama}</td>
                <td>${statusBadge}</td>
                <td>${pj}</td> 
                <td>${deadline}</td>
                <td>
                    <button class="btn-view" 
                        onclick="tampilkanDetailProyek(this)" 
                        data-nama="${nama}" 
                        data-status="${statusText}" 
                        data-pj="${pj}" 
                        data-deadline="${deadline}" 
                        data-tugas="${deskripsi}" >
                        
                        View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        }

        // Reset inputan form
        if (document.getElementById('inputNamaProyek')) document.getElementById('inputNamaProyek').value = "";
        if (document.getElementById('inputPJProyek')) document.getElementById('inputPJProyek').value = "";
        if (document.getElementById('inputDeskProyek')) document.getElementById('inputDeskProyek').value = "";
        
        if (document.getElementById('inputDeadlineProyek')) document.getElementById('inputDeadlineProyek').value = "";
        
       
        modal.style.display = 'none';
       
        
        if (typeof hitungKorelasiProyek === 'function') {
            hitungKorelasiProyek();
        }
    });

    // 5. Tutup modal jika klik di area luar (overlay)
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            editingProyekRow = null;
        }
    });
});

/* =====================================================================
   3. HALAMAN TUGAS
   ===================================================================== */

/* ---------- 3a. Helper avatar & warna ---------- */
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

/* ---------- 3b. Update kartu statistik tugas ---------- */
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

/* ---------- 3c. Penomoran ulang kolom No ---------- */
function renomorTugas() {
  const rows = document.querySelectorAll('#taskTableBody tr');
  rows.forEach((row, i) => {
    row.children[0].textContent = i + 1;
  });
}

/* ---------- 3d. Koneksi ke backend API (database) ---------- */
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

/* ---------- 3e. Tambah / Edit Tugas (modal sama, mode berbeda) ---------- */
const btnTambahTugas = document.getElementById('btnTambahTugas');
const modalTugas = document.getElementById('modalTugas');
const modalTugasTitle = document.getElementById('modalTugasTitle');
const btnBatalTugas = document.getElementById('btnBatalTugas');
const btnSimpanTugas = document.getElementById('btnSimpanTugas');
const taskTableBody = document.getElementById('taskTableBody');

const inputNamaTugas = document.getElementById('inputNamaTugas');

const inputDeadlineTugas = document.getElementById('inputDeadlineTugas');
const inputStatusTugas = document.getElementById('inputStatusTugas');
/* ---------- 3d-2. Isi dropdown Proyek Terkait dari database ---------- */
const inputProyekTugas = document.getElementById('inputProyekTugas');

async function muatDropdownProyek() {
  if (!inputProyekTugas) return;
  try {
    const res = await fetch('http://localhost:3000/api/proyek');
    const proyekList = await res.json();

    // Kosongkan dulu, sisain opsi default
    inputProyekTugas.innerHTML = '<option value="">- Tidak terhubung ke proyek -</option>';

    proyekList.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.Nama_proyek;
      inputProyekTugas.appendChild(opt);
    });
  } catch (error) {
    console.error('Gagal memuat daftar proyek:', error);
  }
}

document.addEventListener('DOMContentLoaded', muatDropdownProyek);
let editingRow = null; // null = mode tambah, berisi <tr> = mode edit

function resetModalTugas() {
  inputNamaTugas.value = '';

  inputDeadlineTugas.value = '';
  inputStatusTugas.value = 'pending';
  if (inputProyekTugas) inputProyekTugas.value = '';
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

/* ---------- 3f. Simpan Tugas (tambah/edit) — terhubung ke database ---------- */
if (btnSimpanTugas && taskTableBody) {
  btnSimpanTugas.addEventListener('click', async () => {
    const nama = inputNamaTugas.value.trim();

    const deadline = inputDeadlineTugas.value;
    const status = inputStatusTugas.value;
    const idProyek = inputProyekTugas ? (inputProyekTugas.value || null) : null;

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
            status: statusLabel,
            id_proyek: idProyek
          })
        });
      } else {
        // MODE TAMBAH: kirim ke database lewat POST
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama_tugas: nama, deadline: deadline, status: statusLabel, id_proyek: idProyek })
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

/* ---------- 3g. Klik tombol Edit / Hapus di tabel — terhubung ke database ---------- */
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

/* ---------- 3h. Search & filter status tugas ---------- */
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

/* ---------- 3i. Sorting kolom tabel tugas (klik header) ---------- */
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


/* =====================================================================
   4. HALAMAN LAPORAN (terhubung ke database)
   ===================================================================== */
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

/* ---------- 4a. Muat data laporan dari database ---------- */
async function muatLaporanDariDatabase() {
  if (!document.querySelector('.laporan-list')) return;
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

/* ---------- 4b. Render daftar laporan (sidebar list) ---------- */
function renderLaporanList() {
  const container = document.querySelector('.laporan-list');
  if (!container) return;
  container.innerHTML = '';

  laporanData.forEach((data, index) => {
    const item = document.createElement('div');
    item.classList.add('laporan-item');
    if (index === laporanAktifIndex) item.classList.add('active');
    item.dataset.prioritas = (data.prioritas || '').toLowerCase().trim();

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

/* ---------- 4c. Tampilkan detail satu laporan ---------- */
function tampilkanLaporan(index) {
  laporanAktifIndex = index;
  const data = laporanData[index];
  if (!data) return;

  detailTitle.textContent = data.judul;
  detailPenulis.textContent = data.penulis;
  detailTanggal.textContent = formatTanggalLaporan(data.tanggal);
  detailPrioritas.textContent = data.prioritas;
  detailIsi.textContent = data.isi;

  const detailProyekTerkaitEl = document.getElementById('detail-proyek-terkait');
  if (detailProyekTerkaitEl) detailProyekTerkaitEl.textContent = data.Nama_proyek || 'Tidak terkait proyek';

  detailFile.innerHTML = `<i class="fa-solid fa-paperclip"></i> ${data.file || '-'}`;
  detailBadge.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
  detailBadge.className = "badge " + data.status;
}

function formatTanggalLaporan(tanggalISO) {
  const d = new Date(tanggalISO);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ---------- 4d. Cari laporan ---------- */
/* ---------- 4d. Cari laporan + filter prioritas (digabung, tidak saling menimpa) ---------- */
let prioritasAktifLaporan = 'semua';

function terapkanFilterLaporan() {
  const searchEl = document.getElementById('searchLaporan');
  const keyword = searchEl ? searchEl.value.toLowerCase().trim() : '';
  const items = document.querySelectorAll('.laporan-item');

  items.forEach((item, index) => {
    const data = laporanData[index];
    if (!data) return;

    const judul = data.judul.toLowerCase();
    const prioritasItem = (data.prioritas || '').toLowerCase().trim();

    const cocokKeyword = judul.includes(keyword);
    const cocokPrioritas = prioritasAktifLaporan === 'semua' || prioritasItem === prioritasAktifLaporan;

    item.style.display = (cocokKeyword && cocokPrioritas) ? '' : 'none';
  });
}

function cariLaporan() {
  terapkanFilterLaporan();
}

/* ---------- 4a-2. Muat dropdown proyek untuk form laporan ---------- */
async function muatDropdownProyekLaporan(selectedId = '') {
  const select = document.getElementById('proyekTerkaitLaporan');
  if (!select) return;
  try {
    const response = await fetch('http://localhost:3000/api/proyek');
    const data = await response.json();
    select.innerHTML = '<option value="">-- Tidak terkait proyek --</option>';
    data.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.Nama_proyek;
      if (String(p.id) === String(selectedId)) opt.selected = true;
      select.appendChild(opt);
    });
  } catch (error) {
    console.error('Gagal memuat daftar proyek untuk dropdown laporan:', error);
  }
}

/* ---------- 4e. Buka / edit / hapus / simpan laporan (modal) ---------- */
function bukaFormLaporan() {
  modeEditLaporan = null;
  document.getElementById('judulLaporan').value = '';
  document.getElementById('penulisLaporan').value = '';
  document.getElementById('prioritasLaporan').value = 'Rendah';
  document.getElementById('statusLaporan').value = 'pending';
  document.getElementById('isiLaporan').value = '';
  muatDropdownProyekLaporan();
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
  muatDropdownProyekLaporan(data.id_proyek);
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

  const idProyekTerkait = document.getElementById('proyekTerkaitLaporan')?.value || null;

  const bodyLaporan = {
    judul, penulis,
    tanggal: dataLamaTanggal,
    prioritas, status, isi,
    file: namaFile !== '-' ? namaFile : dataLamaFile,
    id_proyek: idProyekTerkait
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


function filterLaporan(btn, prioritas) {
    // ubah tombol aktif
    document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
    btn.classList.add('active');

    // simpan prioritas yang sedang aktif, lalu terapkan bareng keyword search
    prioritasAktifLaporan = prioritas;
    terapkanFilterLaporan();
}

/* =====================================================================
   5. HALAMAN PENGATURAN
   ===================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.settings-tab');
  const panels = document.querySelectorAll('.settings-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.querySelector(`.settings-panel[data-panel="${tab.dataset.tab}"]`);
      if (target) target.classList.add('active');
    });
  });
});

/* ---------- 5a. Tombol simpan (beberapa versi id/class berbeda) ---------- */
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

/* ---------- 5b. Pengaturan dashboard (tema, notif, peran, dst) ---------- */
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

/* ---------- 5c. Modal ubah password ---------- */
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

/* ---------- 5d. Inisialisasi halaman pengaturan + tombol ekspor/hubungkan ---------- */
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


/* =====================================================================
   6. CATATAN — VERSI LAMA FUNGSI LAPORAN (DUPLIKAT)
   Blok di bawah ini adalah pengulangan/definisi ulang dari beberapa
   fungsi di section 4 (renderLaporanList, cariLaporan, bukaFormLaporan)
   plus satu listener 'fileLaporan' lagi. Ini SUDAH ADA di file asli
   sebagai duplikat, dan sesuai permintaan tidak dihapus — hanya
   dikumpulkan di sini biar jelas kelihatan kalau ini pengulangan.
   Perlu diketahui: karena deklarasi function di bawah muncul BELAKANGAN
   di file, versi inilah yang sebenarnya "menang" / dipakai browser saat
   dijalankan (menimpa versi di section 4 dengan nama fungsi yang sama).
   ===================================================================== */

// RENDER DAFTAR LAPORAN (dinamis dari array laporanData)
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





function bukaFormLaporan() {
  modeEditLaporan = null;
  document.getElementById('judulLaporan').value = '';
  document.getElementById('penulisLaporan').value = '';
  document.getElementById('prioritasLaporan').value = 'Rendah';
  document.getElementById('statusLaporan').value = 'pending';
  document.getElementById('isiLaporan').value = '';
  muatDropdownProyekLaporan();
  document.getElementById('modal-laporan').classList.add('active');
}



/* =====================================================================
   4. STATISTIK OTOMATIS (Dashboard <-> Proyek via localStorage)
   ===================================================================== */

function hitungStatistikProyek() {
  const rows = document.querySelectorAll('.project-table tbody tr');
  if (rows.length === 0) return; // fungsi ini hanya jalan kalau tabel proyek ada (di proyek.html)

  let total = rows.length;
  let selesai = 0, berjalan = 0, belum = 0;

  rows.forEach((row) => {
    const badge = row.querySelector('.badge');
    if (!badge) return;
    if (badge.classList.contains('status-selesai')) selesai++;
    else if (badge.classList.contains('status-berjalan')) berjalan++;
    else if (badge.classList.contains('status-belum')) belum++;
  });

  const statistik = { total, selesai, berjalan, belum };
  localStorage.setItem('statistikProyek', JSON.stringify(statistik));
}

function tampilkanStatistikDiDashboard() {
  const statTotal = document.getElementById('statTotal');
  if (!statTotal) return; // fungsi ini hanya jalan kalau berada di dashboard.html

  const stored = localStorage.getItem('statistikProyek');
  if (!stored) return; // belum ada data tersimpan, biarkan angka default

  const data = JSON.parse(stored);
  document.getElementById('statTotal').textContent = data.total;
  document.getElementById('statSelesai').textContent = data.selesai;
  document.getElementById('statProgress').textContent = data.berjalan;
  document.getElementById('statPending').textContent = data.belum;
}

document.addEventListener('DOMContentLoaded', () => {
  hitungStatistikProyek();       // hitung ulang kalau sedang di proyek.html
if (typeof hitungKorelasiProyek === 'function') {
    hitungKorelasiProyek();
}
  tampilkanStatistikDiDashboard(); // tampilkan kalau sedang di dashboard.html
});