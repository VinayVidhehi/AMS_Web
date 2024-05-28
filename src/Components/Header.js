import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        width: '100%',
        paddingBottom: 2,
        paddingTop:4,
        backgroundColor: '#ff4c24',
        marginX: 0,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" component="h1" fontWeight="bold" color="white">
        Attendance Management System
      </Typography>
    </Box>
  );
};

export default Header;
