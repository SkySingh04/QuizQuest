import { createTheme } from '@mui/material/styles';
const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#FFFFFF', // White background in light mode
      },
      text: {
        primary: '#000', // Black text in light mode
      },
      // ... other light theme properties
    },
  });
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#000000', // Black background in dark mode
      },
      text: {
        primary: '#FFFFFF', // White text in dark mode
      },
      // ... other dark theme properties
    },
  });

    export {lightTheme, darkTheme};