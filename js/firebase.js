// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5koek3tWoGvDZbDYgCh7JkOGWV2z2QHU",
  authDomain: "colors-brewing.firebaseapp.com",
  projectId: "colors-brewing",
  storageBucket: "colors-brewing.firebasestorage.app",
  messagingSenderId: "464983414759",
  appId: "1:464983414759:web:ea5e9a20c6412d5a1ecf42",
  measurementId: "G-EQ5PZCD3NQ",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
