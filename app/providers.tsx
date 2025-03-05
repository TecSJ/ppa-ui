'use client';

import { ReactNode } from 'react';
import { CssBaseline } from '@mui/material';
import AuthProvider from '@/app/context/AuthProvider';
import PermissionsProvider from '@/app/context/PermissionsProvider';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/app/shared/themes/fontTheme';
import { SessionProvider } from 'next-auth/react';
import { MainLay } from '@/app/shared/layout';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <PermissionsProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <MainLay>
              {children}
            </MainLay>
          </ThemeProvider>
        </PermissionsProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
