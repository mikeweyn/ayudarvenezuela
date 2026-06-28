const express = require('express');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../db');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/subir', upload.single('imagen'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió imagen.' });

  const base64    = req.file.buffer.toString('base64');
  const mediaType = req.file.mimetype;
  const hospital  = req.body.hospital || 'Lista hospitalaria';

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          {
            type: 'text',
            text: `Eres un asistente humanitario. Esta imagen es una lista de pacientes de un hospital venezolano del terremoto de junio 2026.

Extrae TODOS los nombres de personas visibles. Reglas:
- Si un nombre está TACHADO, NO lo incluyas
- Separa nombre y apellido lo mejor que puedas
- Si hay barrio/ciudad junto al nombre, ponlo en "ubicacion"
- Si solo hay un campo (nombre o apellido), pon el otro como cadena vacía
- Ignora títulos de sección como "Trauma", "Neuro cirugía", "Pediatría"

Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{"personas":[{"nombre":"Juan","apellido":"Pérez","ubicacion":"La Guaira"}]}`
          }
        ]
      }]
    });

    const texto = response.content[0].text.trim();
    let datos;
    try {
      const match = texto.match(/\{[\s\S]*\}/);
      datos = JSON.parse(match ? match[0] : texto);
    } catch {
      return res.status(422).json({ error: 'No se pudo interpretar la imagen.', raw: texto });
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
    res.status(500).json({ error: 'Error al procesar la imagen.' });
  }
});

module.exports = router;
