import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";

const AdminPanel = () => {
  const [seccionActiva, setSeccionActiva] = useState("usuarios");
  const [usuarios, setUsuarios] = useState([]);
  const [codigoActual, setCodigoActual] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
      const usuariosData = usuariosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsuarios(usuariosData);
    };

    const fetchCodigo = async () => {
      const configRef = doc(db, "config", "codigosBoda");
      const configSnap = await getDoc(configRef);
      if (configSnap.exists()) {
        const codigos = configSnap.data().validos || [];
        setCodigoActual(codigos);
      }
    };

    fetchUsuarios();
    fetchCodigo();
  }, []);

  const handleRolChange = async (id, nuevoRol) => {
    const usuarioRef = doc(db, "usuarios", id);
    await updateDoc(usuarioRef, { rol: nuevoRol });
    alert("Rol actualizado correctamente.");
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case "usuarios":
        return (
          <div>
            <h2>Gestión de usuarios</h2>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Rol actual</th>
                  <th>Nuevo rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, index) => (
                  <tr key={usuario.id}>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <select id={`rol-${index}`} defaultValue={usuario.rol}>
                        <option value="invitado">Invitado</option>
                        <option value="administrador">Administrador</option>
                        <option value="moderador">Moderador</option>
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          const nuevoRol = document.getElementById(`rol-${index}`).value;
                          handleRolChange(usuario.id, nuevoRol);
                        }}
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "confirmaciones":
        return <div>Aquí puedes revisar las confirmaciones de asistencia.</div>;
      case "datos":
        return <div>Aquí puedes exportar los datos recopilados de la boda.</div>;
      case "configuracion":
        return (
          <div>
            <h2>Configuración general</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const nuevoCodigo = e.target.elements.codigo.value.trim();
                if (!nuevoCodigo) return;

                const configRef = doc(db, "config", "codigosBoda");
                const configSnap = await getDoc(configRef);
                let codigos = configSnap.exists() ? configSnap.data().validos || [] : [];

                if (!codigos.includes(nuevoCodigo)) {
                  codigos.push(nuevoCodigo);
                  await updateDoc(configRef, { validos: codigos }, { merge: true });
                  setCodigoActual(codigos);
                  alert("Código de boda añadido correctamente.");
                } else {
                  alert("Ese código ya existe.");
                }

                e.target.reset();
              }}
            >
              <label htmlFor="codigo">Añadir nuevo código de boda:</label>
              <input type="text" id="codigo" name="codigo" required />
              <button type="submit">Guardar código</button>
            </form>
            {codigoActual.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Últimos códigos añadidos:</strong> {codigoActual.join(", ")}
              </div>
            )}
            <div style={{ marginTop: "2rem" }}>
              <h3>Códigos actuales:</h3>
              <ul>
                {usuarios.length > 0 && (
                  <li style={{ fontStyle: "italic" }}>Cargados desde Firestore</li>
                )}
                {codigoActual.map((cod, i) => (
                  <li key={i}>{cod}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      default:
        return <div>Selecciona una sección.</div>;
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel de Administración</h1>
      <nav style={{ marginBottom: "1rem" }}>
        <button onClick={() => setSeccionActiva("usuarios")}>Usuarios</button>
        <button onClick={() => setSeccionActiva("confirmaciones")}>Confirmaciones</button>
        <button onClick={() => setSeccionActiva("datos")}>Exportar datos</button>
        <button onClick={() => setSeccionActiva("configuracion")}>Configuración</button>
      </nav>
      <section>{renderContenido()}</section>
    </div>
  );
};

export default AdminPanel;