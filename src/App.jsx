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
  // Recuperar usuario guardado en localStorage o sessionStorage al iniciar la app
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  const [rolUsuario, setRolUsuario] = useState(null);
  const [nombreBoda, setNombreBoda] = useState("Boda E&L");
  const [usuariosConectados, setUsuariosConectados] = useState([]);
  const [admins, setAdmins] = useState([]);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (usuario) => {
    if (usuario) {
      setUser(usuario);
      if (usuario.email === "luislunaraluy98@gmail.com") {
        setRolUsuario("admin");
      } else {
        setRolUsuario("invitado");
      }
    } else {
      setUser(null);
      setRolUsuario(null);
    }
  });
  return () => unsubscribe();
}, []);


  const iniciarSesion = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
    }
  };




  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10">
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-4xl">
        <div className="overflow-x-hidden w-full">
          <Router>
            <header className="app-header">
              <h1 className="titulo-app">{nombreBoda}</h1>
              {/* Botón flotante fijo para abrir menú principal */}
              <div
                style={{
                  position: "fixed",
                  top: "1rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 1000
                }}
              >
                <button
                  onClick={() => setMenuOpen(prev => !prev)}
                  style={{
                    background: "#fff",
                    borderRadius: "20px",
                    padding: "0.5rem 1rem",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    fontWeight: "bold",
                    color: "#007bff",
                    border: "none",
                  }}
                >
                  MENÚ
                </button>
              </div>
              {menuOpen && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    zIndex: 1001,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onClick={() => setMenuOpen(false)}
                >
                  <nav
                    className="bg-white shadow-2xl rounded-3xl p-6 w-11/12 max-w-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col gap-3">
                      <button onClick={() => setMenuSection("necesitas")} className={`rounded-xl py-3 px-4 font-bold shadow-md ${menuSection === "necesitas" ? "bg-pink-400 text-white" : "bg-pink-100 text-pink-800"}`}>
                        NECESITAS SABER
                      </button>
                      <button onClick={() => setMenuSection("saberMas")} className={`rounded-xl py-3 px-4 font-bold shadow-md ${menuSection === "saberMas" ? "bg-pink-400 text-white" : "bg-pink-100 text-pink-800"}`}>
                        PARA SABER MÁS
                      </button>
                      <button onClick={() => setMenuSection("modoPro")} className={`rounded-xl py-3 px-4 font-bold shadow-md ${menuSection === "modoPro" ? "bg-pink-400 text-white" : "bg-pink-100 text-pink-800"}`}>
                        MODO PRO
                      </button>
                    </div>
                    <div className="mt-6 flex flex-col gap-4">
                      {menuSection === "necesitas" && (
                        <div className="flex flex-col gap-4">
                          <Link to="/programa" onClick={() => setMenuOpen(false)} className="submenu-link">Programa</Link>
                          <Link to="/info" onClick={() => setMenuOpen(false)} className="submenu-link">Info</Link>
                          <Link to="/confirmar" onClick={() => setMenuOpen(false)} className="submenu-link">Confirmar</Link>
                          <Link to="/mesas" onClick={() => setMenuOpen(false)} className="submenu-link">Mesas</Link>
                          <Link to="/ceremonia" onClick={() => setMenuOpen(false)} className="submenu-link">Asientos de la Ceremonia</Link>
                        </div>
                      )}
                      {menuSection === "saberMas" && (
                        <div className="flex flex-col gap-4">
                          <Link to="/cuenta-atras" onClick={() => setMenuOpen(false)} className="submenu-link">Cuenta Atrás</Link>
                          <Link to="/musica" onClick={() => setMenuOpen(false)} className="submenu-link">Música</Link>
                          <Link to="/invitacion" onClick={() => setMenuOpen(false)} className="submenu-link">Invitación</Link>
                          <Link to="/desplazamiento" onClick={() => setMenuOpen(false)} className="submenu-link">Desplazamiento</Link>
                        </div>
                      )}
                      {menuSection === "modoPro" && (
                        <div className="flex flex-col gap-4">
                          <Link to="/ranking" onClick={() => setMenuOpen(false)} className="submenu-link">Ranking de Invitados</Link>
                          <Link to="/muro" onClick={() => setMenuOpen(false)} className="submenu-link">Muro de Fotos</Link>
                          <Link to="/chat" onClick={() => setMenuOpen(false)} className="submenu-link">Chat entre Invitados</Link>
                          <Link to="/cuestionario" onClick={() => setMenuOpen(false)} className="submenu-link">Cuestionario</Link>
                        </div>
                      )}
                    </div>
                  </nav>
                </div>
              )}
            </header>
            {user ? (
              <AppRoutes
                setUser={setUser}
                setRolUsuario={setRolUsuario}
                user={user}
                rolUsuario={rolUsuario}
              />
            ) : (
              <div className="text-center">
                <Home nombreBoda={nombreBoda} />
                <button
                  onClick={iniciarSesion}
                  className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded"
                >
                  Iniciar sesión con Google
                </button>
              </div>
            )}
            {/* Icono de participación del usuario */}
            <div
              style={{
                position: "fixed",
                top: "1rem",
                left: "1rem",
                zIndex: 1000
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block"
                }}
              >
                <Link
                  to={`/miparticipacion/${user?.uid}`}
                  onMouseEnter={() => setMenuSection("participacionTooltip")}
                  onMouseLeave={() => setMenuSection(null)}
                  style={{
                    background: "#fff",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "#007bff",
                    textDecoration: "none"
                  }}
                >
                  👤
                </Link>
                {menuSection === "participacionTooltip" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "3rem",
                      left: 0,
                      background: "#fff",
                      borderRadius: "1rem",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      padding: "1rem",
                      width: "260px"
                    }}
                  >
                    <p><strong>Estado:</strong> ✅ Conectado</p>
                    <p><strong>Rol:</strong> {rolUsuario}</p>
                    <p className="mt-2 font-bold text-pink-600">Tareas pendientes:</p>
                    <ul className="list-disc ml-4 text-sm text-blue-600">
                      <li><Link to="/confirmar">Confirmar asistencia</Link></li>
                      <li><Link to="/desplazamiento">Solicitar desplazamiento</Link></li>
                      <li><Link to="/musica">Proponer canción</Link></li>
                      <li><Link to="/ranking">Votar en el ranking</Link></li>
                      <li><Link to="/cuestionario">Responder cuestionario</Link></li>
                      <li><Link to="/muro">Subir foto</Link></li>
                      <li><Link to="/mesas">Esperar asignación de mesa</Link></li>
                      <li><Link to="/ceremonia">Esperar asignación en ceremonia</Link></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* Botón flotante fijo para Organización (solo admin) con menú hamburguesa */}
            {rolUsuario === "admin" && (
              <div
                style={{
                  position: "fixed",
                  top: "1rem",
                  right: "4.5rem",
                  zIndex: 1000
                }}
              >
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setMenuSection(prev => prev === "adminPanel" ? null : "adminPanel")}
                    style={{
                      background: "#fff",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      color: "#007bff"
                    }}
                    title="Panel de Organización"
                  >
                    🛠️
                  </button>
                  {menuSection === "adminPanel" && (
                    <div style={{
                      position: "absolute",
                      top: "3rem",
                      right: 0,
                      background: "#fff",
                      borderRadius: "1rem",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}>
                      <Link to="/registro" onClick={() => setMenuSection(null)} className="submenu-link">
                        Registro de acciones
                      </Link>
                      <Link to="/usuarios" onClick={() => setMenuSection(null)} className="submenu-link">
                        Gestión de usuarios
                      </Link>
                      <Link to="/checklist" onClick={() => setMenuSection(null)} className="submenu-link">
                        Panel de administración
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Botón flotante fijo para Home (solo admin) en la esquina derecha */}
            {rolUsuario === "admin" && (
              <div
                style={{
                  position: "fixed",
                  top: "1rem",
                  right: "1rem",
                  zIndex: 1000
                }}
              >
                <Link
                  to="/"
                  style={{
                    background: "#fff",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#007bff"
                  }}
                >
                  🏠
                </Link>
              </div>
            )}
          </Router>
        </div>
      </div>
    </div>
  );
}

import { useLocation } from 'react-router-dom';

function AppRoutes({ setUser, setRolUsuario, user, rolUsuario }) {
  return (
    <Routes>
      <Route path="/" element={
        user ? (
          <Home nombreBoda={"Boda E&L"} />
        ) : (
          <Home nombreBoda={"Boda E&L"} />
        )
      } />
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
      <Route path="/registro" element={<Registro rolUsuario={rolUsuario} />} />
      <Route path="/ranking" element={<Ranking />} />
      <Route path="/chat" element={<Chat usuario={user?.displayName || "Anónimo"} />} />
      <Route path="/miparticipacion/:id" element={<MiParticipacion />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/usuarios" element={<Usuarios />} />
    </Routes>
  );
  // 🚀 Complemento futuro: que el QR generado redirija a /miparticipacion con un parámetro único por invitado
}

export default AppRoot;
