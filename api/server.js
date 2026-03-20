const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios'); // Modul tambahan buat nyedot file download
const proxy = require('./proxy'); // Panggil proxy.js dengan path sejajar

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Aktifkan CORS untuk mencegah blokir di Vercel
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route utama untuk memproses semua endpoint Vercel
app.post('/api/generate', upload.any(), async (req, res) => {
    try {
        const result = await proxy.handleRequest(req.body, req.files);
        res.status(200).json({ success: true, imageUrl: result });
    } catch (error) {
        console.error("Backend Error:", error.message); 
        res.status(500).json({ success: false, message: error.message });
    }
});

// Route Proxy untuk Force Download (Biar langsung ke-download, ga buka tab baru)
app.get('/api/download', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send("URL tidak valid.");

        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        let ext = 'png';
        if (contentType.includes('mp4')) ext = 'mp4';
        else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
        else if (contentType.includes('gif')) ext = 'gif';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="QuickFake_${Date.now()}.${ext}"`);
        res.send(response.data);
    } catch (error) {
        console.error("Download Proxy Error:", error.message);
        res.status(500).send("Sistem gagal mengunduh file.");
    }
});

// Wajib gunakan module.exports agar Vercel mengenali ini sebagai Serverless Function
module.exports = app;
