'use client';

import { useState, useEffect, useMemo, ReactNode } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { getData, createRecord, updateRecord } from '@/app/shared/utils/apiUtils';
import { DataTable, ActionButtons, ModalAdd, ModalStatus } from '@/app/shared/common';
import { useAuthContext } from '@/app/context/AuthContext';

interface OfertaData {
    idOferta: number;
    turno: string;
    idPrograma: number;
    espacio: number;
    idPeriodo?:string;
    idPlantel?: string;
    nombre?: string;
    codigo?: string;
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
    validation?: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      errorMessage?: string;
    };
    icon?: ReactNode;
  }

export default function TableOfertas() {
  const { setNoti } = useAuthContext();

  const [rowData, setRowData] = useState<OfertaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = useState<OfertaData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Actualizar'>('Agregar');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusToApply, setStatusToApply] = useState('');

  const [unidadAcademicaOptions, setUnidadAcademicaOptions] = useState<string[]>([]);
  const [carreraOptions, setCarreraOptions] = useState<(
    string | { label: string; value: string }
  )[]>([]);
  const [programas, setProgramas] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const { data:ofertas } = await getData({ endpoint: '/ofertas' });
      const transformed = ofertas.map((oferta: any) => ({
        ...oferta,
        codigo: oferta.programa?.codigo || '',
        nombre: oferta.programa?.nombre || '',
        idPlantel: oferta.programa?.idPlantel || '',
      }));
      setRowData(transformed);
      return transformed;
    } catch (error:any) {
      setNoti({
        open: true,
        type: 'error',
        message: error || 'Error al obtener los Ofertas',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selected = rowData.find((row) => row.idOferta === selection[0]);
    if (selected) setSelectedRowData(selected);
  };

  const handleCreate = async (formData: { [key: string]: string }) => {
    const data = {
      ...formData,
      espacios: parseInt(formData.espacios),
      estado: 'Elaborado',
    };

    const { statusCode, errorMessage } = await createRecord({
      endpoint: '/ofertas',
      data,
    });
    if (statusCode === 200 || statusCode === 201) {
      setIsModalOpen(false);
      await fetchData();
      setNoti({
        open: true,
        type: 'success',
        message: '¡Oferta creada con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al crear la Oferta',
      });
    }
  };

  const handleUpdate = async (formData: { [key: string]: string }) => {
    if (!selectedRowData) return;

    const validupdateFields = ['idPrograma', 'turno', 'espacios', 'idPeriodo', 'estado'
    ];

    const filterData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => validupdateFields.includes(key))
        .map(([key, value]) => {
          const numericFields = [ 'idPrograma', 'espacios'];
          return [key, numericFields.includes(key) ? parseInt(value) : value];
        })
    );

    const { statusCode, errorMessage } = await updateRecord({
      endpoint: `/ofertas/${selectedRowData.idOferta}`,
      data: filterData,
    });

    if (statusCode === 200) {
      const updateOferta = await fetchData();
      const updated = updateOferta.find((p: any) => p.idOferta === selectedRowData.idOferta);
      if (updated) setSelectedRowData(updated);

      setIsModalOpen(false);
      setSelectedRow([]);
      setSelectedRowData(null);
      setNoti({
        open: true,
        type: 'success',
        message: '¡Oferta actualizada con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al actualizar la Oferta',
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
        message: 'Selecciona un Oferta para continuar.',
      });
      return;
    }

    const { data: programasData } = await getData({ endpoint: '/programa/fa' });
    setProgramas(programasData);

    const unidadOptions = programasData.map((p: any) => p.idPlantel).filter(Boolean) as string[];
    setUnidadAcademicaOptions([...new Set(unidadOptions)]);

    if (actionType === 'Agregar') {
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
      .map((p) => ({ label: p.abreviatura, value: p.idPrograma }));

    setCarreraOptions(carrerasFiltradas);
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
      updateRecord({ endpoint: `/ofertas/${id}`, data: { estado: nuevoEstado } })
    );

    await Promise.all(updates);
    await fetchData();
    setSelectedRow([]);
    setSelectedRowData(null);
    setNoti({
      open: true,
      type: 'success',
      message: `¡Oferta ${nuevoEstado.toLowerCase()}s con éxito!`,
    });
    setIsStatusModalOpen(false);
  };

  const colDefs: GridColDef[] = [
    { field: 'codigo', headerName: 'Clave', sortable: true, cellClassName: 'Visible' },
    { field: 'nombre', headerName: 'Carrera', sortable: true, cellClassName: 'Visible' },
    { field: 'turno', headerName: 'Turno', sortable: true, cellClassName: 'Visible' },
    { field: 'idPlantel', headerName: 'Unidad Académica', sortable: true,
      cellClassName: 'Visible' },
    { field: 'espacios', headerName: 'Espacio', sortable: true },
    { field: 'idPeriodo', headerName: 'Periodo', sortable: true, cellClassName: 'Visible' },
    { field: 'estado', headerName: 'Estado', sortable: true, cellClassName: 'Visible' },
  ];

  const fieldsConfig: FieldProps[] = [
    {
      name: 'idPlantel',
      label: 'Unidad Académica',
      type: 'select',
      options: unidadAcademicaOptions,
      onChange: handleUnidadAcademicaChange,
    },
    {
      name: 'idPrograma',
      label: 'Programa',
      type: 'select',
      options: carreraOptions,
    },
    { name: 'turno', label: 'Tipo', type: 'select',
      options: ['Matutino', 'Vespertino', 'Mixto'], size: 3 },
    { name: 'espacios', label: 'Espacio', type: 'text', size: 3 },
    { name: 'idPeriodo', label: 'Periodo', type: 'select',
      options: ['2025B', '2025A', '2026B', '2026A',], size: 3 },
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
        getRowId={(row) => row.idOferta}
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
        selectedRows={rowData.filter((r) => selectedRow.includes(r.idOferta))}
        nombreBoton={statusToApply as any}
        getRowId={(row: any) => row.idOferta}
        onSubmit={handleStatusSubmit}
      />
    </>
  );
}
