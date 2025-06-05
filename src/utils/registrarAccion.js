import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function registrarAccion(nombre, accion, detalles) {
  try {
    const ref = collection(db, "bodas", "bodaPrincipal", "registroAcciones");
    await addDoc(ref, {
      nombre,
      accion,
      detalles,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error registrando acción:", error);
  }
}