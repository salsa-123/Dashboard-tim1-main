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

  
  // ==========================================
  // KODE UTK MODAL DETAIL PROYEK (DIBUTUHKAN KEMBALI BUNGKUS TRACK)
  // ==========================================
  if (track && modalDetail) {
    track.addEventListener('click', (e) => {
      
      // 3. JIKA YANG DIKLIK ADALAH KARTU PROYEK (BUKAN PANAH)
      const item = e.target.closest('.project-item');
      if (!item) return;

      // Tarik judul dan isi data tersembunyi (.dash-keterangan) dari kartu
      const title = item.querySelector('.project-header h3').innerText;
      
      // Ambil element badge asli dari kartu
      const originalBadge = item.querySelector('.project-header .badge');
      const badgeText = originalBadge ? originalBadge.innerText : 'Berjalan';
      
      // Sesuaikan class badge agar menggunakan style baru
      let badgeClass = 'badge-berjalan';
      if (badgeText.includes('Belum')) badgeClass = 'badge-pending';
      if (badgeText.includes('Selesai')) badgeClass = 'badge-done';

      // Ambil data Tugas & Deadline dari paragraph bawaan kartu
      const paragraphs = item.querySelectorAll('.dash-keterangan p');
      let tugasText = '';
      paragraphs.forEach(p => {
        if (p.innerText.includes('Tugas:')) {
          tugasText = p.innerHTML.replace(/<\/?span[^>]*>/g, "").replace('Tugas:', '').trim();
        }
      });

      const sudahSampaiText = item.dataset.sudahSampai || "Sidebar, halaman Tugas, dan halaman Anggota Tim sudah selesai dibuat.";
      const lanjutanText = item.dataset.lanjutan || "Integrasi halaman Laporan dan menyambungkan form Pengaturan.";
      
      // Susun ulang struktur HTML agar rapi
      let detailsHtml = `
        <span class="badge ${badgeClass}">${badgeText}</span>
        <p><strong>Tugas:</strong> ${tugasText || 'Membangun dashboard internal untuk manajemen tugas tim.'}</p>
        <p><strong>Sudah sampai:</strong> ${sudahSampaiText}</p>
        <p><strong>Lanjutan:</strong> ${lanjutanText}</p>
      `;

      // Buka modal dengan data lengkap
      modalTitle.innerText = `Detail Kelengkapan: ${title}`;
      modalBody.innerHTML = detailsHtml;
      modalDetail.classList.add('active');
    });
  }


  // Tombol X untuk tutup detail modal
  if (closeModalBtn && modalDetail) {
    closeModalBtn.addEventListener('click', () => {
      modalDetail.classList.remove('active');
    });
  }

  // 🔵 Tambahan: Tombol "Tutup" di bagian footer modal bawah
  const btnTutupFooter = document.querySelector('.btn-tutup-footer');
  if (btnTutupFooter && modalDetail) {
    btnTutupFooter.addEventListener('click', () => {
      modalDetail.classList.remove('active');
    });
  }

  // Klik luar kotak putih untuk menutup modal detail
  if (modalDetail) {
    modalDetail.addEventListener('click', (e) => {
      if (e.target === modalDetail) {
        modalDetail.classList.remove('active');
      }
    });
  }
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


  // 🟢 B. LOGIKA TAMBAH PROYEK BARU (DENGAN STRUKTUR CAROUSEL ASLI)
  const btnTambahProyek = document.getElementById('btnTambahProyek');
  const modalProyek = document.getElementById('modalProyek');
  const btnBatalProyek = document.getElementById('btnBatalProyek');
  const btnSimpanProyek = document.getElementById('btnSimpanProyek');
  const projectGrid = document.getElementById('dashboardTrack'); 

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

      // Menambahkan proyek baru mengikuti layout asli dashboard Anda
      const card = document.createElement('div');
      card.classList.add('project-item'); 
      card.innerHTML = `
        <div class="project-logo-row">
          <div class="project-logo-emblem" style="background: #ffffff">
            <img src="emblem/1.jpg" alt="Logo" style="width: 400px; height: auto;">
          </div>
        </div>
        <div class="project-keterangan-row">
          <div class="project-header">
            <h3>${nama}</h3>
            <span class="badge ${s.badge}">${s.label}</span>
          </div>
          <div class="dash-keterangan">
            <p><span class="ket-label">Tugas:</span> ${desk}</p>
            <p><span class="ket-label">Deadline:</span> ${deadlineFormatted}</p>
          </div>
          <div class="project-progress-below">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${s.progress}%;"></div>
            </div>
            <span class="progress-percent">${s.progress}%</span>
          </div>
        </div>
      `;

      projectGrid.appendChild(card);

      // Reset data form input
      inputNama.value = '';
      if (inputDesk) inputDesk.value = '';
      inputDeadline.value = '';
      modalProyek.classList.remove('active');
    });
  }



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

document.addEventListener('DOMContentLoaded', updateStatTugas);

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

function buatBadgeHTML(statusKey) {
  const found = Object.values(statusMapTugas).find(s => s.key === statusKey);
  return `<span class="status ${found.key}"><i class="fa-solid ${found.icon}"></i> ${found.label}</span>`;
}

if (btnSimpanTugas && taskTableBody) {
  btnSimpanTugas.addEventListener('click', () => {
    const nama = inputNamaTugas.value.trim();

    const deadline = inputDeadlineTugas.value;
    const status = inputStatusTugas.value;

    if (!nama || !deadline) {
      alert('Semua kolom wajib diisi!');
      return;
    }

    const s = statusMapTugas[status];
    const deadlineFormatted = new Date(deadline).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });


    if (editingRow) {
      // MODE EDIT: perbarui baris yang sudah ada
      editingRow.setAttribute('data-status', s.key);
      editingRow.children[1].textContent = nama;
      editingRow.children[2].textContent = deadlineFormatted;
      editingRow.children[3].innerHTML = buatBadgeHTML(s.key);
    } else {
      // MODE TAMBAH: buat baris baru
      const row = document.createElement('tr');
      row.setAttribute('data-status', s.key);
      row.innerHTML = `
        <td></td>
        <td>${nama}</td>
        
        <td>${deadlineFormatted}</td>
        <td>${buatBadgeHTML(s.key)}</td>
        <td>
          <div class="action-cell">
            <button class="icon-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn delete" title="Hapus"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      `;
      taskTableBody.appendChild(row);
    }

 modalTugas.classList.remove('active');
    resetModalTugas();
    renomorTugas();
    updateStatTugas();
  });
}

// ==================================================================
// LANJUTAN HALAMAN TUGAS: klik tombol Edit / Hapus di tabel
// ==================================================================
if (taskTableBody) {
  taskTableBody.addEventListener('click', (e) => {
    const btnHapus = e.target.closest('.icon-btn.delete');
    const btnEdit = e.target.closest('.icon-btn:not(.delete)');

    if (btnHapus) {
      if (confirm('Yakin ingin menghapus tugas ini?')) {
        btnHapus.closest('tr').remove();
        renomorTugas();
        updateStatTugas();
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

const detailBadge = document.querySelector(".detail-header .badge");

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
   LAPORAN AKTIF (index yang sedang ditampilkan)
============================================ */
let laporanAktifIndex = 0;

// Update tampilkanLaporan supaya menyimpan index yang sedang aktif
function tampilkanLaporan(index){

    laporanAktifIndex = index; // <-- TAMBAHAN INI

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
   EDIT LAPORAN
============================================ */
let modeEditLaporan = false;

const btnEdit = document.querySelector(".btn-edit");
btnEdit.addEventListener("click", () => {
    const data = laporanData[laporanAktifIndex];
    modeEditLaporan = true;

    document.getElementById('judulLaporan').value = data.judul;
    document.getElementById('penulisLaporan').value = data.penulis;
    document.getElementById('prioritasLaporan').value = data.prioritas;
    document.getElementById('statusLaporan').value = data.status;
    document.getElementById('isiLaporan').value = data.isi;

    bukaFormLaporan();
});

/* ============================================
   HAPUS LAPORAN
============================================ */
const btnDelete = document.querySelector(".btn-delete");
btnDelete.addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin menghapus laporan ini?")) {
        laporanData.splice(laporanAktifIndex, 1);

        if (laporanData.length > 0) {
            renderLaporanList();
            tampilkanLaporan(0);
        } else {
            document.querySelector('.laporan-detail').innerHTML =
                '<p style="padding:20px;">Tidak ada laporan tersisa.</p>';
            document.querySelector('.laporan-list').innerHTML = '';
        }

        alert("Laporan berhasil dihapus.");
    }
});


/* ============================================
   LOAD PERTAMA
============================================ */
renderLaporanList();
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


function simpanLaporan() {
    const judul = document.getElementById('judulLaporan').value.trim();
    const penulis = document.getElementById('penulisLaporan').value.trim();
    const prioritas = document.getElementById('prioritasLaporan').value;
    const status = document.getElementById('statusLaporan').value;
    const isi = document.getElementById('isiLaporan').value.trim();

    // TAMBAHAN: ambil nama file yang dilampirkan
    const fileInput = document.getElementById('fileLaporan');
    const namaFile = fileInput.files.length > 0 ? fileInput.files[0].name : '-';

    if (!judul || !penulis || !isi) {
        alert('Judul, penulis, dan isi laporan wajib diisi!');
        return;
    }

    const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    const laporanBaru = {
        judul: judul,
        tanggal: tanggalSekarang,
        penulis: penulis,
        prioritas: prioritas,
        status: status,
        file: namaFile, // <-- diganti dari '-' jadi nama file asli
        isi: isi
    };

    laporanData.unshift(laporanBaru);
    renderLaporanList();
    tampilkanLaporan(0);

    tutupModalLaporan();
    alert('Laporan berhasil dibuat!');
}

function tutupModalLaporan() {
    const modal = document.getElementById('modal-laporan');
    if (modal) modal.classList.remove('active');

    document.getElementById('judulLaporan').value = '';
    document.getElementById('penulisLaporan').value = '';
    document.getElementById('isiLaporan').value = '';
    document.getElementById('prioritasLaporan').value = 'Rendah';
    document.getElementById('statusLaporan').value = 'pending';

    // TAMBAHAN: reset file upload
    document.getElementById('fileLaporan').value = '';
    document.getElementById('fileLaporanNama').textContent = 'Klik untuk lampirkan file';
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
                <span>${data.tanggal}</span>
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