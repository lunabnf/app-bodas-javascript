import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // asegúrate que esté bien configurado
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  useEffect(() => {
    const obtenerDatos = async () => {
      const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usuariosList);

      const configRef = doc(db, 'config', 'codigoInvitacion');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        setCodigoInvitacion(configSnap.data().codigo);
      }
    };

    obtenerDatos();
  }, []);

  const guardarCodigo = async () => {
    const configRef = doc(db, 'config', 'codigoInvitacion');
    await setDoc(configRef, { codigo: codigoInvitacion }, { merge: true });
    alert('Código actualizado');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
      <div className="mb-4">
        <label className="block mb-2">Código de Invitación</label>
        <input
          type="text"
          value={codigoInvitacion}
          onChange={(e) => setCodigoInvitacion(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={guardarCodigo} className="ml-2 px-4 py-1 bg-blue-500 text-white">
          Guardar
        </button>
        {codigoInvitacion && (
          <div className="mt-2 text-sm text-gray-700">
            Código actual para invitados: <strong>{codigoInvitacion}</strong>
            <button
              onClick={() => {
                navigator.clipboard.writeText(codigoInvitacion);
                alert("Código copiado al portapapeles");
              }}
              className="ml-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
            >
              Copiar
            </button>
          </div>
        )}
      </div>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id} className="border-b py-2">
            {usuario.email} - {usuario.rol}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
