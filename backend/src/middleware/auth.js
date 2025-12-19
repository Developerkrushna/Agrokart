const { auth: firebaseAuth } = require('../config/firebase');
const User = require('../models/User');

module.exports = async function(req, res, next) {
    // Get Firebase token from header (check multiple possible header formats)
    const firebaseToken = req.header('firebase-auth-token') || 
                         req.header('Authorization')?.replace('Bearer ', '') || 
                         req.header('x-auth-token');

    // Check if no token
    if (!firebaseToken) {
        return res.status(401).json({ message: 'No Firebase token, authorization denied' });
    }

    try {
        // Verify Firebase token
        const decodedToken = await firebaseAuth.verifyIdToken(firebaseToken);
        const { uid, email } = decodedToken;
        
        // Find user in our database using Firebase UID
        const user = await User.findOne({ firebaseUid: uid });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found in database' });
        }
        
        // Add user info to request object
        req.user = {
            id: user._id,
            firebaseUid: uid,
            email: email,
            role: user.role
        };
        
        return next();
    } catch (err) {
        console.error('Auth middleware error:', err.message);
        res.status(401).json({ message: 'Firebase token is not valid' });
    }
};
