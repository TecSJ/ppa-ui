'use client';

import React from 'react';
import { useTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import theme from '@/app/shared/themes/fontTheme';
import CardTemplate from './CardTemplate';

function CardClient(props: any) {
  const tema = useTheme();
  return <CardTemplate theme={tema} {...props} />;
}

function CardTemplateClient(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <CardClient {...props} />
    </ThemeProvider>
  );
}

export default CardTemplateClient;
