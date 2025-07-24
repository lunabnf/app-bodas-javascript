import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AlzaSyDvmCnYhYHPzYirf1ug4nOnZb2dVY1ZoQE",
  authDomain: "app-boda-eric-leticia.firebaseapp.com",
  projectId: "app-boda-eric-leticia",
  storageBucket: "app-boda-eric-leticia.appspot.com",
  messagingSenderId: "672947722215",
  appId: "1:672947722215:web:xxxxxx" // Sustituye xxxxxx por el valor real si lo tienes
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, firebaseConfig, app };