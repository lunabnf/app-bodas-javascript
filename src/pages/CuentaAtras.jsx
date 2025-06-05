// File: src/pages/CuentaAtras.jsx
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase";

function CuentaAtras() {
  const storage = getStorage(app);
  const targetDate = new Date(2025, 7, 2, 18, 0, 0); // 2 agosto 2025, 18:00

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      finished: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    const correosAdmins = ["luislunaraluy98@gmail.com", "Ericvg17@hotmail.com"];
    if (usuario && correosAdmins.includes(usuario.email)) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaRef = ref(storage, "cuentaAtrasMedia");
        const url = await getDownloadURL(mediaRef);
        setMediaUrl(url);
        setMediaType(url.match(/\.(mp3|wav)$/) ? "audio" : "image");
      } catch (error) {
        console.log("No hay media subida aún.");
      }
    };
    fetchMedia();
  }, []);

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const mediaRef = ref(storage, "cuentaAtrasMedia");
    await uploadBytes(mediaRef, file);
    const url = await getDownloadURL(mediaRef);
    setMediaUrl(url);
    setMediaType(file.type.startsWith("image") ? "image" : "audio");
  };

  return (
    <section className="card">
      <h2>⏳ Cuenta Atrás</h2>
      <p>Falta poco para el gran día... 🥹</p>
      {!timeLeft.finished ? (
        <div style={{ fontSize: "2em", margin: "1em 0" }}>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </div>
      ) : (
        <div style={{ fontSize: "2em", margin: "1em 0" }}>
          ¡Ya ha llegado el gran día!
        </div>
      )}

      {mediaUrl && mediaType === "audio" && (
        <div style={{ marginTop: "1rem" }}>
          <button onClick={() => {
            const audio = new Audio(mediaUrl);
            audio.play();
            alert("No tengas ansia, las cosas de palacio van despacio.");
          }}>
            ▶️ Pulsa para escuchar un mensaje
          </button>
        </div>
      )}
      {mediaUrl && mediaType === "image" && (
        <div style={{ marginTop: "1rem" }}>
          <img src={mediaUrl} alt="Mensaje visual" style={{ maxWidth: "100%" }} />
        </div>
      )}
      {isAdmin && (
        <input
          type="file"
          accept="audio/*,image/*"
          onChange={handleMediaUpload}
          style={{
            marginTop: "1rem",
            backgroundColor: "#f3b8ee",
            color: "#640647",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        />
      )}
    </section>
  );
}

export default CuentaAtras;