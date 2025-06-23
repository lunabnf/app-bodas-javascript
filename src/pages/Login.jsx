import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const Login = () => {
  const listaAdmins = ["luislunaraluy98@gmail.com"];
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();
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
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
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
  );
};

export default Login;