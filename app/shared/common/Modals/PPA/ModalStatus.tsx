'use client';

import { useState } from 'react';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { updateRecord } from '@/app/shared/utils/apiUtils';
import { DataTable } from '@/app/shared/common/Tables';
import { DefaultModal } from '../';

interface ModalStatusProps {
  open: boolean;
  onClose: () => void;
  selectedRows: any[];
  nombreBoton: string;
  fetchPlanes: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  setNoti: (noti: { open: boolean; type: 'success' | 'error'; message: string }) => void;
}

export default function ModalStatus({
  open,
  onClose,
  selectedRows,
  nombreBoton,
  fetchPlanes,
  setNoti,
}: ModalStatusProps) {
  const [loading, setLoading] = useState(false);

  const colDefs = [
    { field: 'clave', headerName: 'Clave' },
    { field: 'version', headerName: 'Versión' },
    { field: 'fechaInicio', headerName: 'Inicio' },
    { field: 'fechaTermino', headerName: 'Término' },
    { field: 'estado', headerName: 'Estado Actual' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updates = selectedRows.map((row) =>
        updateRecord({ endpoint: `/planes/${row.idPlan}`, data: { estado: nombreBoton } })
      );
      await Promise.all(updates);
      await fetchPlanes();
      setNoti({
        open: true,
        type: 'success',
        message: `¡Planes ${nombreBoton.toLowerCase()}s con éxito!`
      });
      onClose();
    } catch (error) {
      setNoti({ open: true, type: 'error', message:`Error al actualizar los planes: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultModal
      open={open}
      onClose={onClose}
      title={`¿Deseas ${nombreBoton} estos planes?`}
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
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              py: 1,
              px: 3,
              borderRadius: '8px',
              textTransform: 'capitalize',
              backgroundColor: '#008f39',
              '&:hover': { backgroundColor: '#00752f' },
            }}
          >
            Confirmar
          </Button>
        </Grid>
      </Grid>
    </DefaultModal>
  );
}