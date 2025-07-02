

import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaPrivada = ({ children }) => {
  const usuarioAutenticado = localStorage.getItem('usuarioAutenticado');

  return usuarioAutenticado ? children : <Navigate to="/" />;
};

export default RutaPrivada;