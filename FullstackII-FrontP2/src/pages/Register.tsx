// src/pages/Register.tsx
import { useState } from "react";
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
      return "Debe tener al menos una mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "Debe tener al menos una minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "Debe tener al menos un número";
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Debe tener al menos un signo o símbolo";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    console.log("Solicitud de registro:", formData);
    alert("Solicitud enviada (simulación)");
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Crear Cuenta</h2>

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
        />
        {errors.nombre && (
          <div
            className="register-error"
            style={{ color: "red", marginBottom: 10 }}
          >
            {errors.nombre}
          </div>
        )}

        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          required
        />
        {errors.correo && (
          <div
            className="register-error"
            style={{ color: "red", marginBottom: 10 }}
          >
            {errors.correo}
          </div>
        )}

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="********"
          required
        />
        {errors.password && (
          <div
            className="register-error"
            style={{ color: "red", marginBottom: 10 }}
          >
            {errors.password}
          </div>
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
        />
        {errors.confirmar && (
          <div
            className="register-error"
            style={{ color: "red", marginBottom: 10 }}
          >
            {errors.confirmar}
          </div>
        )}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
