import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Programa from './pages/Programa';
import Mesas from './pages/Mesas';
import Info from './pages/Info';
import Confirmar from './pages/Confirmar';
import CuentaAtras from './pages/CuentaAtras';
import MuroDeFotos from './pages/MuroDeFotos';
import Musica from './pages/Musica';
// import Cuestionario from './pages/Cuestionario'; // Eliminado porque borrado
// import Invitacion from './pages/Invitacion'; // Eliminado porque borrado
import Desplazamiento from './pages/Desplazamiento';  // Corregido a mayúscula
import Ceremonia from './pages/Ceremonia';
// import Actividad from './pages/Actividad'; // Eliminado porque borrado
import Ranking from './pages/Ranking';
import Chat from './pages/Chat';
import MiParticipacion from './pages/MiParticipacion';
// import Checklist from './pages/Checklist'; // Eliminado porque borrado
import Usuarios from './pages/Usuarios';

import './App.css';
import { useAuth } from './AuthProvider';

function AppRoot() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState("necesitas");
  const { user, loading: isLoading } = useAuth();
  const listaAdmins = ["luislunaraluy98@gmail.com", "otroadmin@gmail.com"];
  const rolUsuario = user && listaAdmins.includes(user.email) ? "admin" : "invitado";
  const nombreBoda = "Boda E&L";

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem', fontFamily: 'Playfair Display, serif', color: '#5C5470' }}>
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10">
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-4xl">
        <div className="overflow-x-hidden w-full">
          <Router>
            {!user && <Navigate to="/login" />}
            {user && window.location.pathname !== "/login" && window.location.pathname !== "/registro-usuarios" && (
              <>
                <header className="app-header">
                  <h1 className="titulo-app">{nombreBoda}</h1>
                  <div
                    style={{
                      position: "fixed",
                      top: "1rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1000
                    }}
                    onMouseEnter={() => {
                      if (!isTouchDevice) {
                        clearTimeout(window.menuTimeout);
                        setMenuOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isTouchDevice) {
                        window.menuTimeout = setTimeout(() => {
                          setMenuOpen(false);
                        }, 500);
                      }
                    }}
                  >
                    <button
                      onClick={() => {
                        if (isTouchDevice) {
                          setMenuOpen(prev => !prev);
                        }
                      }}
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
                      onMouseEnter={() => clearTimeout(window.menuTimeout)}
                      onMouseLeave={() => {
                        if (!isTouchDevice) {
                          window.menuTimeout = setTimeout(() => {
                            setMenuOpen(false);
                          }, 500);
                        }
                      }}
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
                              {/* <Link to="/invitacion" onClick={() => setMenuOpen(false)} className="submenu-link">Invitación</Link> */}
                              <Link to="/desplazamiento" onClick={() => setMenuOpen(false)} className="submenu-link">Desplazamiento</Link>
                            </div>
                          )}
                          {menuSection === "modoPro" && (
                            <div className="flex flex-col gap-4">
                              <Link to="/ranking" onClick={() => setMenuOpen(false)} className="submenu-link">Ranking de Invitados</Link>
                              <Link to="/muro" onClick={() => setMenuOpen(false)} className="submenu-link">Muro de Fotos</Link>
                              <Link to="/chat" onClick={() => setMenuOpen(false)} className="submenu-link">Chat entre Invitados</Link>
                              {/* Cuestionario eliminado porque borrado */}
                              {/* <Link to="/cuestionario" onClick={() => setMenuOpen(false)} className="submenu-link">Cuestionario</Link> */}
                            </div>
                          )}
                        </div>
                      </nav>
                    </div>
                  )}
                </header>
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
                      onClick={() => {
                        if (isTouchDevice) setMenuSection("participacionTooltip");
                      }}
                      onMouseEnter={() => {
                        if (!isTouchDevice) setMenuSection("participacionTooltip");
                      }}
                      onMouseLeave={() => {
                        if (!isTouchDevice) setMenuSection(null);
                      }}
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
                          {/* Cuestionario eliminado porque borrado */}
                          {/* <li><Link to="/cuestionario">Responder cuestionario</Link></li> */}
                          <li><Link to="/muro">Subir foto</Link></li>
                          <li><Link to="/mesas">Esperar asignación de mesa</Link></li>
                          <li><Link to="/ceremonia">Esperar asignación en ceremonia</Link></li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {rolUsuario === "admin" && (
                  <div
                    style={{
                      position: "fixed",
                      top: "1rem",
                      right: "4.5rem",
                      zIndex: 1000
                    }}
                    onMouseEnter={() => {
                      if (!isTouchDevice) {
                        clearTimeout(window.adminPanelTimeout);
                        setMenuSection("adminPanel");
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isTouchDevice) {
                        window.adminPanelTimeout = setTimeout(() => {
                          setMenuSection(null);
                        }, 500); 
                      }
                    }}
                  >
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: "50%",
                          width: "40px",
                          height: "40px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          color: "#007bff"
                        }}
                        title="Panel de Organización"
                        onClick={() => {
                          if (isTouchDevice) setMenuSection("adminPanel");
                        }}
                        onMouseEnter={() => {
                          if (!isTouchDevice) {
                            clearTimeout(window.adminPanelTimeout);
                            setMenuSection("adminPanel");
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isTouchDevice) {
                            window.adminPanelTimeout = setTimeout(() => {
                              setMenuSection(null);
                            }, 500);
                          }
                        }}
                      >
                        🛠️
                      </div>
                      {menuSection === "adminPanel" && (
                        <div
                          style={{
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
                          }}
                          onMouseEnter={() => {
                            if (!isTouchDevice) clearTimeout(window.adminPanelTimeout);
                          }}
                          onMouseLeave={() => {
                            if (!isTouchDevice) {
                              window.adminPanelTimeout = setTimeout(() => {
                                setMenuSection(null);
                              }, 500);
                            }
                          }}
                        >
                          <Link to="/registro-acciones" className="submenu-link">
                            Registro de acciones
                          </Link>
                          <Link to="/usuarios" className="submenu-link">
                            Gestión de usuarios
                          </Link>
                          {/* Checklist eliminado porque borrado */}
                          {/* <Link to="/checklist" className="submenu-link">
                            Panel de administración
                          </Link> */}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {user && (
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
              </>
            )}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login rolUsuario={rolUsuario} />} />
              <Route path="/programa" element={<Programa />} />
              <Route path="/info" element={<Info />} />
              <Route path="/confirmar" element={<Confirmar />} />
              <Route path="/mesas" element={<Mesas />} />
              <Route path="/ceremonia" element={<Ceremonia />} />
              <Route path="/cuenta-atras" element={<CuentaAtras />} />
              <Route path="/musica" element={<Musica />} />
              {/* <Route path="/invitacion" element={<Invitacion />} /> */}
              <Route path="/desplazamiento" element={<Desplazamiento />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/muro" element={<MuroDeFotos />} />
              <Route path="/chat" element={<Chat />} />
              {/* Cuestionario eliminado porque borrado */}
              {/* <Route path="/cuestionario" element={<Cuestionario />} /> */}
              <Route path="/registro-acciones" element={<Usuarios />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/miparticipacion/:uid" element={<MiParticipacion />} />
              <Route path="/registro-usuarios" element={<Login rolUsuario={rolUsuario} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default AppRoot;

// NOTA: Importaciones eliminadas de componentes borrados:
// - Cuestionario: import Cuestionario from './pages/Cuestionario';
// - Invitacion: import Invitacion from './pages/Invitacion';
// - Actividad: import Actividad from './pages/Actividad';
// - Checklist: import Checklist from './pages/Checklist';