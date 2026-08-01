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
    const [rows] = await db.query(`
        SELECT tugas.*, proyek.nama_proyek 
        FROM tugas 
        LEFT JOIN proyek ON tugas.id_proyek = proyek.id
        ORDER BY tugas.id DESC
    `);
    res.json(rows);
});

      app.post("/api/tugas", async (req, res) => {
            const { nama_tugas, deadline, status, id_proyek } = req.body;
            await db.query("INSERT INTO tugas (nama_tugas, deadline, status, id_proyek) VALUES (?, ?, ?, ?)", [nama_tugas, deadline, status, id_proyek || null]);
            res.status(201).json({ message: "Tugas berhasil ditambahkan" });
        });

        app.put("/api/tugas/:id", async (req, res) => {
            const { nama_tugas, deadline, status, id_proyek } = req.body;
            await db.query("UPDATE tugas SET nama_tugas = ?, deadline = ?, status = ?, id_proyek = ? WHERE id = ?", [nama_tugas, deadline, status, id_proyek || null, req.params.id]);
            res.json({ message: "Tugas berhasil diupdate" });
        });

        app.delete("/api/tugas/:id", async (req, res) => {
            await db.query("DELETE FROM tugas WHERE id = ?", [req.params.id]);
            res.json({ message: "Tugas berhasil dihapus" });
        });


        // ======================= ENDPOINT LAPORAN ======================= //
        app.get('/api/laporan', async (req, res) => {
            const [rows] = await db.query(`
                SELECT laporan.*, proyek.Nama_proyek 
                FROM laporan 
                LEFT JOIN proyek ON laporan.id_proyek = proyek.id 
                ORDER BY laporan.tanggal DESC
            `);
            res.json(rows);
        });

        app.post('/api/laporan', async (req, res) => {
            const { judul, penulis, tanggal, status, isi, file, id_proyek } = req.body;
            const prioritas = req.body.prioritas || 'Rendah';
            await db.query('INSERT INTO laporan (judul, penulis, tanggal, prioritas, status, isi, file, id_proyek) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [judul, penulis, tanggal, prioritas, status, isi, file, id_proyek || null]);
            res.json({ message: "Laporan berhasil ditambahkan" });
        });

        app.put('/api/laporan/:id', async (req, res) => {
            const {
                judul,
                penulis,
                tanggal,
                prioritas,
                status,
                isi,
                file,
                id_proyek
            } = req.body;

            await db.query(
                `UPDATE laporan
                 SET
                    judul = ?,
                    penulis = ?,
                    tanggal = ?,
                    prioritas = ?,
                    status = ?,
                    isi = ?,
                    file = ?,
                    id_proyek = ?
                 WHERE id = ?`,
                [
                    judul,
                    penulis,
                    tanggal,
                    prioritas,
                    status,
                    isi,
                    file,
                    id_proyek,
                    req.params.id
                ]
            );

            res.json({ message: 'Laporan berhasil diupdate' });
        });

        app.delete('/api/laporan/:id', async (req, res) => {
            await db.query('DELETE FROM laporan WHERE id = ?', [req.params.id]);
            res.json({ message: 'Laporan berhasil dihapus' });
        });


        // ======================= ENDPOINT PROYEK ======================= //
        app.get("/api/proyek", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*,
                (SELECT COUNT(*) FROM tugas t WHERE t.id_proyek = p.id) AS total_tugas,
                (SELECT COUNT(*) FROM tugas t WHERE t.id_proyek = p.id AND t.status = 'Selesai') AS tugas_selesai
            FROM proyek p
            ORDER BY p.id DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data", error: error.message });
    }
});
        

        app.post("/api/proyek", async (req, res) => {
            try {
                const { Nama_proyek, Status, Pj, Deadline } = req.body;
                await db.query(
                    "INSERT INTO proyek (Nama_proyek, Status, Pj, Deadline) VALUES (?, ?, ?, ?)",
                    [Nama_proyek, Status, Pj, Deadline]
                );
                res.status(201).json({ message: "Proyek berhasil ditambahkan" });
            } catch (error) {
                res.status(500).json({ message: "Gagal menambah proyek", error: error.message });
            }
        });

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

        app.delete("/api/proyek/:id", async (req, res) => {
    try {
        const idProyek = req.params.id;

        // 1. Hapus dulu semua laporan yang terkait proyek ini
        await db.query("DELETE FROM laporan WHERE id_proyek = ?", [idProyek]);

        // 2. Hapus juga semua tugas yang terkait proyek ini
        await db.query("DELETE FROM tugas WHERE id_proyek = ?", [idProyek]);

        // 3. Baru hapus proyeknya
        await db.query("DELETE FROM proyek WHERE id = ?", [idProyek]);

        res.json({ message: "Proyek, laporan, dan tugas terkait berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus proyek", error: error.message });
    }
});

        app.get("/api/proyek/:id/laporan", async (req, res) => {
            try {
                const [rows] = await db.query("SELECT * FROM laporan WHERE id_proyek = ? ORDER BY tanggal DESC", [req.params.id]);
                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: "Gagal mengambil laporan proyek", error: error.message });
            }
        });

        app.get("/api/proyek/:id/tugas", async (req, res) => {
            try {
                const [rows] = await db.query("SELECT * FROM tugas WHERE id_proyek = ? ORDER BY deadline ASC", [req.params.id]);
                res.json(rows);
            } catch (error) {
                res.status(500).json({ message: "Gagal mengambil tugas proyek", error: error.message });
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