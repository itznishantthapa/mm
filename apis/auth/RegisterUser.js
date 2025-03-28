import {auth, GoogleAuthProvider,signInWithCredential} from "../../firebaseConfig"




export const registerUserWithFirebase = async (googleResponse) => {
    try {
      const { idToken} = googleResponse.data;
  
      // Create Firebase credential
      const googleCredential = GoogleAuthProvider.credential(idToken);
  
      // Sign in to Firebase with Google credentials
      const firebaseUser = await signInWithCredential(auth,googleCredential);
  
      console.log("User registered in Firebase:", firebaseUser);
      return firebaseUser;
    } catch (error) {
      console.error("Firebase Registration Error:", error);
    }
  };
  