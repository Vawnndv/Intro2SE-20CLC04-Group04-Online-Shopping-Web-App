// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAJYCS_ENuwNGg05iLjZHDLf0nRq8PJRss",
//   authDomain: "se-clc04-group04.firebaseapp.com",
//   projectId: "se-clc04-group04",
//   storageBucket: "se-clc04-group04.appspot.com",
//   messagingSenderId: "105490845062",
//   appId: "1:105490845062:web:3d48a8730d116189b6b007"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// export default app;

import firebase from 'firebase';
  
const firebaseConfig = {
    // Your credentials
    apiKey: "AIzaSyAJYCS_ENuwNGg05iLjZHDLf0nRq8PJRss",
    authDomain: "se-clc04-group04.firebaseapp.com",
    projectId: "se-clc04-group04",
    storageBucket: "se-clc04-group04.appspot.com",
    messagingSenderId: "105490845062",
    appId: "1:105490845062:web:3d48a8730d116189b6b007"
};
  
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
export default auth;