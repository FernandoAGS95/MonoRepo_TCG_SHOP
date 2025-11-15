// src/pages/Producto.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/producto_style.css";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

type ProductoBackend = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  hover?: string | null;
  oferta?: string | null;
};

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string; // string con $
  imagen: string;
  hover?: string;
  oferta?: string;
};

export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/productos/${id}`);
        if (res.status === 404) {
          setProducto(null);
          setError("Producto no encontrado");
          return;
        }
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data: ProductoBackend = await res.json();

        const mapeado: Producto = {
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: `$${data.precio.toLocaleString("es-CL")}`,
          imagen: data.imagen.startsWith("http")
            ? data.imagen
            : `${API_BASE_URL}${data.imagen}`,
          hover: data.hover
            ? data.hover.startsWith("http")
              ? data.hover
              : `${API_BASE_URL}${data.hover}`
            : undefined,
          oferta: data.oferta ?? undefined,
        };

        setProducto(mapeado);
      } catch (err) {
        console.error("Error cargando producto:", err);
        setError("No se pudo cargar el producto. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return (
      <main style={{ marginTop: "120px", padding: "20px", textAlign: "center" }}>
        <h1>Cargando producto...</h1>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main style={{ marginTop: "120px", padding: "20px", textAlign: "center" }}>
        <h1>{error || "Producto no encontrado"}</h1>
        <button onClick={() => navigate("/")} style={{ marginTop: "20px" }}>
          Volver a Home
        </button>
      </main>
    );
  }

  return (
    <main style={{ marginTop: "120px", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Imagen */}
        <div style={{ flex: 1 }}>
          <img
            src={producto.imagen}
            alt={producto.nombre}
            style={{ width: "100%", maxWidth: "500px", borderRadius: "8px" }}
          />
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <h1>{producto.nombre}</h1>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
            {producto.descripcion}
          </p>

          <h2
            className={producto.oferta ? "oferta" : ""}
            style={{ fontSize: "28px", marginBottom: "20px" }}
          >
            {producto.precio}
          </h2>

          <button onClick={() => addToCart(producto)}>Agregar al carrito</button>
        </div>
      </div>
    </main>
  );
}
