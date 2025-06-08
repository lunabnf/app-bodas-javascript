import React, { useEffect, useState } from 'react';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const db = getFirestore(app);
const checklistRef = doc(db, "bodas", "bodaPrincipal");

const plantillaChecklist = {
  "Planificación General": [
    "Definir fecha y lugar de la boda",
    "Crear presupuesto",
    "Contratar wedding planner (si aplica)"
  ],
  "Gastos": [
    "Contratar fotógrafo",
    "Contratar vídeo",
    "Reservar catering",
    "Contratar DJ o grupo musical"
  ],
  "Invitados": [
    "Hacer lista de invitados",
    "Enviar invitaciones",
    "Revisar confirmaciones de asistencia"
  ],
  "Proveedores": [
    "Contactar con florista",
    "Reservar transporte para novios",
    "Encargar tarta nupcial"
  ],
  "Logística": [
    "Organizar desplazamiento invitados",
    "Alquilar mobiliario si es necesario",
    "Planificar el orden del día"
  ],
  "Decoración": [
    "Elegir centro de mesa",
    "Diseñar seating plan",
    "Montaje de decoración el día anterior"
  ]
};

function Checklist() {
  const [tareas, setTareas] = useState({});
  const [plantillaAplicada, setPlantillaAplicada] = useState(false);
  const [nuevaTareaTexto, setNuevaTareaTexto] = useState({});
  const [nuevaSeccion, setNuevaSeccion] = useState("");
  const [ordenSecciones, setOrdenSecciones] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(checklistRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data().checklist || {};
        setTareas(data);
        setPlantillaAplicada(Object.keys(data).length > 0);
        // Actualizar ordenSecciones si hay nuevas claves o usar orden guardado
        setOrdenSecciones(prevOrden => {
          const nuevasClaves = Object.keys(data);
          if (docSnap.data().orden && Array.isArray(docSnap.data().orden)) {
            // Usar orden guardado en Firestore filtrando claves que aún existen
            return docSnap.data().orden.filter(clave => nuevasClaves.includes(clave));
          }
          // Si prevOrden está vacío, inicializar con las claves actuales
          if (prevOrden.length === 0) return nuevasClaves;
          // Añadir claves nuevas que no estén en prevOrden al final
          const actualizado = [...prevOrden];
          nuevasClaves.forEach(clave => {
            if (!actualizado.includes(clave)) {
              actualizado.push(clave);
            }
          });
          // Eliminar claves que ya no existen
          return actualizado.filter(clave => nuevasClaves.includes(clave));
        });
      } else {
        setTareas({});
        setPlantillaAplicada(false);
        setOrdenSecciones([]);
      }
    });
    return () => unsub();
  }, []);

  const aplicarPlantilla = () => {
    const datosIniciales = {};
    for (let seccion in plantillaChecklist) {
      datosIniciales[seccion] = plantillaChecklist[seccion].map(texto => ({
        texto,
        hecho: false
      }));
    }
    setDoc(checklistRef, { checklist: datosIniciales });
    setPlantillaAplicada(true);
  };

  const toggleHecho = (seccion, index) => {
    const nuevaLista = { ...tareas };
    nuevaLista[seccion][index].hecho = !nuevaLista[seccion][index].hecho;
    setDoc(checklistRef, { checklist: nuevaLista }, { merge: true });
  };

  const agregarTarea = (seccion) => {
    const texto = (nuevaTareaTexto[seccion] || "").trim();
    if (!texto) return;
    const nuevaLista = { ...tareas };
    if (!nuevaLista[seccion]) {
      nuevaLista[seccion] = [];
    }
    nuevaLista[seccion].push({ texto, hecho: false });
    setDoc(checklistRef, { checklist: nuevaLista }, { merge: true });
    setNuevaTareaTexto(prev => ({ ...prev, [seccion]: "" }));
  };

  const eliminarTarea = (seccion, index) => {
    const nuevaLista = { ...tareas };
    if (!nuevaLista[seccion]) return;
    nuevaLista[seccion] = nuevaLista[seccion].filter((_, i) => i !== index);
    setDoc(checklistRef, { checklist: nuevaLista }, { merge: true });
  };

  const progresoGlobal = () => {
    let total = 0, completadas = 0;
    for (let seccion in tareas) {
      total += tareas[seccion].length;
      completadas += tareas[seccion].filter(t => t.hecho).length;
    }
    return total > 0 ? Math.round((completadas / total) * 100) : 0;
  };

  const moverSeccionArriba = (seccion) => {
    setOrdenSecciones(prevOrden => {
      const idx = prevOrden.indexOf(seccion);
      if (idx <= 0) return prevOrden;
      const nuevoOrden = [...prevOrden];
      [nuevoOrden[idx - 1], nuevoOrden[idx]] = [nuevoOrden[idx], nuevoOrden[idx - 1]];
      setDoc(checklistRef, { orden: nuevoOrden }, { merge: true });
      return nuevoOrden;
    });
  };

  const moverSeccionAbajo = (seccion) => {
    setOrdenSecciones(prevOrden => {
      const idx = prevOrden.indexOf(seccion);
      if (idx === -1 || idx === prevOrden.length - 1) return prevOrden;
      const nuevoOrden = [...prevOrden];
      [nuevoOrden[idx], nuevoOrden[idx + 1]] = [nuevoOrden[idx + 1], nuevoOrden[idx]];
      setDoc(checklistRef, { orden: nuevoOrden }, { merge: true });
      return nuevoOrden;
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 Pizarra de Organización de la Boda</h2>
      {!plantillaAplicada ? (
        <div>
          <p>No hay plantilla aplicada. Puedes aplicar la plantilla base para comenzar con la organización.</p>
          <button onClick={aplicarPlantilla}>Aplicar plantilla base</button>
        </div>
      ) : (
        <>
          <div style={{ margin: "1rem 0", background: "#ddd", borderRadius: "10px", height: "20px" }}>
            <div style={{
              width: `${progresoGlobal()}%`,
              background: "#4caf50",
              height: "100%",
              borderRadius: "10px",
              transition: "width 0.3s"
            }} />
          </div>
          <p style={{ marginBottom: "2rem" }}>Progreso global: {progresoGlobal()}%</p>

          {ordenSecciones.map(seccion => {
            const lista = tareas[seccion] || [];
            return (
              <div key={seccion} style={{ marginBottom: "2rem" }}>
                <h3 style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ flexGrow: 1 }}>{seccion}</span>
                  <button
                    onClick={() => moverSeccionArriba(seccion)}
                    style={{ marginLeft: "0.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.1em" }}
                    aria-label={`Mover sección ${seccion} arriba`}
                    title="Mover sección arriba"
                  >⬆️</button>
                  <button
                    onClick={() => moverSeccionAbajo(seccion)}
                    style={{ marginLeft: "0.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.1em" }}
                    aria-label={`Mover sección ${seccion} abajo`}
                    title="Mover sección abajo"
                  >⬇️</button>
                  <button
                    onClick={() => eliminarSeccion(seccion)}
                    style={{ marginLeft: "0.5rem", background: "none", border: "none", cursor: "pointer", fontSize: "1.1em" }}
                    aria-label={`Eliminar sección ${seccion}`}
                    title="Eliminar sección"
                  >🗑️</button>
                </h3>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {lista.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                      <label style={{ textDecoration: item.hecho ? "line-through" : "none", flexGrow: 1 }}>
                        <input
                          type="checkbox"
                          checked={item.hecho}
                          onChange={() => toggleHecho(seccion, idx)}
                          style={{ marginRight: "0.5rem" }}
                        />
                        {item.texto}
                      </label>
                      <button onClick={() => eliminarTarea(seccion, idx)} style={{ marginLeft: "0.5rem" }} aria-label={`Eliminar tarea ${item.texto}`}>❌</button>
                    </li>
                  ))}
                </ul>
                <form onSubmit={e => { e.preventDefault(); agregarTarea(seccion); }} style={{ marginTop: "0.5rem" }}>
                  <input
                    type="text"
                    value={nuevaTareaTexto[seccion] || ""}
                    onChange={e => setNuevaTareaTexto(prev => ({ ...prev, [seccion]: e.target.value }))}
                    placeholder="Nueva tarea"
                    style={{ marginRight: "0.5rem" }}
                  />
                  <button type="submit">Añadir</button>
                </form>
              </div>
            );
          })}
          {/* Formulario para añadir nueva sección */}
          <form
            onSubmit={e => {
              e.preventDefault();
              agregarSeccion();
            }}
            style={{ marginTop: "1.5rem", marginBottom: "2rem" }}
          >
            <input
              type="text"
              value={nuevaSeccion}
              onChange={e => setNuevaSeccion(e.target.value)}
              placeholder="Nueva sección"
              style={{ marginRight: "0.5rem" }}
            />
            <button type="submit">Añadir sección</button>
          </form>
        </>
      )}
    </div>
  );
  // --- fin de Checklist
  function agregarSeccion() {
    const nombre = nuevaSeccion.trim();
    if (!nombre) return;
    if (Object.keys(tareas).includes(nombre)) return;
    const nuevaLista = { ...tareas, [nombre]: [] };
    setDoc(checklistRef, { checklist: nuevaLista }, { merge: true });
    setNuevaSeccion("");
  }

  // Elimina una sección completa del objeto tareas y lo guarda en Firestore
  function eliminarSeccion(nombreSeccion) {
    const nuevaLista = { ...tareas };
    delete nuevaLista[nombreSeccion];
    setDoc(checklistRef, { checklist: nuevaLista }, { merge: true });
    setTareas(nuevaLista);
  }
}

export default Checklist;
