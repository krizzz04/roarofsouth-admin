const VITE_FIREBASE_APP_API_KEY = import.meta.env.VITE_FIREBASE_APP_API_KEY;
const VITE_FIREBASE_APP_AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_APP_AUTH_DOMAIN;
const VITE_FIREBASE_APP_PROJECT_ID = import.meta.env.VITE_FIREBASE_APP_PROJECT_ID;
const VITE_FIREBASE_APP_STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_APP_STORAGE_BUCKET;
const VITE_FIREBASE_APP_MESSAGING_SENDER_ID = import.meta.env.VITE_FIREBASE_APP_MESSAGING_SENDER_ID;
const VITE_FIREBASE_APP_APP_ID = import.meta.env.VITE_FIREBASE_APP_APP_ID;

import { initializeApp } from "firebase/app";

// Check if Firebase environment variables are available
const hasFirebaseConfig = VITE_FIREBASE_APP_API_KEY && 
                         VITE_FIREBASE_APP_AUTH_DOMAIN && 
                         VITE_FIREBASE_APP_PROJECT_ID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: VITE_FIREBASE_APP_API_KEY || "placeholder",
  authDomain: VITE_FIREBASE_APP_AUTH_DOMAIN || "placeholder.firebaseapp.com",
  projectId: VITE_FIREBASE_APP_PROJECT_ID || "placeholder",
  storageBucket: VITE_FIREBASE_APP_STORAGE_BUCKET || "placeholder.appspot.com",
  messagingSenderId: VITE_FIREBASE_APP_MESSAGING_SENDER_ID || "123456789",
  appId: VITE_FIREBASE_APP_APP_ID || "1:123456789:web:placeholder"
};

// Initialize Firebase only if configuration is available
let firebaseApp = null;
if (hasFirebaseConfig) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase environment variables not found. Firebase features will be disabled.");
}

export { firebaseApp };