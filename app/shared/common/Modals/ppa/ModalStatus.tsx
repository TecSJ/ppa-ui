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
  colDefs: any;
  // eslint-disable-next-line no-unused-vars
  getRowId: (row: any) => string | number;
}

export default function ModalStatus({
  open,
  onClose,
  selectedRows,
  nombreBoton,
  onSubmit,
  colDefs,
  getRowId,
}: ModalStatusProps) {
  const [loading, setLoading] = useState(false);

  const filteredColDefs = colDefs.filter((col: any) => col.cellClassName === 'Visible');

  const handleClick = async () => {
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      title={`¿Deseas ${nombreBoton.toLowerCase()} estos elementos?`}
    >
      <DataTable
        rowData={selectedRows}
        colDefs={filteredColDefs}
        height={300}
        getRowId={(row) => getRowId(row)}
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