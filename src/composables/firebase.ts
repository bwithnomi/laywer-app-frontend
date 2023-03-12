// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeQ3C1Slj0uOUYNIY_R-ywZGfPKJYYqKc",
  authDomain: "linkedin-clone-fa419.firebaseapp.com",
  projectId: "linkedin-clone-fa419",
  storageBucket: "linkedin-clone-fa419.appspot.com",
  messagingSenderId: "912897567922",
  appId: "1:912897567922:web:6d84a4e7969ffcce43edab",
  measurementId: "G-02Y9P7QTKH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);