import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIRE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIRE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIRE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIRE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIRE_MEASUREMENT_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth }