'use client';

import { useState, useEffect } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData } from '@/app/shared/utils/apiUtils';
import { TableTemplate, ActionButtons } from '@/app/shared/common/';
import ModalAgregar from '@/app/shared/common/Modals/ppa/modalAdd';

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

interface FieldProps {
  name: string;
  label: string;
  type: 'text' | 'select';
  size?: number;
  options?: string[];
  onChange?: (value: string) => void;
}

export default function TableModulos() {
  const [rowData, setRowData] = useState<ModuloData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Editar'>('Agregar');
  const [selectedRowData, setSelectedRowData] = useState<ModuloData | null>(null);
  const [unidadAcademicaOptions, setUnidadAcademicaOptions] = useState<string[]>([]);
  const [carreraOptions, setCarreraOptions] = useState<string[]>([]);
  const [planDeEstudioOptions, setPlanDeEstudioOptions] = useState<string[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getData({ endpoint: '/modulos' });
        const programasData = (await getData({ endpoint: '/programa/fa' })).data;
        const planesData = (await getData({ endpoint: '/planes/' })).data;

        setProgramas(programasData);
        setPlanes(planesData);

        const unidadIds = programasData.map((item: any) => item.idPlantel) as string[];
        setUnidadAcademicaOptions([...new Set(unidadIds)]);

        const transformedData = data.map((modulo: any) => ({
          ...modulo,
          planDeEstudio: modulo.plan?.planDeEstudio || '',
          idPrograma: modulo.plan?.idPrograma || '',
          carrera: modulo.plan?.programa?.carrera || '',
          unidadAcademica: modulo.plan?.programa?.unidadAcademica || '',
        }));
        setRowData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selectedData = rowData.find((row) => row.clave === selection[0]);
    if (selectedData) {
      setSelectedRowData(selectedData);
    }
    console.log('Filas seleccionadas:', selectedData);
  };

  const handleButtonClick = (actionType: string) => {
    console.log(`Acción seleccionada: ${actionType}`);
    if (actionType === 'Agregar') {
      setModalMode('Agregar');
      setSelectedRowData(null);
      setIsModalOpen(true);
    } else if (actionType === 'Actualizar') {
      setModalMode('Editar');
      setIsModalOpen(true);
    } else if (actionType === 'Consultar') {
      setModalMode('Consultar');
      setIsModalOpen(true);
    }
  };

  const handleUnidadAcademicaChange = (value: string) => {
    const carrerasFiltradas = programas
      .filter((programa) => programa.idPlantel === value)
      .map((programa) => programa.abreviatura);
    setCarreraOptions([...new Set(carrerasFiltradas)]);
    setPlanDeEstudioOptions([]);
  };

  const handleCarreraChange = (value: string) => {
    const programasFiltrados = programas.filter((programa) => programa.abreviatura === value);
    const planesFiltrados = planes
      .filter((plan) => programasFiltrados.some(
        (programa) => programa.idPrograma === plan.idPrograma))
      .map((plan) => plan.clave);
    setPlanDeEstudioOptions([...new Set(planesFiltrados)]);
  };

  const colDefs: GridColDef[] = [
    { field: 'clave', headerName: 'Clave', sortable: true },
    { field: 'abreviatura', headerName: 'Abreviatura', sortable: true },
    { field: 'nombre', headerName: 'Nombre', sortable: true },
    { field: 'creditos', headerName: 'Créditos', sortable: true },
    { field: 'asignaturas', headerName: 'Asignaturas', sortable: true },
    { field: 'tipo', headerName: 'Tipo', sortable: true },
    { field: 'planDeEstudio', headerName: 'Plan de Estudio', sortable: true },
    { field: 'carrera', headerName: 'Carrera', sortable: true },
    { field: 'unidadAcademica', headerName: 'Unidad Académica', sortable: true },
    { field: 'estado', headerName: 'Estado', sortable: true },
  ];

  const fieldsConfig: FieldProps[] = [
    { name: 'clave', label: 'Clave', type: 'text' },
    { name: 'abreviatura', label: 'Abreviatura', type: 'text' },
    { name: 'nombre', label: 'Nombre', type: 'text', size: 1 },
    { name: 'creditos', label: 'Créditos', type: 'text' },
    { name: 'asignaturas', label: 'Asignaturas', type: 'text' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: ['Base', 'Especialidad'] },
    {
      name: 'unidadAcademica',
      label: 'Unidad Académica',
      type: 'select',
      options: unidadAcademicaOptions,
      onChange: (value) => handleUnidadAcademicaChange(value),
    },
    {
      name: 'carrera',
      label: 'Carrera',
      type: 'select',
      options: carreraOptions,
      onChange: (value) => handleCarreraChange(value),
    },
    {
      name: 'planDeEstudio',
      label: 'Plan de estudios',
      type: 'select',
      options: planDeEstudioOptions,
    },
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
        title={`${modalMode} Módulo`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fields={fieldsConfig}
        mode={modalMode}
        initialValues={selectedRowData ?
          Object.fromEntries(Object.entries(selectedRowData).map((
            [key, value]) => [key, String(value)])) : undefined}
      />
    </div>
  );
}