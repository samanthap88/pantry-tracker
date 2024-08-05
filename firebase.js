// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7vS1pi4YDq2N4yAl7X1fnNcO_chbyoSw",
  authDomain: "pantry-tracker-e7047.firebaseapp.com",
  projectId: "pantry-tracker-e7047",
  storageBucket: "pantry-tracker-e7047.appspot.com",
  messagingSenderId: "865364405095",
  appId: "1:865364405095:web:0e7f4515b76fde9ca45dc2",
  measurementId: "G-44LDN936MJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };