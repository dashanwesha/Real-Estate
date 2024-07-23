// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHKQIls3meUNGtcpihF9_KZlCvEbP4xsY",
  authDomain: "real-state-5e7fb.firebaseapp.com",
  projectId: "real-state-5e7fb",
  storageBucket: "real-state-5e7fb.appspot.com",
  messagingSenderId: "595192807343",
  appId: "1:595192807343:web:f8b0c9ffb3a04048baf95a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
