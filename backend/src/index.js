require('dotenv').config();
const express = require('express');
const cors = require('cors');

const personasRouter = require('./routes/personas');
const avisosRouter = require('./routes/avisos');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/personas', personasRouter);
app.use('/api/avisos', avisosRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
