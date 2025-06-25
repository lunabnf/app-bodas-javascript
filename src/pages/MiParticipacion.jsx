import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useParams } from "react-router-dom";

export default function MiParticipacion() {
  const { id } = useParams();
  const [participacion, setParticipacion] = useState(null);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [rolUsuario, setRolUsuario] = useState("Invitado");

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id) return;

      const ref = doc(db, "bodas", "bodaPrincipal");
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        // Confirmaciones
        const confirmaciones = data.confirmaciones || {};
        const miConfirmacion = Object.entries(confirmaciones).find(
          ([clave]) => clave === id
        );

        const haConfirmado = miConfirmacion ? "Sí" : "No";
        const desplazamiento = miConfirmacion?.[1]?.medio || "No solicitado";

        // Música
        const canciones = data.canciones || {};
        const miCancion = canciones[id];

        // Ranking
        const ranking = data.ranking || {};
        const miVoto = ranking[id];

        // Cuestionario
        const cuestionario = data.cuestionarios || {};
        const miRespuestas = cuestionario[id];

        // Mesa
        const mesas = data.mesas || {};
        let mesaAsignada = "";
        let asientoMesa = "";
        Object.entries(mesas).forEach(([nombreMesa, mesa]) => {
          if (mesa.personas?.includes(id)) {
            mesaAsignada = nombreMesa;
            asientoMesa = (mesa.personas.indexOf(id) + 1).toString();
          }
        });

        // Ceremonia
        const ceremonia = data.ceremonia || {};
        let asientoCeremonia = "No asignado";
        let numeroAsientoCeremonia = "";
        Object.entries(ceremonia).forEach(([zona, datos]) => {
          if (datos.personas?.includes(id)) {
            asientoCeremonia = zona;
            numeroAsientoCeremonia = (datos.personas.indexOf(id) + 1).toString();
          }
        });

        setRolUsuario(data.usuarios?.[id]?.rol || "Invitado");

        setParticipacion({
          nombre: data.usuarios?.[id]?.nombre && data.usuarios?.[id]?.apellidos
            ? `${data.usuarios[id].nombre} ${data.usuarios[id].apellidos}`
            : data.usuarios?.[id]?.nombre || id,
          mesa: mesaAsignada || "No asignada",
          asientoMesa,
          cancion: miCancion || "No propuesta",
          voto: miVoto || "No ha votado",
          cuestionario: miRespuestas ? "Sí" : "No",
          fotoSubida: data.fotos?.[id] ? "Sí" : "No",
          asistencia: haConfirmado,
          desplazamiento,
          asientoCeremonia,
          numeroAsientoCeremonia,
        });
      }
    };

    cargarDatos();
  }, [id]);

  const tareasPendientes = [];
  if (participacion?.asistencia !== "Sí") tareasPendientes.push("Confirmar asistencia");
  if (participacion?.desplazamiento === "No solicitado") tareasPendientes.push("Solicitar desplazamiento");
  if (participacion?.cancion === "No propuesta") tareasPendientes.push("Proponer canción");
  if (participacion?.voto === "No ha votado") tareasPendientes.push("Votar en el ranking");
  if (participacion?.cuestionario === "No") tareasPendientes.push("Responder cuestionario");
  if (participacion?.fotoSubida === "No") tareasPendientes.push("Subir foto");
  if (participacion?.mesa === "No asignada") tareasPendientes.push("Esperar asignación de mesa");
  if (participacion?.asientoCeremonia === "No asignado") tareasPendientes.push("Esperar asignación en ceremonia");

  if (!id) return <p>No se ha proporcionado identificación del invitado.</p>;
  if (!participacion) return <p>Cargando datos...</p>;

  return (
    <div>
      <button onClick={() => window.history.back()} style={{ marginBottom: "1rem", background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "1rem" }}>
        ← Volver
      </button>
      <div
        onMouseEnter={() => setMostrarTooltip(true)}
        onMouseLeave={() => setMostrarTooltip(false)}
        onClick={() => setMostrarTooltip(!mostrarTooltip)}
        style={{
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
          display: "inline-block",
          background: "white",
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          width: "300px",
          cursor: "pointer",
          userSelect: "none",
        }}
        aria-label="Mi perfil y tareas pendientes"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMostrarTooltip(!mostrarTooltip);
          }
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.7rem", color: "#5C5470" }}>
          👤 Mi perfil
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Estado:</strong> <span style={{ color: "green" }}>● Conectado</span>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Rol:</strong> {rolUsuario}
        </div>
        <div className={mostrarTooltip ? "tooltip-transicion" : "tooltip-oculto"}>
          <strong>Tareas pendientes:</strong>
          <ul style={{ paddingLeft: "1.2rem" }}>
            {tareasPendientes.length > 0 ? tareasPendientes.map((tarea, i) => (
              <li key={i}>
                <a
                  href={
                    tarea.includes("Confirmar") ? "/confirmar"
                    : tarea.includes("desplazamiento") ? "/confirmar"
                    : tarea.includes("canción") ? "/musica"
                    : tarea.includes("ranking") ? "/ranking"
                    : tarea.includes("cuestionario") ? "/cuestionario"
                    : tarea.includes("foto") ? "/murofotos"
                    : "#"
                  }
                  style={{ color: "#007bff", textDecoration: "underline" }}
                >
                  {tarea}
                </a>
              </li>
            )) : <li>Todas las tareas completadas 🎉</li>}
          </ul>
        </div>
      </div>
      <div className="card">
        <div style={{ fontSize: "1.2rem", marginBottom: "0.5rem", fontWeight: "bold", color: "#5C5470" }}>
          Usuario conectado: {participacion.nombre}
        </div>
        <h2>Tu participación en la boda</h2>
        <div className="participacion-info">
          <div className="info-box"><strong>Nombre:</strong> {participacion.nombre}</div>
          <div className="info-box"><strong>¿Has confirmado asistencia?:</strong> {participacion.asistencia}</div>
          <div className="info-box"><strong>¿Has solicitado desplazamiento?:</strong> {participacion.desplazamiento}</div>
          <div className="info-box">
            <strong>Mesa:</strong>{" "}
            {participacion.mesa === "No asignada" ? (
              "No asignada"
            ) : (
              <a href="/mesas" style={{ textDecoration: "underline", color: "#007bff" }}>
                {participacion.mesa}
              </a>
            )}
          </div>
          <div className="info-box"><strong>Número de asiento en la mesa:</strong> {participacion.asientoMesa || "No asignado"}</div>
          <div className="info-box"><strong>Canción propuesta:</strong> {participacion.cancion}</div>
          <div className="info-box"><strong>Voto en el ranking:</strong> {participacion.voto}</div>
          <div className="info-box"><strong>¿Has respondido el cuestionario?:</strong> {participacion.cuestionario}</div>
          <div className="info-box"><strong>¿Has subido una foto?:</strong> {participacion.fotoSubida}</div>
          <div className="info-box"><strong>Asiento en la ceremonia:</strong> {participacion.asientoCeremonia}</div>
          <div className="info-box"><strong>Número de asiento en ceremonia:</strong> {participacion.numeroAsientoCeremonia || "No asignado"}</div>
        </div>
        <style>{`
          .participacion-info {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          .info-box {
            background: #fff0f5;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            font-size: 1rem;
          }
        `}</style>
        <style>{`
          .tooltip-transicion {
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 1;
            transform: translateY(0);
          }

          .tooltip-oculto {
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
          }
        `}</style>
      </div>
    </div>
  );
}