import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 * 
 * This configuration connects our app to Firebase services including:
 * - Authentication (email/password, phone, social logins)
 * - Firestore Database (NoSQL database)
 * - Storage (file uploads for product images, documents)
 */
// Check if we're using environment variables or fallback values
const usingEnvVars = !!process.env.REACT_APP_FIREBASE_API_KEY;
console.log('Using Firebase environment variables:', usingEnvVars);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDAMtYm61y2d3YzLBoo1m4K7V1lsJI3lyY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "fertilizer-89e57.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "fertilizer-89e57",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "fertilizer-89e57.appspot.com", // Fixed storage bucket URL
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "425831974831",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:425831974831:web:2ff47c4c1d8ba29f02115a",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-CZE8YM228D"
};

// Log the config we're using
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'Set' : 'Not set',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;

try {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully with config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    storageBucket: firebaseConfig.storageBucket
  });
  
  // Initialize Firebase services with detailed error handling
  try {
    auth = getAuth(app);
    console.log('Firebase Auth initialized:', !!auth);
  } catch (authError) {
    console.error('Error initializing Firebase Auth:', authError);
    // Create a fallback auth object to prevent app crashes
    auth = { currentUser: null, onAuthStateChanged: () => {} };
  }
  
  try {
    db = getFirestore(app);
    console.log('Firebase Firestore initialized:', !!db);
  } catch (dbError) {
    console.error('Error initializing Firebase Firestore:', dbError);
    // Create a fallback db object
    db = {};
  }
  
  try {
    storage = getStorage(app);
    console.log('Firebase Storage initialized:', !!storage);
  } catch (storageError) {
    console.error('Error initializing Firebase Storage:', storageError);
    // Create a fallback storage object
    storage = {};
  }
  
  console.log('All Firebase services initialization attempted');
} catch (error) {
  console.error('Error initializing Firebase app:', error);
  // Create fallback objects to prevent app crashes
  app = {};
  auth = { currentUser: null, onAuthStateChanged: () => {} };
  db = {};
  storage = {};
}

// Export Firebase services
export { auth, db, storage };
export default app;