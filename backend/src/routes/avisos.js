const express = require('express');
const router = express.Router();
const pool = require('../db');

// Agregar aviso sobre una persona
router.post('/', async (req, res) => {
  const { persona_id, autor, texto, ubicacion } = req.body;

  if (!persona_id || !autor || !texto) {
    return res.status(400).json({ error: 'persona_id, autor y texto son obligatorios.' });
  }

  try {
    // Verificar que la persona existe
    const { rows: [persona] } = await pool.query(
      'SELECT id FROM personas WHERE id = $1',
      [persona_id]
    );
    if (!persona) return res.status(404).json({ error: 'Persona no encontrada.' });

    const { rows: [aviso] } = await pool.query(
      `INSERT INTO avisos (persona_id, autor, texto, ubicacion)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [persona_id, autor.trim(), texto.trim(), ubicacion?.trim() || null]
    );
    res.status(201).json(aviso);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar aviso.' });
  }
});

module.exports = router;
