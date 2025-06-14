import { useEffect, useState } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  writeBatch,
  addDoc,
  setDoc,
  getDoc,
  where
} from "firebase/firestore";
// ---- Formulario para añadir administradores ----
import React from "react";

// --- ESTADOS PARA FORMULARIO DE ADMIN ---

function Registro({ user }) {
  const [nombreAdmin, setNombreAdmin] = useState("");
  const [correoAdmin, setCorreoAdmin] = useState("");
  const [agregandoAdmin, setAgregandoAdmin] = useState(false);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!nombreAdmin || !correoAdmin) {
      alert("Por favor, completa ambos campos.");
      return;
    }
    setAgregandoAdmin(true);
    try {
      // Verifica si ya existe un admin con ese correo
      const q = query(collection(db, "usuarios"), where("email", "==", correoAdmin));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        alert("Ya existe un usuario con ese correo.");
        setAgregandoAdmin(false);
        return;
      }
      await addDoc(collection(db, "usuarios"), {
        nombre: nombreAdmin,
        email: correoAdmin,
        rol: "admin",
        codigo: "0000"
      });
      alert("Administrador añadido correctamente.");
      setNombreAdmin("");
      setCorreoAdmin("");
    } catch (err) {
      alert("Error al añadir administrador.");
      console.error(err);
    }
    setAgregandoAdmin(false);
  };
  useEffect(() => {
    const cargarHistorial = async () => {
      const ref = collection(db, "bodas", "bodaPrincipal", "historialCambios");
      const snap = await getDocs(ref);
      const cambios = snap.docs.map(doc => doc.data()).sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));
      setHistorial(cambios);
    };
    cargarHistorial();
  }, []);
  // Historial de cambios
  const [historial, setHistorial] = useState([]);

  // Función para registrar cambios en historialCambios
  const registrarCambio = async (descripcion) => {
    try {
      await addDoc(collection(db, "bodas", "bodaPrincipal", "historialCambios"), {
        usuario: user?.displayName || "Desconocido",
        descripcion,
        timestamp: new Date()
      });
    } catch (err) {
      console.error("Error registrando cambio:", err);
    }
  };
  const [accionesPorTipo, setAccionesPorTipo] = useState({});
  const [resumenPorTipo, setResumenPorTipo] = useState({
    confirmarAsistencia: 0,
    desplazamiento: 0,
    musica: 0,
    cuestionario: 0,
    ranking: 0,
  });
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Estados y función para gestión de mesas
  const [opcionEliminacionMesas, setOpcionEliminacionMesas] = useState("todas");
  const [numeroMesasAEliminar, setNumeroMesasAEliminar] = useState(1);

  const manejarEliminacionMesas = async () => {
    const refBoda = doc(db, "bodas", "bodaPrincipal");

    if (opcionEliminacionMesas === "todas") {
      await setDoc(refBoda, { mesasOrganizadas: {} }, { merge: true });
      await registrarCambio("Eliminó todas las mesas");
      alert("✅ Todas las mesas han sido eliminadas.");
    } else if (opcionEliminacionMesas === "comensales") {
      const snap = await getDoc(refBoda);
      if (snap.exists()) {
        const data = snap.data();
        const mesas = data.mesasOrganizadas || {};
        for (const uid in mesas) {
          mesas[uid] = mesas[uid].map(mesa => ({
            ...mesa,
            comensales: mesa.comensales.map(() => "")
          }));
        }
        await setDoc(refBoda, { mesasOrganizadas: mesas }, { merge: true });
        await registrarCambio("Eliminó todos los comensales de las mesas");
        alert("✅ Comensales eliminados de todas las mesas.");
      }
    } else if (opcionEliminacionMesas === "numero") {
      const snap = await getDoc(refBoda);
      if (snap.exists()) {
        const data = snap.data();
        const mesas = data.mesasOrganizadas || {};
        for (const uid in mesas) {
          mesas[uid] = mesas[uid].slice(0, Math.max(1, mesas[uid].length - numeroMesasAEliminar));
        }
        await setDoc(refBoda, { mesasOrganizadas: mesas }, { merge: true });
        await registrarCambio(`Eliminó ${numeroMesasAEliminar} mesas`);
        alert("✅ Se han eliminado mesas.");
      }
    }
  };

  // Función para cargar acciones, ahora fuera de useEffect para que pueda ser llamada desde otras funciones
  const cargarAcciones = async () => {
    try {
      const ref = collection(db, "bodas", "bodaPrincipal", "registroAcciones");
      const q = query(ref, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const agrupadas = {};

      snapshot.docs.forEach((doc) => {
        try {
          const rawData = doc.data();
          const tipoRaw = rawData.accion || "Otros";
          const tipo = {
            confirmarAsistencia: "Confirmación de Asistencia",
            desplazamiento: "Desplazamiento",
            musica: "Música",
            cuestionario: "Cuestionario",
            ranking: "Ranking"
          }[tipoRaw] || tipoRaw;
          const accion = {
            id: doc.id,
            nombre: rawData.nombre || "Invitado",
            detalles: rawData.detalles || "",
            timestamp: rawData.timestamp?.toDate().toLocaleString() || "Sin fecha",
            tipoRaw,
            tipo,
          };
          if (!agrupadas[tipo]) agrupadas[tipo] = [];
          agrupadas[tipo].push(accion);
        } catch (e) {
          console.warn("Documento con error:", doc.id, e);
        }
      });

      const resumen = {
        confirmarAsistencia: 0,
        desplazamiento: 0,
        musica: 0,
        cuestionario: 0,
        ranking: 0,
      };

      snapshot.docs.forEach((doc) => {
        const tipoRaw = doc.data().accion;
        if (resumen[tipoRaw] !== undefined) {
          resumen[tipoRaw]++;
        }
      });

      setAccionesPorTipo(agrupadas);
      setResumenPorTipo(resumen);
      // Se actualiza correctamente el contador del resumen visual
    } catch (err) {
      console.error("Error cargando acciones:", err);
      setError("Error cargando acciones");
    }
  };

  useEffect(() => {
    cargarAcciones();
  }, []);

  const [mostrarMenuEliminar, setMostrarMenuEliminar] = useState(false);
  // Función para generar datos falsos de prueba
  const generarDatosFalsos = async () => {
    const coleccion = (nombre) => collection(db, "bodas", "bodaPrincipal", nombre);

    const datos = [
      {
        tipo: "confirmarAsistencia",
        nombre: "Ana García",
        detalles: { asistencia: "Sí", mensaje: "Con muchas ganas!" }
      },
      {
        tipo: "musica",
        nombre: "Carlos Pérez",
        detalles: { cancion: "Vivir mi vida", artista: "Marc Anthony" }
      },
      {
        tipo: "cuestionario",
        nombre: "Marta López",
        detalles: { "¿Bebes alcohol?": "Sí", "¿Te gusta bailar?": "Mucho" }
      },
      {
        tipo: "desplazamiento",
        nombre: "Juan Romero",
        detalles: { medio: "Coche propio", comentario: "Llevo 3 plazas libres" }
      },
      // Datos falsos del tipo ranking
      {
        tipo: "ranking",
        nombre: "Laura Martínez",
        detalles: {
          nombrePropuesto: "Sergio Ramírez",
          categoria: "Mejor Vestido"
        }
      },
      {
        tipo: "ranking",
        nombre: "Mario Gómez",
        detalles: {
          nombreVotado: "Ana García",
          categoria: "Más Marchosa"
        }
      }
    ];

    for (const d of datos) {
      const timestamp = new Date();
      const refOriginal = await addDoc(coleccion(d.tipo), {
        nombre: d.nombre,
        detalles: d.detalles,
        timestamp
      });
      await addDoc(coleccion("registroAcciones"), {
        nombre: d.nombre,
        detalles: d.detalles,
        accion: d.tipo,
        timestamp,
        refOriginal: refOriginal.id
      });
    }

    await registrarCambio("Generó datos falsos de prueba");
    alert("✅ Datos de prueba generados");
    await cargarAcciones();
  };

  const eliminarAccion = async (accion) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta acción?")) return;
    const id = accion.id;
    try {
      // Eliminar de registroAcciones
      await deleteDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", id));
      // Eliminar de colección específica si aplica
      if (accion.tipoRaw) {
        try {
          await deleteDoc(doc(db, "bodas", "bodaPrincipal", accion.tipoRaw, id));
        } catch {
          console.warn(`No se encontró documento en colección ${accion.tipoRaw} con id ${id}`);
        }
      }
      setAccionesPorTipo((prev) => {
        const nuevo = { ...prev };
        for (const tipo in nuevo) {
          nuevo[tipo] = nuevo[tipo].filter((a) => a.id !== id);
        }
        return nuevo;
      });
    } catch (err) {
      console.error("Error eliminando acción:", err);
      alert("Error eliminando acción.");
    }
  };

  const eliminarTodos = async () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar TODOS los datos de la app? Esta acción es irreversible.")) return;
    try {
      // Eliminar todos los documentos de registroAcciones
      const ref = collection(db, "bodas", "bodaPrincipal", "registroAcciones");
      const q = query(ref);
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      // Eliminar todos los documentos de colecciones conocidas
      const colecciones = ["confirmarAsistencia", "musica", "desplazamiento", "cuestionario", "ranking", "asientos", "mesas", "fotos", "canciones"];
      for (const col of colecciones) {
        const refCol = collection(db, "bodas", "bodaPrincipal", col);
        const snap = await getDocs(refCol);
        const batchCol = writeBatch(db);
        snap.docs.forEach((doc) => batchCol.delete(doc.ref));
        await batchCol.commit();
      }

      setAccionesPorTipo({});
      setResumenPorTipo({
        confirmarAsistencia: 0,
        desplazamiento: 0,
        musica: 0,
        cuestionario: 0,
        ranking: 0,
      });

      await registrarCambio("Eliminó todos los datos de la aplicación");
      alert("✅ Todos los datos han sido eliminados correctamente.");
    } catch (err) {
      console.error("Error al borrar todos los datos:", err);
      alert("Error al borrar todos los datos.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Gráfica de confirmación: datos reales de Firebase
  const [datosConfirmacion, setDatosConfirmacion] = useState(null);
  useEffect(() => {
    const cargarConfirmacion = async () => {
      try {
        const ref = collection(db, "bodas", "bodaPrincipal", "confirmarAsistencia");
        const snap = await getDocs(ref);
        const confirmados = snap.docs.length;
        const totalInvitados = 80; // cambia este valor si tienes el total real dinámico
        setDatosConfirmacion({
          labels: ['Confirmados', 'No Confirmados'],
          datasets: [
            {
              label: 'Asistencia',
              data: [confirmados, totalInvitados - confirmados],
              backgroundColor: ['#4caf50', '#f44336'],
            },
          ],
        });
      } catch (error) {
        console.error("Error al cargar confirmaciones:", error);
      }
    };
    cargarConfirmacion();
  }, []);

  if (!Object.keys(accionesPorTipo).length) {
    return (
      <>
        <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
          <h2>No hay registros aún</h2>
          <p>Cuando se registren actividades, aparecerán aquí organizadas.</p>
        </div>

        {/* Panel de administración visible aunque no haya registros */}
        <section style={{ marginTop: "3rem" }}>
          <h2>Panel de Administración</h2>

          {/* Formulario para añadir administradores */}
          <div style={{ margin: "2rem auto", maxWidth: 400, background: "#f8f8f8", borderRadius: 8, padding: "1.5rem", boxShadow: "0 2px 8px #0001" }}>
            <h3>Registrar nuevo administrador</h3>
            <form onSubmit={handleAddAdmin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombreAdmin}
                onChange={e => setNombreAdmin(e.target.value)}
                required
                style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
              />
              <input
                type="email"
                placeholder="Correo"
                value={correoAdmin}
                onChange={e => setCorreoAdmin(e.target.value)}
                required
                style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
              />
              <button type="submit" disabled={agregandoAdmin}
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "0.6rem",
                  cursor: agregandoAdmin ? "wait" : "pointer"
                }}>
                {agregandoAdmin ? "Añadiendo..." : "Añadir administrador"}
              </button>
            </form>
          </div>

          {/* Botón para generar datos falsos */}
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              className="admin-btn"
              onClick={generarDatosFalsos}
              style={{
                backgroundColor: "#2e7d32",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "1rem"
              }}
            >
              🧪 Generar Datos Falsos
            </button>
            <br />
            <button
              className="admin-btn"
              onClick={() => {
                const blob = new Blob([JSON.stringify(accionesPorTipo, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'registro_actividades.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              style={{
                backgroundColor: "#00796b",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "1rem"
              }}
            >
              📥 Exportar Datos a JSON
            </button>
            <br />
            <button
              className="admin-btn"
              onClick={eliminarTodos}
              style={{
                backgroundColor: "#c62828",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                marginTop: "1rem"
              }}
            >
              🗑️ Eliminar todos los datos
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Panel de Administración */}
      <section style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2>Panel de Administración</h2>
        {/* Formulario para añadir administradores */}
        <div style={{ margin: "2rem auto", maxWidth: 400, background: "#f8f8f8", borderRadius: 8, padding: "1.5rem", boxShadow: "0 2px 8px #0001" }}>
          <h3>Registrar nuevo administrador</h3>
          <form onSubmit={handleAddAdmin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombreAdmin}
              onChange={e => setNombreAdmin(e.target.value)}
              required
              style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
            />
            <input
              type="email"
              placeholder="Correo"
              value={correoAdmin}
              onChange={e => setCorreoAdmin(e.target.value)}
              required
              style={{ padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
            />
            <button type="submit" disabled={agregandoAdmin}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "0.6rem",
                cursor: agregandoAdmin ? "wait" : "pointer"
              }}>
              {agregandoAdmin ? "Añadiendo..." : "Añadir administrador"}
            </button>
          </form>
        </div>
        <button
          style={{
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "1rem"
          }}
          onClick={() => alert('Función cargar usuarios QR aún no implementada')}
        >
          🔄 Cargar Usuarios QR en Firebase
        </button>
      </section>
      {/* Gráfica de confirmación de invitados */}
      {datosConfirmacion && (
        <div style={{ maxWidth: '500px', margin: 'auto', marginTop: '30px' }}>
          <Pie
            data={datosConfirmacion}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: true,
                  text: 'Estado de Confirmación de Invitados',
                },
              },
            }}
          />
        </div>
      )}
      <div style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
        <label><b>Buscar por nombre:</b></label>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value.toLowerCase())}
          placeholder="Escribe un nombre..."
          style={{ marginRight: "2rem" }}
        />
        <label><b>Filtrar por tipo:</b></label>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todos">Todos</option>
          {Object.keys(accionesPorTipo).map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <div style={{ marginLeft: "2rem" }}>
          <b>Recuento:</b>{" "}
          ✅ {resumenPorTipo.confirmarAsistencia} |{" "}
          🎵 {resumenPorTipo.musica} |{" "}
          📋 {resumenPorTipo.cuestionario} |{" "}
          🚗 {resumenPorTipo.desplazamiento} |{" "}
          🏆 {resumenPorTipo.ranking}
        </div>
      </div>
      <section className="card">
        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button
            className="admin-btn"
            onClick={eliminarTodos}
            style={{
              backgroundColor: "#c62828",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            🗑️ Eliminar todos los datos
          </button>
        </div>
        <h2 style={{ marginBottom: "2rem" }}>Registro de Actividades</h2>
        {Object.entries(accionesPorTipo)
          .filter(([tipo]) => filtro === "todos" || tipo === filtro)
          .map(([tipo, acciones]) => {
            const colorFondo = {
              "Confirmación de Asistencia": "#e8f4f8",
              "Desplazamiento": "#fef6e4",
              "Música": "#f3e8ff",
              "Cuestionario": "#e9ffe8",
            }[tipo] || "#f0f0f0";

            const accionesFiltradas = acciones
              .filter((accion) =>
                accion.nombre.toLowerCase().includes(busqueda)
              );

            const accionesPaginadas = accionesFiltradas.slice(
              (paginaActual - 1) * itemsPorPagina,
              paginaActual * itemsPorPagina
            );

            return (
              <div
                key={tipo}
                style={{
                  marginBottom: "2rem",
                  backgroundColor: colorFondo,
                  padding: "1rem",
                  borderRadius: "0.5rem",
                }}
              >
              <h3 style={{ borderBottom: "2px solid #bbb", marginBottom: "1rem" }}>{tipo}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Nombre</th>
                    <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Fecha</th>
                    <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Detalles</th>
                    <th style={{ textAlign: "center", padding: "0.5rem", borderBottom: "1px solid #ccc" }}>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {accionesPaginadas.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", color: "#888", padding: "1rem" }}>Sin acciones registradas</td>
                    </tr>
                  ) : (
                    accionesPaginadas.map((accion) => (
                      <tr key={accion.id}>
                        <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                          <input
                            type="text"
                            value={accion.nombre}
                            onChange={(e) => {
                              const nuevoNombre = e.target.value;
                              setAccionesPorTipo(prev => {
                                const nuevo = { ...prev };
                                nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id ? { ...a, nombre: nuevoNombre } : a);
                                return nuevo;
                              });
                            }}
                            onBlur={async (e) => {
                              try {
                                await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                  ...accion,
                                  nombre: e.target.value,
                                }, { merge: true });
                                await registrarCambio(`Modificó el nombre del registro ${accion.id}`);
                              } catch (err) {
                                console.error("Error actualizando nombre:", err);
                              }
                            }}
                            style={{ width: "100%" }}
                          />
                        </td>
                        <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>{accion.timestamp}</td>
                        <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee" }}>
                          {/* Mostrar detalles según tipoRaw */}
                          {(() => {
                            // Mostrar campos específicos si es un objeto
                            if (typeof accion.detalles === "object" && accion.detalles !== null) {
                              // Para tipos específicos, mostrar campos relevantes y editables
                              if (accion.tipoRaw === "confirmarAsistencia") {
                                // detalles {asistencia: "Sí", mensaje: "...", alergia: "..."}
                                return (
                                  <div>
                                    {accion.detalles.asistencia !== undefined && (
                                      <div>
                                        <b>Asistencia:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.asistencia}
                                          onChange={(e) => {
                                            const nuevaAsistencia = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, asistencia: nuevaAsistencia } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, asistencia: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó la asistencia del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando asistencia:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                    {accion.detalles.mensaje !== undefined && (
                                      <div>
                                        <b>Mensaje:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.mensaje}
                                          onChange={(e) => {
                                            const nuevoMensaje = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, mensaje: nuevoMensaje } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, mensaje: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó el mensaje del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando mensaje:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                    {accion.detalles.alergia !== undefined && (
                                      <div>
                                        <b>Alergia:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.alergia}
                                          onChange={(e) => {
                                            const nuevaAlergia = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, alergia: nuevaAlergia } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, alergia: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó la alergia del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando alergia:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              if (accion.tipoRaw === "musica") {
                                // detalles {cancion: "...", artista: "..."}
                                return (
                                  <div>
                                    {accion.detalles.cancion !== undefined && (
                                      <div>
                                        <b>Canción:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.cancion}
                                          onChange={(e) => {
                                            const nuevaCancion = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, cancion: nuevaCancion } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, cancion: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó la canción del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando canción:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                    {accion.detalles.artista !== undefined && (
                                      <div>
                                        <b>Artista:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.artista}
                                          onChange={(e) => {
                                            const nuevoArtista = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, artista: nuevoArtista } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, artista: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó el artista del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando artista:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              if (accion.tipoRaw === "desplazamiento") {
                                // detalles {medio: "...", comentario: "..."}
                                return (
                                  <div>
                                    {accion.detalles.medio !== undefined && (
                                      <div>
                                        <b>Medio:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.medio}
                                          onChange={(e) => {
                                            const nuevoMedio = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, medio: nuevoMedio } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, medio: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó el medio del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando medio:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                    {accion.detalles.comentario !== undefined && (
                                      <div>
                                        <b>Comentario:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.comentario}
                                          onChange={(e) => {
                                            const nuevoComentario = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, comentario: nuevoComentario } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, comentario: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó el comentario del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando comentario:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              if (accion.tipoRaw === "cuestionario") {
                                // detalles puede ser respuestas a preguntas
                                return (
                                  <div>
                                    {Object.entries(accion.detalles).map(([k, v]) => (
                                      <div key={k}>
                                        <b>{k}:</b>{" "}
                                        <input
                                          type="text"
                                          value={v}
                                          onChange={(e) => {
                                            const nuevoValor = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, [k]: nuevoValor } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, [k]: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó la respuesta "${k}" del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error(`Error actualizando campo ${k}:`, err);
                                            }
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                );
                              }
                              if (accion.tipoRaw === "ranking") {
                                return (
                                  <div>
                                    {accion.detalles.nombrePropuesto !== undefined && (
                                      <div>
                                        <b>Nombre propuesto:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.nombrePropuesto}
                                          onChange={(e) => {
                                            const nuevoNombrePropuesto = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, nombrePropuesto: nuevoNombrePropuesto } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, nombrePropuesto: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó el nombre propuesto del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando nombre propuesto:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                    {accion.detalles.nombreVotado !== undefined && (
                                      <div>
                                        <b>Nombre votado:</b>{" "}
                                        <input
                                          type="text"
                                          value={accion.detalles.nombreVotado}
                                          onChange={(e) => {
                                            const nuevoNombreVotado = e.target.value;
                                            setAccionesPorTipo(prev => {
                                              const nuevo = { ...prev };
                                              nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                                ? { ...a, detalles: { ...a.detalles, nombreVotado: nuevoNombreVotado } }
                                                : a);
                                              return nuevo;
                                            });
                                          }}
                                          onBlur={async (e) => {
                                            try {
                                              await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                                ...accion,
                                                detalles: { ...accion.detalles, nombreVotado: e.target.value },
                                              }, { merge: true });
                                              await registrarCambio(`Modificó el nombre votado del registro ${accion.id}`);
                                            } catch (err) {
                                              console.error("Error actualizando nombre votado:", err);
                                            }
                                          }}
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <b>Categoría:</b>{" "}
                                      <input
                                        type="text"
                                        value={accion.detalles.categoria || ""}
                                        onChange={(e) => {
                                          const nuevaCategoria = e.target.value;
                                          setAccionesPorTipo(prev => {
                                            const nuevo = { ...prev };
                                            nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                              ? { ...a, detalles: { ...a.detalles, categoria: nuevaCategoria } }
                                              : a);
                                            return nuevo;
                                          });
                                        }}
                                        onBlur={async (e) => {
                                          try {
                                            await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                              ...accion,
                                              detalles: { ...accion.detalles, categoria: e.target.value },
                                            }, { merge: true });
                                            await registrarCambio(`Modificó la categoría del registro ${accion.id}`);
                                          } catch (err) {
                                            console.error("Error actualizando categoría:", err);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              }
                              // Para otros objetos, mostrar clave:valor editable
                              return (
                                <div>
                                  {Object.entries(accion.detalles).map(([k, v]) => (
                                    <div key={k}>
                                      <b>{k}:</b>{" "}
                                      <input
                                        type="text"
                                        value={v}
                                        onChange={(e) => {
                                          const nuevoValor = e.target.value;
                                          setAccionesPorTipo(prev => {
                                            const nuevo = { ...prev };
                                            nuevo[tipo] = nuevo[tipo].map(a => a.id === accion.id
                                              ? { ...a, detalles: { ...a.detalles, [k]: nuevoValor } }
                                              : a);
                                            return nuevo;
                                          });
                                        }}
                                        onBlur={async (e) => {
                                          try {
                                            await setDoc(doc(db, "bodas", "bodaPrincipal", "registroAcciones", accion.id), {
                                              ...accion,
                                              detalles: { ...accion.detalles, [k]: e.target.value },
                                            }, { merge: true });
                                            await registrarCambio(`Modificó el campo "${k}" del registro ${accion.id}`);
                                          } catch (err) {
                                            console.error(`Error actualizando campo ${k}:`, err);
                                          }
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              );
                            }
                            // Si es texto plano
                            return accion.detalles || "Sin detalles";
                          })()}
                        </td>
                        <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign: "center" }}>
                          <button onClick={() => eliminarAccion(accion)} style={{ background: "none", border: "none", cursor: "pointer", color: "red" }}>❌</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}>⬅️</button>
                <span style={{ margin: "0 1rem" }}>Página {paginaActual}</span>
                <button
                  onClick={() =>
                    setPaginaActual((p) =>
                      p * itemsPorPagina < accionesFiltradas.length ? p + 1 : p
                    )
                  }
                >
                  ➡️
                </button>
              </div>
            </div>
            );
          })}
      </section>
      {/* Panel de administración agrupado */}
      <section style={{ marginTop: "3rem" }}>
        <h2>Panel de Administración</h2>
        {/* Historial de Cambios */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>🕓 Historial de Cambios</h3>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {historial.length === 0 ? (
              <li style={{ color: "#888" }}>No hay cambios registrados.</li>
            ) : (
              historial.map((cambio, i) => (
                <li key={i} style={{ marginBottom: "0.5rem" }}>
                  <b>{cambio.usuario}</b>: {cambio.descripcion} —{" "}
                  {cambio.timestamp?.seconds
                    ? new Date(cambio.timestamp.seconds * 1000).toLocaleString()
                    : ""}
                </li>
              ))
            )}
          </ul>
        </div>
        {/* Eliminar registros por tipo - menú hamburguesa */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <h3>🗑️ 
            <button
              onClick={() => setMostrarMenuEliminar(prev => !prev)}
              style={{
                backgroundColor: "#c62828",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                marginLeft: "1rem"
              }}
            >
              Menú Eliminar
            </button>
          </h3>

          {mostrarMenuEliminar && (
            <div>
              {["confirmarAsistencia", "musica", "cuestionario", "desplazamiento", "ranking"].map((tipo) => (
                <div key={tipo} style={{ margin: "0.5rem" }}>
                  <button
                    className="admin-btn"
                    onClick={async () => {
                      if (!window.confirm(`¿Seguro que quieres eliminar todos los registros de ${tipo}?`)) return;
                      try {
                        const ref = collection(db, "bodas", "bodaPrincipal", tipo);
                        const snap = await getDocs(ref);
                        const batch = writeBatch(db);
                        snap.docs.forEach((doc) => batch.delete(doc.ref));
                        await batch.commit();

                        const refRegistro = collection(db, "bodas", "bodaPrincipal", "registroAcciones");
                        const snapRegistro = await getDocs(refRegistro);
                        const batchRegistro = writeBatch(db);
                        snapRegistro.docs.forEach((doc) => {
                          if (doc.data().accion === tipo) {
                            batchRegistro.delete(doc.ref);
                          }
                        });
                        await batchRegistro.commit();

                        await registrarCambio(`Eliminó todos los registros de ${tipo}`);
                        await cargarAcciones();
                        alert(`Registros de ${tipo} eliminados correctamente.`);
                      } catch (err) {
                        console.error("Error al borrar registros:", err);
                        alert("Error al borrar registros.");
                      }
                    }}
                    style={{
                      backgroundColor: "#c62828",
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    🗑️ Eliminar {tipo}
                  </button>
                </div>
              ))}
              {/* Gestión de mesas dentro del menú eliminar */}
              <h4 style={{ marginTop: "2rem" }}>🪑 Gestión de Mesas</h4>
              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <select
                  value={opcionEliminacionMesas}
                  onChange={(e) => setOpcionEliminacionMesas(e.target.value)}
                  style={{ margin: "0.5rem", padding: "0.5rem" }}
                >
                  <option value="todas">Eliminar TODAS las mesas</option>
                  <option value="comensales">Eliminar SOLO los comensales</option>
                  <option value="numero">Eliminar cierto número de mesas</option>
                </select>
                {opcionEliminacionMesas === "numero" && (
                  <input
                    type="number"
                    min="1"
                    value={numeroMesasAEliminar}
                    onChange={(e) => setNumeroMesasAEliminar(Number(e.target.value))}
                    style={{ margin: "0.5rem", padding: "0.5rem", width: "80px" }}
                  />
                )}
                <button
                  className="admin-btn"
                  onClick={manejarEliminacionMesas}
                  style={{
                    backgroundColor: "#c62828",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginLeft: "0.5rem"
                  }}
                >
                  🗑️ Confirmar eliminación
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Generar datos falsos */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button
            className="admin-btn"
            onClick={generarDatosFalsos}
            style={{
              backgroundColor: "#2e7d32",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem"
            }}
          >
            🧪 Generar Datos Falsos
          </button>
          <br />
          <button
            className="admin-btn"
            onClick={() => {
              const blob = new Blob([JSON.stringify(accionesPorTipo, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'registro_actividades.json';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            style={{
              backgroundColor: "#00796b",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem"
            }}
          >
            📥 Exportar Datos a JSON
          </button>
        </div>
      </section>
    </>
  );
}


export default Registro;