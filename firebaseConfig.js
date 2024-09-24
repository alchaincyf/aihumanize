import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRxSws3hE2Z78yh9lHvKiHVlGTNvQjKn4",
  authDomain: "chatbot-c3439.firebaseapp.com",
  projectId: "chatbot-c3439",
  storageBucket: "chatbot-c3439.appspot.com",
  messagingSenderId: "404387888547",
  appId: "1:404387888547:web:391ed4b1eb88a1c3e0ee16",
  measurementId: "G-MMC2E3WQCN"
};

let app;
let auth;
let db;

if (typeof window !== "undefined" && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
