import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener los votos iniciales del backend
    axios.get('http://backend:3000/votes')  // Aquí usamos el nombre del servicio en Docker
      .then(response => {
        setVotes(response.data);  // Actualizamos el estado con los votos
        setLoading(false);  // Cambiamos el estado de carga
      })
      .catch(error => {
        console.error('Error al obtener los votos:', error);
        setLoading(false);  // Finalizamos la carga si hay un error
      });
  }, []);  // Este hook se ejecuta solo una vez al cargar el componente

  // Función para manejar el voto (incrementar el voto en el frontend)
  const handleVote = (optionId) => {
    // Buscamos la opción que el usuario seleccionó
    const updatedVotes = votes.map(vote =>
      vote.id === optionId
        ? { ...vote, count: vote.count + 1 }  // Incrementamos el voto localmente
        : vote
    );

    // Actualizamos el estado con la nueva lista de votos
    setVotes(updatedVotes);

    // Opcionalmente, puedes hacer una solicitud al backend para que registre el voto
    // Pero no es necesario si solo quieres que el frontend maneje la lógica
    axios.post('http://backend:3000/votes', { optionId })
      .catch(error => {
        console.error('Error al votar:', error);
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Votación</h1>
      <div>
        {votes.map(vote => (
          <div key={vote.id}>
            <button onClick={() => handleVote(vote.id)}>
              Votar por {vote.option}
            </button>
            <p>{vote.option}: {vote.count} votos</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
