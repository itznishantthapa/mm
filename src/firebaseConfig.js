// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgzIathUYgJHca0ytkzj4aupXPDtCnUfY",
  authDomain: "meatmart-nepal.firebaseapp.com",
  projectId: "meatmart-nepal",
  storageBucket: "meatmart-nepal.firebasestorage.app",
  messagingSenderId: "262247853161",
  appId: "1:262247853161:web:98a5ca97aead67c7fa06f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app; 