import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRjDUAr9ire-pjqLSms8Kgr3qvnZhUpDc",
  authDomain: "stepforge-e6fee.firebaseapp.com",
  projectId: "stepforge-e6fee",
  storageBucket: "stepforge-e6fee.firebasestorage.app",
  messagingSenderId: "1025430073442",
  appId: "1:1025430073442:web:d37d440d863acfbe17613b",
  measurementId: "G-HSSMTXR9J6"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
