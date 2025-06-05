import React, { useState } from "react";
import { registrarAccion } from '../utils/registrarAccion';

const isAdmin = true; // Forzar como administrador

// function Desplazamiento({ isAdmin }) {
function Desplazamiento() {
  const [nuevoViaje, setNuevoViaje] = useState({
    tipo: "",
    origen: "",
    destino: "",
    horaSalida: "",
    horaVuelta: "",
  });

  const [viajes, setViajes] = useState([]);

  const [nombreTemp, setNombreTemp] = useState("");

  const tiposDisponibles = [
    { label: "Autobús", value: "autobus" },
    { label: "Coche", value: "coche" },
    { label: "Moto", value: "moto" },
    { label: "Taxi", value: "taxi" },
    { label: "Limusina", value: "limusina" },
  ];

  const agregarViaje = async () => {
    const nuevo = { ...nuevoViaje, apuntados: [] };
    setViajes([...viajes, nuevo]);
    setNuevoViaje({
      tipo: "",
      origen: "",
      destino: "",
      horaSalida: "",
      horaVuelta: "",
    });

    if (isAdmin) {
      await registrarAccion("Admin", "Creación de viaje", nuevo);
    }
  };

  return (
    <section className="card">
      <h2>Gestión de Desplazamientos</h2>

      {isAdmin && (
        <div style={{ marginBottom: "2rem" }}>
          <h3>Nuevo Viaje</h3>
          <select
            value={nuevoViaje.tipo}
            onChange={(e) => setNuevoViaje({ ...nuevoViaje, tipo: e.target.value })}
          >
            <option value="">Seleccionar tipo</option>
            {tiposDisponibles.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Origen"
            value={nuevoViaje.origen}
            onChange={(e) => setNuevoViaje({ ...nuevoViaje, origen: e.target.value })}
          />
          <input
            type="text"
            placeholder="Destino"
            value={nuevoViaje.destino}
            onChange={(e) => setNuevoViaje({ ...nuevoViaje, destino: e.target.value })}
          />
          <input
            type="time"
            value={nuevoViaje.horaSalida}
            onChange={(e) => setNuevoViaje({ ...nuevoViaje, horaSalida: e.target.value })}
          />
          <input
            type="time"
            value={nuevoViaje.horaVuelta}
            onChange={(e) => setNuevoViaje({ ...nuevoViaje, horaVuelta: e.target.value })}
          />
          <button onClick={agregarViaje}>Añadir Viaje</button>
        </div>
      )}

      <div>
        <h3>Listado de Viajes</h3>
        {viajes.map((v, idx) => (
          <div
            key={idx}
            style={{
              background: "#f9f9f9",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <h4>Opción {idx + 1}</h4>
            <p><strong>Tipo:</strong> {v.tipo}</p>
            <p><strong>Origen:</strong> {v.origen}</p>
            <p><strong>Destino:</strong> {v.destino}</p>
            <p><strong>Salida:</strong> {v.horaSalida}</p>
            <p><strong>Vuelta:</strong> {v.horaVuelta}</p>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombreTemp}
              onChange={(e) => setNombreTemp(e.target.value)}
            />
            <button
              onClick={async () => {
                const nuevosViajes = [...viajes];
                nuevosViajes[idx].apuntados.push(nombreTemp);
                setViajes(nuevosViajes);
                await registrarAccion(nombreTemp, "Se apunta a viaje", {
                  tipo: v.tipo,
                  origen: v.origen,
                  destino: v.destino,
                  salida: v.horaSalida,
                  vuelta: v.horaVuelta,
                  opcion: idx + 1
                });
                setNombreTemp("");
              }}
            >
              Apuntarse a esta opción
            </button>
            <p><strong>Número de apuntados:</strong> {v.apuntados.length}</p>
            {isAdmin && (
              <ul>
                {v.apuntados.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Desplazamiento;