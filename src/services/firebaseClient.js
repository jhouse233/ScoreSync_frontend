import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    initializeFirestore, 
    persistentLocalCache,
    persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// const app = initializeApp(firebaseConfig);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
    }),
});

export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        signInAnonymously(auth).catch((err) => {
            console.warn('Anonymous sign-in failed:', err?.code || err);
        });
    }
});

