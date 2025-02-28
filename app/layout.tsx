import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Providers from '@/app/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Xura',
  description: 'Control Escolar Xura TSJ',
  keywords: ['login, tsj'],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
