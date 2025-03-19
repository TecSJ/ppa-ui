'use client';

import { useState, useEffect } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData } from '@/app/shared/utils/apiUtils';
import { TableTemplate, ActionButtons } from '@/app/shared/common/';
import ModalAgregar from '@/app/shared/common/Modals/ppa/modaladd'; // Adjust the path as necessary

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
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const { data } = await getData({ endpoint: '/modulos' });
        const transformedData = data.map((modulo: any) => ({
          ...modulo,
          planDeEstudio: modulo.plan?.planDeEstudio || '',
          idPrograma: modulo.plan?.idPrograma || '',
          carrera: modulo.plan?.programa?.carrera || '',
          unidadAcademica: modulo.plan?.programa?.unidadAcademica || '',
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
    const selectedData = rowData.filter((row) => selection.includes(row.clave));
    console.log('Filas seleccionadas:', selectedData);
  };

  const handleButtonClick = (actionType: string) => {
    console.log(`Acción seleccionada: ${actionType}`);
    if (actionType === 'Agregar') {
      setIsModalOpen(true);
    }
  };

  const colDefs: GridColDef[] = [
    { field: 'clave', headerName: 'Clave', sortable: true, flex: 0.7 },
    { field: 'abreviatura', headerName: 'Abreviatura', sortable: true, flex: 1 },
    { field: 'nombre', headerName: 'Nombre', sortable: true, flex: 1.5 },
    { field: 'creditos', headerName: 'Créditos', sortable: true, flex: 0.7 },
    { field: 'asignaturas', headerName: 'Asignaturas', sortable: true, flex: 1 },
    { field: 'tipo', headerName: 'Tipo', sortable: true, flex: 0.8 },
    { field: 'planDeEstudio', headerName: 'Plan de Estudio', sortable: true, flex: 1.2 },
    { field: 'carrera', headerName: 'Carrera', sortable: true, flex: 2 },
    { field: 'unidadAcademica', headerName: 'UA', sortable: true, flex: 0.4 },
    { field: 'estado', headerName: 'Estado', sortable: true, flex: 1 },
  ];

  return (
    <div>
      <ActionButtons
        tableType='modulos'
        selectedRowsCount={selectedRow.length}
        onButtonClick={handleButtonClick}
      />
      <TableTemplate
        rowData={rowData}
        colDefs={colDefs}
        pageSize={20}
        loading={loading}
        enableSelection
        onSelectionChanged={handleSelectionChange}
        getRowId={(row) => row.clave}
      />
      <ModalAgregar
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fields={[
          { name: 'clave', label: 'Clave', type: 'text' },
          { name: 'abreviatura', label: 'Abreviatura', type: 'text' },
          { name: 'nombre', label: 'Nombre', type: 'text' },
          { name: 'creditos', label: 'Créditos', type: 'text' },
          { name: 'tipo', label: 'Tipo', type: 'select', options:
            ['Teoría', 'Práctica', 'Teórico-Práctico'] },
          { name: 'estado', label: 'Estado', type: 'select', options: ['Activo', 'Inactivo'] },
        ]}
      />
    </div>
  );
}
