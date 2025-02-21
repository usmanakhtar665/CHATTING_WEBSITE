import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC4ziEfkksK-mj1x2CdzZdjincJEE_BBpw",
    authDomain: "chat-website-429a2.firebaseapp.com",
    projectId: "chat-website-429a2",
    storageBucket: "chat-website-429a2.firebasestorage.app",
    messagingSenderId: "513667056024",
    appId: "1:513667056024:web:690022e26b81f7acff6bed",
    measurementId: "G-J1KCGNK28M"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  export { db };
