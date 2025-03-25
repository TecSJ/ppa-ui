'use client';

import { useState, useEffect, useMemo } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData, createRecord, updateRecord } from '@/app/shared/utils/apiUtils';
import { DataTable, ActionButtons, ModalAdd } from '@/app/shared/common';
import { useAuthContext } from '@/app/context/AuthContext';

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
  idPrograma: string;
  estado?: string;
}

interface FieldProps {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: (string | { label: string; value: string })[];
  size?: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
}

export default function TablePlanes() {
  const { setNoti } = useAuthContext();

  const [rowData, setRowData] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = useState<PlanData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Actualizar'>('Agregar');

  const [unidadAcademicaOptions, setUnidadAcademicaOptions] = useState<string[]>([]);
  const [carreraOptions, setCarreraOptions] = useState<(
    string | { label: string; value: string }
  )[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);

  useEffect(() => {
    fetchPlanes();
  }, []);

  const fetchPlanes = async () => {
    try {
      const { data: planes } = await getData({ endpoint: '/planes' });
      const transformed = planes.map((plan: any) => ({
        ...plan,
        idPlantel: plan.programa?.idPlantel || '',
        idPrograma: plan.idPrograma,
      }));
      setRowData(transformed);
      return transformed;
    } catch (error: any) {
      setNoti({
        open: true,
        type: 'error',
        message: error || 'Error al obtener los planes',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selected = rowData.find((row) => row.idPlan === selection[0]);
    if (selected) setSelectedRowData(selected);
  };

  const handleCreate = async (formData: { [key: string]: string }) => {
    const data = {
      ...formData,
      idPrograma: parseInt(formData.idPrograma),
      version: parseInt(formData.version),
      creditos: parseInt(formData.creditos),
      credMin: parseInt(formData.credMin),
      credMax: parseInt(formData.credMax),
      estado: 'Elaborado',
    };

    const { statusCode, errorMessage } = await createRecord({
      endpoint: '/planes',
      data,
    });

    if (statusCode === 200 || statusCode === 201) {
      setIsModalOpen(false);
      await fetchPlanes();
      setNoti({
        open: true,
        type: 'success',
        message: '¡Plan de estudio creado con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al crear el plan',
      });
    }
  };

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
      endpoint: `/planes/${selectedRowData.idPlan}`,
      data: filteredData,
    });

    if (statusCode === 200) {
      const updatedPlanes = await fetchPlanes();
      const updated = updatedPlanes.find((p: any) => p.idPlan === selectedRowData.idPlan);
      if (updated) setSelectedRowData(updated);

      setIsModalOpen(false);
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

  const memoizedInitialValues = useMemo(() => {
    if (!selectedRowData) return undefined;
    return Object.fromEntries(
      Object.entries(selectedRowData).map(([key, value]) => [key, String(value ?? '')])
    );
  }, [selectedRowData]);

  const handleButtonClick = async (action: string) => {
    setModalMode(action as any);

    if ((action === 'Actualizar' || action === 'Consultar') && selectedRow.length === 0) {
      setNoti({
        open: true,
        type: 'warning',
        message: 'Selecciona un plan para continuar.',
      });
      return;
    }

    const { data: programasData } = await getData({ endpoint: '/programa/fa' });
    setProgramas(programasData);

    const unidadOptions = programasData.map((p: any) => p.idPlantel).filter(Boolean) as string[];
    setUnidadAcademicaOptions([...new Set(unidadOptions)]);

    if (action === 'Agregar') {
      setSelectedRowData(null);
      setCarreraOptions([]);
    } else {
      const plantel = selectedRowData?.idPlantel;
      const carrerasFiltradas = programasData
        .filter((p: any) => p.idPlantel === plantel)
        .map((p: any) => ({ label: p.nombre, value: p.idPrograma }));
      setCarreraOptions(carrerasFiltradas);
    }
    setIsModalOpen(true);
  };

  const handleUnidadAcademicaChange = (idPlantel: string) => {
    const carrerasFiltradas = programas
      .filter((p) => p.idPlantel === idPlantel)
      .map((p) => ({ label: p.nombre, value: p.idPrograma }));

    setCarreraOptions(carrerasFiltradas);
  };

  const colDefs: GridColDef[] = [
    { field: 'clave', headerName: 'Clave', sortable: true },
    { field: 'version', headerName: 'Versión', sortable: true },
    { field: 'fechaInicio', headerName: 'Fecha Inicio', sortable: true },
    { field: 'fechaTermino', headerName: 'Fecha Término', sortable: true },
    { field: 'creditos', headerName: 'Créditos', sortable: true },
    { field: 'credMin', headerName: 'Créditos Min', sortable: true },
    { field: 'credMax', headerName: 'Créditos Max', sortable: true },
    { field: 'idPlantel', headerName: 'UA', sortable: true },
    { field: 'estado', headerName: 'Estado', sortable: true },
  ];

  const fields: FieldProps[] = [
    { name: 'clave', label: 'Clave', type: 'text' },
    {
      name: 'version',
      label: 'Versión',
      type: 'select',
      options: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
    },
    { name: 'fechaInicio', label: 'Fecha de Inicio', type: 'date' },
    { name: 'fechaTermino', label: 'Fecha de Término', type: 'date' },
    { name: 'creditos', label: 'Créditos', type: 'text', size: 3 },
    { name: 'credMin', label: 'Créditos Mínimos', type: 'text', size: 3 },
    { name: 'credMax', label: 'Créditos Máximos', type: 'text', size: 3 },
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
        getRowId={(row) => row.idPlan}
      />
      <ModalAdd
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalMode} Plan de Estudio`}
        fields={fields}
        mode={modalMode}
        initialValues={memoizedInitialValues}
        onSubmit={
          modalMode === 'Agregar'
            ? handleCreate
            : modalMode === 'Actualizar'
              ? handleUpdate
              : undefined
        }
      />
    </>
  );
}
