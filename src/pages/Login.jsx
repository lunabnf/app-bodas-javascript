import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const Login = () => {
  const listaAdmins = ["luislunaraluy98@gmail.com"];
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [codigoInput, setCodigoInput] = useState('');
  const [codigoIngresado, setCodigoIngresado] = useState(sessionStorage.getItem('codigoValido') === 'true');

  const manejarCodigo = (e) => {
    e.preventDefault();
    if (codigoInput === '1234') {
      sessionStorage.setItem('codigoValido', 'true');
      setCodigoIngresado(true);
    } else {
      setError('Código incorrecto. Inténtalo de nuevo.');
    }
  };

  if (user) {
    return <Navigate to="/home" />;
  }

  if (!codigoIngresado) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-pink-600 mb-4">Introduce el código de la boda</h2>
          <form onSubmit={manejarCodigo}>
            <input
              type="text"
              placeholder="Código de boda"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />
            <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded">
              Validar código
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    );
  }


  const handleLogin = async (e) => {
    e.preventDefault();
    if (sessionStorage.getItem('codigoValido') !== 'true') {
      setError('Debes introducir primero el código de la boda.');
      return;
    }
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'usuarios', userCredential.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Ya no usamos localStorage, el AuthProvider gestiona la sesión
      } else {
        // Ya no usamos localStorage, el AuthProvider gestiona la sesión
      }
      navigate('/home');
    } catch {
      setError('Error al iniciar sesión. Revisa tu correo y contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-pink-600">INICIAR SESIÓN</h2>
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
          <button type="submit">Entrar</button>
          <button
            type="button"
            onClick={async () => {
              if (sessionStorage.getItem('codigoValido') !== 'true') {
                setError("Debes introducir primero el código de la boda.");
                return;
              }
              try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const correo = result.user.email;

                if (!listaAdmins.includes(correo)) {
                  setError("Este correo no tiene permisos de administrador.");
                  return;
                }

                // Ya no usamos localStorage, el AuthProvider gestiona la sesión
                navigate('/home');
              } catch {
                setError("Error al iniciar sesión con Google.");
              }
            }}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '1rem',
              fontWeight: 'bold',
              marginBottom: '1rem'
            }}
          >
            Entrar con Google (solo admins)
          </button>
          <p style={{ marginTop: '1rem' }}>
            ¿No tienes cuenta? <Link to="/registro-usuarios">Regístrate aquí</Link>
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;