import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CafeDataProvider } from './context/CafeDataContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CafeDataProvider>
      <App />
    </CafeDataProvider>
  </React.StrictMode>
);
