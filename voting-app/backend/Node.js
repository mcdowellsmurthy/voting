// backend/index.js
const express = require('express');
const helmet = require('helmet'); // Seguridad de cabecera
const rateLimit = require('express-rate-limit'); // Previene ataques de fuerza bruta

const app = express();
app.use(helmet()); 
app.use(express.json());

// Limitador de solicitudes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Votación API
app.post('/vote', (req, res) => {
  const { choice } = req.body;
  if (!choice) return res.status(400).send('Choice is required');
  // (Aquí guardaríamos en base de datos)
  res.send('Vote registered');
});

app.listen(3000, () => console.log('Backend running on port 3000'));
