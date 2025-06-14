// File: src/pages/Mesas.jsx
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from "firebase/firestore";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Nombres atractivos para las mesas
const nombresMesas = [
  "Los que nunca faltan",
  "Mesa VIP",
  "El último brindis",
  "Los fiesteros oficiales",
  "La mesa del buen rollo",
  "Los del karaoke eterno",
  "Los que vienen por la comida",
  "Los que cierran la pista",
  "La mesa de los que lo dan todo",
  "Los de la risa contagiosa"
];

const iconosMesas = [
  "🔥", // Los que nunca faltan
  "👑", // Mesa VIP
  "🥂", // El último brindis
  "🎉", // Los fiesteros oficiales
  "😄", // La mesa del buen rollo
  "🎤", // Los del karaoke eterno
  "🍽️", // Los que vienen por la comida
  "💃", // Los que cierran la pista
  "🚀", // La mesa de los que lo dan todo
  "😂"  // Los de la risa contagiosa
];

function crearMesa(idx) {
  return {
    nombre: `Mesa ${nombresMesas[idx % nombresMesas.length]}`,
    icono: iconosMesas[idx % iconosMesas.length],
    comensales: Array(10).fill(""),
  };
}

function Mesas() {
  const [mesas, setMesas] = useState([crearMesa(0)]);
  const [user] = useAuthState(auth);
  const [invitadoArrastrado, setInvitadoArrastrado] = useState(null);
  // Estados para el submenú de eliminación
  const [opcionEliminacion, setOpcionEliminacion] = useState("todas");
  const [numeroMesasAEliminar, setNumeroMesasAEliminar] = useState(1);

  // Cargar mesas guardadas desde Firebase al iniciar
  useEffect(() => {
    const cargarMesasGuardadas = async () => {
      if (!user) return;
      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const mesasOrganizadas = data.mesasOrganizadas || {};
        const mesasGuardadas = mesasOrganizadas[user.uid];
        if (Array.isArray(mesasGuardadas)) {
          setMesas(mesasGuardadas);
        }
      }
    };
    cargarMesasGuardadas();
  }, [user]);

  // Guardar mesas automáticamente en Firebase al cambiar
  useEffect(() => {
    if (!user || !Array.isArray(mesas) || mesas.length === 0) return;

    const guardarMesas = async () => {
      try {
        const ref = doc(db, "bodas", "bodaPrincipal");

        await setDoc(
          ref,
          {
            mesasOrganizadas: {
              [user.uid]: mesas
            }
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error al guardar las mesas:", error);
      }
    };

    guardarMesas();
  }, [mesas, user]);

  const [confirmados, setConfirmados] = useState([]);

  useEffect(() => {
    const cargarConfirmados = async () => {
      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        const confirmaciones = data.confirmaciones || {};
        const lista = Object.entries(confirmaciones)
          .flatMap(([id, conf]) => {
            return (conf.detalles || []).map((det, i) => ({
              id: `${id}_${i}`,
              nombre: det.nombre || "",
              alergias: det.alergias || "",
              agregadoPor: conf.agregadoPor || "",
            }));
          })
          .filter((item) => item.nombre !== "");
        setConfirmados(lista);
      }
    };

    if (user) {
      cargarConfirmados();
    }
  }, [user]);

  // Añadir una nueva mesa
  const handleAddMesa = () => {
    setMesas((prev) => [...prev, crearMesa(prev.length)]);
  };

  // Quitar la última mesa (mínimo 1)
  const handleRemoveMesa = () => {
    setMesas((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  // Añadir comensal a una mesa
  const handleAddComensal = (mesaIdx) => {
    setMesas((prev) =>
      prev.map((mesa, idx) =>
        idx === mesaIdx
          ? { ...mesa, comensales: [...mesa.comensales, ""] }
          : mesa
      )
    );
  };

  // Quitar comensal de una mesa (mínimo 1)
  const handleRemoveComensal = (mesaIdx) => {
    setMesas((prev) =>
      prev.map((mesa, idx) =>
        idx === mesaIdx && mesa.comensales.length > 1
          ? { ...mesa, comensales: mesa.comensales.slice(0, -1) }
          : mesa
      )
    );
  };

  // Cambiar nombre de comensal
  const handleNombreComensal = (mesaIdx, comensalIdx, value) => {
    setMesas((prev) =>
      prev.map((mesa, idx) =>
        idx === mesaIdx
          ? {
              ...mesa,
              comensales: mesa.comensales.map((nombre, i) =>
                i === comensalIdx ? value : nombre
              ),
            }
          : mesa
      )
    );
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Distribución de Mesas", 14, 20);

    mesas.forEach((mesa, index) => {
      autoTable(doc, {
        startY: 30 + index * 40,
        head: [[`${mesa.icono} ${mesa.nombre}`]],
        body: mesa.comensales.map((nombre, i) => [nombre || `Comensal ${i + 1}`]),
        theme: 'grid',
      });
    });

    doc.save("distribucion_mesas.pdf");
  };

  const eliminarTodasLasMesas = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar TODAS las mesas? Esta acción es irreversible.")) return;
    try {
      const ref = collection(db, "bodas", "bodaPrincipal", "mesas");
      const snapshot = await getDocs(ref);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      alert("✅ Todas las mesas han sido eliminadas correctamente.");
    } catch (err) {
      console.error("Error al eliminar todas las mesas:", err);
      alert("❌ Error al eliminar todas las mesas.");
    }
  };

  // Manejar eliminación según opción seleccionada en el submenú
  const manejarEliminacionMesas = () => {
    if (opcionEliminacion === "todas") {
      eliminarTodasLasMesas();
    } else if (opcionEliminacion === "comensales") {
      setMesas((prev) =>
        prev.map((mesa) => ({ ...mesa, comensales: Array(mesa.comensales.length).fill("") }))
      );
    } else if (opcionEliminacion === "numero") {
      setMesas((prev) => prev.slice(0, Math.max(1, prev.length - numeroMesasAEliminar)));
    }
  };

  // --- Obtener el objeto usuario con rol ---
  // El usuario puede venir de props, contexto, o del propio user (firebase)
  // Para este ejemplo, asumimos que el rol está en user.rol.
  // Si no, puedes adaptar la obtención del objeto usuario aquí.
  const usuario = user && user.rol ? user : { rol: "invitado" };

  return (
    <section className="card" style={{ background: "rgba(255,255,255,0.95)" }}>
      <h2>Mesas del Gran Salón</h2>
      <div style={{ marginBottom: "2em", maxWidth: "600px" }}>
        <h3 style={{ marginBottom: "0.5em" }}>Invitados confirmados (sin asignar):</h3>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (!invitadoArrastrado) return;
            setConfirmados((prev) =>
              prev.filter((p) => p.nombre !== invitadoArrastrado)
            );
            setInvitadoArrastrado(null);
          }}
          style={{
            minHeight: "50px",
            border: "2px dashed #f44336",
            borderRadius: "0.5em",
            marginBottom: "1em",
            padding: "0.5em",
            background: "#ffebee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#b71c1c",
            fontStyle: "italic"
          }}
        >
          🗑️ Arrastra aquí para ELIMINAR un comensal
        </div>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (!invitadoArrastrado) return;

            // Quitar el invitado de todas las mesas
            setMesas((prev) =>
              prev.map((mesa) => ({
                ...mesa,
                comensales: mesa.comensales.map((c) => (c === invitadoArrastrado ? "" : c)),
              }))
            );

            // Volver a colocar el invitado arriba si no estaba ya
            setConfirmados((prev) => {
              if (prev.find((p) => p.nombre === invitadoArrastrado)) return prev;
              return [...prev, { nombre: invitadoArrastrado }];
            });

            setInvitadoArrastrado(null);
          }}
          style={{
            minHeight: "50px",
            border: "2px dashed #ccc",
            borderRadius: "0.5em",
            marginBottom: "1em",
            padding: "0.5em",
            background: "#f9f9f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
            fontStyle: "italic"
          }}
        >
          Arrastra aquí para desasignar un comensal
        </div>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5em",
        }}>
          {confirmados.map((invitado, idx) => (
            <div
              key={idx}
              draggable={usuario.rol === "admin" || usuario.rol === "moderador"}
              onDragStart={() => {
                if (usuario.rol !== "admin" && usuario.rol !== "moderador") return;
                setInvitadoArrastrado(invitado.nombre);
              }}
              onTouchStart={() => {
                if (usuario.rol !== "admin" && usuario.rol !== "moderador") return;
                setInvitadoArrastrado(invitado.nombre);
              }}
              onTouchEnd={() => {
                setTimeout(() => setInvitadoArrastrado(null), 300);
              }}
              onClick={() =>
                alert(
                  `👤 Nombre: ${invitado.nombre}\n📋 Alergias: ${invitado.alergias || "Ninguna"}\n👤 Confirmado por: ${invitado.agregadoPor || "Desconocido"}`
                )
              }
              style={{
                background: mesas.some((mesa) =>
                  mesa.comensales.includes(invitado.nombre)
                )
                  ? "#e0f7fa"
                  : "#fff",
                padding: "0.5em 1em",
                borderRadius: "1em",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                cursor:
                  usuario.rol === "admin" || usuario.rol === "moderador"
                    ? "grab"
                    : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontSize: "0.95em",
                touchAction: "none",
                position: "relative"
              }}
            >
              <div>{invitado.nombre}</div>
              {invitado.agregadoPor && (
                <div style={{ fontSize: "0.75em", color: "#888" }}>
                  <i>{invitado.agregadoPor}</i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "1em" }}>
        {(usuario.rol === "admin" || usuario.rol === "moderador") && (
          <button onClick={exportarPDF} style={{ marginRight: "1em", background: "#5e60ce", color: "#fff", padding: "0.5em 1em", borderRadius: "0.5em", border: "none" }}>
            📄 Exportar a PDF
          </button>
        )}
        <button onClick={handleAddMesa} style={{ marginRight: "1em" }}>
          ➕ Añadir mesa
        </button>
        <button onClick={handleRemoveMesa} disabled={mesas.length === 1}>
          ➖ Quitar mesa
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2em",
          justifyContent: "center",
        }}
      >
        {mesas.map((mesa, mesaIdx) => (
          <div
            key={mesaIdx}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (usuario.rol !== "admin" && usuario.rol !== "moderador") return;
              if (!invitadoArrastrado) return;
              setMesas((prev) =>
                prev.map((mesa, idx) => {
                  const comensalesActualizados = mesa.comensales.map((c) =>
                    c === invitadoArrastrado ? "" : c
                  );

                  if (idx === mesaIdx) {
                    const hueco = comensalesActualizados.findIndex((c) => c === "");
                    if (hueco !== -1) {
                      comensalesActualizados[hueco] = invitadoArrastrado;
                    }
                  }

                  return { ...mesa, comensales: comensalesActualizados };
                })
              );

              setConfirmados((prev) =>
                prev.filter((invitado) => invitado.nombre !== invitadoArrastrado)
              );
              setInvitadoArrastrado(null);
            }}
            onTouchEndCapture={() => {
              if (!invitadoArrastrado) return;

              setMesas((prev) =>
                prev.map((mesa, idx) => {
                  if (idx !== mesaIdx) return mesa;

                  const comensalesActualizados = mesa.comensales.map((c) =>
                    c === invitadoArrastrado ? "" : c
                  );
                  const hueco = comensalesActualizados.findIndex((c) => c === "");
                  if (hueco !== -1) {
                    comensalesActualizados[hueco] = invitadoArrastrado;
                  }

                  return { ...mesa, comensales: comensalesActualizados };
                })
              );

              setConfirmados((prev) =>
                prev.filter((invitado) => invitado.nombre !== invitadoArrastrado)
              );
              setInvitadoArrastrado(null);
            }}
            style={{
              background: "#e9eef6",
              borderRadius: "1em",
              boxShadow: "0 4px 18px 0 rgba(93,58,155,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08)",
              padding: "1.5em",
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "box-shadow 0.2s",
            }}
          >
            <div style={{ marginBottom: "0.5em", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "1.5em" }}>{mesa.icono}</span>
              <input
                type="text"
                value={mesa.nombre}
                onChange={(e) =>
                  setMesas((prev) =>
                    prev.map((m, idx) =>
                      idx === mesaIdx ? { ...m, nombre: e.target.value } : m
                    )
                  )
                }
                style={{
                  fontWeight: "bold",
                  fontSize: "1em",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  borderRadius: "0.5em",
                  padding: "0.3em 0.6em",
                  marginTop: "0.3em",
                  width: "90%"
                }}
              />
            </div>
            <div style={{ marginBottom: "0.7em" }}>
              <button onClick={() => handleAddComensal(mesaIdx)} style={{ marginRight: "0.5em" }}>
                ➕
              </button>
              <button
                onClick={() => handleRemoveComensal(mesaIdx)}
                disabled={mesa.comensales.length === 1}
              >
                ➖
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(mesa.comensales.length))}, 1fr)`,
                gap: "0.5em",
                background: "#fff",
                borderRadius: "0.7em",
                padding: "1em",
                boxShadow: "0 2px 8px 0 rgba(93,58,155,0.07)",
                minWidth: 120,
                minHeight: 120,
                transition: "min-width 0.2s, min-height 0.2s",
              }}
            >
              {mesa.comensales.map((nombre, comensalIdx) => (
                <div
                  key={comensalIdx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "1.3em" }}>🍽️</span>
                  <input
                    type="text"
                    placeholder={`Comensal ${comensalIdx + 1}`}
                    value={nombre}
                    onChange={(e) =>
                      handleNombreComensal(mesaIdx, comensalIdx, e.target.value)
                    }
                    onDragStart={() => {
                      if (usuario.rol !== "admin" && usuario.rol !== "moderador") return;
                      setInvitadoArrastrado(nombre);
                    }}
                    draggable={usuario.rol === "admin" || usuario.rol === "moderador"}
                    style={{
                      width: 80,
                      marginTop: "0.2em",
                      borderRadius: "0.5em",
                      border: "1px solid #cfd8dc",
                      padding: "0.2em 0.4em",
                      textAlign: "center",
                      cursor: usuario.rol === "admin" || usuario.rol === "moderador" ? "grab" : "not-allowed",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 30,
          fontSize: "3em",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      >
        🪑
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: 40,
          fontSize: "2.5em",
          opacity: 0.09,
          pointerEvents: "none",
        }}
      >
        🪑
      </div>
      {(usuario.rol === "admin") && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <select
            value={opcionEliminacion}
            onChange={(e) => setOpcionEliminacion(e.target.value)}
            style={{
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
          >
            <option value="todas">Eliminar TODAS las mesas</option>
            <option value="comensales">Eliminar SOLO los comensales</option>
            <option value="numero">Eliminar cierto número de mesas</option>
          </select>
          {opcionEliminacion === "numero" && (
            <input
              type="number"
              min="1"
              max={mesas.length}
              value={numeroMesasAEliminar}
              onChange={(e) => setNumeroMesasAEliminar(Number(e.target.value))}
              style={{
                padding: "0.5rem",
                marginLeft: "1rem",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "80px"
              }}
            />
          )}
          <button
            onClick={manejarEliminacionMesas}
            style={{
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              marginLeft: "1rem"
            }}
          >
            🗑️ Confirmar eliminación
          </button>
        </div>
      )}
    </section>
  );
}

export default Mesas;
