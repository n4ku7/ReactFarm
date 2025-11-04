import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    // Off-white canvas with subtle green tint
    background: { default: '#fafbf7', paper: '#ffffff' },
    // Farm complements: forest green primary, amber secondary, sky info, soil accents
    primary: { main: '#2e7d32', contrastText: '#ffffff' },
    secondary: { main: '#fbc02d', contrastText: '#3e2723' },
    success: { main: '#66bb6a' },
    warning: { main: '#fb8c00' },
    info: { main: '#64b5f6' },
    error: { main: '#e57373' },
    // Neutral text tuned for off-white
    text: { primary: '#243224', secondary: '#5a6a5a' },
    divider: 'rgba(36,66,36,0.12)'
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Roboto, system-ui, -apple-system, Segoe UI, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#ffffff',
          color: '#243224',
          boxShadow: '0 1px 2px rgba(36,66,36,0.06)'
        }
      }
    },
    MuiButton: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 12 } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 8 } } }
  }
})

export default theme