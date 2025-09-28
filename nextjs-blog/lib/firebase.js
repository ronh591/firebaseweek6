import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/** firebase.js
 * Configuration object that securely loads Firebase credentials
 * from the environment variables defined in the .env.local file.
 */
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

// 1. Initialize the Firebase app
const app = initializeApp(firebaseConfig);

// 2. Initialize Firestore database service
// This is the 'db' instance imported by your data layer (lib/post.firebase.js).
export const db = getFirestore(app);

// NOTE: Remember to restart your Next.js development server after creating 
// or updating the .env.local file to ensure these variables are loaded!
