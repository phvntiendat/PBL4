import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyAte641DkXUfOSKlLeRFAGumJnirFxK0KA',
    authDomain: 'zalo-11cf6.firebaseapp.com',
    projectId: 'zalo-11cf6',
    storageBucket: 'zalo-11cf6.appspot.com',
    messagingSenderId: '661567137848',
    appId: '1:661567137848:web:b399a3b570fb3cc88ddecd',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
