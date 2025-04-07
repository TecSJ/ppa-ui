import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Programas',
  description: 'Programas Xura',
};

export default function ProgramasLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}