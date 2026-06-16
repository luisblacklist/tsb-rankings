const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Registra cada visita
app.get('/api/visita', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const visita = {
    ip: ip,
    fecha: new Date().toISOString(),
    navegador: req.headers['user-agent']
  };

  let data = [];
  if (fs.existsSync('visitas.json')) {
    data = JSON.parse(fs.readFileSync('visitas.json', 'utf8'));
  }
  data.push(visita);
  fs.writeFileSync('visitas.json', JSON.stringify(data, null, 2));

  res.json({ ok: true });
});

// Ruta admin protegida con contraseña
app.get('/api/admin', (req, res) => {
  const pass = req.headers['x-admin-pass'];
  if (pass !== 'admin1234') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  let data = [];
  if (fs.existsSync('visitas.json')) {
    data = JSON.parse(fs.readFileSync('visitas.json', 'utf8'));
  }
  res.json(data);
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));