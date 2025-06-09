import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Programa from './pages/Programa';
import Mesas from './pages/Mesas';
import Info from './pages/Info';
import Confirmar from './pages/Confirmar';
import CuentaAtras from './pages/CuentaAtras';
import MuroDeFotos from "./pages/MuroDeFotos";
import Musica from './pages/Musica';
import Cuestionario from "./pages/Cuestionario";
import Invitacion from './pages/invitacion';
import Desplazamiento from './pages/Desplazamiento';
import Ceremonia from './pages/Ceremonia';
import Registro from './pages/Registro';
import Ranking from './pages/ranking';
import Chat from './pages/Chat';
import MiParticipacion from './pages/MiParticipacion';
import Checklist from './pages/Checklist';
import Usuarios from './pages/Usuarios';

import './App.css';
import { auth, provider } from './firebaseConfig';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { db } from './firebaseConfig';

function AppRoot() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState("necesitas");
  const [user, setUser] = useState(null);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [nombreBoda, setNombreBoda] = useState("Boda E&L");
  const roles = {
    "luislunaraluy98@gmail.com": "admin",
    "dietistaericvg@gmail.com": "admin",
    "javigrau@gmail.com": "invitado",
    "letilafueva@gmail.com": "admin",
    "esthersolanorina@gmail.com": "moderador"
  };
  const [usuariosConectados, setUsuariosConectados] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [codigoManual, setCodigoManual] = useState("");
  const [accesoQRValido, setAccesoQRValido] = useState(null);

  const verificarCodigoManual = async () => {
    if (!codigoManual) return;
    const ref = doc(db, "bodas", "bodaPrincipal", "usuarios", codigoManual);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const datos = snap.data();
      setUser({ displayName: datos.nombre });
      setRolUsuario(datos.rol);
      setAccesoQRValido(true);
    } else {
      alert("Código inválido");
    }
  };

  // Función para generar un código QR único y almacenarlo en Firestore
  const generarCodigoQR = async (nombre, rol) => {
    // Genera un id a partir del nombre (minúsculas, sin espacios, con año 2025)
    const id = nombre.toLowerCase().replace(/\s+/g, '') + '2025';
    const ref = doc(db, "bodas", "bodaPrincipal", "accesosQR", id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      // Ya existe, no lo creamos de nuevo
      return id;
    } else {
      // Crea el documento con los datos
      await setDoc(ref, { nombre, rol });
      return id;
    }
  };

  // Ejemplo para preparar una lista futura de usuarios para subir a Firestore
  // Esta función no está llamada automáticamente, se deja para uso futuro o manual
  const prepararUsuariosParaFirebase = async () => {
    // Lista completa de invitados, asignando rol "admin" solo a Natia
    const usuarios = [
      { nombre: "Severino" },
      { nombre: "Merche" },
      { nombre: "Tamara" },
      { nombre: "Edu" },
      { nombre: "Leti" },
      { nombre: "Serafín" },
      { nombre: "Manolo" },
      { nombre: "Mari Carmen" },
      { nombre: "Oscar" },
      { nombre: "Begoña" },
      { nombre: "Lara" },
      { nombre: "Leo" },
      { nombre: "David" },
      { nombre: "Sofia" },
      { nombre: "Mateo" },
      { nombre: "Marco" },
      { nombre: "Ivan" },
      { nombre: "Barbara" },
      { nombre: "Thiago" },
      { nombre: "Andrea" },
      { nombre: "Alegría" },
      { nombre: "Rosa mari" },
      { nombre: "Valdo" },
      { nombre: "Eva" },
      { nombre: "Ruben" },
      { nombre: "Marcos" },
      { nombre: "Javi" },
      { nombre: "Cecilia" },
      { nombre: "Abril" },
      { nombre: "Ramón Solipueyo" },
      { nombre: "Ana" },
      { nombre: "Jose Antonio" },
      { nombre: "Nerea" },
      { nombre: "Pablo" },
      { nombre: "Martín" },
      { nombre: "Pili" },
      { nombre: "Jesus" },
      { nombre: "Adrian" },
      { nombre: "Mar Carmen" },
      { nombre: "Carlos" },
      { nombre: "Carla" },
      { nombre: "Tía mercedes" },
      { nombre: "Luisa" },
      { nombre: "Martin" },
      { nombre: "Bea" },
      { nombre: "Jorge" },
      { nombre: "Jara" },
      { nombre: "Dario" },
      { nombre: "Mavi" },
      { nombre: "Ezequiel" },
      { nombre: "Carmen" },
      { nombre: "Marta" },
      { nombre: "Leo" },
      { nombre: "Lara" },
      { nombre: "Manu" },
      { nombre: "Claudia" },
      { nombre: "Reyes" },
      { nombre: "Daniel" },
      { nombre: "Juan carlos" },
      { nombre: "Dani" },
      { nombre: "Laura" },
      { nombre: "Emi" },
      { nombre: "Juan" },
      { nombre: "alexia" },
      { nombre: "Luis" },
      { nombre: "Jose Luis" },
      { nombre: "Miguel" },
      { nombre: "Paz" },
      { nombre: "Alejandro" },
      { nombre: "Cristina" },
      { nombre: "Nora" },
      { nombre: "Mariví" },
      { nombre: "Carrera" },
      { nombre: "Anaís" },
      { nombre: "Boli" },
      { nombre: "Laura" },
      { nombre: "Sergio" },
      { nombre: "Alba" },
      { nombre: "Anselmo" },
      { nombre: "Cris" },
      { nombre: "Andres" },
      { nombre: "Elisa" },
      { nombre: "Angel" },
      { nombre: "Noelia" },
      { nombre: "Bruis" },
      { nombre: "German" },
      { nombre: "Marina" },
      { nombre: "Laurita" },
      { nombre: "Ilona" },
      { nombre: "Sergi" },
      { nombre: "Adri?" },
      { nombre: "Sandra" },
      { nombre: "Adri" },
      { nombre: "Leah" },
      { nombre: "James" },
      { nombre: "Esther" },
      { nombre: "Teresa" },
      { nombre: "Pedrós" },
      { nombre: "Natia" }
    ].map(({ nombre }) => ({
      id: nombre.toLowerCase().replace(/\s+/g, '') + '2025',
      nombre,
      rol: nombre === "Natia" ? "admin" : "invitado"
    }));

    let nuevos = 0;
    let existentes = 0;

    for (const usuario of usuarios) {
      const ref = doc(db, "bodas", "bodaPrincipal", "usuarios", usuario.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          nombre: usuario.nombre,
          rol: usuario.rol,
          timestamp: serverTimestamp()
        });
        nuevos++;
      } else {
        existentes++;
      }
    }

    console.log(`Usuarios cargados: ${nuevos} nuevos, ${existentes} ya existían`);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario && roles[usuario.email]) {
        setUser(usuario);
        setRolUsuario(roles[usuario.email]);

        setUsuariosConectados((prev) => {
          const yaEsta = prev.find((u) => u.uid === usuario.uid);
          return yaEsta ? prev : [...prev, usuario];
        });
      } else if (usuario) {
        alert("Este correo no está autorizado para acceder a la app.");
        auth.signOut();
      } else {
        setUser(null);
      }
    });
    const listaAdmins = Object.entries(roles)
      .filter(([_, rol]) => rol === "admin")
      .map(([correo]) => correo);
    setAdmins(listaAdmins);
    return () => unsubscribe();
  }, []);


  const iniciarSesion = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
    }
  };

  const ejecutarCargaUsuarios = async () => {
    try {
      await prepararUsuariosParaFirebase();
      alert("Usuarios cargados correctamente.");
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      alert("Error al cargar usuarios.");
    }
  };

  if (!accesoQRValido && !(user && admins.includes(user?.email))) {
    return (
      <div className="login-container">
        <h1>Bienvenido a la Boda de Eric & Leticia</h1>
        <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '1em' }}>
          Solo pueden acceder los invitados con su código QR o los administradores con su cuenta de Google.
        </p>
        <div style={{ fontSize: '2.5em', margin: '1em 0' }}>
          🔒
        </div>
        <p>Accede con tu método preferido:</p>
        <button onClick={iniciarSesion}>Iniciar sesión con Google</button>

        <div style={{ marginTop: '2em' }}>
          <input
            type="text"
            placeholder="O introduce tu código"
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            style={{ padding: '0.5em', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button onClick={verificarCodigoManual} style={{ marginLeft: '1em' }}>
            Entrar con código
          </button>
        </div>
      </div>
    );
  }

  if (window.location.pathname === "/registro" && !["admin", "moderador"].includes(rolUsuario)) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10">
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-4xl">
        <Router>
          <header className="app-header">
            <h1 className="titulo-app">{nombreBoda}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
              </button>
            </div>
          </header>
          {menuOpen && (
            <nav className="floating-nav vertical-menu">
              <div className="menu-tabs">
                <button
                  className={menuSection === "necesitas" ? "active" : ""}
                  onClick={() => setMenuSection("necesitas")}
                >
                  NECESITAS SABER
                </button>
                <button
                  className={menuSection === "saberMas" ? "active" : ""}
                  onClick={() => setMenuSection("saberMas")}
                >
                  PARA SABER MÁS
                </button>
                <button
                  className={menuSection === "modoPro" ? "active" : ""}
                  onClick={() => setMenuSection("modoPro")}
                >
                  MODO PRO
                </button>
                <button
                  className={menuSection === "organizacion" ? "active" : ""}
                  onClick={() => setMenuSection("organizacion")}
                >
                  ORGANIZACIÓN
                </button>
              </div>
              {menuSection === "necesitas" && (
                <div className="menu-section">
                  <Link to="/programa" onClick={() => setMenuOpen(false)}>Programa</Link>
                  <Link to="/info" onClick={() => setMenuOpen(false)}>Info</Link>
                  <Link to="/confirmar" onClick={() => setMenuOpen(false)}>Confirmar</Link>
                </div>
              )}
              {menuSection === "saberMas" && (
                <div className="menu-section">
                  <Link to="/mesas" onClick={() => setMenuOpen(false)}>Mesas</Link>
                  <Link to="/cuenta-atras" onClick={() => setMenuOpen(false)}>Cuenta Atrás</Link>
                  <Link to="/musica" onClick={() => setMenuOpen(false)}>Música</Link>
                  <Link to="/invitacion" onClick={() => setMenuOpen(false)} className="invitation-link">Invitación</Link>
                  <Link to="/ceremonia" onClick={() => setMenuOpen(false)}>Asientos de la Ceremonia</Link>
                  <Link to="/desplazamiento" onClick={() => setMenuOpen(false)}>Desplazamiento</Link>
                </div>
              )}
              {menuSection === "modoPro" && (
                <div className="menu-section">
                  <h3>MODO PRO</h3>
                  <Link to="/ranking" onClick={() => setMenuOpen(false)}>Ranking de Invitados</Link>
                  <Link to="/muro" onClick={() => setMenuOpen(false)}>Muro de Fotos</Link>
                  <Link to="/chat" onClick={() => setMenuOpen(false)}>Chat entre Invitados</Link>
                  <Link to="/cuestionario" onClick={() => setMenuOpen(false)}>Cuestionario</Link>
                  <Link to="/miparticipacion" onClick={() => setMenuOpen(false)}>👤 Mi Participación</Link>
                </div>
              )}
              {menuSection === "organizacion" && (
                <div className="menu-section">
                  <h3>ORGANIZACIÓN</h3>
                  <Link to="/registro" onClick={() => setMenuOpen(false)}>Registro de acciones</Link>
                  <Link to="/checklist" onClick={() => setMenuOpen(false)}>Checklist de tareas</Link>
                  <Link to="/usuarios" onClick={() => setMenuOpen(false)}>Gestión de usuarios</Link>
                  {/* Aquí puedes añadir más enlaces al panel de administración si lo implementas */}
                </div>
              )}
            </nav>
          )}
          <AppRoutes
            setUser={setUser}
            setRolUsuario={setRolUsuario}
            setAccesoQRValido={setAccesoQRValido}
            accesoQRValido={accesoQRValido}
            user={user}
            rolUsuario={rolUsuario}
            ejecutarCargaUsuarios={ejecutarCargaUsuarios}
          />
        </Router>
      </div>
    </div>
  );
}

import { useLocation } from 'react-router-dom';

function AppRoutes({ setUser, setRolUsuario, setAccesoQRValido, accesoQRValido, user, rolUsuario, ejecutarCargaUsuarios }) {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codigo = params.get("codigo");

    async function verificarCodigoDesdeURL() {
      if (codigo && !user && !accesoQRValido) {
        const ref = doc(db, "bodas", "bodaPrincipal", "usuarios", codigo);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const datos = snap.data();
          setUser({ displayName: datos.nombre });
          setRolUsuario(datos.rol);
          setAccesoQRValido(true);
          window.history.replaceState(null, "", "/miparticipacion");
        } else {
          alert("Código QR inválido.");
        }
      }
    }

    verificarCodigoDesdeURL();
  }, [location.search]);

  return (
    <Routes>
      <Route path="/" element={<Home nombreBoda={"Boda E&L"} />} />
      <Route path="/programa" element={<Programa isAdmin={true} />} />
      <Route path="/mesas" element={<Mesas isAdmin={true} />} />
      <Route path="/info" element={<Info />} />
      <Route path="/confirmar" element={new Date() < new Date('2025-07-15') ? <Confirmar /> : <div>El plazo para confirmar asistencia ha finalizado.</div>} />
      <Route path="/invitacion" element={<Invitacion isAdmin={true} />} />
      <Route path="/cuenta-atras" element={<CuentaAtras isAdmin={true} />} />
      <Route path="/muro" element={<MuroDeFotos />} />
      <Route path="/musica" element={new Date() < new Date('2025-07-15') ? <Musica /> : <div>El plazo para proponer canciones ha finalizado.</div>} />
      <Route path="/cuestionario" element={new Date() < new Date('2025-07-15') ? <Cuestionario /> : <div>El cuestionario ya no está disponible.</div>} />
      <Route path="/desplazamiento" element={<Desplazamiento isAdmin={true} />} />
      <Route path="/ceremonia" element={<Ceremonia />} />
      <Route path="/registro" element={<Registro ejecutarCargaUsuarios={ejecutarCargaUsuarios} rolUsuario={rolUsuario} />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/chat" element={<Chat usuario={user?.displayName || "Anónimo"} />} />
      <Route path="/miparticipacion" element={<MiParticipacion />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/usuarios" element={<Usuarios />} />
    </Routes>
  );
  // 🚀 Complemento futuro: que el QR generado redirija a /miparticipacion con un parámetro único por invitado
}

export default AppRoot;
