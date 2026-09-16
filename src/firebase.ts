import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Real authentication, used to gate admin writes in firestore.rules
export const auth = getAuth(app);

// Initialize Firestore with robust auto-detection and long-polling support to avoid
// iframe/proxy WebChannel connection drops ("unavailable / Could not reach Cloud Firestore backend")
export const db = initializeFirestore(
  app,
  {
    experimentalAutoDetectLongPolling: true,
  },
  firebaseConfig.firestoreDatabaseId || undefined
);

export { app };
