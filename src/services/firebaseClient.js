import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
    initializeFirestore, 
    memoryLocalCache, 
    persistentLocalCache,
    persistentMultipleTabManager,
    connectFirestoreEmulator
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, connectAuthEmulator } from 'firebase/auth';

const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_APP_ID',
];

const missing = required.filter((k) => !import.meta.env[k]);
if (missing.length) {
    throw new Error(
        `[Firebase config] Missing envs: ${missing.join(", ")}. Copy .env.example to .env and fill values from Firebase console > Project settings.`
    );
}

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isBrowser = typeof window !== 'undefined';


// const app = initializeApp(firebaseConfig);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// export const db = initializeFirestore(app, {
//     localCache: persistentLocalCache({
//         tabManager: persistentMultipleTabManager(),
//     }),
// });

let db;
try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
        }),
    });
} catch (err) {
    console.warn('[Firestore] persistentLocalCache failed, falling back to memory cache:',
        err?.message || err
    );
    db = initializeFirestore(app, { localCache: memoryLocalCache() });
}
export { db };

export const auth = getAuth(app);

// onAuthStateChanged(auth, (user) => {
//     if (!user) {
//         signInAnonymously(auth).catch((err) => {
//             console.warn('Anonymous sign-in failed:', err?.code || err);
//         });
//     }
// });

if (import.meta.env.VITE_EMULATORS === '1') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
}

if (isBrowser) {
    onAuthStateChanged(auth, (user) => {
        if (!user && import.meta.env.VITE_ENABLE_ANON_AUTH === '1'){
            signInAnonymously(auth).catch((err) => {
                console.warn('Anonymous sign-in failed', err?.code || err);
            })
        }
    })
}
