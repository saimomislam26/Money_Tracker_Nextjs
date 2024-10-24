import { createTheme } from "@mui/material";

const theme = createTheme({
    typography: {
      fontFamily: 'Roboto Mono, monospace', // Override the default font for all text
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Roboto Mono, monospace',
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'Roboto Mono, monospace',
          },
        },
      },
    },
  });

  export default theme
  