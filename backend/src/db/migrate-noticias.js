require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:tjehruTOzjiVcDciKBHbJaWQEHqiARTV@reseau.proxy.rlwy.net:36764/railway',
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS noticias (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      titulo TEXT NOT NULL,
      contenido TEXT NOT NULL,
      imagen TEXT,
      autor TEXT NOT NULL,
      fuente TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Tabla noticias creada.');

  await pool.query(`
    INSERT INTO noticias (titulo, contenido, imagen, autor, fuente)
    VALUES ($1, $2, $3, $4, $5)
  `, [
    'Primeros Auxilios Psicológicos Gratuitos — Vía Online',
    'Psicólogas venezolanas radicadas en el exterior ofrecen atención psicológica gratuita para personas afectadas por el terremoto, sus familias, rescatistas y voluntarios. La atención es completamente online. Registrate en el formulario y te contactarán a la brevedad. Lic. Yoliana Benítez (F.P.V. 6187), Lic. Saribay Negrín (F.P.V. 6669), Lic. Almara García (F.P.V. 6466).',
    '/psicologos.jpeg',
    'Psicólogas Venezolanas UCV en el Exterior',
    'https://forms.gle/bHobusEtmTH87rb7',
  ]);
  console.log('Primera noticia insertada.');
  await pool.end();
}

main().catch(e => { console.error(e.message); process.exit(1); });
