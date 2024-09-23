// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRxSws3hE2Z78yh9lHvKiHVlGTNvQjKn4",
  authDomain: "chatbot-c3439.firebaseapp.com",
  projectId: "chatbot-c3439",
  storageBucket: "chatbot-c3439.appspot.com",
  messagingSenderId: "404387888547",
  appId: "1:404387888547:web:391ed4b1eb88a1c3e0ee16",
  measurementId: "G-MMC2E3WQCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db };
