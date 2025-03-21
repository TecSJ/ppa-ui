import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error = false,
  helperText = '',
  fullWidth = true,
  disabled = false,
  size = 'medium',
}) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} variant='outlined' error={error} size={size}>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={handleChange}
        label={label}
        disabled={disabled}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;