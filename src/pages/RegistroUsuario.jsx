import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");

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

      const codigoCorrecto = docSnap.data().codigo;

      if (codigo !== codigoCorrecto) {
        setError("Código de invitación incorrecto.");
        return;
      }

      const usuariosRef = doc(db, "usuariosIndex", `${nombre.toLowerCase()}_${apellidos.toLowerCase()}`);
      const usuarioExistente = await getDoc(usuariosRef);
      if (usuarioExistente.exists()) {
        setError("Ya existe un usuario registrado con ese nombre y apellidos.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, emailSimulado, password);
      const user = userCredential.user;
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        apellidos,
        email: emailSimulado,
        rol: "invitado",
      });

      await setDoc(usuariosRef, { uid: user.uid });

      navigate("/");
      setError("");
    } catch (err) {
      setError("Error al registrar usuario: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-8">Registro de Usuario</h2>
        <div className="text-center mb-4">
          <p className="text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="inline-block mt-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-lg font-semibold hover:bg-pink-200 transition"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form onSubmit={handleRegistro} className="space-y-5">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <input
            type="text"
            placeholder="Código de invitación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition duration-300 font-semibold"
          >
            Registrarse
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default RegistroUsuario;