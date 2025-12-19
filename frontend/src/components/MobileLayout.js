import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { useMobile } from '../context/MobileContext';
import MobileNavigation from './MobileNavigation';

const MobileLayout = ({ 
  children, 
  showNavigation = true, 
  user = null, 
  onLogout = null,
  cartCount = 0,
  notificationCount = 0,
  maxWidth = 'lg',
  padding = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isNative } = useMobile();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      {/* Mobile Status Bar Spacer */}
      {isNative && (
        <Box sx={{ 
          height: 'env(safe-area-inset-top, 0px)',
          bgcolor: 'primary.main'
        }} />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingTop: isMobile && showNavigation ? '64px' : 0, // AppBar height
          paddingBottom: isMobile && showNavigation ? '70px' : 0, // BottomNavigation height
          overflow: 'auto'
        }}
      >
        {padding ? (
          <Container 
            maxWidth={maxWidth}
            sx={{ 
              py: isMobile ? 2 : 3,
              px: isMobile ? 1 : 3
            }}
          >
            {children}
          </Container>
        ) : (
          children
        )}
      </Box>

      {/* Mobile Navigation */}
      {showNavigation && isMobile && (
        <MobileNavigation
          user={user}
          onLogout={onLogout}
          cartCount={cartCount}
          notificationCount={notificationCount}
        />
      )}

      {/* Native Mobile Safe Area Bottom */}
      {isNative && isMobile && showNavigation && (
        <Box sx={{ 
          height: 'env(safe-area-inset-bottom, 0px)',
          bgcolor: 'background.paper'
        }} />
      )}
    </Box>
  );
};

export default MobileLayout;