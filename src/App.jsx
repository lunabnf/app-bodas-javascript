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
            {user && (
              <>
                {/* Botón flotante fijo para Mi Participación */}
                <Link
                  to="/miparticipacion"
                  style={{
                    position: "fixed",
                    top: "1rem",
                    left: "1rem",
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
                    color: "#007bff",
                    zIndex: 1000
                  }}
                >
                  👤
                </Link>
                {/* Botón flotante fijo para ir a Home */}
                <Link
                  to="/"
                  style={{
                    position: "fixed",
                    top: "1rem",
                    left: "4.5rem",
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
                    color: "#007bff",
                    zIndex: 1000
                  }}
                >
                  🏠
                </Link>
              </>
            )}
            <header className="app-header">
              <h1 className="titulo-app">{nombreBoda}</h1>
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  className="menu-toggle"
                  onClick={() => setMenuOpen(prev => !prev)}
                >
                  ☰
                </button>

                {menuOpen && (
                  <div>
                    <nav className="fixed top-24 left-4 md:left-auto md:right-4 bg-white shadow-2xl rounded-3xl p-6 w-11/12 max-w-sm z-50">
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
                        <button onClick={() => setMenuSection("organizacion")} className={`rounded-xl py-3 px-4 font-bold shadow-md ${menuSection === "organizacion" ? "bg-pink-400 text-white" : "bg-pink-100 text-pink-800"}`}>
                          ORGANIZACIÓN
                        </button>
                      </div>

                      <div className="mt-6 flex flex-col gap-4">
                        {menuSection === "necesitas" && (
                          <div className="flex flex-col items-stretch gap-4 mt-6 w-full">
                            <Link
                              to="/programa"
                              onClick={() => setMenuOpen(false)}
                              className="submenu-link"
                            >
                              Programa
                            </Link>
                            <Link
                              to="/info"
                              onClick={() => setMenuOpen(false)}
                              className="submenu-link"
                            >
                              Info
                            </Link>
                            <Link
                              to="/confirmar"
                              onClick={() => setMenuOpen(false)}
                              className="submenu-link"
                            >
                              Confirmar
                            </Link>
                          </div>
                        )}
                        {menuSection === "saberMas" && (
                          <div className="flex flex-col items-stretch gap-4 mt-6 w-full">
                            <Link to="/mesas" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Mesas
                            </Link>
                            <Link to="/cuenta-atras" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Cuenta Atrás
                            </Link>
                            <Link to="/musica" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Música
                            </Link>
                            <Link to="/invitacion" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Invitación
                            </Link>
                            <Link to="/ceremonia" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Asientos de la Ceremonia
                            </Link>
                            <Link to="/desplazamiento" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Desplazamiento
                            </Link>
                          </div>
                        )}
                        {menuSection === "modoPro" && (
                          <div className="flex flex-col items-stretch gap-4 mt-6 w-full">
                            <Link to="/ranking" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Ranking de Invitados
                            </Link>
                            <Link to="/muro" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Muro de Fotos
                            </Link>
                            <Link to="/chat" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Chat entre Invitados
                            </Link>
                            <Link to="/cuestionario" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Cuestionario
                            </Link>
                          </div>
                        )}
                        {menuSection === "organizacion" && (
                          <div className="flex flex-col items-stretch gap-4 mt-6 w-full">
                            <Link to="/registro" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Registro de acciones
                            </Link>
                            <Link to="/checklist" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Checklist de tareas
                            </Link>
                            <Link to="/usuarios" onClick={() => setMenuOpen(false)} className="submenu-link">
                              Gestión de usuarios
                            </Link>
                          </div>
                        )}
                      </div>
                    </nav>
                  </div>
                )}
              </div>
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
      <Route path="/miparticipacion" element={<MiParticipacion />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/usuarios" element={<Usuarios />} />
    </Routes>
  );
  // 🚀 Complemento futuro: que el QR generado redirija a /miparticipacion con un parámetro único por invitado
}

export default AppRoot;
