import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [administradores, setAdministradores] = useState([]);
  const [nuevoAdmin, setNuevoAdmin] = useState("");

  const [moderadores, setModeradores] = useState([]);
  const [nuevoMod, setNuevoMod] = useState("");

  const agregarAdmin = () => {
    if (nuevoAdmin.trim()) {
      setAdministradores(prev => [...prev, nuevoAdmin.trim()]);
      setNuevoAdmin("");
    }
  };

  const agregarMod = () => {
    if (nuevoMod.trim()) {
      setModeradores(prev => [...prev, nuevoMod.trim()]);
      setNuevoMod("");
    }
  };

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosRef = collection(db, "bodas/bodaPrincipal/accesosQR");
      const snapshot = await getDocs(usuariosRef);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(lista);
    };

    fetchUsuarios();
  }, []);

  const updateUsuario = (id, campo, valor) => {
    setUsuarios(prevUsuarios =>
      prevUsuarios.map(usuario =>
        usuario.id === id ? { ...usuario, [campo]: valor } : usuario
      )
    );
  };

  const handleGuardarUsuario = (usuario) => {
    console.log("Guardar usuario:", usuario);
  };

  const handleEditarUsuario = (usuario) => {
    console.log("Editar usuario:", usuario);
  };

  const handleEliminarUsuario = (id) => {
    console.log("Eliminar usuario con id:", id);
  };

  const handleCambiarRol = (usuario) => {
    console.log("Cambiar rol del usuario:", usuario);
  };

  const invitadosNovia = usuarios.filter(u => u.tipo === "novia");
  const invitadosNovio = usuarios.filter(u => u.tipo === "novio");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">Usuarios de la App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-pink-600">👰 Invitados de la Novia</h2>
          <div className="space-y-4">
            {invitadosNovia.map(usuario => (
              <div key={usuario.id} className="bg-white p-4 rounded-lg shadow-md space-y-2">
                <input
                  type="text"
                  value={usuario.nombre || ""}
                  onChange={e => updateUsuario(usuario.id, 'nombre', e.target.value)}
                  placeholder="Nombre"
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={usuario.email || ""}
                  onChange={e => updateUsuario(usuario.id, 'email', e.target.value)}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <select
                  value={usuario.tipo || ""}
                  onChange={e => updateUsuario(usuario.id, 'tipo', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Sin tipo</option>
                  <option value="novia">Novia</option>
                  <option value="novio">Novio</option>
                </select>
                <select
                  value={usuario.rol || ""}
                  onChange={e => updateUsuario(usuario.id, 'rol', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Sin rol</option>
                  <option value="admin">Administrador</option>
                  <option value="moderador">Moderador</option>
                  <option value="invitado">Invitado</option>
                </select>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={usuario.loggedIn || false}
                    onChange={e => updateUsuario(usuario.id, 'loggedIn', e.target.checked)}
                    className="form-checkbox"
                  />
                  Logueado
                </label>
                <button
                  className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded"
                  onClick={() => handleGuardarUsuario(usuario)}
                >
                  Guardar
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 text-blue-600">🤵 Invitados del Novio</h2>
          <div className="space-y-4">
            {invitadosNovio.map(usuario => (
              <div key={usuario.id} className="bg-white p-4 rounded-lg shadow-md space-y-2">
                <input
                  type="text"
                  value={usuario.nombre || ""}
                  onChange={e => updateUsuario(usuario.id, 'nombre', e.target.value)}
                  placeholder="Nombre"
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <input
                  type="text"
                  value={usuario.email || ""}
                  onChange={e => updateUsuario(usuario.id, 'email', e.target.value)}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded px-2 py-1"
                />
                <select
                  value={usuario.tipo || ""}
                  onChange={e => updateUsuario(usuario.id, 'tipo', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Sin tipo</option>
                  <option value="novia">Novia</option>
                  <option value="novio">Novio</option>
                </select>
                <select
                  value={usuario.rol || ""}
                  onChange={e => updateUsuario(usuario.id, 'rol', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Sin rol</option>
                  <option value="admin">Administrador</option>
                  <option value="moderador">Moderador</option>
                  <option value="invitado">Invitado</option>
                </select>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={usuario.loggedIn || false}
                    onChange={e => updateUsuario(usuario.id, 'loggedIn', e.target.checked)}
                    className="form-checkbox"
                  />
                  Logueado
                </label>
                <button
                  className="text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded"
                  onClick={() => handleGuardarUsuario(usuario)}
                >
                  Guardar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-yellow-700">👑 Administradores</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nuevoAdmin}
            onChange={e => setNuevoAdmin(e.target.value)}
            placeholder="Nombre del administrador"
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={agregarAdmin}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded"
          >
            Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {administradores.map((admin, idx) => (
            <span key={idx} className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded">
              {admin}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">🛡️ Moderadores</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={nuevoMod}
            onChange={e => setNuevoMod(e.target.value)}
            placeholder="Nombre del moderador"
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={agregarMod}
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded"
          >
            Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {moderadores.map((mod, idx) => (
            <span key={idx} className="bg-purple-200 text-purple-900 px-3 py-1 rounded">
              {mod}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
