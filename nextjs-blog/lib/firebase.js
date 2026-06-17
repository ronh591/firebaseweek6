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

const requiredEnvVars = ['API_KEY', 'AUTH_DOMAIN', 'PROJECT_ID', 'STORAGE_BUCKET', 'APP_ID'];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
    throw new Error(
        `Missing required Firebase environment variables: ${missingVars.join(', ')}. ` +
        'Ensure they are defined in your .env.local file and restart the dev server.'
    );
}

let app;
try {
    app = initializeApp(firebaseConfig);
} catch (error) {
    throw new Error(`Failed to initialize Firebase app: ${error.message}`);
}

let db;
try {
    db = getFirestore(app);
} catch (error) {
    throw new Error(`Failed to initialize Firestore: ${error.message}`);
}

export { db };

// NOTE: Remember to restart your Next.js development server after creating 
// or updating the .env.local file to ensure these variables are loaded!
