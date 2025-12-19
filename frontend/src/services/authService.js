import axios from 'axios';
import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';

// Dynamic API URL detection for mobile and web
const getApiUrl = () => {
  // Check if running in Capacitor (mobile app)
  if (window.Capacitor) {
    return 'http://192.168.43.196:5000/api';
  }
  // Check if running on localhost (web development)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Default for mobile or other environments
  return 'http://192.168.43.196:5000/api';
};

const API_URL = getApiUrl();

const authService = {
    // Login with email and password using Firebase
    login: async (email, password) => {
        try {
            console.log('Logging in with Firebase:', email);

            // Use Firebase authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Get the Firebase ID token
            const idToken = await user.getIdToken();
            
            console.log('Firebase login successful');
            
            // Store user data in localStorage
            localStorage.setItem('firebaseToken', idToken);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Get user data from backend using Firebase token
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { 'firebase-auth-token': idToken }
            });
            
            return {
                token: idToken,
                user: response.data
            };
        } catch (error) {
            console.error('Firebase login failed:', error.message);
            throw { message: 'Failed to login. ' + error.message };
        }
    },

    // Send OTP
    sendOtp: async (phone) => {
        try {
            console.log('Sending OTP to:', phone);
            const response = await axios.post(`${API_URL}/auth/send-otp`, { phone });
            console.log('OTP sent successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error sending OTP:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Failed to send OTP' };
        }
    },

    // Verify OTP
    verifyOtp: async (phone, otp) => {
        try {
            console.log('Verifying OTP:', { phone, otp });
            const response = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
            console.log('OTP verification response:', response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                console.log('User data stored in localStorage');
            }
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error.response?.data || error.message);
            throw error.response?.data || { message: 'Failed to verify OTP' };
        }
    },

    // Get current user using Firebase
    getCurrentUser: async () => {
        try {
            // Check if user is logged in with Firebase
            const currentUser = auth.currentUser;
            if (!currentUser) return null;
            
            // Get the Firebase ID token
            const idToken = await currentUser.getIdToken();
            console.log('Getting current user with Firebase token');
            
            // Get user data from backend using Firebase token
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { 'firebase-auth-token': idToken }
            });
            
            console.log('Current user data:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error getting current user:', error.message);
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('isLoggedIn');
            throw { message: 'Failed to get user data' };
        }
    },

    // Logout using Firebase
    logout: async () => {
        try {
            console.log('Logging out user with Firebase');
            await signOut(auth);
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isLoggedIn');
        } catch (error) {
            console.error('Error during logout:', error.message);
            throw { message: 'Failed to logout' };
        }
    },

    // Register user using Firebase
    register: async (name, email, password, phone) => {
        try {
            console.log('Registering user with Firebase:', { name, email, phone });

            // Create user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;
            
            // Update Firebase user profile with name
            await firebaseUser.updateProfile({
                displayName: name
            });
            
            // Get the Firebase ID token
            const idToken = await firebaseUser.getIdToken();
            
            // Register user in our backend with Firebase UID
            const response = await axios.post(`${API_URL}/auth/register`, {
                name,
                email,
                phone,
                firebaseUid: firebaseUser.uid
            }, {
                headers: { 'firebase-auth-token': idToken }
            });

            console.log('Registration successful:', response.data);

            // Store Firebase token and user data
            localStorage.setItem('firebaseToken', idToken);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('isLoggedIn', 'true');

            return {
                token: idToken,
                user: response.data
            };
        } catch (error) {
            console.error('Firebase registration failed:', error.message);
            throw { message: 'Failed to register. ' + error.message };
        }
    },
    
    // Reset password using Firebase
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { message: 'Password reset email sent successfully' };
        } catch (error) {
            console.error('Error sending password reset email:', error.message);
            throw { message: 'Failed to send password reset email. ' + error.message };
        }
    }
};

export default authService;