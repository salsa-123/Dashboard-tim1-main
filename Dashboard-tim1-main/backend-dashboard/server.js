const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'teamwork_db'
});

db.connect((err) => {
  if (err) {
    console.error('Gagal konek database:', err);
    return;
  }
  console.log('Berhasil konek ke database MySQL');
});

app.get('/api/tugas', (req, res) => {
  db.query('SELECT * FROM tugas', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/tugas', (req, res) => {
  const { nama_tugas, deadline, status } = req.body;
  db.query(
    'INSERT INTO tugas (nama_tugas, deadline, status) VALUES (?, ?, ?)',
    [nama_tugas, deadline, status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, nama_tugas, deadline, status });
    }
  );
});

app.put('/api/tugas/:id', (req, res) => {

    console.log("BODY:", req.body);
    console.log("ID:", req.params.id);

    const { nama_tugas, deadline, status } = req.body;

    db.query(
        `UPDATE tugas
         SET nama_tugas=?, deadline=?, status=?
         WHERE id=?`,
        [nama_tugas, deadline, status, req.params.id],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }

            console.log(result);

            res.json({ message: "berhasil" });
        }
    );
});

app.delete('/api/tugas/:id', (req, res) => {
  db.query('DELETE FROM tugas WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tugas berhasil dihapus' });
  });
});

// ======================= ENDPOINT LAPORAN =======================

// GET semua laporan
app.get('/api/laporan', (req, res) => {
  db.query('SELECT * FROM laporan ORDER BY tanggal DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST tambah laporan baru
app.post('/api/laporan', (req, res) => {
  const { judul, penulis, tanggal, prioritas, status, isi, file } = req.body;
  db.query(
    'INSERT INTO laporan (judul, penulis, tanggal, prioritas, status, isi, file) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [judul, penulis, tanggal, prioritas, status, isi, file],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, judul, penulis, tanggal, prioritas, status, isi, file });
    }
  );
});

// PUT edit laporan
app.put('/api/laporan/:id', (req, res) => {
  const { judul, penulis, tanggal, prioritas, status, isi, file } = req.body;
  db.query(
    'UPDATE laporan SET judul=?, penulis=?, tanggal=?, prioritas=?, status=?, isi=?, file=? WHERE id=?',
    [judul, penulis, tanggal, prioritas, status, isi, file, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Laporan berhasil diupdate' });
    }
  );
});

// DELETE laporan
app.delete('/api/laporan/:id', (req, res) => {
  db.query('DELETE FROM laporan WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Laporan berhasil dihapus' });
  });
});

async function kirimDataTugas(data) {
    const response = await fetch('/api/tugas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (response.ok) {
        alert('Tugas berhasil ditambah!');
        location.reload(); // Refresh halaman untuk melihat data baru
    }
}

// ======================= ENDPOINT TUGAS ======================= //
const mysql = require("mysql2/promise"); // npm install mysql2

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",          // isi sesuai password MySQL kamu
  database: "dashboard_tim1", // sesuaikan nama database
});

// GET semua tugas
app.get("/api/tugas", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM tugas ORDER BY id DESC");
  res.json(rows);
});

// POST tambah tugas
app.post("/api/tugas", async (req, res) => {
  const { nama_tugas, deadline, status } = req.body;
  await db.query(
    "INSERT INTO tugas (nama_tugas, deadline, status) VALUES (?, ?, ?)",
    [nama_tugas, deadline, status]
  );
  res.status(201).json({ message: "Tugas berhasil ditambahkan" });
});

// DELETE tugas
app.delete("/api/tugas/:id", async (req, res) => {
  await db.query("DELETE FROM tugas WHERE id = ?", [req.params.id]);
  res.json({ message: "Tugas berhasil dihapus" });
});

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});