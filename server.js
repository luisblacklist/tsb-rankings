const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

let memoriaVisitas = [];

function leerVisitas() {
  try {
    if (fs.existsSync('visitas.json')) {
      return JSON.parse(fs.readFileSync('visitas.json', 'utf8'));
    }
  } catch(e) {}
  return memoriaVisitas;
}

function guardarVisita(visita) {
  try {
    const data = leerVisitas();
    data.push(visita);
    fs.writeFileSync('visitas.json', JSON.stringify(data, null, 2));
  } catch(e) {
    memoriaVisitas.push(visita);
  }
}

app.get('/api/visita', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const visita = {
    ip: ip,
    fecha: new Date().toISOString(),
    navegador: req.headers['user-agent']
  };
  guardarVisita(visita);
  res.json({ ok: true });
});

app.get('/api/admin', (req, res) => {
  const pass = req.headers['x-admin-pass'];
  if (pass !== 'admin1234') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  res.json(leerVisitas());
});

app.post('/api/limpiar', (req, res) => {
  const pass = req.headers['x-admin-pass'];
  if (pass !== 'admin1234') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    fs.writeFileSync('visitas.json', '[]');
  } catch(e) {
    memoriaVisitas = [];
  }
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log('Puerto: ' + PORT));