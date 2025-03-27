'use client';

import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import AuthProvider from '@/app/context/AuthProvider';
import PermissionsProvider from '@/app/context/PermissionsProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/shared/themes/fontTheme';
import { SessionProvider } from 'next-auth/react';
import { MainLay } from '@/app/shared/layout';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <PermissionsProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MainLay>
                {children}
              </MainLay>
            </LocalizationProvider>
          </ThemeProvider>
        </PermissionsProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
