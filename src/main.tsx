import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from '@aws-amplify/ui-react';
import App from "./App.tsx";
import theme from './theme.ts';
import { CssBaseline, ThemeProvider, Box, Typography, Paper } from '@mui/material';
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Authenticator hideSignUp
       components={{
        Header() {
          return (
            <Paper
              elevation={3}
              sx={{
                textAlign: 'center',
                marginTop: 5,
                marginBottom: 3,
                padding: 3,
                backgroundColor: 'primary.main',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
                Attendance System Admin Portal
              </Typography>
            </Paper>
          );
        },
        Footer() {
          return (
            <Box
              sx={{
                textAlign: 'center',
                marginTop: 3,
                padding: 2,
                color: 'text.secondary',
                fontSize: '0.9rem',
              }}
            >
              <Typography variant="body2">
                © {new Date().getFullYear()} Attendnace System Admin Portal. All rights reserved.
              </Typography>
            </Box>
          );
        },
      }}
    >
      <App />
    </Authenticator>
  </ThemeProvider>
  </React.StrictMode >
);
