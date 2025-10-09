import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9fafb', // very light gray
      paper: '#ffffff',
    },
    primary: {
      main: '#8ecae6', // pastel blue
      light: '#bde0fe',
      dark: '#6096ba',
      contrastText: '#073b4c',
    },
    secondary: {
      main: '#ffb3c1', // pastel pink
      light: '#ffdce2',
      dark: '#e295ad',
      contrastText: '#4a4a4a',
    },
    success: {
      main: '#b9e28c', // pastel green
    },
    warning: {
      main: '#ffd166', // soft amber
    },
    info: {
      main: '#a0c4ff', // soft sky
    },
    error: {
      main: '#ffadad', // soft red
    },
    text: {
      primary: '#2d2d2d',
      secondary: '#555',
    },
    divider: 'rgba(0,0,0,0.08)'
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#ffffff',
          color: '#2d2d2d',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

export default theme;