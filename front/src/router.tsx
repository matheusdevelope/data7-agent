import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import QrCode from './pages/qrcode';
import QrCodeToLogin from './pages/qrcode_login_mobile';

export default function RouterAplication() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="qrcode" element={<QrCode />} />
        <Route path="login_with_qrcode" element={<QrCodeToLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
