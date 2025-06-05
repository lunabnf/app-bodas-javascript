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

  const userData = { rol: "admin" }; // temporal mientras no se use AuthContext
  const esAdmin = userData?.rol === "admin";

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "ceremonia", "asientos");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAsientosNovio(data.asientosNovio || generarAsientos("N"));
        setAsientosNovia(data.asientosNovia || generarAsientos("V"));
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
    if (!esAdmin) return;
    const nombre = prompt("¿Quién se sienta aquí?");
    if (!nombre) return;
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
  };

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>Plano de la Ceremonia</h2>

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