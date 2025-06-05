import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, query, where } from 'firebase/firestore';
import { registrarAccion } from '../utils/registrarAccion';

const Musica = () => {
  const [canciones, setCanciones] = useState([]);
  const [nuevaCancion, setNuevaCancion] = useState('');
  const [usuario, setUsuario] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCanciones = async () => {
      const q = collection(db, 'musicaBoda');
      const snap = await getDocs(q);
      const cancionesFirebase = snap.docs.map(doc => doc.data());
      setCanciones(cancionesFirebase);
    };
    cargarCanciones();
  }, []);

  const handleAgregar = async () => {
    if (!nuevaCancion || !usuario) {
      setError('Debes escribir una canción y tu nombre.');
      return;
    }

    const yaExiste = canciones.find(c => c?.nombre?.toLowerCase?.() === nuevaCancion.toLowerCase());
    const propuestasUsuario = canciones.filter(c => c.usuario === usuario).length;

    if (yaExiste) {
      setError('La canción ya ha sido propuesta.');
      return;
    }

    if (propuestasUsuario >= 2) {
      setError('Solo puedes proponer un máximo de 2 canciones.');
      return;
    }

    const nueva = { nombre: nuevaCancion, usuario, votos: 1 };
    await addDoc(collection(db, 'musicaBoda'), nueva);
    await registrarAccion(usuario, "Propuesta de canción", { nombre: nuevaCancion });

    setCanciones(prev => [...prev, nueva]);
    setNuevaCancion('');
    setError('');
  };

  const handleVotar = async (nombre) => {
    const cancionActual = canciones.find(c => c.nombre === nombre);
    if (!cancionActual) return;

    const nuevasCanciones = canciones.map(c =>
      c.nombre === nombre ? { ...c, votos: c.votos + 1 } : c
    );
    setCanciones(nuevasCanciones);

    const q = query(collection(db, 'musicaBoda'), where('nombre', '==', nombre));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docRef = snap.docs[0].ref;
      await updateDoc(docRef, { votos: cancionActual.votos + 1 });
      await registrarAccion(usuario || "Invitado", "Voto a canción", { nombre });
    }
  };

  return (
    <div className="app-container">
      <h2>¡Propon tu canción favorita para la boda!</h2>
      <p>Puedes proponer hasta 2 canciones. Si ya existe, ¡vótala!</p>

      <input
        type="text"
        placeholder="Tu nombre"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <input
        type="text"
        placeholder="Título de la canción"
        value={nuevaCancion}
        onChange={(e) => setNuevaCancion(e.target.value)}
      />
      <button onClick={handleAgregar}>Añadir canción</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {canciones
          .sort((a, b) => b.votos - a.votos)
          .map((cancion, idx) => (
            <li key={idx}>
              <strong>{cancion.nombre}</strong> – Propuesta por {cancion.usuario} ({cancion.votos} votos)
              <button onClick={() => handleVotar(cancion.nombre)}>👍 Votar</button>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Musica;