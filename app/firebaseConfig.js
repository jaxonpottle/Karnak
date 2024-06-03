// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC52ANP8nuhgw1GTiU8RpoY_PlwKXGDZDs",
    authDomain: "steubenautorepair.firebaseapp.com",
    projectId: "steubenautorepair",
    storageBucket: "steubenautorepair.appspot.com",
    messagingSenderId: "24568310062",
    appId: "1:24568310062:web:5222ad43e9e3d3a6f032bf",
    measurementId: "G-8SZZJLVVDX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Auth
const auth = getAuth(app);

export { db, auth };
