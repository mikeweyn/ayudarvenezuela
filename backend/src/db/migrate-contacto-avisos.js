require('dotenv').config();
const pool = require('./index');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE avisos ADD COLUMN IF NOT EXISTS contacto TEXT;
    `);
    console.log('✅ Columna contacto agregada a avisos');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();
