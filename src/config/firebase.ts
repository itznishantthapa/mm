import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyChU0Pq3vVFdrNmqKEIpBTG5frRkRHkJOc",
  authDomain: "meatmartnepal-3f520.firebaseapp.com",
  projectId: "meatmartnepal-3f520",
  storageBucket: "meatmartnepal-3f520.appspot.com",
  messagingSenderId: "1076703935364",
  appId: "1:1076703935364:android:45a1c1b6a65f8e6066bbd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); 