import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project settings in the .env file
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Log config status
console.log('[Firebase] Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : 'MISSING'
});

// Initialize Firebase safely
let app = null;
let auth = null;
let googleProvider = null;
let initError = null;

try {
    // Validate that required config exists
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing Firebase config: ${missingFields.join(', ')}. Please check your .env file.`);
    }

    app = initializeApp(firebaseConfig);
    console.log('[Firebase] Firebase initialized successfully');

    // Initialize Firebase Auth
    auth = getAuth(app);
    setPersistence(auth, browserSessionPersistence)
        .then(() => {
            console.log('[Firebase] Session persistence set to browserSessionPersistence successfully');
        })
        .catch((error) => {
            console.error('[Firebase] Failed to set session persistence:', error);
        });
    console.log('[Firebase] Firebase Auth initialized successfully');

    googleProvider = new GoogleAuthProvider();
    console.log('[Firebase] Google Auth Provider created successfully');

} catch (error) {
    initError = error;
    console.error('[Firebase] Initialization failed:', error);
    console.warn('[Firebase] App will run in demo mode with mock data only');
}

// Safe exports that check if Firebase is initialized
export const getFirebaseApp = () => {
    if (initError) {
        console.warn('[Firebase] Firebase not initialized. Running in demo mode.');
        return null;
    }
    return app;
};

export const getAuthInstance = () => {
    if (initError) {
        console.warn('[Firebase] Firebase Auth not available. Running in demo mode.');
        return null;
    }
    return auth;
};

export const getGoogleProvider = () => {
    if (initError) {
        console.warn('[Firebase] Google Provider not available. Running in demo mode.');
        return null;
    }
    return googleProvider;
};

export const getFirebaseError = () => initError;
export const isFirebaseInitialized = () => !initError;

export const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
        throw new Error('Firebase is not initialized. Please check your configuration.');
    }
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log('[Firebase] Sign in successful');
        return result.user;
    } catch (error) {
        console.error("[Firebase] Error signing in with Google:", error);
        throw error;
    }
};

export const logout = async () => {
    if (!auth) {
        console.warn('[Firebase] Firebase Auth not initialized. Demo mode logout.');
        return;
    }
    try {
        await signOut(auth);
        console.log('[Firebase] Sign out successful');
    } catch (error) {
        console.error("[Firebase] Error signing out:", error);
        throw error;
    }
};

export { app, auth, googleProvider };
export default app;
