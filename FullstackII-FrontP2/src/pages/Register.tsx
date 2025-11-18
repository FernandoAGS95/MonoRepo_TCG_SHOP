// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/AuthService";
import "../styles/register_style.css";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmar: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    password: "",
    confirmar: "",
  });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateNombre = (nombre: string) => {
    if (/\d/.test(nombre)) {
      return "El nombre no puede contener números";
    }
    return "";
  };

  const validateCorreo = (correo: string) => {
    const atSplit = correo.split("@");
    if (atSplit.length !== 2) {
      return "El correo debe tener un solo @";
    }
    if (!/\./.test(atSplit[1])) {
      return "El correo debe tener un dominio válido (ej: .com, .cl)";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "La contraseña debe contener al menos una minúscula";
    }
    if (!/\d/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password)) {
      return "La contraseña debe contener al menos un signo especial";
    }
    return "";
  };

  const validateConfirmar = (confirmar: string, password: string) => {
    if (confirmar !== password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = "";
    if (name === "nombre") error = validateNombre(value);
    if (name === "correo") error = validateCorreo(value);
    if (name === "password") error = validatePassword(value);
    if (name === "confirmar")
      error = validateConfirmar(value, formData.password);
    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        confirmar: validateConfirmar(formData.confirmar, value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    const nombreError = validateNombre(formData.nombre);
    const correoError = validateCorreo(formData.correo);
    const passwordError = validatePassword(formData.password);
    const confirmarError = validateConfirmar(
      formData.confirmar,
      formData.password
    );

    setErrors({
      nombre: nombreError,
      correo: correoError,
      password: passwordError,
      confirmar: confirmarError,
    });

    if (nombreError || correoError || passwordError || confirmarError) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        nombreCompleto: formData.nombre,
        correoElectronico: formData.correo,
        password: formData.password,
        confirmarPassword: formData.confirmar,
      });

      console.log("Registro exitoso:", response);
      alert(`¡Registro exitoso! Bienvenido ${response.nombreCompleto}`);

      if (response.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error("Error en registro:", err);
      setServerError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>

        {serverError && <div className="server-error-box">{serverError}</div>}

        <label htmlFor="nombre">Nombre Completo</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre completo"
          required
          disabled={loading}
        />
        {errors.nombre && <div className="register-error">{errors.nombre}</div>}

        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          required
          disabled={loading}
        />
        {errors.correo && <div className="register-error">{errors.correo}</div>}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
          disabled={loading}
        />
        {errors.password && (
          <div className="register-error">{errors.password}</div>
        )}

        <label htmlFor="confirmar">Confirmar Contraseña</label>
        <input
          id="confirmar"
          name="confirmar"
          type="password"
          value={formData.confirmar}
          onChange={handleChange}
          placeholder="********"
          required
          disabled={loading}
        />
        {errors.confirmar && (
          <div className="register-error">{errors.confirmar}</div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}
