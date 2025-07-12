// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwe1ISDVnC8rl4EF--m5WJdxrTKGuAo_o",
  authDomain: "school-project-472e4.firebaseapp.com",
  projectId: "school-project-472e4",
  storageBucket: "school-project-472e4.firebasestorage.app",
  messagingSenderId: "24641147904",
  appId: "1:24641147904:web:06880e254940de96cf74e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)