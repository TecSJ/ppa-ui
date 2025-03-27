import { ReactNode } from 'react';
import { EditOutlined, PlusOneOutlined } from '@mui/icons-material';
import { GridColDef } from '@mui/x-data-grid';

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

export const colDefs: GridColDef[] = [
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

export const fields: FieldProps[] = [
  {
    name: 'clave',
    label: 'Clave',
    type: 'text',
    icon: <EditOutlined />,
    validation: {
      required: true,
      minLength: 3,
      maxLength: 10,
      errorMessage: 'La clave debe tener entre 3 y 10 caracteres.',
    },
  },
  {
    name: 'version',
    label: 'Versión',
    type: 'select',
    options: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
    validation: {
      required: true,
      errorMessage: 'Debe seleccionar una versión.',
    },
  },
  {
    name: 'fechaInicio',
    label: 'Fecha de Inicio',
    type: 'date',
    validation: {
      required: true,
      errorMessage: 'Debe seleccionar una fecha de inicio.',
    },
  },
  {
    name: 'fechaTermino',
    label: 'Fecha de Término',
    type: 'date',
    validation: {
      required: true,
      errorMessage: 'Debe seleccionar una fecha de término.',
    },
  },
  {
    name: 'creditos',
    label: 'Créditos',
    icon: <PlusOneOutlined />,
    type: 'text',
    size: 3,
    validation: {
      required: true,
      pattern: /^[0-9]+$/,
      errorMessage: 'Ingrese los créditos (solo números).',
    },
  },
  {
    name: 'credMin',
    label: 'Créditos Mínimos',
    icon: <PlusOneOutlined />,
    type: 'text',
    size: 3,
    validation: {
      required: true,
      pattern: /^[0-9]+$/,
      errorMessage: 'Ingrese los créditos mínimos (solo números).',
    },
  },
  {
    name: 'credMax',
    label: 'Créditos Máximos',
    icon: <PlusOneOutlined />,
    type: 'text',
    size: 3,
    validation: {
      required: true,
      pattern: /^[0-9]+$/,
      errorMessage: 'Ingrese los créditos máximos (solo números).',
    },
  },
  {
    name: 'idPlantel',
    label: 'Unidad Académica',
    type: 'select',
    options: unidadAcademicaOptions,
    onChange: handleUnidadAcademicaChange,
    validation: {
      required: true,
      errorMessage: 'Debe seleccionar una unidad académica.',
    },
  },
  {
    name: 'idPrograma',
    label: 'Carrera',
    type: 'select',
    options: carreraOptions,
    validation: {
      required: true,
      errorMessage: 'Debe seleccionar una carrera válida.',
    },
  },
];