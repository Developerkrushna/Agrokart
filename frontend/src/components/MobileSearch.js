import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  History,
  TrendingUp,
  LocationOn,
  Category
} from '@mui/icons-material';
import { useMobile } from '../context/MobileContext';

const MobileSearch = ({
  onSearch,
  onFilterChange,
  categories = [],
  recentSearches = [],
  popularSearches = [],
  showLocationFilter = true,
  showPriceFilter = true
}) => {
  const { vibrate, getCurrentLocation, showToast } = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 10000],
    location: '',
    inStock: true,
    sortBy: 'relevance'
  });

  const handleSearch = async (term = searchTerm) => {
    if (term.trim()) {
      await vibrate('light');
      setShowSuggestions(false);
      if (onSearch) {
        onSearch(term, filters);
      }
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    await vibrate('light');
    setSearchTerm(suggestion);
    await handleSearch(suggestion);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleLocationDetect = async () => {
    try {
      await vibrate('light');
      const location = await getCurrentLocation();
      if (location) {
        // Convert coordinates to location name (you'd use a geocoding service)
        const locationName = `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
        handleFilterChange('location', locationName);
        await showToast('Location detected');
      }
    } catch (error) {
      console.error('Location detection error:', error);
      await showToast('Failed to detect location');
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: [0, 10000],
      location: '',
      inStock: true,
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) {
      return value[0] !== 0 || value[1] !== 10000;
    }
    return value && value !== 'relevance' && value !== true;
  }).length;

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="Search for products..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(e.target.value.length > 0);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        onFocus={() => setShowSuggestions(searchTerm.length > 0)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {searchTerm && (
                <IconButton onClick={handleClearSearch} size="small">
                  <Clear />
                </IconButton>
              )}
              <IconButton 
                onClick={() => setShowFilters(true)}
                color={activeFiltersCount > 0 ? 'primary' : 'default'}
              >
                <FilterList />
                {activeFiltersCount > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -2,
                      right: -2,
                      minWidth: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      color: 'white',
                      fontSize: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {activeFiltersCount}
                  </Box>
                )}
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper'
          }
        }}
      />

      {/* Active Filters Chips */}
      {activeFiltersCount > 0 && (
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {filters.category && (
            <Chip
              label={`Category: ${filters.category}`}
              size="small"
              onDelete={() => handleFilterChange('category', '')}
            />
          )}
          {filters.location && (
            <Chip
              label={`Location: ${filters.location}`}
              size="small"
              onDelete={() => handleFilterChange('location', '')}
            />
          )}
          {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) && (
            <Chip
              label={`₹${filters.priceRange[0]}-₹${filters.priceRange[1]}`}
              size="small"
              onDelete={() => handleFilterChange('priceRange', [0, 10000])}
            />
          )}
          <Chip
            label="Clear All"
            size="small"
            variant="outlined"
            onClick={clearAllFilters}
          />
        </Box>
      )}

      {/* Search Suggestions */}
      {showSuggestions && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            mt: 1,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            borderRadius: 2
          }}
        >
          <List>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <>
                <ListItem>
                  <ListItemIcon>
                    <History />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Recent Searches" 
                    primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                  />
                </ListItem>
                {recentSearches.slice(0, 3).map((search, index) => (
                  <ListItem
                    key={`recent-${index}`}
                    button
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <ListItemText primary={search} />
                  </ListItem>
                ))}
                <Divider />
              </>
            )}

            {/* Popular Searches */}
            {popularSearches.length > 0 && (
              <>
                <ListItem>
                  <ListItemIcon>
                    <TrendingUp />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Popular Searches" 
                    primaryTypographyProps={{ variant: 'subtitle2', fontWeight: 'bold' }}
                  />
                </ListItem>
                {popularSearches.slice(0, 5).map((search, index) => (
                  <ListItem
                    key={`popular-${index}`}
                    button
                    onClick={() => handleSuggestionClick(search)}
                  >
                    <ListItemText primary={search} />
                  </ListItem>
                ))}
              </>
            )}
          </List>
        </Paper>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={showFilters}
        onClose={() => setShowFilters(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Filters
          </Typography>

          {/* Category Filter */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price Range Filter */}
          {showPriceFilter && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Price Range (₹)
              </Typography>
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                marks={[
                  { value: 0, label: '₹0' },
                  { value: 5000, label: '₹5K' },
                  { value: 10000, label: '₹10K' }
                ]}
              />
            </Box>
          )}

          {/* Location Filter */}
          {showLocationFilter && (
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleLocationDetect}>
                        <LocationOn />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}

          {/* Stock Filter */}
          <FormControlLabel
            control={
              <Switch
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              />
            }
            label="In Stock Only"
            sx={{ mb: 3 }}
          />

          {/* Sort By */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Rating</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
            </Select>
          </FormControl>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={clearAllFilters}
              sx={{ flex: 1 }}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowFilters(false)}
              sx={{ flex: 1 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MobileSearch;