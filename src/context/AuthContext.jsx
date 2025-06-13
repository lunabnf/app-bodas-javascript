import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Aquí puedes poner la lógica real, esto es solo ejemplo
    const fakeUser = { nombre: "Luis", rol: "admin" };
    setUser(fakeUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};