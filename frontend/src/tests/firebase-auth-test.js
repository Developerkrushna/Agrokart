import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

/**
 * Test file for Firebase Authentication
 * 
 * This file contains functions to test Firebase authentication functionality.
 * Run these tests in the browser console to verify Firebase auth is working correctly.
 */

// Test user registration
const testRegistration = async (email, password, name) => {
  try {
    console.log(`🔍 Testing registration for ${email}...`);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Registration successful:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Registration failed:', error.code, error.message);
    throw error;
  }
};

// Test user login
const testLogin = async (email, password) => {
  try {
    console.log(`🔍 Testing login for ${email}...`);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login successful:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('❌ Login failed:', error.code, error.message);
    throw error;
  }
};

// Test user logout
const testLogout = async () => {
  try {
    console.log('🔍 Testing logout...');
    await signOut(auth);
    console.log('✅ Logout successful');
    return true;
  } catch (error) {
    console.error('❌ Logout failed:', error.code, error.message);
    throw error;
  }
};

// Test password reset
const testPasswordReset = async (email) => {
  try {
    console.log(`🔍 Testing password reset for ${email}...`);
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Password reset email sent');
    return true;
  } catch (error) {
    console.error('❌ Password reset failed:', error.code, error.message);
    throw error;
  }
};

// Test current user
const testCurrentUser = () => {
  const user = auth.currentUser;
  if (user) {
    console.log('✅ Current user:', user);
    return user;
  } else {
    console.log('❌ No user is currently signed in');
    return null;
  }
};

// Run all tests
const runAllTests = async (email, password, name) => {
  try {
    // Register a new user
    await testRegistration(email, password, name);
    
    // Log out the user
    await testLogout();
    
    // Log in the user
    await testLogin(email, password);
    
    // Check current user
    testCurrentUser();
    
    // Test password reset
    await testPasswordReset(email);
    
    // Log out again
    await testLogout();
    
    console.log('🎉 All tests completed successfully!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
};

// Export test functions
export {
  testRegistration,
  testLogin,
  testLogout,
  testPasswordReset,
  testCurrentUser,
  runAllTests
};

// Example usage in browser console:
// import { runAllTests } from './tests/firebase-auth-test';
// runAllTests('test@example.com', 'password123', 'Test User');