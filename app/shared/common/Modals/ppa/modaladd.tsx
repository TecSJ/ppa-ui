import React, { useState } from 'react';
import { DefaultModal } from '../';
import { InputField, SelectField } from '../../form';

interface ModalAgregarProps {
  open: boolean;
  onClose: () => void;
  fields: { name: string; label: string; type: 'text' | 'select'; options?: string[] }[];
}

const ModalAgregar: React.FC<ModalAgregarProps> = ({ open, onClose, fields }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};

    fields.forEach(({ name }) => {
      if (!formData[name]) validationErrors[name] = 'Este campo es obligatorio.';
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Datos enviados:', formData);
    onClose();
  };

  return (
    <DefaultModal open={open} onClose={onClose} title='Agregar Nuevo Registro'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {fields.map(({ name, label, type, options }) =>
          type === 'text' ? (
            <InputField key={name} label={label} name={name} value={
              formData[name] || ''} onChange={handleChange} error={errors[name]} />
          ) : (
            <SelectField key={name} label={label} name={name} value={
              formData[name] || ''} options={options || []} onChange={
              handleChange} error={errors[name]} />
          )
        )}

        <div className='flex justify-end'>
          <button type='button' onClick={onClose}
            className='bg-gray-500 text-white px-4 py-2 rounded-md mr-2'>
            Cancelar
          </button>
          <button type='submit' className=
            'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
            Enviar
          </button>
        </div>
      </form>
    </DefaultModal>
  );
};

export default ModalAgregar;
