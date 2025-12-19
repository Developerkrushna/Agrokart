import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Fab,
  useTheme
} from '@mui/material';
import {
  Engineering as LaborIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const MobileLaborPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openBooking, setOpenBooking] = useState(false);
  const [selectedLabor, setSelectedLabor] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    date: '',
    duration: '',
    description: '',
    location: ''
  });

  // Sample labor data
  const laborers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      category: 'Farm Worker',
      experience: '5 years',
      rating: 4.5,
      reviews: 23,
      hourlyRate: 150,
      location: 'Pune, Maharashtra',
      skills: ['Plowing', 'Harvesting', 'Irrigation'],
      available: true,
      image: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Suresh Patil',
      category: 'Tractor Operator',
      experience: '8 years',
      rating: 4.8,
      reviews: 45,
      hourlyRate: 300,
      location: 'Nashik, Maharashtra',
      skills: ['Tractor Operation', 'Land Preparation', 'Spraying'],
      available: true,
      image: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'Amit Singh',
      category: 'Pesticide Specialist',
      experience: '6 years',
      rating: 4.6,
      reviews: 31,
      hourlyRate: 200,
      location: 'Aurangabad, Maharashtra',
      skills: ['Pest Control', 'Spraying', 'Crop Protection'],
      available: false,
      image: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: 'Ganesh Jadhav',
      category: 'Harvesting Expert',
      experience: '10 years',
      rating: 4.9,
      reviews: 67,
      hourlyRate: 180,
      location: 'Kolhapur, Maharashtra',
      skills: ['Manual Harvesting', 'Crop Handling', 'Post-harvest'],
      available: true,
      image: '/api/placeholder/60/60'
    }
  ];

  const categories = [
    'all',
    'Farm Worker',
    'Tractor Operator',
    'Pesticide Specialist',
    'Harvesting Expert',
    'Irrigation Specialist'
  ];

  const filteredLaborers = laborers.filter(laborer => {
    const matchesSearch = laborer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         laborer.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || laborer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBookLabor = (laborer) => {
    setSelectedLabor(laborer);
    setOpenBooking(true);
  };

  const handleBookingSubmit = () => {
    // Handle booking submission
    console.log('Booking submitted:', { laborer: selectedLabor, details: bookingDetails });
    setOpenBooking(false);
    setBookingDetails({ date: '', duration: '', description: '', location: '' });
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#2E7D32" gutterBottom>
          Find Agricultural Labor
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Connect with skilled agricultural workers in your area
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          }}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Labor Cards */}
      <Grid container spacing={2}>
        {filteredLaborers.map((laborer) => (
          <Grid item xs={12} key={laborer.id}>
            <Card 
              sx={{ 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                opacity: laborer.available ? 1 : 0.7
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    src={laborer.image}
                    sx={{ width: 60, height: 60, mr: 2, bgcolor: '#4CAF50' }}
                  >
                    <LaborIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {laborer.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="500">
                      {laborer.category}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Rating value={laborer.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {laborer.rating} ({laborer.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{laborer.hourlyRate}/hr
                    </Typography>
                    <Chip 
                      label={laborer.available ? 'Available' : 'Busy'} 
                      color={laborer.available ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Experience: {laborer.experience}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {laborer.location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {laborer.skills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!laborer.available}
                  onClick={() => handleBookLabor(laborer)}
                  sx={{
                    bgcolor: '#4CAF50',
                    '&:hover': { bgcolor: '#45a049' }
                  }}
                >
                  {laborer.available ? 'Book Now' : 'Not Available'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={openBooking} onClose={() => setOpenBooking(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Book {selectedLabor?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              value={bookingDetails.date}
              onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Duration (hours)"
              type="number"
              value={bookingDetails.duration}
              onChange={(e) => setBookingDetails({...bookingDetails, duration: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Work Description"
              multiline
              rows={3}
              value={bookingDetails.description}
              onChange={(e) => setBookingDetails({...bookingDetails, description: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Work Location"
              value={bookingDetails.location}
              onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBooking(false)}>Cancel</Button>
          <Button 
            onClick={handleBookingSubmit} 
            variant="contained"
            sx={{ bgcolor: '#4CAF50' }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MobileLaborPage;
