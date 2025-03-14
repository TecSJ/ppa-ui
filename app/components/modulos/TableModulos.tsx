'use client';

import { useState, useEffect } from 'react';
import { GridColDef } from '@mui/x-data-grid';
import {
  getData,
} from '@/app/shared/utils/apiUtils';
import { TableTemplate } from '@/app/shared/common';

interface ModuloData {
  clave: string;
  abreviatura: string;
  nombre: string;
  creditos: number;
  asignaturas: number;
  tipo: string;
  unidadAcademica?: string;
  carrera?: string;
  planDeEstudio?: string;
  estado?: string;
}

export default function TableModulos() {
  const [rowData, setRowData] = useState<ModuloData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const { data } = await getData({ endpoint: '/modulos/fa' });
        setRowData(data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const colDefs: GridColDef[] = [
    {
      field: 'clave',
      headerName: 'Clave',
      sortable: true,
      filterable: true,
      flex: .7,
    },
    {
      field: 'abreviatura',
      headerName: 'Abreviatura',
      sortable: true,
      filterable: true,
      flex: 1,
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      sortable: true,
      filterable: true,
      flex: 1.5,
    },
    {
      field: 'creditos',
      headerName: 'Creditos',
      sortable: true,
      filterable: true,
      flex: .7,
    },
    {
      field: 'asignaturas',
      headerName: 'Asignaturas',
      sortable: true,
      filterable: true,
      flex: 1,
    },
    {
      field: 'tipo',
      headerName: 'Tipo',
      sortable: true,
      filterable: true,
      flex: .8,
    },
    {
      field: 'planDeEstudio',
      headerName: 'Plan de estudio',
      sortable: true,
      filterable: true,
      flex: 1.2,
    },
    {
      field: 'carrera',
      headerName: 'Carrera',
      sortable: true,
      filterable: true,
      flex: 2,
    },
    {
      field: 'unidadAcademica',
      headerName: 'UA',
      sortable: true,
      filterable: true,
      flex: .4,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      sortable: true,
      filterable: true,
      flex: 1,
    },
  ];

  return (
    <>
      <TableTemplate
        rowData={rowData}
        colDefs={colDefs}
        pageSize={20}
        loading={loading}
        selectionMode='multiRow'
        enableSelection
        getRowId={(row) => row.clave}
      />
    </>
  );
}
