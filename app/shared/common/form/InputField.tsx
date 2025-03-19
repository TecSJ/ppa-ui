import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, error }) => {
  return (
    <div className='mb-4'>
      <label className='block text-gray-700 font-bold'>{label}</label>
      <input
        type='text'
        name={name}
        value={value}
        onChange={onChange}
        className='w-full p-2 border rounded-md'
      />
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export default InputField;
