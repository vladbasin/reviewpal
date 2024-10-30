import { createTheme } from '@mui/material';
import darkScrollbar from '@mui/material/darkScrollbar';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#252525',
    },
    primary: {
      light: '#ffd877',
      main: '#d4a748',
      dark: '#9f7817',
      contrastText: '#000000',
    },
    secondary: {
      main: '#6d6d6d',
      light: '#4d4d4d',
      dark: '#4d4d4d',
      contrastText: '#000000',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(),
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'large',
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          marginBottom: 6,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        secondary: {
          fontSize: '1rem',
        },
      },
    },
  },
});
