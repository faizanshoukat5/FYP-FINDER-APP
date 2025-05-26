import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyACqGYPK_8_YFlAQn0YwgxHCf6zgxHCgYs",
  authDomain: "fyp-supervisor-finder-9bbfd.firebaseapp.com",
  projectId: "fyp-supervisor-finder-9bbfd",
  storageBucket: "fyp-supervisor-finder-9bbfd.firebasestorage.app",
  messagingSenderId: "343014984014",
  appId: "1:343014984014:web:3abeccb8a32b614e37f61f",
  
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;



