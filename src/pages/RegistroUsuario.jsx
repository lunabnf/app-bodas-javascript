import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(false);

  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    const emailSimulado = `${nombre.toLowerCase()}.${apellidos.toLowerCase()}@boda.com`;

    try {
      const docRef = doc(db, "config", "codigoInvitacion");
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError("No se pudo obtener el código de invitación.");
        return;
      }

      const codigoCorrecto = docSnap.data().valor;

      if (codigo !== codigoCorrecto) {
        setError("Código de invitación incorrecto.");
        return;
      }

      await createUserWithEmailAndPassword(auth, emailSimulado, password);
      setRegistroExitoso(true);
      navigate("/home");
      setError("");
    } catch (err) {
      setError("Error al registrar usuario: " + err.message);
    }
  };

  return (
    <div className="registro-usuario">
      <h2>Registro de Usuario</h2>
      {registroExitoso ? (
        <p>Registro exitoso. Redirigiendo...</p>
      ) : (
        <form onSubmit={handleRegistro}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Código de invitación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegistroUsuario;