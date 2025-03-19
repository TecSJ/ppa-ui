'use client';

import { useState, useEffect } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData } from '@/app/shared/utils/apiUtils';
import { DataTable } from '@/app/shared/common/';

interface PlanData {
  idPlan: number;
  clave: string;
  version: number;
  fechaInicio: string;
  fechaTermino: string;
  creditos: number;
  credMin: number;
  credMax: number;
  idPlantel: string;
  estado?: string;
}

export default function TablePlanes() {
  const [rowData, setRowData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getData({ endpoint: '/planes' });
        const transformedData = data.map((plan: any) => ({
          ...plan,
          idPlantel: plan.programa?.idPlantel || '',
        }));
        setRowData(transformedData);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selectedData = rowData.filter((row) => selection.includes(row.idPlan));
    console.log('Filas seleccionadas:', selectedData);
  };

  const colDefs: GridColDef[] = [
    { field: 'clave', headerName: 'Clave', sortable: true },
    { field: 'version', headerName: 'Version', sortable: true },
    { field: 'fechaInicio', headerName: 'Fecha Inicio', sortable: true },
    { field: 'fechaTermino', headerName: 'Fecha Termino', sortable: true },
    { field: 'creditos', headerName: 'Créditos', sortable: true },
    { field: 'credMin', headerName: 'Créditos Min', sortable: true },
    { field: 'credMax', headerName: 'Créditos Max', sortable: true },
    { field: 'idPlantel', headerName: 'UA', sortable: true },
    { field: 'estado', headerName: 'Estado', sortable: true },
  ];

  return (
    <div>
      <DataTable
        rowData={rowData}
        colDefs={colDefs}
        pageSize={20}
        loading={loading}
        enableSelection
        onSelectionChanged={handleSelectionChange}
        getRowId={(row) => row.idPlan}
      />
    </div>
  );
}