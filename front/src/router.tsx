import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import QrCode from "./pages/qrcode";

export default function RouterAplication() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="qrcode" element={<QrCode />} />
      </Routes>
    </BrowserRouter>
  )
}
