'use client';

import { useState, useEffect, useMemo} from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData, createRecord } from '@/app/shared/utils/apiUtils';
import { TableTemplate, ActionButtons, ModalAdd } from '@/app/shared/common/';
import { useAuthContext } from '@/app/context/AuthContext';
import { idID } from '@mui/material/locale';

interface ModuloData {
  idModulo: number;
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
  options?: (string | { label: string; value: string })[];
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
}

export default function TableModulos() {
  const { setNoti } = useAuthContext();

  const [rowData, setRowData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<ModuloData | null>(null);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Editar'>('Agregar');

  const [unidadSelected, setUnidadSelected] = useState<string>('');
  const [unidadAcademicaOptions, setUnidadAcademicaOptions] = useState<string[]>([]);
  const [carreraOptions, setCarreraOptions] = useState<(
    string | { label: string; value: string }
  )[]>([]);
  const [planDeEstudioOptions, setPlanDeEstudioOptions] = useState<(
    string | { label: string; value: string }
  )[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);
  const [planes, setPlanes] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data:modulos } = await getData({ endpoint: '/modulos' });
      const transformedData = modulos.map((modulo: any) => ({
        ...modulo,
        planDeEstudio: modulo.plan?.planDeEstudio || '',
        idPrograma: modulo.plan?.idPrograma || '',
        carrera: modulo.plan?.programa?.carrera || '',
        unidadAcademica: modulo.plan?.programa?.unidadAcademica || '',
      }));
      setRowData(transformedData);
    } catch (error:any) {
      setNoti({
        open: true,
        type: 'error',
        message: error || 'Error al obtener los planes',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selectedData = rowData.find((row) => row.clave === selection[0]);
    if (selectedData) {
      setSelectedRowData(selectedData);
    }
  };

  const handleCreate = async (formData: { [key: string]: string }) => {
    const data = {
      ...formData,
      idPlan: parseInt(formData.idPlan),
      clave: formData.clave,
      abreviatura: formData.abreviatura,
      nombre: formData.nombre,
      creditos: parseInt(formData.creditos),
      asignaturas: parseInt(formData.asignaturas),
      tipo: formData.tipo,
      estado: 'Elaborado',
    };

    const { statusCode, errorMessage } = await createRecord({
      endpoint: '/modulos',
      data,
    });
    if (statusCode === 200 || statusCode === 201) {
      setIsModalOpen(false);
      await fetchData();
      setNoti({
        open: true,
        type: 'success',
        message: '¡Modulo creado con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al crear el Modulo',
      });
    }
  };
  /*
const handleUpdate = async (formData: { [key: string]: string }) => {
    if (!selectedRowData) return;

    const validUpdateFields = [
      'idPrograma', 'clave', 'fechaInicio', 'fechaTermino',
      'creditos', 'credMin', 'credMax', 'version', 'estado'
    ];

    const filteredData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => validUpdateFields.includes(key))
        .map(([key, value]) => {
          const numericFields = ['idPrograma', 'version', 'creditos', 'credMin', 'credMax'];
          return [key, numericFields.includes(key) ? parseInt(value) : value];
        })
    );

    const { statusCode, errorMessage } = await updateRecord({
      endpoint: ⁠ /planes/${selectedRowData.idPlan} ⁠,
      data: filteredData,
    });

    if (statusCode === 200) {
      setIsModalOpen(false);
      await fetchPlanes();
      setNoti({
        open: true,
        type: 'success',
        message: '¡Plan de estudio actualizado con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al actualizar el plan',
      });
    }
  };
*/
  const memoizedInitialValues = useMemo(() => {
    if (!selectedRowData) return undefined;
    return Object.fromEntries(
      Object.entries(selectedRowData).map(([key, value]) => [key, String(value ?? '')])
    );
  }, [selectedRowData]);

  const handleButtonClick = async (actionType: string) => {
    setModalMode(actionType as any);
    /*
    if ((action === 'Actualizar' || action === 'Consultar') && selectedRow.length === 0) {
          setNoti({
            open: true,
            type: 'warning',
            message: 'Selecciona un plan para continuar.',
          });
          return;
        }
    */
    const { data: programasData } = await getData({ endpoint: '/programa/fa' });
    setProgramas(programasData);

    const unidadOptions = programasData.map((p: any) => p.idPlantel).filter(Boolean) as string[];
    setUnidadAcademicaOptions([...new Set(unidadOptions)]);

    const { data: plantelData } = await getData({ endpoint: '/planes' });
    setPlanes(plantelData);

    if (actionType === 'Agregar') {
      setSelectedRowData(null);
      setCarreraOptions([]);
      setPlanDeEstudioOptions([]);
    } else {
      const plantel = selectedRowData?.unidadAcademica;
      const carrerasFiltradas = programasData
        .filter((p: any) => p.idPlantel === plantel)
        .map((p: any) => ({ label: p.nombre, value: p.idPrograma }));
      setCarreraOptions(carrerasFiltradas);
    }
    setIsModalOpen(true);
  };

  const handleUnidadAcademicaChange = (idPlantel: string) => {
    setPlanDeEstudioOptions([]);
    setUnidadSelected(idPlantel);
    const carrerasFiltradas = programas
      .filter((p) => p.idPlantel === idPlantel)
      .map((p) => ({ label: p.nombre, value: p.idPrograma }));

    setCarreraOptions(carrerasFiltradas);
  };

  const handleCarreraChange = (carreraSeleccionada: string) => {
    const programasFiltrados = programas
      .filter((p) => p.idPrograma === carreraSeleccionada && p.idPlantel === unidadSelected)
      .map((p) => p.idPrograma);
    console.log(programasFiltrados);
    const planesFiltrados = planes
      .filter((plan) => programasFiltrados.includes(plan.idPrograma))
      .map((plan) => ({ label: plan.clave, value: plan.idPlan }));
    setPlanDeEstudioOptions(planesFiltrados);
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
      onChange: handleUnidadAcademicaChange,
    },
    {
      name: 'carrera',
      label: 'Carrera',
      type: 'select',
      options: carreraOptions,
      onChange: handleCarreraChange,
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
      <ModalAdd
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