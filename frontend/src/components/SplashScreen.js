import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SplashScreen = ({ onComplete }) => {
  const theme = useTheme();
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start logo animation immediately
    setShowLogo(true);
    
    // Show text after logo appears
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 300);

    // Start fade out after 2.2 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    // Complete splash screen after 2.5 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <Fade in={!fadeOut} timeout={300}>
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
            opacity: 0.05,
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(22, 163, 74, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(22, 163, 74, 0.05) 0%, transparent 50%)
            `
          }}
        />

        {/* Logo Container */}
        <Fade in={showLogo} timeout={500}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transform: showLogo ? 'scale(1)' : 'scale(0.8)',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Logo Image */}
            <Box
              sx={{
                width: { xs: 120, sm: 140 },
                height: { xs: 120, sm: 140 },
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #16A34A 0%, #8B5CF6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(22, 163, 74, 0.3)',
                mb: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Logo Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 50%),
                    radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)
                  `
                }}
              />
              
              {/* Logo Icon/Text */}
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', sm: '3rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                🌾
              </Typography>
            </Box>

            {/* Brand Text */}
            <Fade in={showText} timeout={500}>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.2rem', sm: '2.8rem' },
                      color: '#6A1B9A', // Purple matching the image
                      letterSpacing: '0.02em',
                      textAlign: 'center'
                    }}
                  >
                    Agri
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '2.2rem', sm: '2.8rem' },
                      color: '#FF5722', // Orange matching the image
                      letterSpacing: '0.02em',
                      textAlign: 'center'
                    }}
                  >
                    Net
                  </Typography>
                </Box>
                
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: '#6B7280',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    opacity: showText ? 1 : 0,
                    transform: showText ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.5s ease 0.2s'
                  }}
                >
                  Premium fertilizers delivered to your farm
                </Typography>
              </Box>
            </Fade>
          </Box>
        </Fade>

        {/* Loading Dots Animation */}
        <Fade in={showText} timeout={500}>
          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 80, sm: 100 },
              display: 'flex',
              gap: 1,
              opacity: showText ? 1 : 0,
              transition: 'opacity 0.5s ease 0.4s'
            }}
          >
            {[0, 1, 2].map((index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #16A34A 0%, #8B5CF6 100%)',
                  animation: `pulse 1.5s ease-in-out ${index * 0.2}s infinite`,
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 0.4,
                      transform: 'scale(1)'
                    },
                    '50%': {
                      opacity: 1,
                      transform: 'scale(1.2)'
                    }
                  }
                }}
              />
            ))}
          </Box>
        </Fade>

        {/* Version Text */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 20,
            color: '#9CA3AF',
            fontSize: '0.75rem',
            opacity: showText ? 0.7 : 0,
            transition: 'opacity 0.5s ease 0.6s'
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Fade>
  );
};

export default SplashScreen;
