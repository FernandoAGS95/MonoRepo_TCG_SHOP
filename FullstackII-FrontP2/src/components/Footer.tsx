import "../styles/navbar_style.css";

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-links">
          <ul>
            <li>Inicio</li>
            <li>Preguntas frecuentes</li>
            <li>Ubicación</li>
            <li>Contacto</li>
          </ul>
        </div>
        <div className="footer-logo">
          <img
            src="https://static.wixstatic.com/media/cc32b2_4cd9801bbc844d7f9fce1e92f80fa270~mv2.png"
            alt="Logo Tienda"
          />
        </div>
        <div className="footer">
          <h3>Contacto</h3>
          <ul>
            <li>Teléfono: +569 123 456 89</li>
            <li>Correo: tcg@contacto.cl</li>
            <li>Dirección: Álvarez 1136</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
