import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBesXSIoq4FIfIP2YEsg1861HgVOrUE2CA",
  authDomain: "shopieefinance.firebaseapp.com",
  projectId: "shopieefinance",
  storageBucket: "shopieefinance.appspot.com",
  messagingSenderId: "997707463111",
  appId: "1:997707463111:web:c20d4a71e4bda72bd0c1e2",
  measurementId: "G-EXYYC62C7R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
