import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useAuthenticator } from '@aws-amplify/ui-react'; // Import useAuthenticator
import AttendanceManagement from './pages/AttendanceManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import AttedndanceAnalytics from './pages/AttednanceAnalytics';

function App() {
  const { signOut } = useAuthenticator(); // Extract signOut from useAuthenticator

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      signOut(); // Call the signOut function
    }
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        {/* Material-UI AppBar */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 2 }}>
              Attendance System Admin Portal
            </Typography>
            {/* Navigation Links */}
            <Box
              sx={{
                display: 'flex',
                gap: 2, // Space between buttons
              }}
            >
              <Box
                sx={{
                  padding: 1,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'primary.light',
                }}
              >
                <Button color="inherit" component={Link} to="/">
                  Employee Management
                </Button>
              </Box>
              <Box
                sx={{
                  padding: 1,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'primary.light',
                }}
              >
                <Button color="inherit" component={Link} to="/attendance">
                  Attendance Management
                </Button>
              </Box>
              <Box
                sx={{
                  padding: 1,
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  backgroundColor: 'primary.light',
                }}
              >
                <Button color="inherit" component={Link} to="/analytics">
                  Attendance Analytics
                </Button>
              </Box>
              {/* Logout Button Highlighted in a Box */}
              <Box
                sx={{
                  padding: 1,
                  border: '1px solid',
                  borderColor: 'secondary.main',
                  borderRadius: 2,
                  backgroundColor: 'secondary.light',
                  marginLeft: 'auto', // Push to the right
                }}
              >
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ color: 'white' }}
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {/* Main Content Area */}
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<EmployeeManagement />} />
          <Route path="/attendance" element={<AttendanceManagement />} />
          <Route path="/analytics" element={<AttedndanceAnalytics />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
