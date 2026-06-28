require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:tjehruTOzjiVcDciKBHbJaWQEHqiARTV@reseau.proxy.rlwy.net:36764/railway',
  ssl: { rejectUnauthorized: false },
});

pool.query('ALTER TABLE personas ADD COLUMN IF NOT EXISTS cedula TEXT;')
  .then(() => { console.log('Columna cedula agregada.'); pool.end(); })
  .catch(e => { console.error(e.message); pool.end(); });
