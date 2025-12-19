import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Language as LanguageIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useLanguage } from '../context/LanguageContext';

const LanguageSelector = ({ variant = 'button', size = 'medium' }) => {
  const theme = useTheme();
  const { currentLanguage, languages, changeLanguage, getCurrentLanguageInfo } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode);
    handleClose();
  };

  const currentLangInfo = getCurrentLanguageInfo();

  // Compact chip variant for mobile/small spaces
  if (variant === 'chip') {
    return (
      <>
        <Chip
          icon={<LanguageIcon />}
          label={currentLangInfo.nativeName}
          onClick={handleClick}
          size={size}
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.25)',
            },
            '& .MuiChip-icon': {
              color: '#FFFFFF'
            }
          }}
        />
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              minWidth: 150
            }
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={language.code === currentLanguage}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: 1,
                mx: 0.5,
                mb: 0.5,
                '&:last-child': { mb: 0 }
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                {language.code === currentLanguage && (
                  <CheckIcon color="primary" fontSize="small" />
                )}
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" fontWeight={language.code === currentLanguage ? 600 : 400}>
                  {language.nativeName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {language.name}
                </Typography>
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  // Default button variant
  return (
    <>
      <Button
        color="inherit"
        startIcon={<LanguageIcon />}
        endIcon={<ExpandMoreIcon />}
        onClick={handleClick}
        size={size}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 1,
          px: 2,
          bgcolor: 'rgba(255,255,255,0.08)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.12)',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="caption" sx={{ lineHeight: 1, opacity: 0.8 }}>
            Language
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1, fontWeight: 600 }}>
            {currentLangInfo.nativeName}
          </Typography>
        </Box>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: 200
          }
        }}
      >
        <Box sx={{ px: 2, py: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle2" color="text.secondary">
            Select Language
          </Typography>
        </Box>
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === currentLanguage}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: 1,
              mx: 0.5,
              mb: 0.5,
              '&:last-child': { mb: 0 }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {language.code === currentLanguage && (
                <CheckIcon color="primary" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2" fontWeight={language.code === currentLanguage ? 600 : 400}>
                {language.nativeName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {language.name}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
