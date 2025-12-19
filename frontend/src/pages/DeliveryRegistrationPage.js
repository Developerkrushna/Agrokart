import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { deliveryRegister, deliveryUploadDocuments } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';

const steps = ['Personal Details', 'Vehicle Information', 'Documents', 'Verification'];

const vehicleTypes = [
  { value: 'bike', label: 'Motorcycle/Bike' },
  { value: 'auto', label: 'Auto Rickshaw' },
  { value: 'van', label: 'Van' },
  { value: 'truck', label: 'Truck' }
];

const DeliveryRegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole, updateUser, setIsAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  // Get initial form data from location state if available
  const initialFormData = location.state ? {
    // Personal Details - Pre-filled from previous page
    name: location.state.name || '',
    email: location.state.email || '',
    password: '',
    confirmPassword: '',
    phone: location.state.phone || '',
    
    // Vehicle Information
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    aadharNumber: '',
    serviceRadius: 10,
    
    // Documents
    documents: {
      drivingLicense: null,
      vehicleRC: null,
      aadharCard: null,
      photo: null
    }
  } : {
    // Personal Details - Empty
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Vehicle Information
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    aadharNumber: '',
    serviceRadius: 10,
    
    // Documents
    documents: {
      drivingLicense: null,
      vehicleRC: null,
      aadharCard: null,
      photo: null
    }
  };

  // Log if we received data from previous page
  React.useEffect(() => {
    if (location.state) {
      const { email, name, phone } = location.state;
      if (email || name || phone) {
        console.log('📝 Pre-filled delivery registration data:', { email, name, phone });
      }
    }
  }, [location.state]);

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: file
      }
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.email && formData.password && 
               formData.confirmPassword && formData.phone && 
               formData.password === formData.confirmPassword;
      case 1:
        return formData.vehicleType && formData.vehicleNumber && 
               formData.licenseNumber && formData.aadharNumber;
      case 2:
        return Object.values(formData.documents).every(doc => doc !== null);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError('');
    } else {
      setError('Please fill all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Starting delivery partner registration process...');
      
      // Step 1: Create Firebase user for delivery partner (for consistency)
      let firebaseUid = null;
      let firebaseIdToken = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        firebaseUid = user.uid;
        firebaseIdToken = await user.getIdToken();
        
        // Update profile with displayName
        await updateProfile(user, {
          displayName: formData.name
        });
        
        console.log('✅ Firebase user created for delivery partner:', firebaseUid);
      } catch (firebaseError) {
        console.warn('⚠️ Firebase sign-up for delivery partner failed:', firebaseError?.code || firebaseError?.message);
        if (auth.currentUser) {
          firebaseUid = auth.currentUser.uid;
          firebaseIdToken = await auth.currentUser.getIdToken();
          console.log('ℹ️ Using existing Firebase session for delivery partner:', firebaseUid);
        } else {
          throw new Error(firebaseError?.message || 'Failed to create Firebase account');
        }
      }
      
      // Step 2: Register with backend
      const registrationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        aadharNumber: formData.aadharNumber,
        serviceRadius: formData.serviceRadius,
        role: 'delivery_partner',
        firebaseUid // Include Firebase UID
      };

      console.log('📤 Registering delivery partner with backend:', {
        ...registrationData,
        firebaseUid: firebaseUid ? 'Present' : 'Missing'
      });
      
      const response = await deliveryRegister(registrationData);
      console.log('✅ Delivery partner backend registration successful:', response);

      // Step 3: Upload documents if any
      const authToken = response.token || response.user?.token || firebaseIdToken;
      
      const formDataObj = new FormData();
      Object.keys(formData.documents).forEach(key => {
        if (formData.documents[key]) {
          console.log(`📎 Adding document: ${key}`, formData.documents[key].name);
          formDataObj.append(key, formData.documents[key]);
        }
      });

      if (Object.keys(formData.documents).some(key => formData.documents[key]) && authToken) {
        console.log('📤 Uploading delivery partner documents...');
        try {
          await deliveryUploadDocuments(formDataObj, authToken);
          console.log('✅ Delivery partner documents uploaded successfully');
        } catch (docError) {
          console.warn('⚠️ Delivery partner document upload failed:', docError.message);
          // Continue anyway - documents can be uploaded later
        }
      }

      // Step 4: Update AuthContext and store user data
      const deliveryUser = {
        id: firebaseUid,
        name: formData.name,
        email: formData.email,
        role: 'delivery_partner',
        firebaseUid: firebaseUid,
        vehicleType: formData.vehicleType
      };

      // Store user data for modal
      setRegisteredUser({
        name: formData.name,
        email: formData.email,
        role: 'delivery_partner'
      });
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(deliveryUser));
      localStorage.setItem('userRole', 'delivery_partner');
      localStorage.setItem('authToken', authToken || '');
      console.log('✅ Delivery partner user data stored');
      
      setSuccess('Delivery partner registration successful!');
      setShowSuccessModal(true);

    } catch (error) {
      console.error('🚨 Delivery partner registration error:', error);
      setError(error.message || 'Delivery partner registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToLogin = () => {
    setShowSuccessModal(false);
    navigate('/delivery/login');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Aadhar Number"
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
                error={formData.password !== formData.confirmPassword}
                helperText={formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                >
                  {vehicleTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={formData.vehicleNumber}
                onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Driving License Number"
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Service Radius (km)"
                type="number"
                value={formData.serviceRadius}
                onChange={(e) => handleInputChange('serviceRadius', parseInt(e.target.value))}
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            {Object.keys(formData.documents).map((docType) => (
              <Grid item xs={12} md={6} key={docType}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {docType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<UploadIcon />}
                      fullWidth
                    >
                      {formData.documents[docType] ? 'File Selected' : 'Upload File'}
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(docType, e.target.files[0])}
                      />
                    </Button>
                    {formData.documents[docType] && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {formData.documents[docType].name}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <DeliveryIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Ready to Start Delivering!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your registration is complete. Click submit to create your delivery partner account.
              Our team will verify your documents within 24-48 hours.
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              You will receive a notification once your account is verified and you can start accepting deliveries.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <DeliveryIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Delivery Partner Registration
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading || !validateStep(activeStep)}
            >
              {loading ? 'Registering...' : 'Complete Registration'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!validateStep(activeStep)}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
      
      {/* Registration Success Modal */}
      <RegistrationSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onContinueToLogin={handleContinueToLogin}
        userRole="delivery_partner"
        userName={registeredUser?.name}
        userEmail={registeredUser?.email}
      />
    </Container>
  );
};

export default DeliveryRegistrationPage;
