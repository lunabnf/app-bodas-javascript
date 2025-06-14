import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, arrayUnion, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { registrarAccion } from '../utils/registrarAccion';

function Confirmar({ confirmarAsistencia }) {
  const [numAsistentes, setNumAsistentes] = useState(1);
  const [nombres, setNombres] = useState([]);
  const [numNinos, setNumNinos] = useState(0);
  const [nombresNinos, setNombresNinos] = useState([]);
  const [confirmados, setConfirmados] = useState([]);
  const [confirmadosGlobal, setConfirmadosGlobal] = useState([]);
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [confirmacionesData, setConfirmacionesData] = useState({});
  useEffect(() => {
    setNombres((prev) => {
      const nuevos = [...prev];
      if (nuevos.length < numAsistentes) {
        return [...nuevos, ...Array(numAsistentes - nuevos.length).fill({ nombre: "", apellidos: "", alergia: "" })];
      } else {
        return nuevos.slice(0, numAsistentes);
      }
    });
  }, [numAsistentes]);

  useEffect(() => {
    setNombresNinos((prev) => {
      const nuevos = [...prev];
      if (nuevos.length < numNinos) {
        return [...nuevos, ...Array(numNinos - nuevos.length).fill({ nombre: "", apellidos: "", alergia: "" })];
      } else {
        return nuevos.slice(0, numNinos);
      }
    });
  }, [numNinos]);

  useEffect(() => {
    const cargarConfirmados = async () => {
      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const confirmaciones = data.confirmaciones || {};
        const nombres = Object.values(confirmaciones)
          .flatMap((conf) => conf.nombres || []);
        setConfirmadosGlobal(nombres);
      }
    };
    cargarConfirmados();
  }, []);

  useEffect(() => {
    const verificarAdmin = async () => {
      if (user) {
        const ref = doc(db, "bodas", "bodaPrincipal");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const adminUIDs = data.adminUIDs || [];
          setIsAdmin(adminUIDs.includes(user.uid));
        }
      }
    };
    verificarAdmin();
  }, [user]);

  useEffect(() => {
    const fetchConfirmaciones = async () => {
      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setConfirmacionesData(data.confirmaciones || {});
      }
    };
    fetchConfirmaciones();
  }, []);

  // Eliminar confirmación completamente por UID
  const eliminarConfirmacionPorUID = async (uid) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este registro de confirmación? Esta acción eliminará completamente a los comensales de todos los sitios.")) return;
    try {
      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const actual = data.confirmaciones || {};
        const conf = actual[uid];
        delete actual[uid];
        await setDoc(ref, { confirmaciones: actual }, { merge: true });
        setConfirmacionesData(actual);
        alert("✅ Comensales eliminados de forma global.");

        // Eliminar del registro de acciones
        const accionesRef = collection(db, "bodas", "bodaPrincipal", "registroAcciones");
        const q = query(accionesRef, where("asistente", "in", conf.detalles.map(d => `${d.nombre} ${d.apellidos}`.trim())));
        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => deleteDoc(doc.ref));
      }
    } catch (err) {
      console.error("Error al eliminar confirmación completa:", err);
    }
  };

  // Actualiza el nombre de cada asistente
  const handleNombreChange = (idx, value) => {
    setNombres((prev) => {
      const nuevos = [...prev];
      nuevos[idx].nombre = value;
      return nuevos;
    });
  };

  const handleAlergiaChange = (idx, value) => {
    setNombres((prev) => {
      const nuevos = [...prev];
      nuevos[idx].alergia = value;
      return nuevos;
    });
  };

  const handleNombreNinoChange = (idx, value) => {
    setNombresNinos((prev) => {
      const nuevos = prev.map(n => ({ ...n }));
      nuevos[idx].nombre = value;
      return nuevos;
    });
  };

  const handleAlergiaNinoChange = (idx, value) => {
    setNombresNinos((prev) => {
      const nuevos = prev.map(n => ({ ...n }));
      nuevos[idx].alergia = value;
      return nuevos;
    });
  };

  // Confirma y guarda en Firebase
  const handleConfirmar = async (e) => {
    e.preventDefault();
    const confirmadosLimpios = nombres.filter((c) => c.nombre.trim() !== "");
    if (confirmadosLimpios.length === 0) {
      alert("Debes introducir al menos un nombre.");
      return;
    }
    setConfirmados(confirmadosLimpios.map(c => c.nombre));

    if (!user) {
      alert("Debes iniciar sesión para confirmar asistencia.");
      return;
    }

    const ref = doc(db, "bodas", "bodaPrincipal");
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};

    const confirmacionesAnteriores = data.confirmaciones || {};
    const todosLosAsistentes = [...confirmadosLimpios, ...nombresNinos.filter(n => n.nombre.trim() !== "")];

    todosLosAsistentes.forEach((persona) => {
      const id = `${user.uid}_${persona.nombre}_${Date.now()}`;
      confirmacionesAnteriores[id] = {
        email: user.email,
        nombres: [`${persona.nombre} ${persona.apellidos}`.trim()],
        detalles: [persona],
        numNinos,
        agregadoPor: user.displayName || user.email,
      };
    });

    await setDoc(ref, {
      confirmaciones: confirmacionesAnteriores
    }, { merge: true });

    for (let persona of todosLosAsistentes) {
      await registrarAccion(user.displayName || user.email, "confirmarAsistencia", {
        asistente: `${persona.nombre} ${persona.apellidos}`.trim(),
        alergia: persona.alergia || "",
        tipo: nombresNinos.includes(persona) ? "niño" : "adulto"
      });
    }

    alert("¡Asistencia confirmada correctamente!");
  };

  const eliminarTodosConfirmados = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar TODAS las confirmaciones? Esta acción no se puede deshacer.")) return;
    try {
      const ref = doc(db, "bodas", "bodaPrincipal");
      await setDoc(ref, { confirmaciones: {} }, { merge: true });
      setConfirmacionesData({});
      alert("✅ Todas las confirmaciones han sido eliminadas.");

      // Elimina también todas las acciones relacionadas
      const accionesRef = collection(db, "bodas", "bodaPrincipal", "registroAcciones");
      const snapshot = await getDocs(accionesRef);
      snapshot.forEach((doc) => deleteDoc(doc.ref));
    } catch (err) {
      console.error("Error al eliminar todas las confirmaciones:", err);
    }
  };

  return (
    <section className="card">
      <h2>Confirmar Asistencia</h2>
      <form onSubmit={handleConfirmar}>
        <label>
          Número de adultos:
          <select value={numAsistentes} onChange={(e) => setNumAsistentes(parseInt(e.target.value, 10))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Número de niños:
          <select value={numNinos} onChange={(e) => setNumNinos(parseInt(e.target.value, 10))}>
            {[0, 1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <div style={{ margin: "1em 0" }}>
          {Array.from({ length: numAsistentes }).map((_, idx) => (
            <div key={idx} style={{ marginBottom: "0.5em" }}>
              <label>
                Nombre de la persona {idx + 1}:
                <input
                  type="text"
                  value={nombres[idx]?.nombre || ""}
                  onChange={(e) => handleNombreChange(idx, e.target.value)}
                  required
                  style={{ marginLeft: "0.5em" }}
                />
              </label>
              <label>
                Apellidos:
                <input
                  type="text"
                  value={nombres[idx]?.apellidos || ""}
                  onChange={(e) => {
                    const nuevos = [...nombres];
                    nuevos[idx].apellidos = e.target.value;
                    setNombres(nuevos);
                  }}
                  required
                  style={{ marginLeft: "0.5em" }}
                />
              </label>
              <label>
                Alergia:
                <select
                  value={nombres[idx]?.alergia || ""}
                  onChange={(e) => handleAlergiaChange(idx, e.target.value)}
                  style={{ marginLeft: "0.5em" }}
                >
                  <option value="">Ninguna</option>
                  <option value="gluten">Gluten</option>
                  <option value="lactosa">Lactosa</option>
                  <option value="frutos secos">Frutos secos</option>
                  <option value="marisco">Marisco</option>
                </select>
              </label>
            </div>
          ))}
        </div>
        {numNinos > 0 && (
          <div style={{ margin: "1em 0" }}>
            <h4>Información de los niños:</h4>
            {Array.from({ length: numNinos }).map((_, idx) => (
              <div key={idx} style={{ marginBottom: "0.5em" }}>
                <label>
                  Nombre del niño {idx + 1}:
                  <input
                    type="text"
                    value={nombresNinos[idx]?.nombre || ""}
                    onChange={(e) => handleNombreNinoChange(idx, e.target.value)}
                    required
                    style={{ marginLeft: "0.5em" }}
                  />
                </label>
                <label>
                  Apellidos:
                  <input
                    type="text"
                    value={nombresNinos[idx]?.apellidos || ""}
                    onChange={(e) => {
                      const nuevos = [...nombresNinos];
                      nuevos[idx].apellidos = e.target.value;
                      setNombresNinos(nuevos);
                    }}
                    required
                    style={{ marginLeft: "0.5em" }}
                  />
                </label>
                <label>
                  Alergia:
                  <select
                    value={nombresNinos[idx]?.alergia || ""}
                    onChange={(e) => handleAlergiaNinoChange(idx, e.target.value)}
                    style={{ marginLeft: "0.5em" }}
                  >
                    <option value="">Ninguna</option>
                    <option value="gluten">Gluten</option>
                    <option value="lactosa">Lactosa</option>
                    <option value="frutos secos">Frutos secos</option>
                    <option value="marisco">Marisco</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Confirmar</button>
      </form>
      {confirmados.length > 0 && (
        <div style={{ marginTop: "3em", borderTop: "1px solid #ccc", paddingTop: "1em" }}>
          <h3>Asistentes confirmados:</h3>
          <ul>
            {confirmados.map((nombre, idx) => (
              <li key={idx}>{nombre}</li>
            ))}
          </ul>
        </div>
      )}
      <div style={{ marginTop: "2em" }}>
        <h3>Lista global de asistentes confirmados:</h3>
        {isAdmin && (
          <button
            onClick={eliminarTodosConfirmados}
            style={{
              marginBottom: "1em",
              backgroundColor: "#ff4444",
              color: "white",
              padding: "0.5em 1em",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Eliminar todos los confirmados
          </button>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.5em",
            listStyleType: "none",
            paddingLeft: 0,
          }}
        >
          {Object.entries(confirmacionesData).map(([uid, conf], idx) => (
            <div key={idx} style={{
              background: "#f3f3f3",
              borderRadius: "8px",
              padding: "0.5em",
              fontSize: "0.85em",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              {conf.detalles?.map((d, i) => (
                <div key={i} style={{
                  background: "linear-gradient(to right, #fdfbfb, #ebedee)",
                  borderRadius: "12px",
                  padding: "1em",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5em"
                }}>
                  <div style={{ fontWeight: "bold", fontSize: "1.1em", color: "#333" }}>
                    {d.nombre}
                    {isAdmin && (
                      <button
                        onClick={() => eliminarConfirmacionPorUID(uid)}
                        style={{
                          marginLeft: "0.5em",
                          background: "transparent",
                          border: "none",
                          color: "#c00",
                          cursor: "pointer"
                        }}
                        title="Eliminar confirmación"
                      >
                        ❌
                      </button>
                    )}
                    {conf.numNinos > i && (
                      <span
                        title="Niño/a"
                        style={{
                          display: "inline-block",
                          marginLeft: "0.25em",
                          width: "10px",
                          height: "10px",
                          backgroundColor: "#4caf50",
                          borderRadius: "50%",
                        }}
                      ></span>
                    )}
                  </div>
                  {isAdmin && d.alergia && d.alergia !== "" && (
                    <div style={{ fontSize: "0.9em", color: "#a94442" }}>
                      Alergia: {d.alergia}
                    </div>
                  )}
                  {isAdmin && (
                    <div style={{ fontSize: "0.8em", color: "#999" }}>
                      Añadido por: {conf.agregadoPor || "Desconocido"}
                    </div>
                  )}
                </div>
              ))}
              {isAdmin && typeof conf.numNinos === "number" && (
                <div style={{ fontSize: "0.9em", color: "#31708f" }}>
                  Niños: {conf.numNinos}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Confirmar;
