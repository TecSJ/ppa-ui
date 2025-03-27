import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes de Estudio',
  description: 'Planes de Estudio Xura',
};

export default function PlanesLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
