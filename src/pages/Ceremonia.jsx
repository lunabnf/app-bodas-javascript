import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./Ceremonia.css";

const filas = 8;
const columnas = 10;
const totalSillasPorLado = filas * columnas;

const generarAsientos = (lado) => {
  const asientos = [];
  for (let i = 0; i < totalSillasPorLado; i++) {
    asientos.push({ id: `${lado}-${i + 1}`, nombre: null });
  }
  return asientos;
};

const Ceremonia = () => {
  const [asientosNovio, setAsientosNovio] = useState(generarAsientos("N"));
  const [asientosNovia, setAsientosNovia] = useState(generarAsientos("V"));
  const [confirmados, setConfirmados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [maestroNombre, setMaestroNombre] = useState("");
  const [nombreNovia, setNombreNovia] = useState("");
  const [nombreNovio, setNombreNovio] = useState("");

  const userData = { rol: "admin" }; // temporal mientras no se use AuthContext
  const esAdmin = userData?.rol === "admin";

  useEffect(() => {
    const fetchData = async () => {
      const asientosRef = doc(db, "ceremonia", "asientos");
      const confirmacionesRef = doc(db, "bodas", "bodaPrincipal");

      const [asientosSnap, confirmacionesSnap] = await Promise.all([
        getDoc(asientosRef),
        getDoc(confirmacionesRef),
      ]);

      if (asientosSnap.exists()) {
        const data = asientosSnap.data();
        setAsientosNovio(data.asientosNovio || generarAsientos("N"));
        setAsientosNovia(data.asientosNovia || generarAsientos("V"));
      }

      if (confirmacionesSnap.exists()) {
        const data = confirmacionesSnap.data();
        const confirmadosTodos = Object.entries(data.confirmaciones || {}).flatMap(([id, conf]) => {
          return (conf.detalles || []).map((det, i) => ({
            id: `${id}_${i}`,
            nombre: det.nombre || "",
            agregadoPor: conf.agregadoPor || "",
          }));
        });

        // Antes filtraba los que ya estaban colocados, ahora siempre disponibles
        setConfirmados(confirmadosTodos);
      }
    };
    fetchData();
     
  }, []);

  const guardarEnFirestore = async (nuevoNovio, nuevoNovia) => {
    await setDoc(doc(db, "ceremonia", "asientos"), {
      asientosNovio: nuevoNovio,
      asientosNovia: nuevoNovia,
    });
  };

  const handleClick = async (id, lado) => {
    if (!esAdmin || confirmados.length === 0) return;
    const nombre = prompt("Escribe el nombre exacto a colocar o copia desde arriba:");
    if (!nombre || !confirmados.map(c => c.nombre).includes(nombre)) return alert("Nombre no válido.");

    if (lado === "N") {
      const nuevos = asientosNovio.map((a) =>
        a.id === id ? { ...a, nombre } : a
      );
      setAsientosNovio(nuevos);
      await guardarEnFirestore(nuevos, asientosNovia);
    } else {
      const nuevos = asientosNovia.map((a) =>
        a.id === id ? { ...a, nombre } : a
      );
      setAsientosNovia(nuevos);
      await guardarEnFirestore(asientosNovio, nuevos);
    }

    setConfirmados((prev) => prev.filter((n) => n.nombre !== nombre));
  };

  const handleDrop = async (nombre, id, lado) => {
    if (!esAdmin) return;

    if (lado === "N") {
      const nuevos = asientosNovio.map((a) =>
        a.id === id ? { ...a, nombre } : a
      );
      setAsientosNovio(nuevos);
      await guardarEnFirestore(nuevos, asientosNovia);
    } else {
      const nuevos = asientosNovia.map((a) =>
        a.id === id ? { ...a, nombre } : a
      );
      setAsientosNovia(nuevos);
      await guardarEnFirestore(asientosNovio, nuevos);
    }

    // Eliminar al invitado del panel superior
    setConfirmados((prev) => prev.filter((inv) => inv.nombre !== nombre));
  };

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>Plano de la Ceremonia</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Invitados por ubicar</h3>
        {esAdmin && (
          <div style={{ marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Nombre del invitado (manual)"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              style={{ padding: "0.5rem", borderRadius: "0.5rem", marginRight: "0.5rem" }}
            />
            <button
              onClick={() => {
                if (!nuevoNombre.trim()) return;
                const nuevo = {
                  id: `manual_${Date.now()}`,
                  nombre: nuevoNombre.trim(),
                  agregadoPor: "admin",
                };
                setConfirmados((prev) => [...prev, nuevo]);
                setNuevoNombre("");
              }}
              style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer" }}
            >
              Añadir invitado
            </button>
          </div>
        )}
        {/* Botón de reinicio para administradores */}
        {esAdmin && (
          <button
            onClick={() => {
              const colocados = [...asientosNovio, ...asientosNovia].filter((a) => a.nombre);
              const nuevosConfirmados = colocados.map((a, i) => ({
                id: `reinicio_${i}`,
                nombre: a.nombre,
                agregadoPor: "admin",
              }));
              setAsientosNovio(generarAsientos("N"));
              setAsientosNovia(generarAsientos("V"));
              setConfirmados(nuevosConfirmados);
              guardarEnFirestore(generarAsientos("N"), generarAsientos("V"));
            }}
            style={{
              marginBottom: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f44336",
              color: "white",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            Reiniciar colocación
          </button>
        )}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
          {confirmados.map((inv) => (
            <div
              key={inv.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", inv.nombre)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: [...asientosNovio, ...asientosNovia].some((a) => a.nombre === inv.nombre)
                  ? "#c8e6c9"
                  : "#e0f7fa",
                borderRadius: "1rem",
                cursor: "grab",
              }}
            >
              {inv.nombre}
              <div style={{ fontSize: "0.75rem", color: "#888" }}>
                <i>{inv.agregadoPor}</i>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: "2rem 0" }}>
        <div><strong>Maestro de ceremonias</strong></div>
        <div
          style={{
            fontSize: "2rem",
            padding: "1rem",
            backgroundColor: maestroNombre ? "#ffe082" : "#fff",
            borderRadius: "1rem",
            minWidth: "100px",
            minHeight: "60px"
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const nombre = e.dataTransfer.getData("text/plain");
            setMaestroNombre(nombre);
          }}
        >
          🎤
          <div style={{ fontSize: "0.75rem" }}>{maestroNombre}</div>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div><strong>Novios</strong></div>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", fontSize: "2rem" }}>
          <div
            style={{
              padding: "1rem",
              backgroundColor: nombreNovia ? "#ffe082" : "#fff",
              borderRadius: "1rem",
              minWidth: "100px",
              minHeight: "60px"
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const nombre = e.dataTransfer.getData("text/plain");
              setNombreNovia(nombre);
            }}
          >
            👰
            <div style={{ fontSize: "0.75rem" }}>{nombreNovia}</div>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: nombreNovio ? "#ffe082" : "#fff",
              borderRadius: "1rem",
              minWidth: "100px",
              minHeight: "60px"
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const nombre = e.dataTransfer.getData("text/plain");
              setNombreNovio(nombre);
            }}
          >
            🤵
            <div style={{ fontSize: "0.75rem" }}>{nombreNovio}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
        <div>
          <h4>Invitados del Novio</h4>
          <div className="asientos-grid">
            {asientosNovio.map((a) => (
              <div
                key={a.id}
                className="asiento"
                style={{
                  backgroundColor: a.nombre ? "#ffe082" : "white",
                  transition: "background-color 0.3s ease"
                }}
                onClick={esAdmin ? () => handleClick(a.id, "N") : undefined}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const nombre = e.dataTransfer.getData("text/plain");
                  handleDrop(nombre, a.id, "N");
                }}
                title={a.nombre || "Vacío"}
              >
                {a.id}
                <div style={{ fontSize: "0.75rem" }}>{a.nombre}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4>Invitados de la Novia</h4>
          <div className="asientos-grid">
            {asientosNovia.map((a) => (
              <div
                key={a.id}
                className="asiento"
                style={{
                  backgroundColor: a.nombre ? "#ffe082" : "white",
                  transition: "background-color 0.3s ease"
                }}
                onClick={esAdmin ? () => handleClick(a.id, "V") : undefined}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const nombre = e.dataTransfer.getData("text/plain");
                  handleDrop(nombre, a.id, "V");
                }}
                title={a.nombre || "Vacío"}
              >
                {a.id}
                <div style={{ fontSize: "0.75rem" }}>{a.nombre}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ceremonia;