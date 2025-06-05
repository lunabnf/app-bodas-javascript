import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

const categorias = [
  "👑 Invitado/a más guapo/a",
  "🕺 Mejor outfit masculino",
  "💃 Mejor outfit femenino",
  "🤣 El alma de la fiesta",
  "🎤 El que más ha cantado",
  "💥 El que más ha bailado",
  "📸 El más fotogénico/a",
  "🍷 El más fiestero/a",
  "💬 El más hablador/a",
  "🎭 El más espontáneo/a"
];

const nombresInvitados = [
  "Luis Luna", "Leticia", "Eric", "Víctor", "Sandra", "Tatiana", "Walter", "Esther", "Teresa"
];

const Ranking = ({ usuario = "Usuario de prueba" }) => {
  const [votos, setVotos] = useState({});
  const [misVotos, setMisVotos] = useState({});
  const [propuestas, setPropuestas] = useState({});
  const [nuevaPropuesta, setNuevaPropuesta] = useState({});

  useEffect(() => {
    const cargarDatos = async () => {
      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setVotos(data.rankingPro || {});
        setPropuestas(data.propuestasRanking || {});
      }
    };
    cargarDatos();
  }, []);

  const votar = async (categoria, nombre) => {
    if (misVotos[categoria]?.includes(nombre)) return; // prevenir doble voto por persona

    const nuevoVoto = { ...votos };
    nuevoVoto[categoria] = nuevoVoto[categoria] || {};
    nuevoVoto[categoria][nombre] = (nuevoVoto[categoria][nombre] || 0) + 1;

    setVotos(nuevoVoto);
    setMisVotos(prev => ({
      ...prev,
      [categoria]: [...(prev[categoria] || []), nombre]
    }));

    const ref = doc(db, "bodas", "bodaPrincipal");
    await setDoc(ref, { rankingPro: nuevoVoto }, { merge: true });

    await addDoc(collection(db, "bodas", "bodaPrincipal", "registroAcciones"), {
      nombre: usuario,
      accion: "ranking",
      timestamp: serverTimestamp(),
      detalles: {
        categoria: categoria,
        votadoPor: usuario,
        nombreVotado: nombre
      }
    });
  };

  const proponer = async (cat) => {
    if (!nuevaPropuesta[cat]) return;
    const nuevas = { ...propuestas, [cat]: [...(propuestas[cat] || []), nuevaPropuesta[cat]] };
    setPropuestas(nuevas);
    setNuevaPropuesta({ ...nuevaPropuesta, [cat]: "" });
    const ref = doc(db, "bodas", "bodaPrincipal");
    await setDoc(ref, { propuestasRanking: nuevas }, { merge: true });

    await addDoc(collection(db, "bodas", "bodaPrincipal", "registroAcciones"), {
      nombre: usuario,
      accion: "ranking",
      timestamp: serverTimestamp(),
      detalles: {
        categoria: cat,
        propuestoPor: usuario,
        nombrePropuesto: nuevaPropuesta[cat]
      }
    });
  };

  return (
    <div>
      <h2>Premios de la Boda 🏆</h2>
      {categorias.map(cat => (
        <div key={cat} style={{ marginBottom: "2rem" }}>
          <h3>{cat}</h3>
          <input
            type="text"
            value={nuevaPropuesta[cat] || ""}
            onChange={(e) => setNuevaPropuesta({ ...nuevaPropuesta, [cat]: e.target.value })}
            placeholder="Proponer nombre"
          />
          <button onClick={() => proponer(cat)}>Proponer</button>
          {misVotos[cat] && misVotos[cat].length > 0 && (
            <p>✅ Ya has votado por: {misVotos[cat].join(", ")}</p>
          )}
          {(propuestas[cat] || []).map(nombre => (
            <button key={nombre} onClick={() => votar(cat, nombre)} style={{ margin: "0.2rem" }}>
              {nombre}
            </button>
          ))}
          {votos[cat] && (
            <div style={{ marginTop: "0.5rem" }}>
              <strong>🏅 Ranking actual:</strong>
              <ul>
                {Object.entries(votos[cat])
                  .sort((a, b) => b[1] - a[1])
                  .map(([nombre, cantidad]) => (
                    <li key={nombre}>{nombre}: {cantidad} voto{cantidad > 1 ? "s" : ""}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Ranking;