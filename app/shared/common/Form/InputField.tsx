import { TextField, InputAdornment } from '@mui/material';
import { ChangeEvent, ReactNode } from 'react';

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
  icon?: ReactNode;
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
  icon,
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
      slotProps={{
        input: {
          endAdornment: icon ? (
            <InputAdornment position='end'>
              {icon}
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
}
