require('dotenv').config();
const express = require('express');
const cors = require('cors');

const personasRouter = require('./routes/personas');
const avisosRouter = require('./routes/avisos');
const listasRouter = require('./routes/listas');

const app = express();
const PORT = process.env.PORT || 3001;

const origenesPermitidos = [
  'https://ayudarvenezuela.com',
  'https://www.ayudarvenezuela.com',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: origenesPermitidos,
}));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/personas', personasRouter);
app.use('/api/avisos', avisosRouter);
app.use('/api/listas', listasRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
