import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ofertas',
  description: 'Ofertas Xura',
};

export default function OfertasLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
