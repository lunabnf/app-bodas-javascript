import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function MiParticipacion() {
  const query = useQuery();
  const id = query.get("id");
  const [participacion, setParticipacion] = useState(null);

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
        Object.entries(mesas).forEach(([nombreMesa, mesa]) => {
          if (mesa.personas?.includes(id)) {
            mesaAsignada = nombreMesa;
          }
        });

        // Ceremonia
        const ceremonia = data.ceremonia || {};
        let asientoCeremonia = "No asignado";
        Object.entries(ceremonia).forEach(([zona, datos]) => {
          if (datos.personas?.includes(id)) {
            asientoCeremonia = zona;
          }
        });

        setParticipacion({
          nombre: id,
          mesa: mesaAsignada || "No asignada",
          cancion: miCancion || "No propuesta",
          voto: miVoto || "No ha votado",
          cuestionario: miRespuestas ? "Sí" : "No",
          fotoSubida: data.fotos?.[id] ? "Sí" : "No",
          asistencia: haConfirmado,
          desplazamiento,
          asientoCeremonia,
        });
      }
    };

    cargarDatos();
  }, [id]);

  if (!id) return <p>No se ha proporcionado identificación del invitado.</p>;
  if (!participacion) return <p>Cargando datos...</p>;

  return (
    <div>
      <button onClick={() => window.history.back()} style={{ marginBottom: "1rem", background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "1rem" }}>
        ← Volver
      </button>
      <div className="card">
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
          <div className="info-box"><strong>Canción propuesta:</strong> {participacion.cancion}</div>
          <div className="info-box"><strong>Voto en el ranking:</strong> {participacion.voto}</div>
          <div className="info-box"><strong>¿Has respondido el cuestionario?:</strong> {participacion.cuestionario}</div>
          <div className="info-box"><strong>¿Has subido una foto?:</strong> {participacion.fotoSubida}</div>
          <div className="info-box"><strong>Asiento en la ceremonia:</strong> {participacion.asientoCeremonia}</div>
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
      </div>
    </div>
  );
}