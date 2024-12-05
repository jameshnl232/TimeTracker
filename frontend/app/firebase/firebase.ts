// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_API_KEY,
  authDomain: "belzir-879bf.firebaseapp.com",
  projectId: "belzir-879bf",
  storageBucket: "belzir-879bf.firebasestorage.app",
  messagingSenderId: "1010149692198",
  appId: "1:1010149692198:web:156978ef2c9fee09da27e7",
  measurementId: "G-HXB3E8JDYW",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };