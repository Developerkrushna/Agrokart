import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  useTheme,
  Stack,
  Chip,
  Fade,
  Slide,
  Grow,
  alpha,
  IconButton,
  keyframes
} from '@mui/material';
import {
  LocalShipping,
  ShoppingCart,
  ArrowForward,
  Agriculture,
  Speed,
  Biotech,
  Nature, // Changed from Eco to Nature
  Insights,
  Groups,
  Star,
  PlayArrow,
  AutoAwesome
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../components/WorkflowManager';
import ProductList from '../components/ProductList';

// Add CSS animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
  40% { transform: translateY(-10px) translateX(-50%); }
  60% { transform: translateY(-5px) translateX(-50%); }
`;

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Punjab",
    text: "Agrokart has transformed my farming. Quality fertilizers delivered on time!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Maharashtra",
    text: "Excellent service and genuine products. My crop yield increased by 30%!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    name: "Suresh Patel",
    location: "Gujarat",
    text: "Fast delivery and expert advice. Highly recommend Agrokart!",
    rating: 5,
    avatar: "https://randomuser.me/api/portraits/men/68.jpg"
  }
];

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { transitionTo, WORKFLOW_STEPS } = useWorkflow();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotate testimonials every 5 seconds
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Modern Hero Section */}
      <Box
        sx={{
          width: '100vw',
          minWidth: '100vw',
          position: 'relative',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          minHeight: { xs: '80vh', md: '90vh' },
          background: `linear-gradient(135deg, ${alpha('#1565C0', 0.95)} 0%, ${alpha('#0D47A1', 0.9)} 50%, ${alpha('#1976D2', 0.85)} 100%), url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop') center/cover`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}-
      >
        {/* Animated Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
            animation: `${float} 6s ease-in-out infinite`
          }}
        />
        
        {/* Floating Particles */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '10%',
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.6)',
            animation: `${float} 4s ease-in-out infinite 0.5s`
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            right: '15%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.4)',
            animation: `${float} 5s ease-in-out infinite 1s`
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '30%',
            left: '20%',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            animation: `${float} 6s ease-in-out infinite 2s`
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={1000}>
                <Box>
                  {/* Badge */}
                  <Chip
                    icon={<AutoAwesome />}
                    label="Trusted by 10,000+ Farmers Across India"
                    sx={{
                      mb: 3,
                      bgcolor: alpha('#fff', 0.15),
                      color: '#fff',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontSize: '0.875rem',
                      px: 2,
                      py: 0.5
                    }}
                  />

                  {/* Main Heading */}
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2.75rem', md: '4.5rem' },
                      lineHeight: 1.1,
                      color: '#fff',
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Professional
                    <br />
                    <Box component="span" sx={{
                      background: 'linear-gradient(135deg, #FFE500 0%, #FFC107 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      Agriculture Solutions
                    </Box>
                  </Typography>
                  
                  {/* Subtitle */}
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      fontWeight: 400,
                      opacity: 0.95,
                      lineHeight: 1.6,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    Premium fertilizers and agricultural solutions delivered with precision and care.
                    Empowering farmers with quality products and expert guidance for sustainable growth.
                  </Typography>
                  
                  {/* CTA Buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={() => transitionTo(WORKFLOW_STEPS.BROWSE_PRODUCTS)}
                      sx={{
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(46, 125, 50, 0.3)',
                        textTransform: 'none',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(46, 125, 50, 0.4)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Explore Products
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrow />}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.6)',
                        color: '#fff',
                        fontWeight: 600,
                        px: 4,
                        textTransform: 'none',
                        borderWidth: 2,
                        py: 1.5,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: '#fff',
                          bgcolor: alpha('#fff', 0.1),
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                  
                  {/* Stats */}
                  <Stack direction="row" spacing={4} sx={{ mt: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFE500' }}>
                        10K+
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Happy Farmers
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFE500' }}>
                        24h
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Fast Delivery
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#FFE500' }}>
                        100%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Quality Assured
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Slide direction="left" in={isVisible} timeout={1200}>
                <Box sx={{ position: 'relative' }}>
                  {/* Hero Image/Illustration */}
                  <Box
                    sx={{
                      width: '100%',
                      height: { xs: 300, md: 500 },
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      borderRadius: 4,
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Floating Elements */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        bgcolor: alpha('#fff', 0.9),
                        borderRadius: 2,
                        p: 2,
                        animation: `${float} 3s ease-in-out infinite`
                      }}
                    >
                      <Agriculture sx={{ color: theme.palette.primary.main, fontSize: 40 }} />
                    </Box>
                    
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 30,
                        left: 30,
                        bgcolor: alpha('#fff', 0.9),
                        borderRadius: 2,
                        p: 2,
                        animation: `${float} 3s ease-in-out infinite 1s`
                      }}
                    >
                      <Speed sx={{ color: theme.palette.secondary.main, fontSize: 40 }} />
                    </Box>
                    
                    {/* Central Icon */}
                    <Box
                      sx={{
                        bgcolor: alpha('#fff', 0.9),
                        borderRadius: '50%',
                        p: 4,
                        animation: `${pulse} 2s ease-in-out infinite`
                      }}
                    >
                      <Agriculture sx={{ color: theme.palette.success.main, fontSize: 80 }} />
                    </Box>
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
        
        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            animation: `${bounce} 2s infinite`
          }}
        >
          <IconButton sx={{ color: '#fff', opacity: 0.7 }}>
            <ArrowForward sx={{ transform: 'rotate(90deg)' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.grey[100], 0.5), py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Featured Products
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Premium fertilizers for every crop and season
            </Typography>
          </Box>

          <ProductList />

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => transitionTo(WORKFLOW_STEPS.BROWSE_PRODUCTS)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                },
                transition: 'all 0.3s ease'
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Modern Features Section - Why Choose Agrokart? */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Fade in={isVisible} timeout={1500}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Why Choose Agrokart?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              We're revolutionizing agriculture with technology, quality, and trust
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {[
            {
              icon: <Biotech sx={{ fontSize: 50 }} />,
              title: "Advanced Agricultural Technology",
              description: "Cutting-edge solutions powered by AI and data analytics for precision farming",
              color: theme.palette.primary.main,
              gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`
            },
            {
              icon: <Nature sx={{ fontSize: 50 }} />, // Changed from Eco to Nature
              title: "Sustainable & Organic",
              description: "Eco-friendly products that promote sustainable farming practices",
              color: theme.palette.success.main,
              gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
            },
            {
              icon: <Insights sx={{ fontSize: 50 }} />,
              title: "Data-Driven Insights",
              description: "Get personalized recommendations based on soil analysis and weather patterns",
              color: theme.palette.secondary.main,
              gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in={isVisible} timeout={1000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: `1px solid ${alpha(feature.color, 0.1)}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                      '& .feature-bg': {
                        opacity: 0.1,
                      }
                    }
                  }}
                >
                  {/* Background Gradient */}
                  <Box
                    className="feature-bg"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: feature.gradient,
                      opacity: 0.05,
                      transition: 'opacity 0.3s ease'
                    }}
                  />

                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 2 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 3,
                        background: alpha(feature.color, 0.1),
                        color: feature.color,
                        mb: 3,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05), py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ textAlign: 'center' }}>
            {[
              { number: '10,000+', label: 'Happy Farmers', icon: <Groups /> },
              { number: '50,000+', label: 'Orders Delivered', icon: <LocalShipping /> },
              { number: '24hrs', label: 'Average Delivery', icon: <Speed /> },
              { number: '99.9%', label: 'Customer Satisfaction', icon: <Star /> }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Grow in={isVisible} timeout={1500 + index * 100}>
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mb: 2
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
                      {stat.number}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            What Our Farmers Say
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Real stories from real farmers who trust Agrokart
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <Fade in={isVisible} timeout={2000 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    p: 3,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`
                    }
                  }}
                >
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                      ))}
                    </Stack>
                    <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                      "{testimonial.text}"
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          background: `url(${testimonial.avatar}) center/cover`,
                          border: `2px solid ${theme.palette.primary.main}`
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: '#fff',
          py: 8
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Transform Your Farming?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of farmers who trust Agrokart for their fertilizer needs
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => transitionTo(WORKFLOW_STEPS.BROWSE_PRODUCTS)}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: '#FFFFFF',
                fontWeight: 700,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                borderRadius: 3,
                boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                  color: '#FFFFFF'
                }
              }}
            >
              Start Shopping
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#fff',
                color: '#fff',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: alpha('#fff', 0.1)
                }
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;