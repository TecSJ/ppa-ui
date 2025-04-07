'use client';

import { useState, useEffect, useMemo } from 'react';
import { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {getData, createRecord, updateRecord} from '@/app/shared/utils/apiUtils';
import { DataTable, ActionButtons } from '@/app/shared/common';
import { useAuthContext } from '@/app/context/AuthContext';
import ModalAdd from '@/app/shared/common/Modals/ppa/modaladd';
import ModalStatus from '@/app/shared/common/Modals/ppa/ModalStatus';

interface ProgramaData {
    idPrograma: number,
    clave: string,
    codigo: string,
    abreviatura: string,
    nombre: string,
    certificacion: string,
    modalidad: string,
    nivel: string,
    documento: string,
    idPlantel: string,
    estado: string
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

export default function TableProgramas() {
  const { setNoti } = useAuthContext();
  const [rowData, setRowData] = useState<ProgramaData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRow, setSelectedRow] = useState<GridRowSelectionModel>([]);
  const [selectedRowData, setSelectedRowData] = useState<ProgramaData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'Agregar' | 'Consultar' | 'Editar'>('Agregar');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusToApply, setStatusToApply] = useState('');

  useEffect(() => {
    fetchProgramas();
  }, []);

  const fetchProgramas = async () => {
    try {
      const { data: programas } = await getData({ endpoint: '/programa/fa' });
      const transformed = programas.map((programa: any) => ({
        ...programa
      }));
      setRowData(transformed);
      return [];
    } catch (error) {
      console.error('Error al cargar planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selection: GridRowSelectionModel) => {
    setSelectedRow(selection);
    const selected = rowData.find((row) => row.idPrograma === selection[0]);
    console.log(selected);
    if(selected) setSelectedRowData(selected);
  };

  const handleCreate = async (formData: { [key: string]: string }) => {
    const data = {
      ...formData,
      clave: formData.clave,
      codigo: formData.codigo,
      abreviatura: formData.abreviatura,
      nombre: formData.nombre,
      certificacion: formData.certificacion,
      documento: formData.documento,
      modalidad: formData.modalidad,
      nivel: formData.nivel,
      idPlantel: formData.idPlantel,
    };

    const { statusCode, errorMessage } = await createRecord({
      endpoint: '/programa',
      data,
    });

    if (statusCode === 200 || statusCode === 201) {
      setIsModalOpen(false);
      await fetchProgramas();
      setNoti({
        open: true,
        type: 'success',
        message: '¡Programa creado con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al crear el programa',
      });
    }
  };

  const handleUpdate = async (formData: { [key: string]: string }) => {
    if (!selectedRowData) return;

    const validUpdateFields = [
      'abreviatura', 'certificacion', 'clave', 'codigo', 'documento',
      'estado', 'idPlantel', 'idPrograma', 'modalidad','nivel', 'nombre'
    ];

    const filteredData = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => validUpdateFields.includes(key))
        .map(([key, value]) => {
          const numericFields = [''];
          return [key, numericFields.includes(key) ? parseInt(value) : value];
        })
    );

    const { statusCode, errorMessage } = await updateRecord({
      endpoint: `/programa/${selectedRowData.idPrograma}`,
      data: filteredData,
    });

    if (statusCode === 200) {
      await fetchProgramas();

      setIsModalOpen(false);
      setSelectedRow([]);
      setSelectedRowData(null);
      setNoti({
        open: true,
        type: 'success',
        message: '¡Programa actualizado con éxito!',
      });
    } else {
      setNoti({
        open: true,
        type: 'error',
        message: errorMessage || 'Error al actualizar el programa',
      });
    }
  };

  const memoizedInitialValues = useMemo(() => {
    if (!selectedRowData) return undefined;
    return Object.fromEntries(
      Object.entries(selectedRowData).map(([key, value]) => [key, String(value ?? '')])
    );
  }, [selectedRowData]);

  const handleButtonClick = (action: string) => {
    if (['Validar', 'Autorizar', 'Publicar', 'Cancelar'].includes(action)) {
      setStatusToApply(action);
      setIsStatusModalOpen(true);
      return;
    }

    setModalMode(action as any);

    if ((action === 'Actualizar' || action === 'Consultar') && selectedRow.length === 0) {
      setNoti({
        open: true,
        type: 'warning',
        message: 'Selecciona un plan para continuar.',
      });
      return;
    }

    if (action === 'Agregar') {
      setSelectedRowData(null);
    }
    setIsModalOpen(true);

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
      updateRecord({ endpoint: `/programa/${id}`, data: { estado: nuevoEstado } })
    );

    await Promise.all(updates);

    await fetchProgramas();
    setSelectedRow([]);
    setSelectedRowData(null);
    setNoti({
      open: true,
      type: 'success',
      message: `¡Programas ${nuevoEstado.toLowerCase()}s con éxito!`,
    });
    setIsStatusModalOpen(false);
  };

  const colDefs: GridColDef[] = [
    { field: 'idPrograma', headerName: 'ID', sortable: true, cellClassName: 'Visible'},
    { field: 'clave', headerName: 'clave', sortable: true, cellClassName: 'Visible'},
    { field: 'codigo', headerName: 'Código', sortable: true, cellClassName: 'Visible' },
    { field: 'abreviatura', headerName: 'Abreviatura', sortable: true, cellClassName: 'Visible' },
    { field: 'nombre', headerName: 'Nombre', sortable: true, cellClassName: 'Visible'},
    { field: 'certificacion', headerName: 'Certificación', sortable: true },
    { field: 'modalidad', headerName: 'Modalidad', sortable: true, cellClassName: 'Visible' },
    { field: 'nivel', headerName: 'Nivel', sortable: true },
    { field: 'documento', headerName: 'Documento', sortable: true },
    { field: 'idPlantel', headerName: 'Plantel', sortable: true, cellClassName: 'Visible' },
    { field: 'estado', headerName: 'Estado', sortable: true, cellClassName: 'Visible' }
  ];

  const fields: FieldProps[] = [
    {name: 'clave', label: 'Clave', type: 'text'},
    {name: 'codigo', label: 'Código', type: 'text'},
    {name: 'abreviatura', label: 'Abreviatura', type: 'text'},
    {name: 'nombre', label: 'Nombre', type: 'text'},
    {name: 'certificacion', label: 'Certificación', type: 'text'},
    {name: 'documento', label: 'Documento', type: 'text'},
    {name: 'modalidad', label: 'Modalidad', type: 'select', options:
      ['Escolarizado', 'Mixta', 'A distancia']},
    {name: 'nivel', label: 'Nivel', type: 'select', options:
      ['Licenciatura','Ingeniería','Maestría']},
    {name: 'idPlantel', label: 'idPlantel', type: 'select', options:
      ['ZA', 'PV', 'CH', 'AR', 'GR', 'MA', 'HU', 'TE']},
  ];

  return (
    <div>
      <ActionButtons
        tableType='programas'
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
        getRowId={(row) => row.idPrograma}
      />
      <ModalAdd
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalMode} Programa`}
        fields={fields}
        mode={modalMode}
        initialValues={memoizedInitialValues}
        onSubmit={modalMode === 'Agregar'
          ? handleCreate : modalMode === 'Actualizar' ? handleUpdate : undefined}
      />
      <ModalStatus
        open={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        selectedRows={rowData.filter((r) => selectedRow.includes(r.idPrograma))}
        nombreBoton={statusToApply as any}
        onSubmit={handleStatusSubmit}
        colDefs={colDefs}
      />
    </div>
  );
}