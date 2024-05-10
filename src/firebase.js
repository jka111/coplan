// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
import { getStorage } from "firebase/storage"; // Import for Firebase Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnjoFHe41aVFXrjbxOMhjnEGsMTGSCcwI",
  authDomain: "cooplaner.firebaseapp.com",
  projectId: "cooplaner",
  storageBucket: "cooplaner.appspot.com",
  messagingSenderId: "1086055360406",
  appId: "1:1086055360406:web:33de89cd5c22785adadfb7",
  measurementId: "G-PF3D35C8KY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app)
export const storage = getStorage(app); // Initialize and export storage
