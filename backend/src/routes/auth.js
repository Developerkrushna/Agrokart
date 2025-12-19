const express = require('express');
const router = express.Router();
const User = require('../models/User');
const admin = require('firebase-admin');

// Initialize Firebase Admin from config
const { auth: firebaseAuth } = require('../config/firebase');

// Register with Firebase Authentication
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, firebaseUid } = req.body;

    console.log('📝 Registration request:', { name, email, phone, role, firebaseUid });

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user in MongoDB
    user = new User({
      name,
      email,
      firebaseUid, // Store Firebase UID instead of password
      phone,
      role: role || 'customer' // Default to customer if no role specified
    });

    // Save user
    await user.save();

    console.log('✅ User registered successfully:', { id: user._id, email: user.email, role: user.role });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
});

// Login with email and password (for customers)
router.post('/login', async (req, res) => {
  try {
    const { email, password, expectedRole } = req.body;
    
    console.log('🔄 Customer login attempt:', { email, expectedRole });
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user in database
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. No account found with this email.' });
    }
    
    // Validate user role if expectedRole is specified
    if (expectedRole && user.role !== expectedRole) {
      console.log('❌ Role mismatch - Expected:', expectedRole, 'Found:', user.role);
      return res.status(403).json({ 
        message: `Access denied. This account is registered as ${user.role}, not ${expectedRole}. Please use the correct login page for your account type.`,
        userRole: user.role
      });
    }
    
    console.log('✅ Customer login successful:', { id: user._id, email: user.email, role: user.role });
    
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      token: 'customer-jwt-token' // In a real app, generate a proper JWT
    });
    
  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  }
});

// Login with Firebase token
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;
    
    console.log('Firebase token verified:', { uid, email });

    // Find user in our database
    let user = await User.findOne({ email });
    
    // If user doesn't exist in our database but exists in Firebase, create them
    if (!user) {
      // Get user details from Firebase
      const firebaseUser = await firebaseAuth.getUser(uid);
      
      // Create new user in our database
      user = new User({
        name: firebaseUser.displayName || email.split('@')[0],
        email: email,
        firebaseUid: uid,
        phone: firebaseUser.phoneNumber,
        role: 'customer' // Default role
      });
      
      await user.save();
      console.log('Created new user from Firebase auth:', { id: user._id, email });
    }

    console.log('✅ Login successful for user:', { id: user._id, email: user.email, role: user.role });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // The auth middleware already verified the Firebase token
    // and added the user info to req.user
    if (!req.user || !req.user.email) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findOne({ email: req.user.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Firebase token
router.post('/verify-token', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    // Verify Firebase token
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;
    
    // Find user in our database
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }
    
    res.json({
      message: 'Token verified',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Reset password should be handled through Firebase
// This endpoint is removed as we're using Firebase for authentication

module.exports = router;