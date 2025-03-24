'use client';

import { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import { Button, TextField } from '@mui/material';
import { Add, Close, Edit } from '@mui/icons-material';
import { DefaultModal } from '../';
import { InputField, SelectField } from '../../Form';

interface FieldProps {
  name: string;
  label: string;
  type: 'text' | 'select' | 'date';
  options?: (string | { label: string; value: string })[];
  size?: number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
}

interface ModalAgregarProps {
  title: string;
  open: boolean;
  onClose: () => void;
  fields: FieldProps[];
  mode: 'Agregar' | 'Editar' | 'Consultar';
  initialValues?: { [key: string]: string };
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (data: { [key: string]: string }) => void;
}

export default function ModalAdd({
  title,
  open,
  onClose,
  fields,
  mode,
  initialValues = {},
  onSubmit,
}: ModalAgregarProps) {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!open) return;
    const values = initialValues || {};
    setFormData(JSON.parse(JSON.stringify(values)));
    setErrors({});
  }, [open]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    const field = fields.find((f) => f.name === name);
    if (field?.onChange) field.onChange(value);
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  const handleSubmit = (e: FormEvent) => {
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
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <DefaultModal open={open} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {fields.map(({ name, label, type, options, size }) => {
            const col = size === 1 ? 12 : size === 3 ? 4 : 6;
            return (
              <Grid key={name} size={{ xs: 12, md: col }}>
                {type === 'text' && (
                  <InputField
                    label={label}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    disabled={mode === 'Consultar'}
                  />
                )}
                {type === 'select' && (
                  <SelectField
                    label={label}
                    name={name}
                    value={formData[name] || ''}
                    options={options || []}
                    onChange={(e) => handleSelectChange(name, e.target.value)}
                    helperText={errors[name]}
                    error={!!errors[name]}
                    disabled={mode === 'Consultar'}
                  />
                )}
                {type === 'date' && (
                  <TextField
                    fullWidth
                    type='date'
                    name={name}
                    label={label}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    error={!!errors[name]}
                    helperText={errors[name]}
                    disabled={mode === 'Consultar'}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>

        <Grid container justifyContent='flex-end' spacing={2} sx={{ mt: 2 }}>
          <Grid>
            <Button
              variant='contained'
              onClick={handleClose}
              startIcon={<Close />}
              sx={{
                py: 1,
                px: 3,
                borderRadius: '8px',
                textTransform: 'capitalize',
                backgroundColor: 'rgb(255, 77, 99)',
                '&:hover': { backgroundColor: 'rgb(200, 50, 70)' },
              }}
            >
              Cerrar
            </Button>
          </Grid>
          {mode !== 'Consultar' && (
            <Grid>
              <Button
                type='submit'
                variant='contained'
                startIcon={mode === 'Editar' ? <Edit /> : <Add />}
                sx={{
                  py: 1,
                  px: 3,
                  borderRadius: '8px',
                  textTransform: 'capitalize',
                  backgroundColor: mode === 'Editar' ? '#FF9800' : '#32169b',
                  '&:hover': {
                    backgroundColor: mode === 'Editar' ? '#E68900' : '#14005E',
                  },
                }}
              >
                {mode === 'Editar' ? 'Guardar cambios' : 'Guardar'}
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
    </DefaultModal>
  );
}
