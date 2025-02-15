// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY03CzKUkUOG2pY9h_Px8AYJtRq-WLNzs",
  authDomain: "yarees-a69d1.firebaseapp.com",
  projectId: "yarees-a69d1",
  storageBucket: "yarees-a69d1.firebasestorage.app",
  messagingSenderId: "194021814907",
  appId: "1:194021814907:web:d0ebb8debb355d7ec228de",
  measurementId: "G-PMRLVN4Q0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);
export { analytics };