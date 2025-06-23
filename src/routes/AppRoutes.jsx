import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import AdminPanel from '../pages/AdminPanel';
import InvitadoPanel from '../pages/InvitadoPanel';
import Error404 from '../pages/Error404';

const AppRoutes = ({ user, rolUsuario }) => {
  return (
    <Routes>
      {/* Rutas comunes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* Ruta solo para admin */}
      {user && rolUsuario === "admin" && (
        <Route path="/admin" element={<AdminPanel />} />
      )}

      {/* Ruta solo para invitados */}
      {user && rolUsuario === "invitado" && (
        <Route path="/invitado" element={<InvitadoPanel />} />
      )}

      {user && (
        <>
          <Route path="/registro-usuarios" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Navigate to="/home" />} />
        </>
      )}

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to={user ? "/home" : "/registro-usuarios"} />} />

      {/* Página de error si quisieras usarla */}
      {/* <Route path="/404" element={<Error404 />} /> */}
    </Routes>
  );
};

export default AppRoutes;