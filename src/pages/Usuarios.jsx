import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig'; // asegúrate que esté bien configurado
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [codigoInvitacion, setCodigoInvitacion] = useState('');
  const auth = getAuth();
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioActual(user);
    });
    return () => unsubscribe();
  }, []);

  const [nuevoUsuario, setNuevoUsuario] = useState({ email: '', password: '' });

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
      <p className="mb-2 text-sm text-gray-700">
        Total de usuarios registrados: <strong>{usuarios.length}</strong>
      </p>
      <table className="min-w-full text-sm mt-2">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-t">
              <td className="p-2">{usuario.email}</td>
              <td className="p-2">
                <select
                  value={usuario.rol || 'invitado'}
                  onChange={async (e) => {
                    const nuevoRol = e.target.value;
                    await setDoc(doc(db, 'usuarios', usuario.id), { rol: nuevoRol }, { merge: true });
                    setUsuarios((prev) =>
                      prev.map((u) => (u.id === usuario.id ? { ...u, rol: nuevoRol } : u))
                    );
                  }}
                  className="border rounded px-1 py-0.5"
                >
                  <option value="admin">admin</option>
                  <option value="invitado">invitado</option>
                </select>
              </td>
              <td className="p-2">{usuario.fechaRegistro?.split('T')[0] || 'Sin fecha'}</td>
              <td className="p-2">
                <button
                  disabled={usuario.rol === 'admin' || usuarioActual?.uid === usuario.id}
                  onClick={async () => {
                    if (confirm(`¿Eliminar a ${usuario.email}?`)) {
                      await setDoc(doc(db, 'usuarios', usuario.id), {}, { merge: false });
                      const nuevosUsuarios = usuarios.filter((u) => u.id !== usuario.id);
                      setUsuarios(nuevosUsuarios);
                    }
                  }}
                  className={`px-2 py-1 text-xs rounded ${
                    usuario.rol === 'admin' || usuarioActual?.uid === usuario.id
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">Añadir nuevo usuario</h3>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={nuevoUsuario.email}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={nuevoUsuario.password}
          onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
          className="border px-2 py-1 mr-2"
        />
        <button
          onClick={async () => {
            try {
              const userCredential = await createUserWithEmailAndPassword(auth, nuevoUsuario.email, nuevoUsuario.password);
              await setDoc(doc(db, 'usuarios', userCredential.user.uid), {
                email: nuevoUsuario.email,
                rol: 'invitado',
                fechaRegistro: new Date().toISOString(),
              });
              alert("Usuario creado: " + userCredential.user.email);
              setNuevoUsuario({ email: '', password: '' });

              // Refrescar la lista de usuarios
              const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
              const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setUsuarios(usuariosList);
            } catch (error) {
              alert("Error al crear usuario: " + error.message);
            }
          }}
          className="bg-green-500 text-white px-4 py-1"
        >
          Crear usuario
        </button>
      </div>
    </div>
  );
}

export default Usuarios;
