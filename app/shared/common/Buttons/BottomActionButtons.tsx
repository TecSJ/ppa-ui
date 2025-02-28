'use client';

import { Box, Button } from '@mui/material';
import { FileUploadOutlined, FileDownloadOutlined } from '@mui/icons-material';
import { madaniArabicRegular } from '@/public/assets/fonts';

export default function BottomActionButtons() {
  const customButtonStyles = {
    borderRadius: '20px', // Redondeo de los bordes
    color: 'rgb(50, 22, 155)', // Color del texto y los íconos
    textTransform: 'capitalize',
    borderColor: 'rgb(50, 22, 155)', // Color del borde
    '&:hover': {
      backgroundColor: 'rgba(50, 22, 155, 0.08)', // Ligero fondo al hacer hover
      borderColor: 'rgb(50, 22, 155)', // Mantiene el color del borde en hover
    },
  };

  const handleAction = (action: string) => {
    console.log(`${action} clickeado`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 2,
        marginTop: 2,
      }}
    >
      <Button
        variant='outlined'
        startIcon={<FileUploadOutlined />}
        sx={customButtonStyles}
        className={madaniArabicRegular.className}
        onClick={() => handleAction('Subir')}
      >
        Subir
      </Button>
      <Button
        variant='outlined'
        startIcon={<FileDownloadOutlined />}
        sx={customButtonStyles}
        className={madaniArabicRegular.className}
        onClick={() => handleAction('Descargar')}
      >
        Descargar
      </Button>
    </Box>
  );
}
