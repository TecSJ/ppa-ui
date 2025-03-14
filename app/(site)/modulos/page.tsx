import { Typography } from '@mui/material';
import { TableModulos } from '@/app/components/modulos';
import AnimatedPaper from '@/app/shared/common/Papers/AnimatedPaper';

export default function ModulosPage() {
  return (
    <AnimatedPaper>
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        align='left'
        sx={{ userSelect: 'none' }}
      >
        Módulos
      </Typography>
      <TableModulos />
    </AnimatedPaper>
  );
}
