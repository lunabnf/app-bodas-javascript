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
        const confirmadosTodos = data.confirmaciones || [];

        // Filtrar los que ya están colocados
        const colocados = [
          ...(asientosSnap.data()?.asientosNovio || []),
          ...(asientosSnap.data()?.asientosNovia || []),
        ].map((a) => a.nombre).filter(Boolean);

        const libres = confirmadosTodos.filter((n) => !colocados.includes(n));
        setConfirmados(libres);
      }
    };
    fetchData();
    // eslint-disable-next-line
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
    if (!nombre || !confirmados.includes(nombre)) return alert("Nombre no válido.");

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

    // Quitar el nombre ya usado
    setConfirmados((prev) => prev.filter((n) => n !== nombre));
  };

  const handleDrop = async (nombre, id, lado) => {
    if (!esAdmin || !confirmados.includes(nombre)) return;
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
    setConfirmados((prev) => prev.filter((n) => n !== nombre));
  };

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>Plano de la Ceremonia</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Invitados por ubicar</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
          {confirmados.map((nombre) => (
            <div
              key={nombre}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", nombre)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#e0f7fa",
                borderRadius: "1rem",
                cursor: "grab",
              }}
            >
              {nombre}
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: "2rem 0" }}>
        <div><strong>Maestro de ceremonias</strong></div>
        <div style={{ fontSize: "2rem" }}>🎤</div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <div><strong>Novios</strong></div>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem", fontSize: "2rem" }}>
          <span>👰</span>
          <span>🤵</span>
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