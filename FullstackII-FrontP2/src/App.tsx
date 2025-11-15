import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import Producto from "./pages/Producto";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { CartProvider } from "./context/CartContext";
import Register from "./pages/Register";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/producto/:id" element={<Producto />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}
