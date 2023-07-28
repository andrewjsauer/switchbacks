import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIRE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIRE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIRE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIRE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let analytics = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);

  if (process.env.NODE_ENV === 'development') {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY as string),
    isTokenAutoRefreshEnabled: true,
  });
}

export { db, auth, analytics, storage };
export default app;
