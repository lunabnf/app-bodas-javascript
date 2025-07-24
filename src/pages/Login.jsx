import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  // --- BLOQUE DE CÓDIGO DE ACCESO MANUAL ---
  const [codigoInput, setCodigoInput] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState(false);

  const CODIGO_VALIDO = "LUIS2025"; // Código de acceso manual

  useEffect(() => {
    const codigoGuardado = sessionStorage.getItem("codigoValido");
    if (codigoGuardado === "true") {
      setCodigoIngresado(true);
    }
  }, []);

  const handleCodigoSubmit = () => {
    if (codigoInput === CODIGO_VALIDO) {
      sessionStorage.setItem("codigoValido", "true");
      setCodigoIngresado(true);
    } else {
      alert("Código incorrecto");
    }
  };
  // --- FIN BLOQUE DE CÓDIGO DE ACCESO MANUAL ---

  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  if (user) {
    return <Navigate to="/home" />;
  }

  // --- BLOQUEO POR CÓDIGO DE ACCESO MANUAL ---
  if (!codigoIngresado) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Introduce el código de la boda</h2>
        <input
          type="text"
          value={codigoInput}
          onChange={(e) => setCodigoInput(e.target.value)}
          placeholder="Código de la boda"
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <br />
        <button
          onClick={handleCodigoSubmit}
          style={{ marginTop: "10px", padding: "10px 20px" }}
        >
          Acceder
        </button>
      </div>
    );
  }
  // --- FIN BLOQUEO POR CÓDIGO DE ACCESO MANUAL ---


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (modoRegistro) {
      if (password !== confirmarPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      try {
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: nombre });
        await setDoc(doc(db, "usuarios", userCredential.user.uid), {
          nombre: nombre,
          email: email,
          uid: userCredential.user.uid,
          rol: "invitado",
          fechaRegistro: serverTimestamp(),
        });
        navigate('/home');
      } catch {
        setError('Error al registrar. El correo puede estar en uso.');
      }
    } else {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Comprobar si el usuario ya tiene documento en la colección "usuarios"
        const docRef = doc(db, "usuarios", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            nombre: userCredential.user.displayName || '',
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            rol: "invitado",
            fechaRegistro: serverTimestamp(),
          });
        }
        navigate('/home');
      } catch {
        setError('Error al iniciar sesión. Revisa tu correo y contraseña.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">
            {modoRegistro ? 'REGISTRO' : 'INICIAR SESIÓN'}
          </h2>
          {modoRegistro && (
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {modoRegistro && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />
          )}
          <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded my-3 w-full">
            {modoRegistro ? 'Registrarse' : 'Entrar'}
          </button>
          <p
            className="text-sm text-center text-blue-600 cursor-pointer mt-2"
            onClick={() => setModoRegistro(!modoRegistro)}
          >
            {modoRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </p>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;