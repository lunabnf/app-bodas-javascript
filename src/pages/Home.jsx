import { collection, getDocs, getFirestore, addDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mantenerSesion, setMantenerSesion] = useState(true);

  useEffect(() => {
    // Simulación de obtención del usuario, reemplazar con lógica real si aplica
    const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    // Si el usuario quiere cerrar sesión
    // eslint-disable-next-line
    // (esto es sólo para dejar el comentario, la función va fuera del useEffect)
  }, []);

  // Si el usuario quiere cerrar sesión
  const cerrarSesion = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("qrSesionActiva");
    window.location.reload();
  };

  const registrarUsuario = async () => {
    if (!nombre || !email || !codigo) return alert("Rellena todos los campos");

    const codigoValido = "bodaleticia2025";
    if (codigo !== codigoValido) return alert("Código incorrecto. Pide a los novios que te lo confirmen.");

    const nuevoUsuario = {
      nombre,
      email,
      rol: "invitado",
      uid: `${nombre}-${Date.now()}`,
      codigo
    };

    if (mantenerSesion) {
      localStorage.setItem("user", JSON.stringify(nuevoUsuario));
    } else {
      sessionStorage.setItem("user", JSON.stringify(nuevoUsuario));
    }

    window.location.reload();
  };

  return (
    <>
      <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center", background: "#eef2f5", borderRadius: "10px" }}>
        <h2>🔑 Accede a la app</h2>
        <p>Regístrate rápidamente para acceder como invitado:</p>
        <div style={{ marginTop: "1.5rem" }}>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "80%", maxWidth: "300px", border: "1px solid #ccc", borderRadius: "6px" }}
          />
          <input
            type="email"
            placeholder="Tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "80%", maxWidth: "300px", border: "1px solid #ccc", borderRadius: "6px" }}
          />
          <input
            type="text"
            placeholder="Tu código de invitado"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            style={{ padding: "0.5rem", marginBottom: "0.5rem", width: "80%", maxWidth: "300px", border: "1px solid #ccc", borderRadius: "6px" }}
          />
          <label style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={mantenerSesion}
              onChange={() => setMantenerSesion(!mantenerSesion)}
            />
            Mantener sesión iniciada
          </label>
          <button
            onClick={registrarUsuario}
            style={{
              padding: "0.5rem 1rem",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Registrarme
          </button>
        </div>
      </div>

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

      <div style={{ marginTop: "3rem", padding: "2rem", background: "#f8f9fa", borderRadius: "10px" }}>
        <h3>🔐 Acceso privado para invitados</h3>
        <p>
          Tu acceso está {localStorage.getItem("qrSesionActiva") ? "guardado ✅" : "activo pero no guardado ❌"}.
        </p>
        {!localStorage.getItem("qrSesionActiva") && (
          <button
            onClick={() => {
              localStorage.setItem("qrSesionActiva", "true");
              window.location.reload();
            }}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Guardar acceso en este dispositivo
          </button>
        )}
        {user?.displayName && (
          <div style={{ marginTop: "2rem" }}>
            <p><strong>Tu código QR personal:</strong></p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=https://bodaleticiayeric.com/?codigo=${user.displayName.toLowerCase()}2025&size=150x150`}
              alt="Código QR"
              style={{ marginTop: "1rem", borderRadius: "8px" }}
            />
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Escanea este código o compártelo para acceder desde otro dispositivo.</p>
          </div>
        )}
      </div>
      {user && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={cerrarSesion}
            style={{
              padding: "0.5rem 1rem",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </>
  );
}

export default App;