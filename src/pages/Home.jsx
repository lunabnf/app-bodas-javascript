import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div className="pwa-instructions" style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
        <h2>📲 Añade esta app a tu pantalla de inicio</h2>
        <p>Así podrás acceder como si fuera una aplicación normal:</p>
        <div style={{ marginTop: "1rem", textAlign: "left" }}>
          <h3>📱 Para iPhone (Safari):</h3>
          <ul>
            <li>1. Pulsa el botón <strong>Compartir</strong> (cuadro con flecha hacia arriba).</li>
            <li>2. Baja hasta encontrar <strong>Añadir a pantalla de inicio</strong>.</li>
            <li>3. Pulsa <strong>Añadir</strong>.</li>
          </ul>
          <h3 style={{ marginTop: "1rem" }}>📱 Para Android (Chrome):</h3>
          <ul>
            <li>1. Pulsa el icono de <strong>tres puntos</strong> (arriba a la derecha).</li>
            <li>2. Toca <strong>Añadir a pantalla de inicio</strong>.</li>
            <li>3. Confirma con <strong>Añadir</strong>.</li>
          </ul>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <img src="/images/image.png" alt="Instrucciones PWA" style={{ width: "100%", maxWidth: "300px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
        </div>
      </div>
    </>
  );
}

export default App;