import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
if (!container) {
  throw new Error("Impossible de trouver l'élément #root dans le HTML");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// optionnel : activer la collecte de métriques
reportWebVitals();
