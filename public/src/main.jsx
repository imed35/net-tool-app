import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Standard way to load Tailwind CSS utility classes
import './index.css'; 

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
