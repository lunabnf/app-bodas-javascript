import { useState } from "react";

function Programa() {
  const [eventos, setEventos] = useState([
    "18:00 — Llegada autocares, copa de bienvenida y mesa de vermuth",
    "18:15 — Llegada novio",
    "18:30 — Ceremonia",
    "20:00 — Aperitivo en los jardines",
    "21:30 — Cena en la plaza",
    "00:30 — Apertura disco móvil",
    "6:30 — Fin de fiesta"
  ]);
  const [nuevoEvento, setNuevoEvento] = useState("");
  const esAdmin = true; // Simulación: reemplazar con lógica real

  const agregarEvento = () => {
    if (nuevoEvento.trim() !== "") {
      const nuevo = nuevoEvento.trim();
      const listaActualizada = [...eventos, nuevo];

      // Función para extraer hora en formato numérico
      const extraerHora = (evento) => {
        const match = evento.match(/^(\d{1,2}):(\d{2})/);
        if (!match) return 9999; // Si no hay hora, va al final
        const [_, horas, minutos] = match;
        return parseInt(horas) * 60 + parseInt(minutos);
      };

      const listaOrdenada = listaActualizada.sort((a, b) => extraerHora(a) - extraerHora(b));
      setEventos(listaOrdenada);
      setNuevoEvento("");
    }
  };

  return (
    <section className="programa-section">
      <h2>Programa del Día</h2>
      <div className="programa-grid">
        {eventos.map((evento, index) => (
          <div key={index} className="programa-evento" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{evento}</span>
            {esAdmin && (
              <button
                onClick={() => {
                  const nuevaLista = eventos.filter((_, i) => i !== index);
                  setEventos(nuevaLista);
                }}
                style={{
                  marginLeft: "1rem",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.2rem 0.5rem",
                  cursor: "pointer"
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Añadir nuevo evento"
          value={nuevoEvento}
          onChange={(e) => setNuevoEvento(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        />
        <button onClick={agregarEvento} style={{ padding: "0.5rem" }}>
          Añadir
        </button>
      </div>
    </section>
  );
}

export default Programa;