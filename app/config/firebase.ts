import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_GOOGLE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_GOOGLE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_GOOGLE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_GOOGLE_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_GOOGLE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const loginWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  signOut(auth);
};

export { auth, loginWithEmailAndPassword, logOut };
