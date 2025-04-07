import {
  FormControl,
  Autocomplete,
  TextField,
} from '@mui/material';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: (string | { label: string; value: string })[];
  // eslint-disable-next-line no-unused-vars
  onChange: (name: string, value: string) => void;
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
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : {
      label: option.label,
      value: String(option.value),
    }
  );

  const currentValue = normalizedOptions.find(
    (option) => option.value === String(value)
  ) || null;

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <Autocomplete
        id={name}
        options={normalizedOptions}
        getOptionLabel={(option) => option.label}
        value={currentValue}
        isOptionEqualToValue={(option, val) => option.value === val?.value}
        onChange={(_, newValue) => {
          const newVal = newValue?.value || '';
          onChange(name, newVal);
        }}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            size={size}
            helperText={helperText}
          />
        )}
      />
    </FormControl>
  );
}
