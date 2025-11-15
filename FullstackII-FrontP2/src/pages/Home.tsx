import { useEffect, useState } from "react";
import "../styles/navbar_style.css";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

type ProductoBackend = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;          // ruta relativa o absoluta
  hover?: string | null;
  oferta?: string | null;
};

export type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;          // formateado
  imagen: string;          // URL completa
  hover?: string;
  oferta?: string;
};

type BannerBackend = {
  id: number;
  url: string;
  titulo?: string | null;
};

type Banner = {
  id: number;
  url: string;             // URL completa
  titulo?: string | null;
};

// Tarjeta de producto
function ProductCard({ producto }: { producto: Producto }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [src, setSrc] = useState(producto.imagen);

  return (
    <div className="card">
      <img
        src={src}
        alt={producto.nombre}
        className="card-img"
        onMouseEnter={() => producto.hover && setSrc(producto.hover)}
        onMouseLeave={() => setSrc(producto.imagen)}
        onClick={() => navigate(`/producto/${producto.id}`)}
      />
      <h4 onClick={() => navigate(`/producto/${producto.id}`)}>
        <b>{producto.nombre}</b>
      </h4>
      <p>{producto.descripcion}</p>
      <h4 className={producto.oferta ? "oferta" : ""}>{producto.precio}</h4>
      <button className="boton" onClick={() => addToCart(producto)}>
        Agregar al carrito
      </button>
    </div>
  );
}

export default function Home() {
  const [index, setIndex] = useState(0);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState<string | null>(null);

  // rotación automática del carrusel
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const prevSlide = () =>
    setIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );

  const nextSlide = () =>
    setIndex((prev) => (prev + 1) % banners.length);

  // cargar productos desde backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoadingProductos(true);
        setErrorProductos(null);

        const res = await fetch(`${API_BASE_URL}/api/productos`);
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data: ProductoBackend[] = await res.json();

        const mapeados: Producto[] = data.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          precio: `$${p.precio.toLocaleString("es-CL")}`,
          imagen: p.imagen.startsWith("http")
            ? p.imagen
            : `${API_BASE_URL}${p.imagen}`,
          hover: p.hover
            ? p.hover.startsWith("http")
              ? p.hover
              : `${API_BASE_URL}${p.hover}`
            : undefined,
          oferta: p.oferta ?? undefined,
        }));

        setProductos(mapeados);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setErrorProductos("No se pudieron cargar los productos.");
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();
  }, []);

  // cargar banners desde backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/banners`);
        if (!res.ok) return;

        const data: BannerBackend[] = await res.json();
        const normalizados: Banner[] = data.map((b) => ({
          id: b.id,
          titulo: b.titulo,
          url: b.url.startsWith("http")
            ? b.url
            : `${API_BASE_URL}${b.url}`,
        }));

        setBanners(normalizados);
      } catch (err) {
        console.error("Error cargando banners:", err);
      }
    };

    fetchBanners();
  }, []);

  const juegosMesa = productos.filter((p) => p.id <= 4);
  const tcg = productos.filter((p) => p.id > 4);

  return (
    <main>
      {/* Carrusel SOLO si hay banners */}
      {banners.length > 0 && (
        <div className="carousel">
          <div className="carousel-images">
            {banners.map((b, i) => (
              <img
                key={b.id}
                src={b.url}
                alt={b.titulo || `Slide ${i + 1}`}
                className={i === index ? "active" : ""}
              />
            ))}
          </div>
          <button className="carousel-btn prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="carousel-btn next" onClick={nextSlide}>
            &#10095;
          </button>
        </div>
      )}

      <section className="content" style={{ marginTop: "40px" }}>
        {loadingProductos && <p>Cargando productos...</p>}
        {errorProductos && (
          <p style={{ color: "red", marginBottom: "20px" }}>
            {errorProductos}
          </p>
        )}

        {!loadingProductos && !errorProductos && (
          <>
            <h1 className="titulos">JUEGOS DE MESA</h1>
            <div className="spacer">
              {juegosMesa.length === 0 ? (
                <p>No hay productos de mesa disponibles.</p>
              ) : (
                juegosMesa.map((p) => (
                  <ProductCard key={p.id} producto={p} />
                ))
              )}
            </div>

            <hr className="separador" />

            <h1 className="titulos">TRADING CARD GAMES</h1>
            <div className="spacer">
              {tcg.length === 0 ? (
                <p>No hay TCG disponibles.</p>
              ) : (
                tcg.map((p) => <ProductCard key={p.id} producto={p} />)
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
