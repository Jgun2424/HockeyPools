// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGX2fuY-msPGOBJDEnIJb2PwzVvNbJEFQ",
  authDomain: "storeapp-47c29.firebaseapp.com",
  projectId: "storeapp-47c29",
  storageBucket: "storeapp-47c29.appspot.com",
  messagingSenderId: "686010622316",
  appId: "1:686010622316:web:4de6f00464faafe5541349"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);