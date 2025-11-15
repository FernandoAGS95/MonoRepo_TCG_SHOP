import { useEffect, useState } from "react";
import "../styles/admin_style.css";
import { API_BASE_URL } from "../config/api";

// ==== Tipos ====
type ContactMessage = {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  mensaje: string;
  timestamp: string;
};

type LoginAttempt = {
  id: number;
  email: string;
  success: boolean;
  timestamp: string;
};

type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
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
  url: string;          // URL completa
  titulo?: string | null;
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState<
    "mensajes" | "intentos" | "productos" | "banners"
  >("mensajes");

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Cargar mensajes e intentos desde localStorage
  useEffect(() => {
    try {
      const m = localStorage.getItem("contact_messages");
      setMessages(m ? JSON.parse(m) : []);
    } catch {}

    try {
      const a = localStorage.getItem("login_attempts");
      setAttempts(a ? JSON.parse(a) : []);
    } catch {}
  }, []);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        setProductsError(null);

        const res = await fetch(`${API_BASE_URL}/api/productos`);
        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data = (await res.json()) as Product[];
        const ajustados = data.map((p) => ({
          ...p,
          imagen: p.imagen.startsWith("http")
            ? p.imagen
            : `${API_BASE_URL}${p.imagen}`,
          hover: p.hover
            ? p.hover.startsWith("http")
              ? p.hover
              : `${API_BASE_URL}${p.hover}`
            : undefined,
        }));
        setProducts(ajustados);
      } catch (err) {
        console.error("Error cargando productos:", err);
        setProductsError("No se pudieron cargar los productos.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  // Cargar banners desde backend
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

  // ====== BORRAR DATOS LOCALSTORAGE ======
  const clearMessages = () => {
    localStorage.removeItem("contact_messages");
    setMessages([]);
  };

  const clearAttempts = () => {
    localStorage.removeItem("login_attempts");
    setAttempts([]);
  };

  // ====== CRUD PRODUCTOS ======

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const nombre = (form.elements.namedItem("nombre") as HTMLInputElement).value;
    const descripcion = (
      form.elements.namedItem("descripcion") as HTMLInputElement
    ).value;
    const precioStr = (form.elements.namedItem("precio") as HTMLInputElement)
      .value;
    const oferta = (form.elements.namedItem("oferta") as HTMLInputElement).value;
    const imagenInput = form.elements.namedItem("imagen") as HTMLInputElement;
    const hoverInput = form.elements.namedItem("hover") as HTMLInputElement;

    const precio = parseInt(precioStr, 10);
    const imagenFile = imagenInput.files?.[0];
    const hoverFile = hoverInput.files?.[0];

    if (!imagenFile) {
      alert("Debes seleccionar una imagen principal");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("precio", isNaN(precio) ? "0" : String(precio));
    if (oferta) formData.append("oferta", oferta);
    formData.append("imagen", imagenFile);
    if (hoverFile) formData.append("hover", hoverFile);

    try {
      const res = await fetch(`${API_BASE_URL}/api/productos/con-imagen`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }
      const creado = (await res.json()) as Product;

      const ajustado: Product = {
        ...creado,
        imagen: creado.imagen.startsWith("http")
          ? creado.imagen
          : `${API_BASE_URL}${creado.imagen}`,
        hover: creado.hover
          ? creado.hover.startsWith("http")
            ? creado.hover
            : `${API_BASE_URL}${creado.hover}`
          : undefined,
      };

      setProducts((prev) => [...prev, ajustado]);
      form.reset();
      alert("Producto creado correctamente");
    } catch (err) {
      console.error("Error creando producto:", err);
      alert("No se pudo crear el producto.");
    }
  };

  const handleEditProduct = async (p: Product) => {
    const nombre = prompt("Nuevo nombre:", p.nombre);
    if (!nombre) return;

    const descripcion = prompt("Nueva descripción:", p.descripcion);
    if (!descripcion) return;

    const precioStr = prompt(
      "Nuevo precio (solo número, sin puntos):",
      p.precio.toString()
    );
    const precio = precioStr ? parseInt(precioStr, 10) : p.precio;

    const oferta =
      prompt("Oferta (ej: 'oferta' o vacío):", p.oferta || "") || "";

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append(
      "precio",
      isNaN(precio) ? String(p.precio) : String(precio)
    );
    if (oferta) formData.append("oferta", oferta);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/productos/${p.id}/con-imagen`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }
      const actualizado = (await res.json()) as Product;

      const ajustado: Product = {
        ...actualizado,
        imagen: actualizado.imagen.startsWith("http")
          ? actualizado.imagen
          : `${API_BASE_URL}${actualizado.imagen}`,
        hover: actualizado.hover
          ? actualizado.hover.startsWith("http")
            ? actualizado.hover
            : `${API_BASE_URL}${actualizado.hover}`
          : undefined,
      };

      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? ajustado : x))
      );
      alert("Producto actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando producto:", err);
      alert("No se pudo actualizar el producto.");
    }
  };

  const handleUpdateImages = async (
    e: React.FormEvent<HTMLFormElement>,
    p: Product
  ) => {
    e.preventDefault();
    const form = e.currentTarget;

    const imagenInput = form.elements.namedItem("imagen") as HTMLInputElement;
    const hoverInput = form.elements.namedItem("hover") as HTMLInputElement;

    const imagenFile = imagenInput.files?.[0];
    const hoverFile = hoverInput.files?.[0];

    if (!imagenFile && !hoverFile) {
      alert("Selecciona al menos una imagen para actualizar");
      return;
    }

    const fd = new FormData();
    fd.append("nombre", p.nombre);
    fd.append("descripcion", p.descripcion);
    fd.append("precio", String(p.precio));
    if (p.oferta) fd.append("oferta", p.oferta);
    if (imagenFile) fd.append("imagen", imagenFile);
    if (hoverFile) fd.append("hover", hoverFile);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/productos/${p.id}/con-imagen`,
        {
          method: "PUT",
          body: fd,
        }
      );
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }
      const actualizado = (await res.json()) as Product;

      const ajustado: Product = {
        ...actualizado,
        imagen: actualizado.imagen.startsWith("http")
          ? actualizado.imagen
          : `${API_BASE_URL}${actualizado.imagen}`,
        hover: actualizado.hover
          ? actualizado.hover.startsWith("http")
            ? actualizado.hover
            : `${API_BASE_URL}${actualizado.hover}`
          : undefined,
      };

      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? ajustado : x))
      );
      form.reset();
      alert("Imágenes actualizadas correctamente");
    } catch (err) {
      console.error("Error actualizando imágenes:", err);
      alert("No se pudieron actualizar las imágenes.");
    }
  };

  const handleDeleteProduct = async (p: Product) => {
    if (!confirm(`¿Seguro que quieres eliminar "${p.nombre}"?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/productos/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Error HTTP ${res.status}`);
      }
      setProducts((prev) => prev.filter((x) => x.id !== p.id));
    } catch (err) {
      console.error("Error eliminando producto:", err);
      alert("No se pudo eliminar el producto.");
    }
  };

  // ====== CRUD BANNERS (ARCHIVOS) ======

  const handleCreateBanner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const titulo = (form.elements.namedItem("titulo") as HTMLInputElement).value;
    const imagenInput = form.elements.namedItem("imagen") as HTMLInputElement;
    const imagenFile = imagenInput.files?.[0];

    if (!imagenFile) {
      alert("Debes seleccionar una imagen para el banner");
      return;
    }

    const fd = new FormData();
    fd.append("imagen", imagenFile);
    if (titulo) fd.append("titulo", titulo);

    try {
      const res = await fetch(`${API_BASE_URL}/api/banners/con-imagen`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const creado: BannerBackend = await res.json();
      const normalizado: Banner = {
        id: creado.id,
        titulo: creado.titulo,
        url: creado.url.startsWith("http")
          ? creado.url
          : `${API_BASE_URL}${creado.url}`,
      };

      setBanners((prev) => [...prev, normalizado]);
      form.reset();
    } catch (err) {
      console.error("Error creando banner:", err);
      alert("No se pudo crear el banner.");
    }
  };

  const handleUpdateBanner = async (
    e: React.FormEvent<HTMLFormElement>,
    b: Banner
  ) => {
    e.preventDefault();
    const form = e.currentTarget;

    const tituloInput = form.elements.namedItem("titulo") as HTMLInputElement;
    const imagenInput = form.elements.namedItem("imagen") as HTMLInputElement;

    const titulo = tituloInput.value || b.titulo || "";
    const imagenFile = imagenInput.files?.[0];

    if (!imagenFile && titulo === (b.titulo || "")) {
      alert("No hay cambios para guardar");
      return;
    }

    const fd = new FormData();
    if (titulo) fd.append("titulo", titulo);
    if (imagenFile) fd.append("imagen", imagenFile);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/banners/${b.id}/con-imagen`,
        {
          method: "PUT",
          body: fd,
        }
      );
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

      const actualizado: BannerBackend = await res.json();
      const normalizado: Banner = {
        id: actualizado.id,
        titulo: actualizado.titulo,
        url: actualizado.url.startsWith("http")
          ? actualizado.url
          : `${API_BASE_URL}${actualizado.url}`,
      };

      setBanners((prev) =>
        prev.map((x) => (x.id === b.id ? normalizado : x))
      );
      form.reset();
      alert("Banner actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando banner:", err);
      alert("No se pudo actualizar el banner.");
    }
  };

  const handleDeleteBanner = async (b: Banner) => {
    if (!confirm(`¿Eliminar banner "${b.titulo || b.url}"?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/banners/${b.id}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error(`Error HTTP ${res.status}`);
      }
      setBanners((prev) => prev.filter((x) => x.id !== b.id));
    } catch (err) {
      console.error("Error eliminando banner:", err);
      alert("No se pudo eliminar el banner.");
    }
  };

  // ====== RENDER ======

  return (
    <main className="admin-panel">
      <h1>Panel de Administrador</h1>

      <div className="tabs">
        <button
          className={activeTab === "mensajes" ? "active" : ""}
          onClick={() => setActiveTab("mensajes")}
        >
          📩 Mensajes
        </button>
        <button
          className={activeTab === "intentos" ? "active" : ""}
          onClick={() => setActiveTab("intentos")}
        >
          🔑 Intentos Login
        </button>
        <button
          className={activeTab === "productos" ? "active" : ""}
          onClick={() => setActiveTab("productos")}
        >
          🛒 Productos
        </button>
        <button
          className={activeTab === "banners" ? "active" : ""}
          onClick={() => setActiveTab("banners")}
        >
          🖼️ Banners
        </button>
      </div>

      <div className="tab-content">
        {/* MENSAJES */}
        {activeTab === "mensajes" && (
          <section>
            <h2>Mensajes de Contacto ({messages.length})</h2>
            <button onClick={clearMessages}>Borrar mensajes</button>
            {messages.length === 0 ? (
              <p>No hay mensajes.</p>
            ) : (
              <ul>
                {messages
                  .slice()
                  .reverse()
                  .map((m) => (
                    <li key={m.id}>
                      <strong>
                        {m.nombre} {m.apellido}
                      </strong>{" "}
                      — {m.correo}
                      <div>{m.mensaje}</div>
                    </li>
                  ))}
              </ul>
            )}
          </section>
        )}

        {/* INTENTOS LOGIN */}
        {activeTab === "intentos" && (
          <section>
            <h2>Intentos de Login ({attempts.length})</h2>
            <button onClick={clearAttempts}>Borrar intentos</button>
            {attempts.length === 0 ? (
              <p>No hay intentos.</p>
            ) : (
              <ul>
                {attempts
                  .slice()
                  .reverse()
                  .map((a) => (
                    <li key={a.id}>
                      {a.email} — {a.success ? "✅ OK" : "❌ FALLIDO"} —{" "}
                      {new Date(a.timestamp).toLocaleString()}
                    </li>
                  ))}
              </ul>
            )}
          </section>
        )}

        {/* PRODUCTOS */}
        {activeTab === "productos" && (
          <section className="admin-section">
            <h2>Productos ({products.length})</h2>

            {loadingProducts && <p>Cargando productos...</p>}
            {productsError && (
              <p style={{ color: "red" }}>{productsError}</p>
            )}

            <form className="admin-form" onSubmit={handleCreateProduct}>
              <input name="nombre" placeholder="Nombre" required />
              <input name="descripcion" placeholder="Descripción" required />
              <input
                name="precio"
                type="number"
                step="1"
                placeholder="Precio en pesos (ej: 9990)"
                required
              />
              <input
                name="oferta"
                placeholder="Etiqueta oferta (opcional, ej: oferta)"
              />
              <label>
                Imagen principal:
                <input name="imagen" type="file" accept="image/*" required />
              </label>
              <label>
                Imagen hover (opcional):
                <input name="hover" type="file" accept="image/*" />
              </label>
              <button type="submit">Agregar producto</button>
            </form>

            {products.length === 0 ? (
              <p>No hay productos.</p>
            ) : (
              <div className="product-list">
                {products.map((p) => (
                  <div key={p.id} className="product-card">
                    <img src={p.imagen} alt={p.nombre} />
                    <h3>{p.nombre}</h3>
                    <p className="description">{p.descripcion}</p>
                    <div className="price">
                      ${p.precio.toLocaleString("es-CL")}
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleEditProduct(p)}>
                        ✏️ Editar texto
                      </button>
                      <button onClick={() => handleDeleteProduct(p)}>
                        🗑️ Eliminar
                      </button>
                    </div>

                    <form
                      className="image-update-form"
                      onSubmit={(e) => handleUpdateImages(e, p)}
                    >
                      <label>
                        Nueva imagen principal:
                        <input name="imagen" type="file" accept="image/*" />
                      </label>
                      <label>
                        Nueva imagen hover:
                        <input name="hover" type="file" accept="image/*" />
                      </label>
                      <button type="submit">Actualizar imágenes</button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* BANNERS */}
        {activeTab === "banners" && (
          <section>
            <h2>Banners del Carrusel ({banners.length})</h2>

            {/* Crear banner con archivo */}
            <form onSubmit={handleCreateBanner} className="form-box">
              <label>
                Imagen del banner:
                <input name="imagen" type="file" accept="image/*" required />
              </label>
              <input name="titulo" placeholder="Título (opcional)" />
              <button type="submit">Agregar banner</button>
            </form>

            {banners.length === 0 ? (
              <p>No hay banners.</p>
            ) : (
              <ul className="banner-list">
                {banners.map((b) => (
                  <li key={b.id} className="banner-item">
                    <img src={b.url} alt={b.titulo || "banner"} width={250} />
                    <div>
                      <p>{b.titulo || "(sin título)"}</p>
                    </div>
                    <button onClick={() => handleDeleteBanner(b)}>
                      Eliminar
                    </button>

                    {/* Form para actualizar título/imagen */}
                    <form
                      className="banner-update-form"
                      onSubmit={(e) => handleUpdateBanner(e, b)}
                    >
                      <input
                        name="titulo"
                        placeholder="Nuevo título (opcional)"
                      />
                      <label>
                        Nueva imagen:
                        <input name="imagen" type="file" accept="image/*" />
                      </label>
                      <button type="submit">Actualizar banner</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
