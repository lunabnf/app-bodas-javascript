function Programa() {
  const eventos = [
    "18:00 — Llegada autocares, copa de bienvenida y mesa de vermuth",
    "18:15 — Llegada novio",
    "18:30 — Ceremonia",
    "20:00 — Aperitivo en los jardines",
    "21:30 — Cena en la plaza",
    "00:30 — Apertura disco móvil",
    "6:30 — Fin de fiesta"
  ];

  return (
    <section className="programa-section">
      <h2>Programa del Día</h2>
      <div className="programa-grid">
        {eventos.map((evento, index) => (
          <div key={index} className="programa-evento">
            {evento}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Programa;