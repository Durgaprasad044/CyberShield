import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <ShieldIcon sx={{ mr: 2, animation: 'float 4s ease-in-out infinite' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Cyber Shield
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/email-scanner"
          >
            Email Scanner
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/website-scanner"
          >
            Website Scanner
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/contact"
          >
            Contact
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 