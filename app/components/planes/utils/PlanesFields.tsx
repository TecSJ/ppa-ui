export const PlanFields = [
  {
    name: 'clave',
    label: 'Clave',
    type: 'text',
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
      errorMessage: 'Selecciona una versión válida.',
    },
  },
  {
    name: 'fechaInicio',
    label: 'Fecha de Inicio',
    type: 'date',
    validation: {
      required: true,
      errorMessage: 'La fecha de inicio es obligatoria.',
    },
  },
  {
    name: 'fechaTermino',
    label: 'Fecha de Término',
    type: 'date',
    validation: {
      required: true,
      errorMessage: 'La fecha de término es obligatoria.',
    },
  },
  {
    name: 'creditos',
    label: 'Créditos',
    type: 'text',
    size: 3,
    validation: {
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Los créditos deben ser un número.',
    },
  },
  {
    name: 'credMin',
    label: 'Créditos Mínimos',
    type: 'text',
    size: 3,
    validation: {
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Los créditos mínimos deben ser un número.',
    },
  },
  {
    name: 'credMax',
    label: 'Créditos Máximos',
    type: 'text',
    size: 3,
    validation: {
      required: true,
      pattern: /^\d+$/,
      errorMessage: 'Los créditos máximos deben ser un número.',
    },
  },
  {
    name: 'idPlantel',
    label: 'Unidad Académica',
    type: 'select',
    validation: {
      required: true,
      errorMessage: 'Selecciona una unidad académica.',
    },
  },
  {
    name: 'idPrograma',
    label: 'Carrera',
    type: 'select',
    validation: {
      required: true,
      errorMessage: 'Selecciona una carrera.',
    },
  },
];
