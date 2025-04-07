import { TableProgramas } from '@/app/components/programas';
import AnimatedPaper from '@/app/shared/common/Papers/AnimatedPaper';

export default function ModulosPage() {
  return (
    <AnimatedPaper title='Programas'>
      <TableProgramas />
    </AnimatedPaper>
  );
}