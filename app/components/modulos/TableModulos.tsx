'use client';

import { useState, useEffect, useMemo } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData, createRecord, updateRecord } from '@/app/shared/utils/apiUtils';
import { DataTable, ActionButtons, ModalAdd, ModalStatus } from '@/app/shared/common';
import { useAuthContext } from '@/app/context/AuthContext';

interface ModuloData {
  idModulo: number;
  clave: string;
  abreviatura: string;
  nombre: string;
  creditos: number;
  asignaturas: number;
  tipo: string;
  idPlantel?: string;
  idPrograma?: string;
  planDeEstudio?: string;
  idPlan: number;
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

  const [rowData, setRowData] = useState<ModuloData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = useState<ModuloData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Actualizar'>('Agregar');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusToApply, setStatusToApply] = useState('');

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const { data:modulos } = await getData({ endpoint: '/modulos' });
      const transformed = modulos.map((modulo: any) => ({
        ...modulo,
        planDeEstudio: modulo.plan?.planDeEstudio || '',
        idProgramas: modulo.plan?.programa?.idProgramas || '',
        idPlantel: modulo.plan?.programa?.idPlantel || '',
        idPlan: modulo.idPlan,
        idPrograma: modulo.plan?.idPrograma || '',
      }));
      setRowData(transformed);
      return transformed;
    } catch (error:any) {
      setNoti({
        open: true,
        type: 'error',
        message: error || 'Error al obtener los modulos',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selected = rowData.find((row) => row.idModulo === selection[0]);
    if (selected) setSelectedRowData(selected);
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

  const handleUpdate = async (formData: { [key: string]: string }) => {
    if (!selectedRowData) return;

    const validupdateFields = ['idPlan', 'clave', 'abreviatura', 'nombre',
      'creditos', 'asignaturas', 'tipo', 'estado'
    ];

    const filterData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => validupdateFields.includes(key))
        .map(([key, value]) => {
          const numericFields = [ 'idPlan', 'creditos', 'asignaturas'];
          return [key, numericFields.includes(key) ? parseInt(value) : value];
        })
    );

    const { statusCode, errorMessage } = await updateRecord({
      endpoint: `/modulos/${selectedRowData.idModulo}`,
      data: filterData,
    });

    if (statusCode === 200) {
      const updateModulo = await fetchData();
      const updated = updateModulo.find((p: any) => p.idModulo === selectedRowData.idModulo);
      if (updated) setSelectedRowData(updated);

      setIsModalOpen(false);
      setSelectedRow([]);
      setSelectedRowData(null);
      setNoti({
        open: true,
        type: 'success',
        message: '¡Modulo actualizado con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al actualizar el modulo',
      });
    }
  };

  const memoizedInitialValues = useMemo(() => {
    if (!selectedRowData) return undefined;
    return Object.fromEntries(
      Object.entries(selectedRowData).map(([key, value]) => [key, String(value ?? '')])
    );
  }, [selectedRowData]);

  const handleButtonClick = async (actionType: string) => {
    if (['Validar', 'Autorizar', 'Publicar', 'Cancelar'].includes(actionType)) {
      setStatusToApply(actionType);
      setIsStatusModalOpen(true);
      return;
    }

    setModalMode(actionType as any);

    if ((actionType === 'Actualizar' || actionType === 'Consultar') && selectedRow.length === 0) {
      setNoti({
        open: true,
        type: 'warning',
        message: 'Selecciona un modulo para continuar.',
      });
      return;
    }

    const { data: planesData } = await getData({ endpoint: '/planes' });
    setPlanes(planesData);
    const { data: programasData } = await getData({ endpoint: '/programa/fa' });
    setProgramas(programasData);

    const unidadOptions = programasData.map((p: any) => p.idPlantel).filter(Boolean) as string[];
    setUnidadAcademicaOptions([...new Set(unidadOptions)]);

    if (actionType === 'Agregar') {
      setSelectedRowData(null);
      setCarreraOptions([]);
      setPlanDeEstudioOptions([]);
    } else {
      const plantel = selectedRowData?.idPlantel;
      const carrera = selectedRowData?.idPrograma;
      setUnidadSelected(plantel || '');
      const carrerasFiltradas = programasData
        .filter((p: any) => p.idPlantel === plantel)
        .map((p: any) => ({ label: p.nombre, value: p.idPrograma }));

      const programasFiltrados = programasData
        .filter((p: any) => p.idPrograma === Number(
          carrera) && p.idPlantel === plantel)
        .map((p: any) => p.idPrograma);
      const planesFiltrados = planesData
        .filter((plan: any) => programasFiltrados.includes(plan.idPrograma))
        .map((plan: any) => ({ label: plan.clave, value: plan.idPlan }));

      setCarreraOptions(carrerasFiltradas);
      setPlanDeEstudioOptions(planesFiltrados);
    }
    setIsModalOpen(true);
  };

  const handleUnidadAcademicaChange = (idPlantel: string) => {
    setPlanDeEstudioOptions([]);
    setUnidadSelected(idPlantel);
    const carrerasFiltradas = programas
      .filter((p) => p.idPlantel === idPlantel)
      .map((p) => ({ label: p.abreviatura, value: p.idPrograma }));

    setCarreraOptions(carrerasFiltradas);
  };

  const handleCarreraChange = (carreraSeleccionada: string) => {
    const programasFiltrados = programas
      .filter((p) => p.idPrograma === Number(carreraSeleccionada) && p.idPlantel === unidadSelected)
      .map((p) => p.idPrograma);
    const planesFiltrados = planes
      .filter((plan) => programasFiltrados.includes(plan.idPrograma))
      .map((plan) => ({ label: plan.clave, value: plan.idPlan }));

    setPlanDeEstudioOptions(planesFiltrados);
  };

  const handleStatusSubmit = async () => {
    const estadoMap: Record<string, string> = {
      Validar: 'Validado',
      Autorizar: 'Autorizado',
      Publicar: 'Publicado',
      Cancelar: 'Cancelado',
    };

    const nuevoEstado = estadoMap[statusToApply] || statusToApply;

    const updates = selectedRow.map((id) =>
      updateRecord({ endpoint: `/modulos/${id}`, data: { estado: nuevoEstado } })
    );

    await Promise.all(updates);
    await fetchData();
    setSelectedRow([]);
    setSelectedRowData(null);
    setNoti({
      open: true,
      type: 'success',
      message: `¡Modulos ${nuevoEstado.toLowerCase()}s con éxito!`,
    });
    setIsStatusModalOpen(false);
  };

  const colDefs: GridColDef[] = [
    { field: 'clave', headerName: 'Clave', sortable: true, cellClassName: 'Visible' },
    { field: 'abreviatura', headerName: 'Abreviatura', sortable: true },
    { field: 'nombre', headerName: 'Nombre', sortable: true, cellClassName: 'Visible' },
    { field: 'creditos', headerName: 'Créditos', sortable: true },
    { field: 'asignaturas', headerName: 'Asignaturas', sortable: true },
    { field: 'tipo', headerName: 'Tipo', sortable: true },
    { field: 'planDeEstudio', headerName: 'Plan de Estudio', sortable: true,
      cellClassName: 'Visible' },
    { field: 'idProgramas', headerName: 'Carrera', sortable: true, cellClassName: 'Visible' },
    { field: 'idPlantel', headerName: 'Unidad Académica', sortable: true },
    { field: 'estado', headerName: 'Estado', sortable: true, cellClassName: 'Visible' },
  ];

  const fieldsConfig: FieldProps[] = [
    { name: 'clave', label: 'Clave', type: 'text' },
    { name: 'abreviatura', label: 'Abreviatura', type: 'text' },
    { name: 'nombre', label: 'Nombre', type: 'text', size: 1 },
    { name: 'creditos', label: 'Créditos', type: 'text' },
    { name: 'asignaturas', label: 'Asignaturas', type: 'text' },
    { name: 'tipo', label: 'Tipo', type: 'select', options: ['Base', 'Especialidad'] },
    {
      name: 'idPlantel',
      label: 'Unidad Académica',
      type: 'select',
      options: unidadAcademicaOptions,
      onChange: handleUnidadAcademicaChange,
    },
    {
      name: 'idPrograma',
      label: 'Carrera',
      type: 'select',
      options: carreraOptions,
      onChange: handleCarreraChange,
    },
    {
      name: 'idPlan',
      label: 'Plan de estudios',
      type: 'select',
      options: planDeEstudioOptions,
    },
  ];

  return (
    <>
      <ActionButtons
        tableType='modulos'
        selectedRowsCount={selectedRow.length}
        onButtonClick={handleButtonClick}
      />
      <DataTable
        rowData={rowData}
        colDefs={colDefs}
        pageSize={20}
        loading={loading}
        enableSelection
        onSelectionChanged={handleSelectionChange}
        getRowId={(row) => row.idModulo}
        rowSelectionModel={selectedRow}
      />
      <ModalAdd
        title={`${modalMode} Módulo`}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fields={fieldsConfig}
        mode={modalMode}
        initialValues={memoizedInitialValues}
        onSubmit={modalMode === 'Agregar'
          ? handleCreate : modalMode === 'Actualizar' ? handleUpdate : undefined}
      />
      <ModalStatus
        open={isStatusModalOpen}
        colDefs={colDefs}
        onClose={() => setIsStatusModalOpen(false)}
        selectedRows={rowData.filter((r) => selectedRow.includes(r.idModulo))}
        nombreBoton={statusToApply as any}
        getRowId={(row: any) => row.idModulo}
        onSubmit={handleStatusSubmit}
      />
    </>
  );
}