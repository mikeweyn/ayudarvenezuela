const express = require('express');
const router = express.Router();
const pool = require('../db');

// Buscar personas por nombre/apellido
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Ingresa al menos 2 caracteres para buscar.' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT id, nombre, apellido, estado, ultima_ubicacion, mensaje, contacto, foto_url,
              registrado_por, tipo_registro, created_at,
              similarity(nombre || ' ' || apellido, $1) AS sim
       FROM personas
       WHERE nombre || ' ' || apellido ILIKE $2
          OR similarity(nombre || ' ' || apellido, $1) > 0.2
       ORDER BY sim DESC, created_at DESC
       LIMIT 30`,
      [q.trim(), `%${q.trim()}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al buscar.' });
  }
});

// Obtener persona por id (con sus avisos)
router.get('/:id', async (req, res) => {
  try {
    const { rows: [persona] } = await pool.query(
      `SELECT id, nombre, apellido, cedula, estado, ultima_ubicacion, mensaje, contacto,
              foto_url, registrado_por, tipo_registro, created_at
       FROM personas WHERE id = $1`,
      [req.params.id]
    );

    if (!persona) return res.status(404).json({ error: 'Persona no encontrada.' });

    const { rows: avisos } = await pool.query(
      `SELECT id, autor, texto, ubicacion, contacto, created_at
       FROM avisos WHERE persona_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({ ...persona, avisos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener persona.' });
  }
});

// Registrar una persona
router.post('/', async (req, res) => {
  const { nombre, apellido, cedula, estado, ultima_ubicacion, mensaje, contacto, foto_url, registrado_por, tipo_registro } = req.body;

  if (!nombre || !apellido || !registrado_por) {
    return res.status(400).json({ error: 'Nombre, apellido y quien registra son obligatorios.' });
  }

  try {
    const { rows: [persona] } = await pool.query(
      `INSERT INTO personas (nombre, apellido, cedula, estado, ultima_ubicacion, mensaje, contacto, foto_url, registrado_por, tipo_registro)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        nombre.trim(),
        apellido.trim(),
        cedula?.trim() || null,
        estado || 'desconocido',
        ultima_ubicacion?.trim() || null,
        mensaje?.trim() || null,
        contacto?.trim() || null,
        foto_url?.trim() || null,
        registrado_por.trim(),
        tipo_registro || 'familiar',
      ]
    );
    res.status(201).json(persona);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar persona.' });
  }
});

// Listar personas (con filtro opcional ?estado=desaparecido)
router.get('/', async (req, res) => {
  const { estado } = req.query;
  try {
    let rows;
    if (estado) {
      ({ rows } = await pool.query(
        `SELECT id, nombre, apellido, estado, ultima_ubicacion, registrado_por, tipo_registro, created_at
         FROM personas WHERE estado = $1 ORDER BY created_at DESC LIMIT 100`,
        [estado]
      ));
    } else {
      ({ rows } = await pool.query(
        `SELECT id, nombre, apellido, estado, ultima_ubicacion, registrado_por, tipo_registro, created_at
         FROM personas ORDER BY created_at DESC LIMIT 100`
      ));
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar.' });
  }
});

module.exports = router;
