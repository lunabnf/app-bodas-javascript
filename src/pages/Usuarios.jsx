import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // asegúrate que esté bien configurado
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usuariosList);
    };

    obtenerUsuarios();
  }, []);

  const guardarCodigo = async () => {
    const configRef = doc(db, 'config', 'codigoInvitacion');
    await updateDoc(configRef, { codigo: codigoInvitacion });
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
