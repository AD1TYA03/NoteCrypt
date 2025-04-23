import { initializeApp } from 'firebase/app';
import {getFirestore} from "firebase/firestore";
import {getAuth ,signOut} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD6rU2xeN8NYLKSyO0Squ6tva1dR2ZXkzY",
    authDomain: "keepapp-dc15e.firebaseapp.com",
    projectId: "keepapp-dc15e",
    storageBucket: "keepapp-dc15e.firebasestorage.app",
    messagingSenderId: "935174534471",
    appId: "1:935174534471:web:1942ef61cec6ffe8cc8862",
    measurementId: "G-QEZ6PX710M"
  };

  const app = initializeApp(firebaseConfig);
  export const db=getFirestore(app);
  export const auth= getAuth(app);
  export {signOut};