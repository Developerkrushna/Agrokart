import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { ShoppingBag as OrderIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const OrdersFloatingButton = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="My Orders" placement="left">
      <Fab
        color="primary"
        onClick={() => navigate('/my-orders')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: 'linear-gradient(135deg, #2874f0 0%, #1565c0 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(40, 116, 240, 0.3)',
        }}
      >
        <OrderIcon />
      </Fab>
    </Tooltip>
  );
};

export default OrdersFloatingButton;
