// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCfDNElWDTsdlc6fp14vdcz63wKxMrO4sk",
  authDomain: "ebook-editor-c7e9c.firebaseapp.com",
  projectId: "ebook-editor-c7e9c",
  storageBucket: "ebook-editor-c7e9c.firebasestorage.app",
  messagingSenderId: "662224742141",
  appId: "1:662224742141:web:f563b6de42da210b190094",
  measurementId: "G-9F6ZMEQS4E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 