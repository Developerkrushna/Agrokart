import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const SearchSuggestions = ({ onSuggestionClick, currentSearch }) => {
  const theme = useTheme();
  
  // Popular search terms
  const popularSearches = [
    { term: 'urea', count: 245 },
    { term: 'dap fertilizer', count: 189 },
    { term: 'npk', count: 156 },
    { term: 'organic compost', count: 134 },
    { term: 'potash', count: 98 },
    { term: 'zinc sulphate', count: 76 },
    { term: 'calcium nitrate', count: 54 },
    { term: 'magnesium sulphate', count: 43 }
  ];

  // Recent searches from localStorage
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing recent searches:', error);
      }
    }
  }, []);

  // Save search to recent searches
  const saveSearch = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return;
    
    const updated = [
      searchTerm,
      ...recentSearches.filter(term => term !== searchTerm)
    ].slice(0, 5); // Keep only last 5 searches
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle suggestion click
  const handleSuggestionClick = (term) => {
    saveSearch(term);
    onSuggestionClick(term);
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Recent Searches
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {recentSearches.map((term, index) => (
              <Chip
                key={index}
                label={term}
                variant="outlined"
                size="small"
                onClick={() => handleSuggestionClick(term)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                  }
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {/* Popular Searches */}
      <Paper sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.02) }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <TrendingIcon sx={{ fontSize: 16, color: 'success.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Popular Searches
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {popularSearches.slice(0, 6).map((search, index) => (
            <Chip
              key={index}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>{search.term}</span>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    ({search.count})
                  </Typography>
                </Box>
              }
              variant="outlined"
              size="small"
              color="success"
              onClick={() => handleSuggestionClick(search.term)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha(theme.palette.success.main, 0.1)
                }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Search Tips */}
      <Paper sx={{ p: 2, mt: 2, bgcolor: alpha(theme.palette.info.main, 0.02) }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Search Tips
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          • Try searching by product name (e.g., "urea", "dap")<br />
          • Search by category (e.g., "organic", "nitrogen")<br />
          • Search by brand name<br />
          • Use specific terms for better results
        </Typography>
      </Paper>
    </Box>
  );
};

export default SearchSuggestions;
