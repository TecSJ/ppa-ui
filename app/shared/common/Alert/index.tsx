'use client';

import {
  Alert, Snackbar, Slide, SlideProps, AlertTitle,
} from '@mui/material';

interface SnackAlertProps {
  open: boolean;
  close: () => void;
  type: 'error' | 'warning' | 'info' | 'success';
  mensaje?: string;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction='left' />;
}

const alertTitles = {
  error: 'Error',
  warning: 'Precaución',
  info: 'Información',
  success: 'Completado',
} as const;

export default function SnackAlert({
  open,
  close,
  type,
  mensaje = '',
}: SnackAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={close}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideTransition}
    >
      <Alert variant='filled' onClose={close} severity={type} sx={{ width: '100%' }}>
        <AlertTitle>{alertTitles[type]}</AlertTitle>
        {mensaje}
      </Alert>
    </Snackbar>
  );
}
