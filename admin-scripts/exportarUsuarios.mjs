/* eslint-disable */
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
// eslint-disable-next-line
import serviceAccount from './clave-firebase.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = getFirestore();

async function exportarUsuarios() {
  try {
    const listAllUsers = async (nextPageToken) => {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      for (const userRecord of result.users) {
        const { uid, email, metadata } = userRecord;
        const fechaRegistro = metadata.creationTime;

        await db.collection('usuarios').doc(uid).set({
          email: email || '',
          rol: 'invitado',
          fechaRegistro: fechaRegistro,
        });

        console.log(`Exportado: ${email}`);
      }

      if (result.pageToken) {
        await listAllUsers(result.pageToken);
      }
    };

    await listAllUsers();
    console.log('✅ Exportación completada.');
  } catch (error) {
    console.error('❌ Error exportando usuarios:', error);
  }
}

exportarUsuarios();