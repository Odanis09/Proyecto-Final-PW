
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyALqu1dE73_Wt9Jh3I7R-Hd738I2peVGao",
    authDomain: "itla-crush-c42bc.firebaseapp.com",
    projectId: "itla-crush-c42bc",
    storageBucket: "itla-crush-c42bc.appspot.com",
    messagingSenderId: "351019585394",
    appId: "1:351019585394:web:c683ac9ed32a28ebab97eb"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
