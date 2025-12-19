import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AgrokartLogo from './AgrokartLogo';

const AgrokartLoader = ({ 
  message = 'Loading...', 
  size = 'medium',
  variant = 'full', // 'full', 'inline', 'overlay'
  showProgress = true,
  showLogo = true,
  duration = null // If provided, auto-completes after duration
}) => {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
    
    if (showProgress) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval((timer));
            return 100;
          }
          const randomIncrement = Math.random() * 10;
          return Math.min(prevProgress + randomIncrement, 100);
        });
      }, 200);

      return () => clearInterval(timer);
    }

    if (duration) {
      const durationTimer = setTimeout(() => {
        setProgress(100);
      }, duration);

      return () => clearTimeout(durationTimer);
    }
  }, [showProgress, duration]);

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return { 
          logoSize: 60, 
          iconSize: 24, 
          fontSize: '0.875rem',
          spacing: 2,
          circularSize: 32
        };
      case 'large':
        return { 
          logoSize: 120, 
          iconSize: 48, 
          fontSize: '1.25rem',
          spacing: 4,
          circularSize: 64
        };
      default: // medium
        return { 
          logoSize: 80, 
          iconSize: 32, 
          fontSize: '1rem',
          spacing: 3,
          circularSize: 48
        };
    }
  };

  const config = getSizeConfig();

  // Animated Logo Component
  const AnimatedLogo = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'logoFloat 3s ease-in-out infinite',
        '@keyframes logoFloat': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
          },
          '50%': {
            transform: 'translateY(-8px) scale(1.05)',
          }
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Agrokart Logo */}
        <AgrokartLogo 
          width={config.logoSize} 
          height={config.logoSize * 0.6} 
          variant="full" 
          color="multicolor"
        />
        
        {/* Animated Ring */}
        <Box
          sx={{
            position: 'absolute',
            width: config.logoSize + 20,
            height: config.logoSize + 20,
            borderRadius: '50%',
            border: `2px solid ${theme.palette.primary.main}20`,
            animation: 'rotate 4s linear infinite',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: theme.palette.primary.main,
              animation: 'rotate 2s linear infinite reverse',
            },
            '@keyframes rotate': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />
      </Box>
    </Box>
  );

  // Loading Dots Animation
  const LoadingDots = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 0.5,
        mt: config.spacing
      }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            animation: `bounce 1.4s ease-in-out ${index * 0.16}s infinite both`,
            '@keyframes bounce': {
              '0%, 80%, 100%': {
                transform: 'scale(0.8)',
                opacity: 0.5
              },
              '40%': {
                transform: 'scale(1.2)',
                opacity: 1
              }
            }
          }}
        />
      ))}
    </Box>
  );

  // Progress Wave Animation
  const ProgressWave = () => (
    <Box
      sx={{
        width: '100%',
        maxWidth: 200,
        height: 4,
        backgroundColor: `${theme.palette.primary.main}20`,
        borderRadius: 2,
        overflow: 'hidden',
        mt: config.spacing,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          height: '100%',
          background: `linear-gradient(90deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.secondary.main} 50%, 
            ${theme.palette.primary.main} 100%)`,
          borderRadius: 2,
          width: `${progress}%`,
          transition: 'width 0.3s ease',
          animation: 'shimmer 2s ease-in-out infinite',
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '-200px 0' },
            '100%': { backgroundPosition: '200px 0' }
          }
        }}
      />
    </Box>
  );

  // Inline variant for smaller loading states
  if (variant === 'inline') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 1
        }}
      >
        <CircularProgress 
          size={config.circularSize}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            }
          }}
        />
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ fontSize: config.fontSize }}
        >
          {message}
        </Typography>
      </Box>
    );
  }

  // Overlay variant for loading over existing content
  if (variant === 'overlay') {
    return (
      <Fade in={showContent} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {showLogo && <AnimatedLogo />}
          
          <Typography
            variant="h6"
            sx={{
              mt: config.spacing,
              fontSize: config.fontSize,
              fontWeight: 500,
              color: 'text.primary',
              textAlign: 'center'
            }}
          >
            {message}
          </Typography>

          {showProgress && <ProgressWave />}
          <LoadingDots />
        </Box>
      </Fade>
    );
  }

  // Full variant - default full screen loader
  return (
    <Fade in={showContent} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #E6F3FF 50%, #F3E8FF 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, ${theme.palette.primary.main} 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main} 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px',
            animation: 'backgroundMove 20s linear infinite',
            '@keyframes backgroundMove': {
              '0%': { transform: 'translate(0, 0)' },
              '100%': { transform: 'translate(50px, 50px)' }
            }
          }}
        />

        {showLogo && <AnimatedLogo />}
        
        <Typography
          variant="h4"
          sx={{
            mt: config.spacing,
            fontSize: config.fontSize,
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            animation: 'textGlow 2s ease-in-out infinite alternate',
            '@keyframes textGlow': {
              '0%': { opacity: 0.8 },
              '100%': { opacity: 1 }
            }
          }}
        >
          {message}
        </Typography>

        {showProgress && <ProgressWave />}
        <LoadingDots />

        {/* Agrokart branding */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 40,
            color: 'text.secondary',
            fontSize: '0.75rem',
            opacity: 0.7,
            animation: 'fadeIn 1s ease 2s both',
            '@keyframes fadeIn': {
              '0%': { opacity: 0 },
              '100%': { opacity: 0.7 }
            }
          }}
        >
          🌾 Agrokart - Connecting Agriculture • v1.0.0
        </Typography>
      </Box>
    </Fade>
  );
};

export default AgrokartLoader;