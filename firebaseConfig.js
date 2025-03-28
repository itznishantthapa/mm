import { initializeApp,getApps } from 'firebase/app';
import { initializeAuth,getReactNativePersistence,signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyChU0Pq3vVFdrNmqKEIpBTG5frRkRHkJOc",
  authDomain: "meatmartnepal-3f520.firebaseapp.com",
  projectId: "meatmartnepal-3f520",
  storageBucket: "meatmartnepal-3f520.appspot.com",
  messagingSenderId: "1076703935364",
  appId: "1:1076703935364:android:45a1c1b6a65f8e6066bbd1"
};

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
}else{
    app=getApps()[0];
}

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

// const firestore = getFirestore(app);
const storage = getStorage(app);

export {auth,storage,GoogleAuthProvider,signInWithCredential};
export default app;
