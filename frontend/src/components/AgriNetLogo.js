import React from 'react';
import { Box, Typography } from '@mui/material';

const AgriNetLogo = ({ 
  width = 200, 
  height = 60, 
  variant = 'full', // 'full', 'icon', 'text'
  color = 'default' // 'default', 'white', 'dark'
}) => {
  
  const getColors = () => {
    switch (color) {
      case 'white':
        return {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
          text: '#FFFFFF'
        };
      case 'dark':
        return {
          primary: '#1B5E20',
          secondary: '#2E7D32',
          text: '#1B5E20'
        };
      default:
        return {
          primary: '#4CAF50',
          secondary: '#7CB342',
          text: '#2E7D32'
        };
    }
  };

  const colors = getColors();

  const IconOnly = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: width, height: height }}>
      <svg width={width} height={height} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#7CB342'}} />
            <stop offset="50%" style={{stopColor: '#4CAF50'}} />
            <stop offset="100%" style={{stopColor: '#2E7D32'}} />
          </linearGradient>
        </defs>
        {/* Main leaf shape */}
        <path
          d="M10 40 L30 10 Q35 5 40 10 L45 15 Q50 20 45 25 L35 35 Q50 40 45 45 L40 50 Q35 55 30 50 L10 40 Z"
          fill="url(#leafGradient)"
          stroke="#2E7D32"
          strokeWidth="1"
        />
        {/* Secondary leaf element */}
        <path
          d="M35 35 L50 25 Q55 20 60 25 L65 30 Q70 35 65 40 L55 45 Q50 50 45 45 L35 35 Z"
          fill={colors.secondary}
          opacity="0.8"
        />
      </svg>
    </Box>
  );

  const TextOnly = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', width: width, height: height }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            color: color === 'white' ? '#B39DDB' : '#6A1B9A', // Purple matching the image
            letterSpacing: '1px',
            textShadow: color === 'white' ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Agri
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            color: color === 'white' ? '#FFB74D' : '#FF5722', // Orange matching the image
            letterSpacing: '1px',
            textShadow: color === 'white' ? 'none' : '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          Net
        </Typography>
      </Box>
    </Box>
  );

  const FullLogo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: width, height: height }}>
      {/* Icon part */}
      <svg width="50" height="50" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fullLeafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#7CB342'}} />
            <stop offset="50%" style={{stopColor: '#4CAF50'}} />
            <stop offset="100%" style={{stopColor: '#2E7D32'}} />
          </linearGradient>
        </defs>
        {/* Main leaf shape */}
        <path
          d="M10 40 L30 10 Q35 5 40 10 L45 15 Q50 20 45 25 L35 35 Q50 40 45 45 L40 50 Q35 55 30 50 L10 40 Z"
          fill="url(#fullLeafGradient)"
          stroke="#2E7D32"
          strokeWidth="1"
        />
        {/* Secondary leaf element */}
        <path
          d="M35 35 L50 25 Q55 20 60 25 L65 30 Q70 35 65 40 L55 45 Q50 50 45 45 L35 35 Z"
          fill={colors.secondary}
          opacity="0.8"
        />
      </svg>
      
      {/* Text part */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            color: color === 'white' ? '#B39DDB' : '#6A1B9A', // Purple matching the image
            letterSpacing: '1px'
          }}
        >
          Agri
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            color: color === 'white' ? '#FFB74D' : '#FF5722', // Orange matching the image
            letterSpacing: '1px'
          }}
        >
          Net
        </Typography>
      </Box>
    </Box>
  );

  const renderLogo = () => {
    switch (variant) {
      case 'icon':
        return <IconOnly />;
      case 'text':
        return <TextOnly />;
      default:
        return <FullLogo />;
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'inline-flex', 
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
          transition: 'transform 0.2s ease-in-out'
        }
      }}
    >
      {renderLogo()}
    </Box>
  );
};

export default AgriNetLogo;
