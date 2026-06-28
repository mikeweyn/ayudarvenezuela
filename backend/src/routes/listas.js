const express = require('express');
const multer = require('multer');
const { OpenAI } = require('openai');
const rateLimit = require('express-rate-limit');
const pool = require('../db');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten imágenes.'));
    }
    cb(null, true);
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Máximo 10 subidas por hora por IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: 'Límite alcanzado. Máximo 10 listas por hora. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const PROMPT = `Eres un sistema de validación y extracción para una plataforma humanitaria del terremoto en Venezuela 2026.

PASO 1 — VALIDACIÓN:
Determina si esta imagen es una lista de pacientes, heridos, desaparecidos o personas afectadas por una emergencia (puede ser escrita a mano o impresa).
Si NO es una lista de este tipo (es una foto de personas, paisaje, documento sin nombres, etc.), responde SOLO:
{"valida": false, "motivo": "explicación breve"}

PASO 2 — EXTRACCIÓN (solo si es válida):
Extrae TODOS los nombres de personas visibles. Reglas:
- Si un nombre está TACHADO, NO lo incluyas
- Separa nombre y apellido lo mejor que puedas
- Si hay barrio/ciudad junto al nombre, ponlo en "ubicacion"
- Ignora títulos de sección como "Trauma", "Neuro cirugía", "Pediatría", "Piso 6", etc.
- Si una entrada tiene solo apellido o solo nombre, pon el otro campo como cadena vacía

Responde SOLO con JSON válido, sin texto adicional:
{"valida": true, "personas": [{"nombre": "Juan", "apellido": "Pérez", "ubicacion": "La Guaira"}]}`;

router.post('/subir', limiter, upload.single('imagen'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen.' });

  const base64    = req.file.buffer.toString('base64');
  const mediaType = req.file.mimetype;
  const hospital  = (req.body.hospital || 'Lista hospitalaria').trim();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}`, detail: 'high' } },
          { type: 'text', text: PROMPT },
        ],
      }],
    });

    const texto = response.choices[0].message.content.trim();
    let datos;
    try {
      const match = texto.match(/\{[\s\S]*\}/);
      datos = JSON.parse(match ? match[0] : texto);
    } catch {
      return res.status(422).json({ error: 'No se pudo interpretar la imagen.', raw: texto });
    }

    // Rechazar si la imagen no es una lista válida
    if (!datos.valida) {
      return res.status(400).json({
        error: 'La imagen no parece ser una lista de pacientes.',
        motivo: datos.motivo || 'Verificá que sea una lista escrita con nombres de personas.',
      });
    }

    const personas = (datos.personas || []).filter(p => p.nombre || p.apellido);
    let importados = 0;

    for (const p of personas) {
      const ubicacion = p.ubicacion ? `${hospital} - ${p.ubicacion}` : hospital;
      await pool.query(
        `INSERT INTO personas (nombre, apellido, estado, ultima_ubicacion, registrado_por, tipo_registro)
         VALUES ($1, $2, 'herido', $3, $4, 'testigo')`,
        [p.nombre || 'Sin nombre', p.apellido || 'Sin apellido', ubicacion, hospital]
      );
      importados++;
    }

    res.json({ importados, personas });
  } catch (err) {
    console.error('Error procesando lista:', err.message);
    res.status(500).json({ error: 'Error al procesar la imagen. Intentá de nuevo.' });
  }
});

module.exports = router;
