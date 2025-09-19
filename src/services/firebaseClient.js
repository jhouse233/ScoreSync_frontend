import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistance } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.ENV.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (!user) signInAnonymously(auth).catch(console.error)
});

if (typeof window !== 'undefined') {
    enableIndexedDbPersistance(db).catch(() => {
        
    })
}