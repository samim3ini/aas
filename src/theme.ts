import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#326989' },
    secondary: { main: 'rgb(223, 0, 78)' },
    text: { primary: '#000000', secondary: '#ffffff' },
    background: { default: '#F5F5F5', paper: 'rgb(215, 215, 215)' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg,#f4f6f8 0%, #326989 100%)',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

export default theme;
