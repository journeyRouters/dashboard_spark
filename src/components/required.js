// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvbcOYsIBlUzZNQr0IjFCFyjI6tzB1m-U",
  authDomain: "worldtour-171e7.firebaseapp.com",
  projectId: "worldtour-171e7",
  storageBucket: "worldtour-171e7.appspot.com",
  messagingSenderId: "633565967198",
  appId: "1:633565967198:web:7827bcd0c71e3a977cd5cf"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBzx1MygYcIiGpylWN0va1nKyoHvUPHnNQ",
//   authDomain: "jrtestweb-12e4f.firebaseapp.com",
//   projectId: "jrtestweb-12e4f",
//   storageBucket: "jrtestweb-12e4f.appspot.com",
//   messagingSenderId: "559142218034",
//   appId: "1:559142218034:web:4fad5637299b71a1424f2b"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
