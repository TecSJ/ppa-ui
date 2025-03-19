import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label, name, value, options, onChange, error }) => {
  return (
    <div className='mb-4'>
      <label className='block text-gray-700 font-bold'>{label}</label>
      <select name={name} value={value} onChange={
        onChange} className='w-full p-2 border rounded-md'>
        <option value=''>Seleccione</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export default SelectField;
