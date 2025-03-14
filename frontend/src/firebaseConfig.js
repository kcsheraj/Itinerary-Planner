import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBY7-tXcK9BC9zrQoBUfaLO0jdN88N7-cM",
  authDomain: "wandrauth.firebaseapp.com",
  projectId: "wandrauth",
  storageBucket: "wandrauth.firebasestorage.app",
  messagingSenderId: "229817457958",
  appId: "1:229817457958:web:8c2e671c1d6540c26235e7",
  measurementId: "G-HDF9Z5MMWW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
