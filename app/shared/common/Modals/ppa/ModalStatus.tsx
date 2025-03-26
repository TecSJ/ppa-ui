'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import { DataTable } from '../../Tables';
import { DefaultModal } from '../';

interface ModalStatusProps {
  open: boolean;
  onClose: () => void;
  selectedRows: any[];
  nombreBoton: 'Validado' | 'Autorizado' | 'Publicado' | 'Cancelado';
  onSubmit: () => Promise<void>;
}

export default function ModalStatus({
  open,
  onClose,
  selectedRows,
  nombreBoton,
  onSubmit,
}: ModalStatusProps) {
  const [loading, setLoading] = useState(false);

  const colDefs = [
    { field: 'clave', headerName: 'Clave' },
    { field: 'version', headerName: 'Versión' },
    { field: 'fechaInicio', headerName: 'Inicio' },
    { field: 'fechaTermino', headerName: 'Término' },
    { field: 'estado', headerName: 'Estado Actual' },
  ];

  const handleClick = async () => {
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      title={`¿Deseas ${nombreBoton.toLowerCase()} estos planes?`}
    >
      <DataTable
        rowData={selectedRows}
        colDefs={colDefs}
        height={300}
        getRowId={(row) => row.idPlan}
      />

      <Grid container justifyContent='flex-end' spacing={2} sx={{ mt: 3 }}>
        <Grid>
          <Button
            variant='contained'
            onClick={onClose}
            startIcon={<Close />}
            sx={{
              py: 1,
              px: 3,
              borderRadius: '8px',
              textTransform: 'capitalize',
              backgroundColor: 'rgb(255, 77, 99)',
              '&:hover': { backgroundColor: 'rgb(200, 50, 70)' },
            }}
          >
            Cancelar
          </Button>
        </Grid>
        <Grid>
          <Button
            variant='contained'
            onClick={handleClick}
            disabled={loading}
            startIcon={<Edit />}
            sx={{
              py: 1,
              px: 3,
              borderRadius: '8px',
              textTransform: 'capitalize',
              backgroundColor: '#008f39',
              '&:hover': { backgroundColor: '#00752f' },
            }}
          >
            Guardar cambios
          </Button>
        </Grid>
      </Grid>
    </DefaultModal>
  );
}