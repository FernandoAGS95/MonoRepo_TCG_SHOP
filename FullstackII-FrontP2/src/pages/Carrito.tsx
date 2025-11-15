import { useCart } from "../context/CartContext";
import "../styles/carrito_style.css";

export default function Carrito() {
  const { items, addToCart, decreaseFromCart, removeFromCart, clearCart } = useCart();

  const subtotal = items.reduce(
    (acc, item) =>
      acc + parseInt(item.producto.precio.replace(/[^0-9]/g, "")) * item.cantidad,
    0
  );

  if (items.length === 0) {
    return (
      <main style={{ marginTop: "120px", padding: "20px" }}>
        <h1>Tu carrito está vacío 🛒</h1>
      </main>
    );
  }

  return (
    <main style={{ marginTop: "120px", padding: "20px" }}>
  
      <div className="carrito-container">
        {items.map(({ producto, cantidad }) => (
          <div key={producto.id} className="carrito-item">
            <img src={producto.imagen} alt={producto.nombre} />
            <div className="carrito-info">
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>

              {/* Controles de cantidad */}
              <div className="cantidad-control">
                <button onClick={() => decreaseFromCart(producto.id)}>-</button>
                <span>{cantidad}</span>
                <button onClick={() => addToCart(producto)}>+</button>
              </div>

              <p>
                Precio unitario: ${parseInt(producto.precio.replace(/[^0-9]/g, "")).toLocaleString("es-CL")}
              </p>
              <p>
                Total: $
                {(
                  parseInt(producto.precio.replace(/[^0-9]/g, "")) * cantidad
                ).toLocaleString("es-CL")}
              </p>

              <button
                className="boton eliminar"
                onClick={() => removeFromCart(producto.id)}
              >
                Eliminar producto
              </button>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <h2>Subtotal: ${subtotal.toLocaleString("es-CL")}</h2>
      <button className="boton vaciar" onClick={clearCart}>
        Vaciar carrito
      </button>
    </main>
  );
}
