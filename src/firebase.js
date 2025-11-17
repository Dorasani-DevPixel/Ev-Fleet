import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbIJUgVMMf2VUzGqE7xkhDiMM8Bp3nLVQ",
  authDomain: "ev-fleet-management.firebaseapp.com",
  projectId: "ev-fleet-management",
  storageBucket: "ev-fleet-management.firebasestorage.app",
  messagingSenderId: "246256429031",
  appId: "1:246256429031:web:e168c5014f268a93a97f42",
  measurementId: "G-372ZWEZHK0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();
setPersistence(auth, browserSessionPersistence);
export { auth, RecaptchaVerifier, signInWithPhoneNumber };
