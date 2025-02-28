'use client';

import { createTheme } from '@mui/material/styles';
import { madaniArabicRegular, madaniArabicSemiBold } from '@/public/assets/fonts';

const theme = createTheme({
  typography: {
    fontFamily: madaniArabicRegular.style.fontFamily,
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: madaniArabicRegular.style.fontFamily,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: madaniArabicRegular.style.fontFamily,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: madaniArabicSemiBold.style.fontFamily,
          textTransform: 'none',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontFamily: madaniArabicRegular.style.fontFamily,
        },
      },
    },
  },
});

export default theme;
