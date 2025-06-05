// File: src/pages/Info.jsx
function Info() {
  const ubicaciones = [
    {
      nombre: "Hotel Ciudad de Binéfar",
      url: "https://www.hotelciudaddebinefar.com",
      icon: "🏨",
    },
    {
      nombre: "Hotel Más Monzón",
      url: "https://www.hotelmasmonzon.com",
      icon: "🏨",
    },
    {
      nombre: "Hotel Ciudad de Barbastro",
      url: "https://www.ghbarbastro.com/?td=b00ga00&referer_code=ADWORDS&gad_source=1&gad_campaignid=22312959542&gbraid=0AAAAADtzc6v5bxg7ebgEInhoXMyyFzSkm&gclid=Cj0KCQjw0LDBBhCnARIsAMpYlArFTkzTmWfZ9KsSgoie8zimdu3Pfa-UVtoriwOKdkG3aOgpc-GDJ7IaAquBEALw_wcB",
      icon: "🏨",
    },
    {
      nombre: "Ubicación del evento: Casas Adamil, Monzón",
      url: "https://www.lascasasdeadamil.com/",
      icon: "📍",
    },
  ];

  return (
    <section className="card" style={{ position: "relative", overflow: "hidden" }}>
      <h2>Información Relevante</h2>
      {/* Dibujos decorativos de hoteles */}
      <span
        style={{
          position: "absolute",
          top: 10,
          left: 20,
          fontSize: "2.5em",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      >
        🏨
      </span>
      <span
        style={{
          position: "absolute",
          bottom: 20,
          right: 30,
          fontSize: "3em",
          opacity: 0.13,
          pointerEvents: "none",
        }}
      >
        🏨
      </span>
      <span
        style={{
          position: "absolute",
          top: 60,
          right: 60,
          fontSize: "2em",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      >
        🏨
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5em",
          alignItems: "center",
          margin: "2em 0",
        }}
      >
        {ubicaciones.map((u, idx) => (
          <a
            key={u.nombre}
            href={u.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1em",
              background: "rgba(255,255,255,0.85)",
              borderRadius: "2em",
              boxShadow: "0 4px 18px 0 rgba(93,58,155,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08)",
              padding: "1em 2.2em",
              fontSize: "1.2em",
              fontWeight: "bold",
              color: "#5D3A9B",
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              position: "relative",
              zIndex: 1,
            }}
            className="floating-btn"
          >
            <span style={{ fontSize: "1.7em" }}>{u.icon}</span>
            {u.nombre}
          </a>
        ))}
      </div>
      <p style={{ marginTop: "2em", color: "#888" }}>
        Aquí se muestran los tres hoteles más conocidos y cercanos a la ubicación donde se realizará el evento.
      </p>
    </section>
  );
}

export default Info;
