import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: (string | { label: string; value: string })[];
  // eslint-disable-next-line no-unused-vars
  onChange: (e: SelectChangeEvent<string>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export default function SelectField({
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
}: SelectFieldProps) {
  return (
    <FormControl fullWidth={fullWidth} variant='outlined' error={error} size={size}>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value} onChange={onChange} label={label} disabled={disabled}>
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          return (
            <MenuItem key={optionValue} value={optionValue}>
              {optionLabel}
            </MenuItem>
          );
        })}
      </Select>
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
