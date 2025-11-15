// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login_style.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const atSplit = email.split("@");
    if (atSplit.length !== 2) return false;
    return /\./.test(atSplit[1]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!isValidEmail(email)) {
      setEmailError(
        "El correo debe tener un solo @ y un dominio válido (ej: .com, .cl)"
      );
      return;
    }

    const isAdmin = email === "admin@tcg.cl" && password === "admin";

    const attempt = {
      id: Date.now(),
      email,
      success: isAdmin,
      timestamp: new Date().toISOString(),
    };

    try {
      const saved = localStorage.getItem("login_attempts");
      const arr = saved ? JSON.parse(saved) : [];
      arr.push(attempt);
      localStorage.setItem("login_attempts", JSON.stringify(arr));
    } catch (err) {
      console.error("Error guardando intento de login:", err);
    }

    if (isAdmin) {
      navigate("/admin");
      return;
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {error && (
          <div
            className="login-error"
            style={{ color: "red", marginBottom: 10 }}
          >
            {error}
          </div>
        )}

        <label htmlFor="email">Correo electrónico</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ejemplo@correo.com"
          required
        />
        {emailError && (
          <div
            className="login-error"
            style={{ color: "red", marginBottom: 10 }}
          >
            {emailError}
          </div>
        )}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />

        <button type="submit">Ingresar</button>

        <p className="register-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
