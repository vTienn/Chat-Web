import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  connectAuthEmulator 
} from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW9gxyuLAybMO0Jh4RZVIPnhdlvhhz39w",
  authDomain: "chat-app-d6915.firebaseapp.com",
  projectId: "chat-app-d6915",
  storageBucket: "chat-app-d6915.firebasestorage.app",
  messagingSenderId: "782534130152",
  appId: "1:782534130152:web:b7ba712f72720f0358cc5d",
  measurementId: "G-9H7KPMW2PZ"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}

export const analytics = getAnalytics(app);
export default firebaseConfig;
