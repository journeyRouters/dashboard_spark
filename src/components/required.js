import { initializeApp } from "firebase/app";


// const firebaseConfig = {
//   apiKey: "AIzaSyDvbcOYsIBlUzZNQr0IjFCFyjI6tzB1m-U",
//   authDomain: "worldtour-171e7.firebaseapp.com",
//   projectId: "worldtour-171e7",
//   storageBucket: "worldtour-171e7.appspot.com", 
//   messagingSenderId: "633565967198",
//   appId: "1:633565967198:web:7827bcd0c71e3a977cd5cf"
// };
/** this is creditential for backend@journeyrouters.com   */
const firebaseConfig = {
  apiKey: "AIzaSyARcPADJJdnYGjcRJMr9FO9C2Gk6nmk7Oc",
  authDomain: "jrspark-adb98.firebaseapp.com",
  projectId: "jrspark-adb98",
  storageBucket: "jrspark-adb98.appspot.com",
  messagingSenderId: "25799762344", 
  appId: "1:25799762344:web:c037fc55057bbe67ae7d9d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
