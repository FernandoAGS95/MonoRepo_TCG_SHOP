// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import authService from "../services/AuthService";
import "../styles/navbar_style.css";

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);

      if (isAuth) {
        const userData = authService.getUserData();
        if (userData) {
          setUserName(userData.nombreCompleto);
        }
      } else {
        setUserName("");
      }
    };

    checkAuth();
  }, [location]);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserName("");
    navigate("/");
  };

  return (
    <header>
      <nav id="navbar" className={`navbar-scope ${scrolled ? "solid" : ""}`}>
        {!scrolled && (
          <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Buscar..." />
            <button type="submit">
              <img src="/img/search.png" alt="buscar" width="10" />
            </button>
          </form>
        )}

        <img
          src="https://static.wixstatic.com/media/cc32b2_4cd9801bbc844d7f9fce1e92f80fa270~mv2.png"
          alt="logo"
          className={`logo ${scrolled ? "small" : ""}`}
        />

        <div
          className={`hamburger ${menuOpen ? "active" : ""} ${
            scrolled ? "scrolled" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul
          className={`nav-menu ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <li>
            <NavLink to="/">Inicio</NavLink>
          </li>
          <li>
            <NavLink to="/contacto">Contacto</NavLink>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <span className={`user-name ${scrolled ? "scrolled" : ""}`}>
                  👤 {userName}
                </span>
              </li>
              {authService.isAdmin() && (
                <li>
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              )}
              <li>
                <button
                  className={`logout-button ${scrolled ? "scrolled" : ""}`}
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          )}

          <li>
            <NavLink to="/carrito">
              Carrito{" "}
              {count > 0 && (
                <span id="cart-count" className="cart-count">
                  {count}
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
