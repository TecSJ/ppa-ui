'use client';

import { TablePlanes } from '@/app/components/planes';
import { AnimatedPaper } from '@/app/shared/common';

export default function Home() {
  return (
    <AnimatedPaper title='Planes de Estudio'>
      <TablePlanes />
    </AnimatedPaper>
  );
}
