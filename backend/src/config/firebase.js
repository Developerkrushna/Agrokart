const admin = require('firebase-admin');

// Initialize Firebase Admin with environment variables or default configuration
let firebaseConfig;

// Check if we're in development mode with placeholder credentials
if (process.env.NODE_ENV !== 'production') {
  // Use a simple configuration for development/testing
  firebaseConfig = {
    credential: admin.credential.applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID || 'krushidoot'
  };
  
  console.log('Using development Firebase configuration');
} else {
  // In production, use proper service account credentials
  firebaseConfig = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "krushidoot.appspot.com"
  };
}

admin.initializeApp(firebaseConfig);

const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

module.exports = {
  auth,
  db,
  storage
};