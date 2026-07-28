const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fungsi utama untuk menjalankan server agar koneksi database stabil
async function startServer() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'teamwork_db'
        });

        console.log('Berhasil konek ke database MySQL');


        // ======================= ENDPOINT TUGAS ======================= //
        app.get("/api/tugas", async (req, res) => {
            const [rows] = await db.query("SELECT * FROM tugas ORDER BY id DESC");
            res.json(rows);
        });

        app.post("/api/tugas", async (req, res) => {
            const { nama_tugas, deadline, status } = req.body;
            await db.query("INSERT INTO tugas (nama_tugas, deadline, status) VALUES (?, ?, ?)", [nama_tugas, deadline, status]);
            res.status(201).json({ message: "Tugas berhasil ditambahkan" });
        });

        app.put("/api/tugas/:id", async (req, res) => {
            const { nama_tugas, deadline, status } = req.body;
            await db.query("UPDATE tugas SET nama_tugas = ?, deadline = ?, status = ? WHERE id = ?", [nama_tugas, deadline, status, req.params.id]);
            res.json({ message: "Tugas berhasil diupdate" });
        });

        app.delete("/api/tugas/:id", async (req, res) => {
            await db.query("DELETE FROM tugas WHERE id = ?", [req.params.id]);
            res.json({ message: "Tugas berhasil dihapus" });
        });


        // ======================= ENDPOINT LAPORAN ======================= //
        app.get('/api/laporan', async (req, res) => {
            const [rows] = await db.query('SELECT * FROM laporan ORDER BY tanggal DESC');
            res.json(rows);
        });

        app.post('/api/laporan', async (req, res) => {
            const { judul, penulis, tanggal, prioritas, status, isi, file } = req.body;
            await db.query('INSERT INTO laporan (judul, penulis, tanggal, prioritas, status, isi, file) VALUES (?, ?, ?, ?, ?, ?, ?)', [judul, penulis, tanggal, prioritas, status, isi, file]);
            res.json({ message: "Laporan berhasil ditambahkan" });
        });

        app.put('/api/laporan/:id', async (req, res) => {
            const { judul, penulis, tanggal, prioritas, status, isi, file } = req.body;
            await db.query('UPDATE laporan SET judul=?, penulis=?, tanggal=?, prioritas=?, status=?, isi=?, file=? WHERE id=?', [judul, penulis, tanggal, prioritas, status, isi, file, req.params.id]);
            res.json({ message: 'Laporan berhasil diupdate' });
        });

        app.delete('/api/laporan/:id', async (req, res) => {
            await db.query('DELETE FROM laporan WHERE id = ?', [req.params.id]);
            res.json({ message: 'Laporan berhasil dihapus' });
        });

        // // =============================== ENDPOINT PROYEK =============================== //

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Pastikan install mysql2

const app = express();

// --- Konfigurasi Database (Sesuaikan dengan settingan XAMPP Anda) ---
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'teamwork_db'
});

// Middleware
app.use(cors());
app.use(express.json());

// --- ENDPOINT PROYEK ---

// 1. GET: Ambil semua data
app.get("/api/proyek", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM proyek ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data", error: error.message });
  }
});

// 2. POST: Tambah data
app.post("/api/proyek", async (req, res) => {
  try {
    const { Nama_proyek, Status, Pj, Deadline, Deskripsi, lanjutan } = req.body;
    await db.query(
      "INSERT INTO proyek (Nama_proyek, Status, Pj, Deadline, Deskripsi, lanjutan) VALUES (?, ?, ?, ?, ?, ?)",
      [Nama_proyek, Status, Pj, Deadline, Deskripsi, lanjutan]
    );
    res.status(201).json({ message: "Proyek berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah proyek", error: error.message });
  }
});

// 3. PUT: Update data
app.put("/api/proyek/:id", async (req, res) => {
  try {
    const { Nama_proyek, Status, Pj, Deadline } = req.body;
    await db.query(
      "UPDATE proyek SET Nama_proyek = ?, Status = ?, Pj = ?, Deadline = ? WHERE id = ?",
      [Nama_proyek, Status, Pj, Deadline, req.params.id]
    );
    res.json({ message: "Proyek berhasil diupdate" });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengupdate proyek", error: error.message });
  }
});

// 4. DELETE: Hapus data
app.delete("/api/proyek/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM proyek WHERE id = ?", [req.params.id]);
    res.json({ message: "Proyek berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus proyek", error: error.message });
  }
});

        // Jalankan Server //
        app.listen(3000, () => {
            console.log('Server jalan di http://localhost:3000');
        });

    } catch (err) {
        console.error('Gagal konek ke database:', err);
    }
}

startServer();