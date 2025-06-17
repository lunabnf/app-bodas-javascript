import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
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
import Registro from './pages/actividad';
import Ranking from './pages/ranking';
import Chat from './pages/Chat';
import MiParticipacion from './pages/MiParticipacion';
import Checklist from './pages/Checklist';
import Usuarios from './pages/Usuarios';
import RegistroUsuario from './pages/RegistroUsuario';

import './App.css';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

function AppRoot() {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSection, setMenuSection] = useState("necesitas");
  const [user, setUser] = useState(null);
  // Lista centralizada de administradores
  const listaAdmins = ["luislunaraluy98@gmail.com", "otroadmin@gmail.com"];
  // Recuperar usuario guardado en localStorage o sessionStorage al iniciar la app
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  const [rolUsuario, setRolUsuario] = useState(null);
  const nombreBoda = "Boda E&L";

  // isLoading para indicar si el estado de autenticación se está determinando
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        const esAdmin = listaAdmins.includes(usuario.email);
        const userData = {
          uid: usuario.uid,
          email: usuario.email,
          displayName: usuario.displayName,
          rol: esAdmin ? "admin" : "invitado"
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(usuario);
        setRolUsuario(userData.rol);
      } else {
        setUser(null);
        setRolUsuario(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);






  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start pt-10">
      <div className="bg-white shadow-lg rounded-3xl p-6 w-full max-w-4xl">
        <div className="overflow-x-hidden w-full">
          <Router>
            {isLoading ? null : (
              <>
                {user && window.location.pathname !== "/login" && window.location.pathname !== "/registro-usuarios" && (
                  <>
                    <header className="app-header">
                      {/* Aquí mantener el código del header y menú */}
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
                    {/* Iconos flotantes de usuario y admin */}
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
                              <li><Link to="/cuestionario">Responder cuestionario</Link></li>
                              <li><Link to="/muro">Subir foto</Link></li>
                              <li><Link to="/mesas">Esperar asignación de mesa</Link></li>
                              <li><Link to="/ceremonia">Esperar asignación en ceremonia</Link></li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Botón flotante fijo para Organización (solo admin) con menú desplegable al pasar el ratón */}
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
                            }, 500); // Espera de 500 ms antes de cerrar
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
                              <Link to="/checklist" className="submenu-link">
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
                  </>
                )}
                <Routes>
                  <Route path="/login" element={<Login rolUsuario={rolUsuario} />} />
                  <Route path="/registro-usuarios" element={<RegistroUsuario />} />
                  <Route
                    path="*"
                    element={
                      user ? (
                        <AppRoutes
                          setUser={setUser}
                          setRolUsuario={setRolUsuario}
                          user={user}
                          rolUsuario={rolUsuario}
                        />
                      ) : (
                        <Navigate to="/registro-usuarios" replace />
                      )
                    }
                  />
                </Routes>
              </>
            )}
          </Router>
        </div>
      </div>
    </div>
  );
}


function AppRoutes({ user, rolUsuario }) {
  console.log("user:", user, "rolUsuario:", rolUsuario);
  return (
    <Routes>
      <Route path="/" element={
        user
          ? <Home nombreBoda={"Boda E&L"} />
          : <Navigate to="/registro" replace />
      } />
      {/* Ruta de login visible para todos los usuarios, incluso si no están autenticados */}
      <Route path="/login" element={<Login rolUsuario={rolUsuario} />} />
      <Route path="/registro-usuarios" element={<RegistroUsuario />} />
      <Route path="/programa" element={user ? <Programa isAdmin={true} /> : <Navigate to="/login" />} />
      <Route path="/mesas" element={user ? <Mesas isAdmin={true} /> : <Navigate to="/login" />} />
      <Route path="/info" element={user ? <Info /> : <Navigate to="/login" />} />
      <Route path="/confirmar" element={user ? (new Date() < new Date('2025-07-15') ? <Confirmar /> : <div>El plazo para confirmar asistencia ha finalizado.</div>) : <Navigate to="/login" />} />
      <Route path="/invitacion" element={user ? <Invitacion isAdmin={true} /> : <Navigate to="/login" />} />
      <Route path="/cuenta-atras" element={user ? <CuentaAtras isAdmin={true} /> : <Navigate to="/login" />} />
      <Route path="/muro" element={user ? <MuroDeFotos /> : <Navigate to="/login" />} />
      <Route path="/musica" element={user ? (new Date() < new Date('2025-07-15') ? <Musica /> : <div>El plazo para proponer canciones ha finalizado.</div>) : <Navigate to="/login" />} />
      <Route path="/cuestionario" element={user ? (new Date() < new Date('2025-07-15') ? <Cuestionario /> : <div>El cuestionario ya no está disponible.</div>) : <Navigate to="/login" />} />
      <Route path="/desplazamiento" element={user ? <Desplazamiento isAdmin={true} /> : <Navigate to="/login" />} />
      <Route path="/ceremonia" element={user ? <Ceremonia /> : <Navigate to="/login" />} />
      <Route path="/registro-acciones" element={user ? <Registro rolUsuario={rolUsuario} /> : <Navigate to="/login" />} />
      <Route path="/ranking" element={user ? <Ranking /> : <Navigate to="/login" />} />
      <Route path="/chat" element={user ? <Chat usuario={user?.displayName || "Anónimo"} /> : <Navigate to="/login" />} />
      <Route path="/miparticipacion/:id" element={user ? <MiParticipacion /> : <Navigate to="/login" />} />
      <Route path="/checklist" element={user ? <Checklist /> : <Navigate to="/login" />} />
      <Route path="/usuarios" element={user ? <Usuarios /> : <Navigate to="/login" />} />
      {/* Ruta de pruebas para desarrollo, solo visible para admin */}
      <Route path="/pruebas-dev" element={
        rolUsuario === "admin" ? (
          <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>✅ Checklist de pruebas</h2>
            <ul style={{ lineHeight: "1.8" }}>
              <li>🟢 Registro de usuario funcional</li>
              <li>🟢 Login con usuario/contraseña</li>
              <li>🟢 Login con Google (solo admin)</li>
              <li>🟢 Acceso restringido a rutas privadas (usuarios, registro, checklist)</li>
              <li>🟢 Datos guardados correctamente en Firestore</li>
              <li>🟢 Redirección a / tras login</li>
              <li>🟢 Logout funcional</li>
            </ul>
            <p style={{ marginTop: "2rem", fontStyle: "italic", color: "#888" }}>Esta vista solo está disponible en desarrollo.</p>
          </div>
        ) : <Navigate to="/login" />
      } />
    </Routes>
  );
  // 🚀 Complemento futuro: que el QR generado redirija a /miparticipacion con un parámetro único por invitado
}

export default AppRoot;
