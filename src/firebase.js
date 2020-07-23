import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAVYoCF78yp_IfrY8iMsdc92IK8uFeJH0E",
  authDomain: "to-do-2-da206.firebaseapp.com",
  databaseURL: "https://to-do-2-da206.firebaseio.com",
  projectId: "to-do-2-da206",
  storageBucket: "to-do-2-da206.appspot.com",
  messagingSenderId: "464804729331",
  appId: "1:464804729331:web:5f95d5e090c1dce8fc8286",
  measurementId: "G-JK1SJ9MGL6",
});

const db = firebaseApp.firestore();

export default db;
