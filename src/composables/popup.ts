import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, OAuthCredential } from "firebase/auth";
import type {UserCredential} from "firebase/auth"
import provider from "./googleAuth";
import { app } from "./firebase";
// import firebase from 'firebase/app';

const auth = getAuth(app);
export const googleSignin = async () :Promise<void | { result: UserCredential, credential: OAuthCredential | null }> => {

  return signInWithPopup(auth, provider)
    .then((result: UserCredential) => {

      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential : OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential?.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...

      return { result, credential };
    }).catch(() => {
      // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
}

export const userLogout = async () => {

  return signOut(auth)
    .then(() => {
      
      // Sign-out successful.
    })
    .catch(() => {
      // An error happened.
    });
}