import { BrowserRouter as Router } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react';
import AppRoutes from './Routes';

function App() {
  const { signOut } = useAuthenticator();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut();
    }
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar
          sx={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              textAlign: { xs: 'center', sm: 'left' },
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            <Box
              sx={{
                display: 'inline-block',
                padding: '8px 16px',
                border: '2px solid',
                borderColor: 'primary.main',
                borderRadius: '8px',
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 2,
              }}
            >
              Attendance System Admin Portal
            </Box>
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              justifyContent: { xs: 'center', sm: 'flex-end' },
              overflowX: 'auto',
            }}
          >
            <Button
              color="inherit"
              component="a"
              href="/"
              sx={{
                minWidth: '100px',
                '&.active': { fontWeight: 'bold', textDecoration: 'underline' },
              }}
            >
              Employee Management
            </Button>
            <Button
              color="inherit"
              component="a"
              href="/attendance"
              sx={{
                minWidth: '100px',
                '&.active': { fontWeight: 'bold', textDecoration: 'underline' },
              }}
            >
              Attendance Management
            </Button>
            <Button
              color="inherit"
              component="a"
              href="/analytics"
              sx={{
                minWidth: '100px',
                '&.active': { fontWeight: 'bold', textDecoration: 'underline' },
              }}
            >
              Attendance Analytics
            </Button>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                minWidth: '100px',
                bgcolor: 'secondary.light',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.dark' },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 4 }}>
        <AppRoutes />
      </Container>
    </Router>
  );
}

export default App;