import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB8V1pNWHdosDDbBZllnAPrzvuPnvq9alg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pickmytech-1ae94.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pickmytech-1ae94",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pickmytech-1ae94.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "611791862985",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:611791862985:web:4284c003fe2c7164772118"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

