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
  idPrograma?: string;
}

interface FieldProps {
  name: string;
  label: string;
  type: 'text' | 'select';
  size?: number;
  options?: string[];
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function TableModulos() {
  const [rowData, setRowData] = useState<ModuloData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Editar'>('Agregar');
  const [selectedRowData, setSelectedRowData] = useState<ModuloData | null>(null);
  
  // Estado para gestionar las opciones filtradas y seleccionadas
  const [unidadAcademica, setUnidadAcademica] = useState<string>('');
  const [carrera, setCarrera] = useState<string>('');
  const [planDeEstudio, setPlanDeEstudio] = useState<string>('');

  // Opciones dinámicas
  const [unidadAcademicaOptions, setUnidadAcademicaOptions] = useState<string[]>([]);
  const [carreraOptions, setCarreraOptions] = useState<string[]>([]);
  const [planDeEstudioOptions, setPlanDeEstudioOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getData({ endpoint: '/modulos' });
        const unidades: { idPlantel: string }[] =
        (await getData({ endpoint: '/programa/fa' })).data;
        const carreras: { abreviatura: string, idPlantel: string }[] =
        (await getData({ endpoint: '/programa/fa' })).data;
        const planes: { clave: string, idPrograma: string, carrera: string,
          idPlantel: string }[] = (await getData({ endpoint: '/planes/' })).data;

        const unidadIds = unidades.map((item: { idPlantel: string }) => item.idPlantel);
        setUnidadAcademicaOptions([...new Set(unidadIds)]);

        // Filtrar carreras según unidad académica seleccionada
        const filteredCarreras = carreras.filter(item => item.idPlantel === unidadAcademica);
        setCarreraOptions(filteredCarreras.map(item => item.abreviatura));

        // Filtrar planes de estudio según unidad académica y carrera
        const filteredPlanes = planes.filter(item =>
          item.idPlantel === unidadAcademica && item.carrera === carrera);
        setPlanDeEstudioOptions(filteredPlanes.map(item => item.clave));

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
  }, [unidadAcademica, carrera]);

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selectedData = rowData.find((row) => row.clave === selection[0]);
    if (selectedData) {
      setSelectedRowData(selectedData);
    }
    console.log('Filas seleccionadas:', selectedData);
  };

  const handleUnidadAcademicaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUnidadAcademica(event.target.value);
    setCarrera('');
    setPlanDeEstudio('');
  };

  const handleCarreraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCarrera(event.target.value);
    setPlanDeEstudio('');
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
    { name: 'unidadAcademica', label: 'Unidad Académica', type: 'select',
      options: unidadAcademicaOptions, onChange: handleUnidadAcademicaChange },
    { name: 'carrera', label: 'Carrera', type: 'select',
      options: carreraOptions, onChange: handleCarreraChange },
    { name: 'planDeEstudio', label: 'Plan de estudios', type: 'select',
      options: planDeEstudioOptions },
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
