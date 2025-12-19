import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoleSelection, setShowRoleSelection] = useState(true);

  useEffect(() => {
    // Check for Firebase auth state and localStorage role
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    }

    // Set up Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser({
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          phone: currentUser.phoneNumber,
          role: savedRole || 'customer'
        });
        setIsAuthenticated(true);
        setShowRoleSelection(false); // Hide role selection if user is logged in
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
        setShowRoleSelection(true); // Show unified auth page for new users
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Firebase register with email and password
  const register = async (userData) => {
    console.log('🔄 AuthContext register function called with:', {
      email: userData.email,
      name: userData.name,
      role: userData.role
    });
    setLoading(true);
    try {
      // Check if Firebase auth is properly initialized
      if (!auth) {
        console.error('❌ Firebase Auth is not initialized:', auth);
        throw new Error('Firebase authentication is not available');
      }
      
      console.log('⏳ Attempting to create user with Firebase Authentication');
      // Create user with Firebase Authentication
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth, 
          userData.email, 
          userData.password
        );
        const user = userCredential.user;
        console.log('✅ User created successfully:', user.uid);
      } catch (createUserError) {
        console.error('❌ Error creating user:', createUserError.code, createUserError.message);
        // Check for specific Firebase errors
        if (createUserError.code === 'auth/email-already-in-use') {
          throw new Error('Email is already in use. Please use a different email or try logging in.');
        } else if (createUserError.code === 'auth/network-request-failed') {
          throw new Error('Network error. Please check your internet connection and try again.');
        } else if (createUserError.code === 'auth/weak-password') {
          throw new Error('Password is too weak. Please use a stronger password.');
        } else {
          throw createUserError;
        }
      }
      
      const user = userCredential.user;
      
      console.log('⏳ Updating user profile with name');
      // Update profile with name
      try {
        await updateProfile(user, {
          displayName: userData.name
        });
        console.log('✅ User profile updated successfully');
      } catch (profileError) {
        console.error('⚠️ Error updating profile:', profileError);
        // Continue despite profile update error
      }
      
      // Store role in localStorage
      if (userData.role) {
        try {
          console.log('⏳ Storing user role in localStorage:', userData.role);
          localStorage.setItem('userRole', userData.role);
          setUserRole(userData.role);
        } catch (storageError) {
          console.error('⚠️ Error storing user role in localStorage:', storageError);
          // Continue despite localStorage error
        }
      }
      
      console.log('✅ Firebase registration successful:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Firebase registration error:', error.code || 'unknown', error.message, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Firebase login with email and password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store role in localStorage
      if (userRole) {
        localStorage.setItem('userRole', userRole);
      }
      
      console.log('Firebase login successful:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('Firebase login error:', error.code, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Firebase password reset
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Firebase password reset error:', error);
      throw error;
    }
  };

  // Firebase logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      setUserRole(null);
      setIsAuthenticated(false);
      setUser(null);
      setShowRoleSelection(true);
      return { success: true };
    } catch (error) {
      console.error('Firebase logout error:', error);
      throw error;
    }
  };

  // Set user role (used during role selection)
  const setRole = (role) => {
    localStorage.setItem('userRole', role);
    setUserRole(role);
  };

  // Update user data (used after registration)
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Set authentication status
  const setAuthenticationStatus = (status) => {
    setIsAuthenticated(status);
  };

  const hideRoleSelection = () => {
    setShowRoleSelection(false);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    isAuthenticated,
    user,
    userRole,
    loading,
    showRoleSelection,
    setUserRole,
    setShowRoleSelection,
    setRole,
    updateUser,
    setIsAuthenticated: setAuthenticationStatus,
    hideRoleSelection,
    login,
    logout,
    register,
    resetPassword,
    getCurrentUser: () => auth.currentUser,
    isUserAuthenticated: () => !!auth.currentUser,
    // Legacy API compatibility
    authLogin: (credentials) => login(credentials.email, credentials.password),
    authRegister: (userData) => register(userData)
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};