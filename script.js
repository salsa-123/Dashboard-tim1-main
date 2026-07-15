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
     if (!targetPage) return;


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


// TAMBAH TUGAS
const btnTambahTugas = document.getElementById('btnTambahTugas');
const modalTugas = document.getElementById('modalTugas');
const btnBatalTugas = document.getElementById('btnBatalTugas');
const btnSimpanTugas = document.getElementById('btnSimpanTugas');
const taskTableBody = document.getElementById('taskTableBody');

btnTambahTugas.addEventListener('click', () => {
  modalTugas.classList.add('active');
});

btnBatalTugas.addEventListener('click', () => {
  modalTugas.classList.remove('active');
});

btnSimpanTugas.addEventListener('click', () => {
  const nama = document.getElementById('inputNamaTugas').value.trim();
  const penanggung = document.getElementById('inputPenanggungTugas').value.trim();
  const deadline = document.getElementById('inputDeadlineTugas').value;
  const status = document.getElementById('inputStatusTugas').value;

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

  document.getElementById('inputNamaTugas').value = '';
  document.getElementById('inputPenanggungTugas').value = '';
  document.getElementById('inputDeadlineTugas').value = '';
  modalTugas.classList.remove('active');
});


// TAMBAH Laporan
  document.querySelector('.btn-submit').addEventListener('click', function() {
    // 1. Mengambil nilai dari input dan textarea
    const judul = document.getElementById('judulLaporan').value;
    const isi = document.getElementById('isiLaporan').value;

    // 2. Validasi sederhana agar tidak mengirim laporan kosong
    if (judul === '' || isi === '') {
      alert('Mohon isi judul dan isi laporan!');
      return;
    }

    // 3. Membuat elemen laporan baru
    const reportList = document.getElementById('riwayatLaporan');
    const emptyMsg = document.querySelector('.empty-msg');
    
    // Hapus pesan "Belum ada laporan" jika sudah ada laporan
    if (emptyMsg) emptyMsg.remove();

    // 4. Membuat kartu laporan baru
    const newReport = document.createElement('div');
    newReport.style.cssText = "background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #00b894;";
    newReport.innerHTML = `
      <h4 style="margin: 0 0 5px 0;">${judul}</h4>
      <p style="margin: 0;">${isi}</p>
    `;

    // 5. Menambahkan ke daftar dan mengosongkan form
    reportList.appendChild(newReport);
    document.getElementById('judulLaporan').value = '';
    document.getElementById('isiLaporan').value = '';
  });

// LOGOUT
document.getElementById('btnLogout').addEventListener('click', function(e) {
  e.preventDefault();
  if (confirm('Yakin ingin logout?')) {
    alert('Anda telah logout. Sampai jumpa lagi!');
  }
});

// ===========================
// DARK MODE
// ===========================

const themeSelect = document.getElementById("themeSelect");

themeSelect.addEventListener("change", function(){

    if(this.value === "dark"){
        document.body.classList.add("dark-mode");
    }else{
        document.body.classList.remove("dark-mode");
    }

});

const savedTheme=localStorage.getItem("theme");

if(savedTheme){

    document.body.classList.add(savedTheme);

    themeSelect.value=savedTheme==="dark-mode"
        ?"dark"
        :"light";

}


// Tunggu hingga dokumen dimuat
document.addEventListener('DOMContentLoaded', function() {
    
    // Ambil elemen tombol berdasarkan ID
    const btnSimpan = document.getElementById('btn-simpan');
    
    if (btnSimpan) {
        // Tambahkan fungsi saat tombol diklik
        btnSimpan.addEventListener('click', function(event) {
            // Mencegah halaman reload jika di dalam formulir
            event.preventDefault(); 
            
            // Pesan konfirmasi
            alert("Perubahan Berhasil Disimpan!");
            
            // Masukkan logika penyimpanan data Anda di sini
        });
    }
});


document.getElementById('btnSimpan').addEventListener('click', function() {
    // Logika untuk menyimpan tugas Anda di sini
    console.log("Tombol Simpan diklik!");
    
    // Contoh: ambil data dari input
    const namaTugas = document.querySelector('input[name="namaTugas"]').value;
    alert("Tugas '" + namaTugas + "' berhasil disimpan!");
});

document.querySelector('.btn-simpan').addEventListener('click', function() {
    alert('Tombol berhasil diklik!');
    // Tambahkan logika untuk menyimpan data di sini
});

/* ==========================
   DATA TIM
========================== */

const dataTim = {
    1: {
        judul: "Tim 1 : Logo",
        isi: `
            <h2>🎨 Tim Logo</h2>
            <p>
                Tim ini bertugas membuat desain logo, branding,
                identitas visual, serta guideline perusahaan.
            </p>

            <hr>

            <h3>Anggota</h3>

            <ul>
                <li>👨‍🎨 User A1 - Lead Designer</li>
                <li>🎬 User B1 - Motion Graphic Editor</li>
            </ul>
        `
    },

    2: {
        judul: "Tim 2 : Kuliner",
        isi: `
            <h2>🍔 Tim Kuliner</h2>

            <p>
                Tim ini mengerjakan branding bisnis makanan
                dan minuman.
            </p>

            <hr>

            <h3>Anggota</h3>

            <ul>
                <li>📈 User A2 - Brand Strategist</li>
                <li>📷 User B2 - Content Creator</li>
            </ul>
        `
    },

    3: {
        judul: "Tim 3 : Dashboard Project",
        isi: `
            <h2>💻 Tim Dashboard</h2>

            <p>
                Tim ini bertanggung jawab mengembangkan dashboard,
                frontend, backend, serta database.
            </p>

            <hr>

            <h3>Anggota</h3>

            <ul>
                <li>⚙ User A3 - Full Stack Developer</li>
                <li>🗄 User B3 - Database Engineer</li>
            </ul>
        `
    }
};


/* ==========================
   MODAL
========================== */

function detailTim(id) {

    document.getElementById("modalTitle").innerHTML = dataTim[id].judul;

    document.getElementById("modalBody").innerHTML = dataTim[id].isi;

    document.getElementById("teamModal").style.display = "flex";

}

function tutupModal() {

    document.getElementById("teamModal").style.display = "none";

}

window.addEventListener("click", function(e){

    const modal = document.getElementById("teamModal");

    if(e.target === modal){

        modal.style.display = "none";

    }

});


/* ==========================
   ANIMASI CARD
========================== */

document.addEventListener("DOMContentLoaded", function () {

    const cards = document.querySelectorAll(".team-card");

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

            }

        });

    }, {
        threshold: 0.2
    });

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";
        card.style.transition = `all .6s ease ${index * 0.2}s`;

        observer.observe(card);

    });

});

