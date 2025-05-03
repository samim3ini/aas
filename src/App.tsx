import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import AttendanceAnalytics from './pages/AttendanceAnalytics';

function App() {
  const { signOut } = useAuthenticator();
  const [currentPage, setCurrentPage] = useState('employeeManagement'); // State for the current page

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut();
    }
  };

  // Function to render the current page
  const renderPage = () => {
    switch (currentPage) {
      case 'employeeManagement':
        return <EmployeeManagement />;
      case 'attendanceManagement':
        return <AttendanceManagement />;
      case 'attendanceAnalytics':
        return <AttendanceAnalytics />;
      default:
        return <div>Page Not Found</div>;
    }
  };

  return (
    <>
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
              onClick={() => setCurrentPage('employeeManagement')} // Change page
              sx={{
                minWidth: '100px',
                '&.active': { fontWeight: 'bold', textDecoration: 'underline' },
              }}
            >
              Employee Management
            </Button>
            <Button
              color="inherit"
              onClick={() => setCurrentPage('attendanceManagement')} // Change page
              sx={{
                minWidth: '100px',
                '&.active': { fontWeight: 'bold', textDecoration: 'underline' },
              }}
            >
              Attendance Management
            </Button>
            <Button
              color="inherit"
              onClick={() => setCurrentPage('attendanceAnalytics')} // Change page
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
        {renderPage()} {/* Render the current page */}
      </Container>
    </>
  );
}

export default App;