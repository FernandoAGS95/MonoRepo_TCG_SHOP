// src/context/CartContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen: string;
  hover?: string;
  oferta?: string;
};

type CartItem = {
  producto: Producto;
  cantidad: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (producto: Producto) => void;
  decreaseFromCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (producto: Producto) => {
    setItems((prev) => {
      const existe = prev.find((item) => item.producto.id === producto.id);
      if (existe) {
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const decreaseFromCart = (id: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (id: number) =>
    setItems((prev) => prev.filter((item) => item.producto.id !== id));

  const clearCart = () => setItems([]);

  const count = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
