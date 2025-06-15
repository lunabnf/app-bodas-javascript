import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const db = getFirestore(getApp());

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [codigoSecreto, setCodigoSecreto] = useState('');
  const [nuevoAdmin, setNuevoAdmin] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [resultadosFiltrados, setResultadosFiltrados] = useState([]);

  useEffect(() => {
    cargarUsuarios();
    setResultadosFiltrados([]);
  }, []);

  // Nueva función para manejar cambios en la búsqueda
  useEffect(() => {
    const cargarCodigoSecreto = async () => {
      const snapshot = await getDocs(collection(db, 'usuarios'));
      const admin = snapshot.docs.find(doc => doc.data().rol === 'administrador' && doc.data().codigoAcceso);
      if (admin) {
        setCodigoSecreto(admin.data().codigoAcceso);
      }
    };
    cargarCodigoSecreto();
  }, []);
  const handleBusquedaChange = (e) => {
    const valor = e.target.value.toLowerCase();
    setBusqueda(valor);
    setResultadosFiltrados(
      usuarios.filter((usuario) =>
        usuario.nombre?.toLowerCase().includes(valor) ||
        usuario.email?.toLowerCase().includes(valor)
      )
    );
  };

  const cargarUsuarios = async () => {
    const snapshot = await getDocs(collection(db, 'usuarios'));
    const lista = snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }));
      //.filter((usuario) => usuario.registrado === true);
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

  const guardarCodigo = async () => {
    try {
      await setDoc(doc(db, 'bodaPrincipal', 'configuracion', 'codigoAcceso'), {
        valor: codigoSecreto,
      });
      alert('Código secreto guardado correctamente en configuración.');
    } catch (error) {
      console.error('Error al guardar el código secreto:', error);
      alert('No se pudo guardar el código secreto.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-4">Gestión de Usuarios</h1>

      <div className="mb-6 bg-white p-4 rounded shadow max-w-md mx-auto">
        <label className="block mb-2 font-medium text-gray-700">Añadir correo de administrador:</label>
        <input
          type="email"
          value={nuevoAdmin}
          onChange={(e) => setNuevoAdmin(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Ej: admin@email.com"
        />
        <button
          onClick={async () => {
            if (!nuevoAdmin) return alert('Introduce un correo válido.');
            const nuevoUsuario = {
              nombre: nuevoAdmin.split('@')[0],
              correo: nuevoAdmin,
              rol: 'administrador',
              registrado: true,
              codigoAcceso: codigoSecreto
            };
            await setDoc(doc(db, 'usuarios', nuevoAdmin), nuevoUsuario);
            setUsuarios([...usuarios, { id: nuevoAdmin, ...nuevoUsuario }]);
            setNuevoAdmin('');
            alert('Administrador añadido.');
          }}
          className="mt-3 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Añadir administrador
        </button>
      </div>

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
        {codigoSecreto && (
          <div className="mt-3 text-sm text-gray-700">
            Código actual para registrarse: <span className="font-semibold">{codigoSecreto}</span>
          </div>
        )}
        <button
          onClick={borrarTodosLosUsuarios}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded w-full"
        >
          Borrar todos los usuarios
        </button>
      </div>

      <div className="mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          className="w-full p-2 border rounded"
          value={busqueda}
          onChange={handleBusquedaChange}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {(busqueda ? resultadosFiltrados : usuarios).map((usuario) => (
          <div key={usuario.id} className="bg-white p-4 rounded shadow text-center">
            <div className="text-lg font-semibold text-gray-900">{usuario.nombre}</div>
            <div className="text-sm text-gray-500">{usuario.email}</div>
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
