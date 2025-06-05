import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

const salas = [
  "Mayores de 30",
  "Menores de 30",
  "Mayores de 40",
  "Todos",
  "Fiesteros",
  "Bailongos",
  "Hasta el final"
];

const Chat = ({ usuario = "Anónimo" }) => {
  const [salaActiva, setSalaActiva] = useState("Todos");
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [ultimoEmisor, setUltimoEmisor] = useState(null);
  const chatRef = React.useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", salaActiva, "mensajes"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const msgs = snapshot.docs
        .map(doc => doc.data())
        .filter(m => m.timestamp?.toDate?.() && now - m.timestamp.toDate() <= 24 * 60 * 60 * 1000);
      setMensajes(msgs);
      if (msgs.length > 0) {
        setUltimoEmisor(msgs[msgs.length - 1].nombre);
      }
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    });

    return () => unsubscribe();
  }, [salaActiva]);

  const enviarMensaje = async () => {
    if (mensaje.trim() === "") return;
    await addDoc(collection(db, "chats", salaActiva, "mensajes"), {
      nombre: usuario,
      texto: mensaje.trim(),
      timestamp: new Date()
    });
    setMensaje("");
  };

  return (
    <div>
      <h2>💬 Chat general</h2>
      <select value={salaActiva} onChange={(e) => setSalaActiva(e.target.value)}>
        {salas.map((sala) => (
          <option key={sala} value={sala}>{sala}</option>
        ))}
      </select>

      <div
        ref={chatRef}
        style={{
          border: "1px solid #ccc",
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          height: "450px",
          overflowY: "auto",
          fontSize: "0.9rem",
          lineHeight: "1.4",
          backgroundColor: "#f9f9f9"
        }}
      >
        {mensajes.map((m, i) => {
          const esMismoUsuario = i > 0 && mensajes[i - 1].nombre === m.nombre;
          const alineacion = esMismoUsuario
            ? (i % 2 === 0 ? "flex-end" : "flex-start")
            : (mensajes[i - 1]?.nombre === m.nombre ? "flex-end" : "flex-start");

          return (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: alineacion,
                marginBottom: "0.5rem"
              }}
            >
              <div
                style={{
                  backgroundColor: m.nombre === usuario ? "#d0e8ff" : "#e0e0e0",
                  borderRadius: "1rem",
                  padding: "0.5rem 1rem",
                  maxWidth: "70%",
                  fontSize: "0.9rem",
                  fontWeight: m.nombre === usuario ? "bold" : "normal",
                  color: "#000"
                }}
              >
                <div style={{ fontSize: "0.75rem", marginBottom: "0.2rem" }}>
                  <strong>{m.nombre}</strong>
                </div>
                <div>{m.texto}</div>
              </div>
            </div>
          );
        })}
      </div>

      <input
        type="text"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") enviarMensaje();
        }}
        placeholder="Escribe tu mensaje..."
      />
      <button onClick={enviarMensaje}>Enviar</button>
    </div>
  );
};

export default Chat;