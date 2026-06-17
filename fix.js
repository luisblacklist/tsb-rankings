const fs = require('fs');
let c = fs.readFileSync('server.js', 'utf8');
c = c.replace(
  "app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));",
  "const PORT = process.env.PORT || 3000;\napp.listen(PORT, () => console.log('Puerto: ' + PORT));"
);
fs.writeFileSync('server.js', c);
console.log('OK');