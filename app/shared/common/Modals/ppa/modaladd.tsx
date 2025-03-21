import React, { useState, useEffect, useMemo } from 'react';
import { DefaultModal } from '../';
import { InputField, SelectField } from '../../form';
import { Grid, Button } from '@mui/material';
import { Add, Close, Edit } from '@mui/icons-material';

interface FieldProps {
  name: string;
  label: string;
  type: 'text' | 'select';
  options?: string[];
  size?: number;
  onChange?: (value: string) => void;
}

interface ModalAgregarProps {
  title: string;
  open: boolean;
  onClose: () => void;
  fields: FieldProps[];
  mode: 'Agregar' | 'Editar' | 'Consultar';
  initialValues?: { [key: string]: string };
}

const ModalAgregar: React.FC<ModalAgregarProps> = ({
  title,
  open,
  onClose,
  fields,
  mode,
  initialValues = {},
}) => {
  const initialValuesString = JSON.stringify(initialValues);
  const memoizedInitialValues = useMemo(
    () => JSON.parse(initialValuesString),
    [initialValuesString]
  );

  const [formData, setFormData] = useState<{ [key: string]: string }>(
    mode === 'Editar' || mode === 'Consultar' ? memoizedInitialValues : {}
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (open) {
      setFormData(mode === 'Editar' || mode === 'Consultar' ? memoizedInitialValues : {});
      setErrors({});
    }
  }, [open, mode, memoizedInitialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Ejecutar onChange personalizado si existe
    const field = fields.find((f) => f.name === name);
    if (field?.onChange) {
      field.onChange(value);
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'Consultar') return;

    const validationErrors: { [key: string]: string } = {};
    fields.forEach(({ name }) => {
      if (!formData[name]) validationErrors[name] = 'Campo obligatorio.';
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Datos enviados:', formData);
    onClose();
  };

  return (
    <DefaultModal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fields.map(({ name, label, type, options, size }) => (
            <Grid
              item
              xs={12}
              sm={size === 1 ? 12 : size === 3 ? 4 : 6}
              md={size === 1 ? 12 : size === 3 ? 4 : 6}
              key={name}
            >
              {type === 'text' ? (
                <InputField
                  label={label}
                  name={name}
                  value={formData[name] || ''}
                  onChange={handleChange}
                  error={!!errors[name]}
                  helperText={errors[name] || ''}
                  disabled={mode === 'Consultar'}
                />
              ) : (
                <SelectField
                  label={label}
                  name={name}
                  value={formData[name] || ''}
                  options={options || []}
                  onChange={(value) => handleSelectChange(name, value)}
                  helperText={errors[name] || ''}
                  disabled={mode === 'Consultar'}
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Grid container justifyContent='flex-end' spacing={2} sx={{ mt: 2 }}>
          <Grid item>
            <Button
              variant='contained'
              onClick={handleClose}
              startIcon={<Close />}
              sx={{
                py: 1,
                px: 3,
                textTransform: 'capitalize',
                borderRadius: '8px',
                backgroundColor: 'rgb(255, 77, 99)',
                '&:hover': { backgroundColor: 'rgb(200, 50, 70)' },
                fontSize: '0.875rem',
              }}
            >
              Cerrar
            </Button>
            {mode !== 'Consultar' && (
              <Button
                variant='contained'
                type='submit'
                startIcon={mode === 'Editar' ? <Edit /> : <Add />}
                sx={{
                  py: 1,
                  px: 3,
                  textTransform: 'capitalize',
                  borderRadius: '8px',
                  backgroundColor: mode === 'Editar' ? '#FF9800' : '#32169b',
                  '&:hover': { backgroundColor: mode === 'Editar' ? '#E68900' : '#14005E' },
                  fontSize: '0.875rem',
                }}
              >
                {mode === 'Editar' ? 'Guardar cambios' : 'Guardar'}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </DefaultModal>
  );
};

export default ModalAgregar;