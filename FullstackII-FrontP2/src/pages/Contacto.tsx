import { useState } from "react";
import "../styles/contacto_style.css";

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
  mensaje: string;
}

interface FormErrors {
  nombre?: string;
  apellido?: string;
  correo?: string;
  celular?: string;
  mensaje?: string;
}

export default function Contacto() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo =
        "El correo debe tener formato válido (ejemplo@dominio.com)";
    }

    if (!formData.celular.trim()) {
      newErrors.celular = "El número de celular es requerido";
    } else if (!/^\d{7,15}$/.test(formData.celular.replace(/[\s-]/g, ""))) {
      newErrors.celular = "El número debe tener entre 7 y 15 dígitos";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es requerido";
    } else if (formData.mensaje.trim().length < 10) {
      newErrors.mensaje = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitted(true);
      const message = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toISOString(),
      };
      try {
        const saved = localStorage.getItem("contact_messages");
        const arr = saved ? JSON.parse(saved) : [];
        arr.push(message);
        localStorage.setItem("contact_messages", JSON.stringify(arr));
        console.log("Mensaje guardado:", message);
      } catch (err) {
        console.error("Error guardando mensaje:", err);
      }
    }
  };

  return (
    <main className="contact-main">
      <section className="contact-section">
        <div className="contact-container">
          <h1>Contacto</h1>
          <p>Déjanos tu mensaje y nos pondremos en contacto pronto</p>

          {!submitted ? (
            <div className="contact-form">
              {}
              <div className={`form-group ${errors.nombre ? "error" : ""}`}>
                <label htmlFor="nombre">Nombre</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre: e.target.value.replace(
                        /[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g,
                        ""
                      ),
                    })
                  }
                  placeholder="Nombre"
                />
                {errors.nombre && (
                  <span className="error-message">{errors.nombre}</span>
                )}
              </div>

              {}
              <div className={`form-group ${errors.apellido ? "error" : ""}`}>
                <label htmlFor="apellido">Apellido</label>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      apellido: e.target.value.replace(
                        /[^a-záéíóúñA-ZÁÉÍÓÚÑ\s]/g,
                        ""
                      ),
                    })
                  }
                  placeholder="Apellido"
                />
                {errors.apellido && (
                  <span className="error-message">{errors.apellido}</span>
                )}
              </div>

              {}
              <div className={`form-group ${errors.correo ? "error" : ""}`}>
                <label htmlFor="correo">Correo</label>
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                />
                {errors.correo && (
                  <span className="error-message">{errors.correo}</span>
                )}
              </div>

              {}
              <div className={`form-group ${errors.celular ? "error" : ""}`}>
                <label htmlFor="celular">Teléfono</label>
                <input
                  id="celular"
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      celular: e.target.value.replace(/[^0-9\s-]/g, ""),
                    })
                  }
                  placeholder="+56 9 XXXX XXXX"
                />
                {errors.celular && (
                  <span className="error-message">{errors.celular}</span>
                )}
              </div>

              {}
              <div className={`form-group ${errors.mensaje ? "error" : ""}`}>
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos tu mensaje..."
                  rows={5}
                />
                {errors.mensaje && (
                  <span className="error-message">{errors.mensaje}</span>
                )}
              </div>

              {}
              <button className="submit-btn" onClick={handleSubmit}>
                Enviar mensaje
              </button>
            </div>
          ) : (
            <div className="success-message">
              <h3>¡Mensaje enviado!</h3>
              <p>Gracias por contactarnos, pronto te responderemos.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
