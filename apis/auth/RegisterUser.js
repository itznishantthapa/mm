import { Alert } from "react-native";
import {auth, GoogleAuthProvider,signInWithCredential} from "../../firebaseConfig"




export const registerUserWithFirebase = async (googleResponse) => {
    // Validate input
    if (!googleResponse || !googleResponse.data || !googleResponse.data.idToken) {
     Alert.alert("Error", "Invalid Google response data");
    }

    try {
      const { idToken } = googleResponse.data;
      // Validate idToken
      if (typeof idToken !== 'string' || idToken.trim() === '') {
        throw new Error('Invalid ID token');
      }
  
      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(idToken);
      
      if (!googleCredential) {
        throw new Error('Failed to create Firebase credential');
      }
  
      // Sign in to Firebase with Google credentials
      const firebaseUser = await signInWithCredential(auth, googleCredential);

      if (!firebaseUser) {
        throw new Error('Firebase sign in failed');
      }
  
      console.log("User registered in Firebase:", firebaseUser);
      return firebaseUser;

    } catch (error) {
      console.error("Firebase Registration Error:", error);
      throw error; // Re-throw to handle in calling code
    }
};
  