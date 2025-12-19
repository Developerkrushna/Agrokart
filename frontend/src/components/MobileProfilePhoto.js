import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Alert
} from '@mui/material';
import {
  PhotoCamera,
  Photo,
  Edit as EditIcon
} from '@mui/icons-material';
import { useMobile } from '../context/MobileContext';

const MobileProfilePhoto = ({ 
  currentPhoto, 
  onPhotoChange, 
  size = 80, 
  editable = true,
  userName = 'User'
}) => {
  const { isNative, takePhoto, selectFromGallery, showToast, vibrate } = useMobile();
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTakePhoto = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      await vibrate('light');
      const photoUrl = await takePhoto();
      
      if (photoUrl && onPhotoChange) {
        onPhotoChange(photoUrl);
        await showToast('Photo captured successfully!');
        await vibrate('success');
      }
      
      setShowPhotoDialog(false);
    } catch (error) {
      console.error('Take photo error:', error);
      setError('Failed to take photo. Please check camera permissions.');
      await vibrate('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      await vibrate('light');
      const photoUrl = await selectFromGallery();
      
      if (photoUrl && onPhotoChange) {
        onPhotoChange(photoUrl);
        await showToast('Photo selected successfully!');
        await vibrate('success');
      }
      
      setShowPhotoDialog(false);
    } catch (error) {
      console.error('Select photo error:', error);
      setError('Failed to select photo. Please check gallery permissions.');
      await vibrate('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onPhotoChange) {
          onPhotoChange(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      setShowPhotoDialog(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={currentPhoto}
        sx={{
          width: size,
          height: size,
          bgcolor: 'primary.main',
          fontSize: size * 0.4,
          cursor: editable ? 'pointer' : 'default',
          '&:hover': editable ? {
            opacity: 0.8,
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease'
          } : {}
        }}
        onClick={editable ? () => setShowPhotoDialog(true) : undefined}
      >
        {!currentPhoto && userName.charAt(0).toUpperCase()}
      </Avatar>
      
      {editable && (
        <IconButton
          sx={{
            position: 'absolute',
            bottom: -4,
            right: -4,
            bgcolor: 'primary.main',
            color: 'white',
            width: 24,
            height: 24,
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }}
          onClick={() => setShowPhotoDialog(true)}
        >
          <EditIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}

      {/* Photo Selection Dialog */}
      <Dialog 
        open={showPhotoDialog} 
        onClose={() => setShowPhotoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Update Profile Photo
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose how you'd like to update your profile photo
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isNative ? (
              // Native mobile options
              <>
                <Button
                  variant="contained"
                  startIcon={<PhotoCamera />}
                  onClick={handleTakePhoto}
                  disabled={isLoading}
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? 'Taking Photo...' : 'Take Photo'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<Photo />}
                  onClick={handleSelectFromGallery}
                  disabled={isLoading}
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? 'Selecting...' : 'Choose from Gallery'}
                </Button>
              </>
            ) : (
              // Web fallback
              <>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handleWebFileSelect}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                    fullWidth
                    size="large"
                    sx={{ py: 1.5 }}
                  >
                    Choose Photo
                  </Button>
                </label>
              </>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowPhotoDialog(false)} disabled={isLoading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobileProfilePhoto;