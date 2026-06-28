const express = require('express');
const multer  = require('multer');
const pool    = require('../db');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    cb(null, file.mimetype.startsWith('image/'));
  },
});

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, titulo, contenido, imagen, autor, fuente, created_at
       FROM noticias ORDER BY created_at DESC LIMIT 50`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar noticias.' });
  }
});

router.post('/', upload.single('imagen'), async (req, res) => {
  const { titulo, contenido, autor, fuente } = req.body;
  if (!titulo?.trim() || !contenido?.trim() || !autor?.trim()) {
    return res.status(400).json({ error: 'Título, contenido y autor son obligatorios.' });
  }

  let imagen = null;
  if (req.file) {
    imagen = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO noticias (titulo, contenido, imagen, autor, fuente)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo.trim(), contenido.trim(), imagen, autor.trim(), fuente?.trim() || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al publicar noticia.' });
  }
});

module.exports = router;
