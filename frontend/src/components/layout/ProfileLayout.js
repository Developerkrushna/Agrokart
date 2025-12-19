import React from 'react';
import {
  Box,
  Container
} from '@mui/material';

const ProfileLayout = ({ children }) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Content - No Header */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};

export default ProfileLayout;

