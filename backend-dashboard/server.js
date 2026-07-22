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
  const { status } = req.body;
  db.query(
    'UPDATE tugas SET status = ? WHERE id = ?',
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Tugas berhasil diupdate' });
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

app.listen(3000, () => {
  console.log('Server jalan di http://localhost:3000');
});