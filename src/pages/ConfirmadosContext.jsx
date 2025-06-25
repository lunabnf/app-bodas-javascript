import { createContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Ajusta esta ruta si tu archivo firebase está en otra ubicación
import { collection, onSnapshot } from "firebase/firestore";

const ConfirmadosContext = createContext();

export const ConfirmadosProvider = ({ children }) => {
  const [invitados, setInvitados] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "confirmaciones"), (snapshot) => {
      const invitadosSeparados = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const personas = data.personas || [];

        personas.forEach((persona, index) => {
          invitadosSeparados.push({
            id: `${doc.id}-${index}`,
            nombre: persona.nombre,
            rol: persona.rol,
            inscritoPor: data.inscritoPor || "Desconocido",
          });
        });
      });

      setInvitados(invitadosSeparados);
    });

    return () => unsub();
  }, []);

  return (
    <ConfirmadosContext.Provider value={{ invitados }}>
      {children}
    </ConfirmadosContext.Provider>
  );
};

export { ConfirmadosContext };