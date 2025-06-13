import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const db = getFirestore(getApp());

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [codigoSecreto, setCodigoSecreto] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const lista = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((usuario) => usuario.registrado === true);
    setUsuarios(lista);
  };

  const cambiarRol = async (id, nuevoRol) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    const actualizado = { ...usuario, rol: nuevoRol };
    await setDoc(doc(db, 'usuarios', id), actualizado);
    setUsuarios(usuarios.map(u => u.id === id ? actualizado : u));
  };

  const borrarTodosLosUsuarios = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'usuarios'));
      const batch = [];
      snapshot.forEach((docSnapshot) => {
        batch.push(deleteDoc(doc(db, 'usuarios', docSnapshot.id)));
      });
      await Promise.all(batch);
      setUsuarios([]);
      alert('Todos los usuarios han sido eliminados.');
    } catch (error) {
      console.error('Error al eliminar usuarios:', error);
      alert('Hubo un problema al eliminar los usuarios.');
    }
  };

  const guardarCodigo = () => {
    localStorage.setItem('codigoSecreto', codigoSecreto);
    alert('Código secreto guardado.');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Gestión de Usuarios</h1>

      <div className="mb-6 bg-white p-4 rounded shadow max-w-md mx-auto">
        <label className="block mb-2 font-medium text-gray-700">Código secreto para acceso:</label>
        <input
          type="text"
          value={codigoSecreto}
          onChange={(e) => setCodigoSecreto(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ej: fiesta2025"
        />
        <button
          onClick={guardarCodigo}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Guardar código secreto
        </button>
        {localStorage.getItem('codigoSecreto') && (
          <div className="mt-3 text-sm text-gray-700">
            Código actual para registrarse: <span className="font-semibold">{localStorage.getItem('codigoSecreto')}</span>
          </div>
        )}
        <button
          onClick={borrarTodosLosUsuarios}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Borrar todos los usuarios
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold text-gray-900">{usuario.nombre}</div>
            <div className="text-sm font-medium text-pink-600">Rol: {usuario.rol}</div>
            {usuario.codigo && (
              <div className="text-xs text-gray-500 mt-1">Código: {usuario.codigo}</div>
            )}
            <div className="mt-3 flex justify-center gap-2">
              {['invitado', 'moderador', 'administrador'].map((rol) => (
                <button
                  key={rol}
                  onClick={() => cambiarRol(usuario.id, rol)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    usuario.rol === rol
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {rol}
                </button>
              ))}
            </div>
            <button
              onClick={async () => {
                if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre}?`)) return;
                await deleteDoc(doc(db, 'usuarios', usuario.id));
                setUsuarios(usuarios.filter(u => u.id !== usuario.id));
              }}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
            >
              Borrar usuario
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
