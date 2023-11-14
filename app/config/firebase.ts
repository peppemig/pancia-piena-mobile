import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import usersService from "../api/usersService";

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

// TODO
//const signInWithGoogle = async () => {
//  const { user } = await signInWithPopup(auth, googleProvider);
//  await usersService.createUserWithGoogle(user);
//};

const loginWithEmailAndPassword = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
};

const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
  surname: string
) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await usersService.createUserWithEmail(user, name, surname);
};

const logOut = () => {
  signOut(auth);
};

export {
  auth,
  loginWithEmailAndPassword,
  logOut,
  registerWithEmailAndPassword,
};
