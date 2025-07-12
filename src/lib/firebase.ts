import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase - TuctorCripto
const firebaseConfig = {
  apiKey: "AIzaSyBeX9x0lvoimzEapiaDTtToTD4Zbnmdr3U",
  authDomain: "tuctorcripto.firebaseapp.com",
  projectId: "tuctorcripto",
  storageBucket: "tuctorcripto.firebasestorage.app",
  messagingSenderId: "696549570826",
  appId: "1:696549570826:web:a313dd4d645d48d61d22f3",
  measurementId: "G-ECLV42J7RT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (opcional)
export const analytics = getAnalytics(app);

export default app; 