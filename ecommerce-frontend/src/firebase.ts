import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:"AIzaSyAtQuMIDv9V684WNiI4f1SXuftYyOENSao",
  authDomain:"e-commerce-sphere.firebaseapp.com",
  projectId:"e-commerce-sphere",
  storageBucket: "875621037970",
  messagingSenderId:"1:875621037970:web:2d48cde413932b840af34b",
  appId:"e-commerce-sphere.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);