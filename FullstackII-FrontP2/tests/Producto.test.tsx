import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Producto from "../src/pages/Producto";

const mockAddToCart = vi.fn();

vi.mock("../src/context/CartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Componente <Producto />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /*verificar si los detalles del producto se muestran de manera corecta cuando se accede a un producto que existe*/
  it("muestra correctamente los datos del producto cuando existe", () => {
    render(
      <MemoryRouter initialEntries={["/producto/1"]}>
        <Routes>
          <Route path="/producto/:id" element={<Producto />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /¿Alcachofas\? ¡No, gracias!/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Un juego de cartas sin corazón - DEVIR/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/\$9\.990/)).toBeInTheDocument();
  });

  /*verifica que cuando se intente acceder a un producto que no existe muestre
   el mensaje "Producto no encontrado" y quebotón "Volver a Home" redirija correctamente*/
  it("muestra 'Producto no encontrado' si el id no existe", () => {
    render(
      <MemoryRouter initialEntries={["/producto/999"]}>
        <Routes>
          <Route path="/producto/:id" element={<Producto />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Producto no encontrado")).toBeInTheDocument();

    const volverButton = screen.getByRole("button", { name: /volver a home/i });
    fireEvent.click(volverButton);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  /*verificar que la imagen del producto se carga correctamente*/
  it("muestra la imagen del producto correctamente", () => {
    render(
      <MemoryRouter initialEntries={["/producto/1"]}>
        <Routes>
          <Route path="/producto/:id" element={<Producto />} />
        </Routes>
      </MemoryRouter>
    );

    const imagen = screen.getByRole("img");
    expect(imagen).toBeInTheDocument();
    expect(imagen).toHaveAttribute(
      "alt",
      expect.stringContaining("¿Alcachofas? ¡No, gracias!")
    );
    expect(imagen).toHaveAttribute(
      "src",
      expect.stringContaining("/img/juegos_mesa/")
    );
  });

  /*verifica al hacer click en el botón agregar al carriot, se llame a addToCart con los datos correctos del producto*/
  it("agrega el producto correcto al carrito", () => {
    render(
      <MemoryRouter initialEntries={["/producto/1"]}>
        <Routes>
          <Route path="/producto/:id" element={<Producto />} />
        </Routes>
      </MemoryRouter>
    );

    const botonAgregar = screen.getByRole("button", {
      name: /agregar al carrito/i,
    });
    fireEvent.click(botonAgregar);

    /*verifica que se llame a addToCart con el producto correcto*/
    expect(mockAddToCart).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        nombre: "¿Alcachofas? ¡No, gracias!",
        precio: "$9.990",
        descripcion: "Un juego de cartas sin corazón - DEVIR",
        imagen: expect.stringContaining("alcachofas-no-gracias"),
        hover: expect.stringContaining("alcachofas-no-gracias-contenido"),
      })
    );
  });

  /*verifica que la descripcióndel producto se muestra con el estilo correcto*/
  it("muestra la descripción corta con el formato adecuado", () => {
    render(
      <MemoryRouter initialEntries={["/producto/1"]}>
        <Routes>
          <Route path="/producto/:id" element={<Producto />} />
        </Routes>
      </MemoryRouter>
    );

    const descripcion = screen.getByText(
      /Un juego de cartas sin corazón - DEVIR/i
    );
    expect(descripcion).toBeInTheDocument();
    expect(descripcion).toHaveStyle({
      fontSize: "18px",
      color: "rgb(102, 102, 102)",
      marginBottom: "20px",
    });
  });
});
