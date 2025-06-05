import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDvmCnYhYHPzYirf1ug4nOnZb2dVY1ZoQE",
  authDomain: "app-boda-eric-leticia.firebaseapp.com",
  projectId: "app-boda-eric-leticia",
  storageBucket: "app-boda-eric-leticia.firebasestorage.app",
  messagingSenderId: "672947722215",
  appId: "1:672947722215:web:3c4027ffa606aa8d5d4f42",
  measurementId: "G-PMDSN12BKW"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, firebaseConfig, app };