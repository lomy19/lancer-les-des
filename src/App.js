import React, { useState, useEffect, Suspense } from 'react';
import './App.css';
import { Canvas } from '@react-three/fiber';
import Cube from './components/Dice/cube.js';

function App() {
  const [valeur, setValeur] = useState(0);
  const [historique, setHistorique] = useState([]);
  const [message, setMessage] = useState('');
  const [isRolling, setIsRolling] = useState(false);
  const [targetValue, setTargetValue] = useState(1);

  function lancerEtAjouter() {
    if (isRolling) return;
    const nouvelleValeur = Math.floor(Math.random() * 6) + 1;
    setValeur(nouvelleValeur);
    setHistorique(prev => [...prev, nouvelleValeur]);
    setTargetValue(nouvelleValeur);
    setIsRolling(true);
    setTimeout(() => {
      setIsRolling(false);
    }, 1000);
  }

  useEffect(() => {
    setMessage(valeur === 6 ? 'Vous avez fait un 6!' : '');
  }, [valeur]);

  return (
    <div className="App">
      <h1>Lancer de dé</h1>

      <div className="canvas">
        <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
          <ambientLight intensity={1} />
          <Suspense fallback={null}>
            <Cube face={targetValue} isRolling={isRolling} />
          </Suspense>
        </Canvas>
      </div>

      <div>
        <button onClick={lancerEtAjouter} disabled={isRolling}>
          {isRolling ? 'Lancement...' : 'Lancer le dé'}
        </button>

        <div>
          {valeur ? (
            <p>
              Valeur actuelle : <strong>{valeur}</strong>
            </p>
          ) : (
            <p>Pas de valeur pour le moment, veuillez lancer le dé.</p>
          )}
          {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
      </div>

      <div>
        <h2>Historique des lancers :</h2>
        {historique.length > 0 ? (
          <ul>
            {historique.map((val, i) => (
              <li key={i}>
                Lancer n°{i + 1} : {val}
              </li>
            ))}
          </ul>
        ) : (
          <p>Pas d'historique pour le moment, veuillez lancer le dé.</p>
        )}
      </div>
    </div>
  );
}

export default App;
