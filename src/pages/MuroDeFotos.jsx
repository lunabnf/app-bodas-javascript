import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { registrarAccion } from "../utils/registrarAccion";

function MuroDeFotos() {
  const [imagen, setImagen] = useState(null);
  const [pieDeFoto, setPieDeFoto] = useState('');
  const [fotosSubidas, setFotosSubidas] = useState([]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagen(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubirFoto = async () => {
    if (!imagen) return;

    const storage = getStorage();
    const nombreArchivo = `foto_${Date.now()}.jpg`;
    const storageRef = ref(storage, `fotosMuro/${nombreArchivo}`);

    // Subir imagen como string base64
    await uploadString(storageRef, imagen, 'data_url');

    const url = await getDownloadURL(storageRef);

    const nuevaFoto = { url, pie: pieDeFoto };
    await addDoc(collection(db, 'fotosMuro'), nuevaFoto);
    await registrarAccion("Invitado", "Subió foto al muro", { pie: pieDeFoto });

    setFotosSubidas((prev) => [...prev, nuevaFoto]);
    setImagen(null);
    setPieDeFoto('');
  };

  useEffect(() => {
    const cargarFotos = async () => {
      const querySnapshot = await getDocs(collection(db, 'fotosMuro'));
      const fotos = querySnapshot.docs.map(doc => doc.data());
      setFotosSubidas(fotos);
    };
    cargarFotos();
  }, []);

  return (
    <section className="card">
      <h1>Muro de Fotos 📸</h1>
      <p>¡Sube tus fotos con un breve pie de foto!</p>
      <input type="file" accept="image/*" onChange={handleImagenChange} />
      {imagen && (
        <div style={{ marginTop: '1rem' }}>
          <img src={imagen} alt="Previsualización" style={{ maxWidth: '100%', borderRadius: '8px' }} />
          <textarea
            placeholder="Escribe un pie de foto..."
            value={pieDeFoto}
            onChange={(e) => setPieDeFoto(e.target.value)}
            style={{ width: '100%', marginTop: '0.5rem' }}
          />
          <button onClick={handleSubirFoto} style={{ marginTop: '0.5rem' }}>Subir Foto</button>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        {fotosSubidas.map((foto, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <img src={foto.url} alt={`foto-${idx}`} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <p><em>{foto.pie}</em></p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MuroDeFotos;