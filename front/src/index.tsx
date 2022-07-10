import React from 'react';
import ReactDOM from 'react-dom/client';
import QrCode from './pages/qrcode';
import RouterAplication from './router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterAplication />
  </React.StrictMode>,
);
