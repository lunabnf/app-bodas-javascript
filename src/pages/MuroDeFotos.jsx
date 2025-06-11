import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { registrarAccion } from "../utils/registrarAccion";

function MuroDeFotos() {
  const [imagen, setImagen] = useState(null);
  const [pieDeFoto, setPieDeFoto] = useState('');
  const [fotosSubidas, setFotosSubidas] = useState([]);

  // Suponiendo que usuarioNombre y esAdmin se obtienen desde algún contexto o prop
  const usuarioNombre = "Invitado"; // Cambiar según la autenticación real
  const esAdmin = false; // Cambiar según la autenticación real

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

    const fotosUsuario = fotosSubidas.filter(f => f.usuario === (usuarioNombre || "Invitado"));
    if (fotosUsuario.length >= 3) {
      alert("Solo puedes subir hasta 3 fotos.");
      return;
    }

    const storage = getStorage();
    const nombreArchivo = `foto_${Date.now()}.jpg`;
    const storageRef = ref(storage, `fotosMuro/${nombreArchivo}`);

    // Subir imagen como string base64
    await uploadString(storageRef, imagen, 'data_url');

    const url = await getDownloadURL(storageRef);

    const nuevaFoto = { url, pie: pieDeFoto, usuario: usuarioNombre || "Invitado", timestamp: Date.now() };
    await addDoc(collection(db, 'fotosMuro'), nuevaFoto);
    await registrarAccion(usuarioNombre || "Invitado", "Subió foto al muro", { pie: pieDeFoto });

    setFotosSubidas((prev) => [nuevaFoto, ...prev]);
    setImagen(null);
    setPieDeFoto('');
  };

  useEffect(() => {
    const cargarFotos = async () => {
      const querySnapshot = await getDocs(collection(db, 'fotosMuro'));
      const fotos = querySnapshot.docs.map(doc => doc.data());
      setFotosSubidas(fotos.sort((a, b) => b.timestamp - a.timestamp));
    };
    cargarFotos();
  }, []);

  const manejarReaccion = (idx, emoji) => {
    const nuevasFotos = [...fotosSubidas];
    nuevasFotos[idx].reacciones = [...(nuevasFotos[idx].reacciones || []), emoji];
    setFotosSubidas(nuevasFotos);
  };

  const eliminarFoto = async (foto) => {
    try {
      // Buscar el documento en Firestore para eliminarlo
      const fotosRef = collection(db, 'fotosMuro');
      const q = query(fotosRef, where('url', '==', foto.url));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Asumiendo que url es único, eliminar el primer documento encontrado
        const docId = querySnapshot.docs[0].id;
        await deleteDoc(querySnapshot.docs[0].ref);
      }

      // Eliminar la imagen del storage
      const storage = getStorage();
      // Extraer el path relativo a partir de la url
      const pathStart = foto.url.indexOf('/o/') + 3;
      const pathEnd = foto.url.indexOf('?alt=');
      const encodedPath = foto.url.substring(pathStart, pathEnd);
      const filePath = decodeURIComponent(encodedPath);
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);

      // Actualizar estado local
      setFotosSubidas(prev => prev.filter(f => f.url !== foto.url));
      await registrarAccion(usuarioNombre || "Invitado", "Eliminó una foto del muro", { url: foto.url });
    } catch (error) {
      console.error("Error eliminando la foto:", error);
      alert("No se pudo eliminar la foto.");
    }
  };

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
          <div key={idx} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', background: '#fff' }}>
            <img src={foto.url} alt={`foto-${idx}`} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <p><em>{foto.pie}</em></p>
            <p><strong>{foto.usuario}</strong></p>
            <div>
              <button onClick={() => manejarReaccion(idx, '❤️')}>❤️</button>
              <button onClick={() => manejarReaccion(idx, '😂')}>😂</button>
              <button onClick={() => manejarReaccion(idx, '👍')}>👍</button>
              <span>{foto.reacciones?.join(' ')}</span>
            </div>
            {(esAdmin || foto.usuario === usuarioNombre) && (
              <button onClick={() => eliminarFoto(foto)}>Eliminar</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default MuroDeFotos;