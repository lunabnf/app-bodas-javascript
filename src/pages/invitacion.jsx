import { useState, useEffect } from "react";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";

initializeApp(firebaseConfig);
const db = getFirestore();

function Invitacion({ isAdmin }) {
  const [imagenSrc, setImagenSrc] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const guardada = localStorage.getItem("invitacionImg");
      if (guardada) {
        setImagenSrc(guardada);
      } else {
        try {
          const ref = doc(db, "bodas", "bodaPrincipal");
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            if (data.invitacionImg) {
              setImagenSrc(data.invitacionImg);
              localStorage.setItem("invitacionImg", data.invitacionImg);
            }
          }
        } catch (error) {
          console.error("Error al obtener la invitación:", error);
        }
      }
    };
    cargarDatos();
  }, []);

  const handleImagenSubida = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("invitacionImg", reader.result);
      setImagenSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="card">
      <h2>Invitación de Boda</h2>
      <p>Aquí podrás ver y descargar la invitación oficial.</p>

      {isAdmin && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImagenSubida}
          style={{
            margin: "1rem 0",
            padding: "0.5rem 1rem",
            backgroundColor: "#f3b8ee",
            color: "#640647",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        />
      )}

      {imagenSrc ? (
        <>
          <img
            src={imagenSrc}
            alt="Invitación"
            style={{
              maxWidth: "100%",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              marginTop: "1rem"
            }}
          />
          <div style={{ marginTop: "1rem" }}>
            <a
              href={imagenSrc}
              download="invitacion_boda.jpg"
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                backgroundColor: "#640647",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px"
              }}
            >
              📥 Descargar invitación
            </a>
          </div>
        </>
      ) : (
        <p style={{ color: "#888" }}>Aún no se ha subido ninguna invitación.</p>
      )}
    </section>
  );
}

export default Invitacion;