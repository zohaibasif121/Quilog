// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAe4aMFKFVoA_NNeM8K9_PzTPfwqWaOy1M",
  authDomain: "quilog-cfad6.firebaseapp.com",
  projectId: "quilog-cfad6",
  storageBucket: "quilog-cfad6.appspot.com",
  messagingSenderId: "185769866946",
  appId: "1:185769866946:web:bb15cc57ecf4ee80bead5b",
  measurementId: "G-PLKY4SN00P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth and firestore services
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
