import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { auth } from '../config/firebase';
import { onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        localStorage.setItem('userPhone', user.phoneNumber);
        localStorage.setItem('userName', `User ${user.phoneNumber.slice(-4)}`);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/home');
      }
    });

    // Start resend timer
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [timer, navigate]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await window.confirmationResult.confirm(otp);
      // User signed in successfully
      const user = result.user;
      console.log('User signed in:', user);
      // Navigation will be handled by the auth state listener
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    
    try {
      const phoneNumber = localStorage.getItem('phoneNumber');
      const formattedPhone = `+91${phoneNumber}`;
      
      // Create a new reCAPTCHA verifier
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA solved
        }
      });

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );
      
      window.confirmationResult = confirmationResult;
      
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Verify OTP
          </Typography>
          <Typography variant="body1" gutterBottom align="center" color="text.secondary">
            Enter the 6-digit code sent to your phone
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleVerifyOTP}>
            <TextField
              fullWidth
              label="OTP"
              variant="outlined"
              margin="normal"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  setOtp(value);
                }
              }}
              placeholder="Enter 6-digit OTP"
              error={!!error}
              helperText={error}
              disabled={loading}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*'
              }}
            />

            <div id="recaptcha-container" style={{ marginTop: '20px' }}></div>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              disabled={loading || otp.length !== 6}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Didn\'t receive the code?'}
              </Typography>
              <Button
                variant="text"
                color="primary"
                onClick={handleResendOTP}
                disabled={!canResend || loading}
                sx={{ mt: 1 }}
              >
                Resend OTP
              </Button>
            </Box>

            <Button
              fullWidth
              variant="text"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default OtpPage; 