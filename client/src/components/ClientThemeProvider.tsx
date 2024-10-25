// components/ClientThemeProvider.tsx
'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif', // Override the default font for all text
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto , sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto , sans-serif',
        },
      },
    },
  },
});

const ClientThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Only render ThemeProvider after the component has mounted
  }, []);

  if (!mounted) {
    return null; // Don't render on the server
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ClientThemeProvider;
