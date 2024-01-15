// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
import { ref, push, onValue } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS_GcCoey9tuiuMXjxQHxtuHonpuTEGZg",
  authDomain: "pirotecniacq.firebaseapp.com",
  projectId: "pirotecniacq",
  storageBucket: "pirotecniacq.appspot.com",
  messagingSenderId: "584159960314",
  appId: "1:584159960314:web:09a837d50cefced3d9fd43"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app); // Configura Firestore
const db = firestore; // Configura db

const database = getDatabase(app); // Usa getDatabase para Firebase Realtime Database

const analytics = getAnalytics(app);

// Exporta los servicios que necesitas
export { auth, storage, database,db, analytics, ref, push, onValue };