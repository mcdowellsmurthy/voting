const express = require('express');
const app = express();
app.use(express.json()); // Para manejar datos JSON en las solicitudes POST

let votes = [
  { id: 1, option: 'Option 1', count: 10 },
  { id: 2, option: 'Option 2', count: 5 },
  { id: 3, option: 'Option 3', count: 3 }
];

// Ruta GET para obtener los votos
app.get('/votes', (req, res) => {
  res.json(votes); // Devuelve los votos actuales
});

// Ruta POST para recibir el voto, pero no incrementar el contador aquí
app.post('/votes', (req, res) => {
  const { optionId } = req.body;
  
  // Encontrar el voto basado en el ID
  const vote = votes.find(vote => vote.id === optionId);
  
  if (vote) {
    res.status(200).json(vote);  // Solo devolvemos la opción de voto sin incrementarla
  } else {
    res.status(404).send('Opción no encontrada');
  }
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
