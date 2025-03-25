import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export default function InputField({
  label,
  name,
  value,
  onChange,
  error = false,
  helperText = '',
  fullWidth = true,
  disabled = false,
  size = 'medium',
}: InputFieldProps) {
  return (
    <TextField
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      variant='outlined'
      error={error}
      helperText={error ? helperText : ''}
      disabled={disabled}
      size={size}
    />
  );
}
