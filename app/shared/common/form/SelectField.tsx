import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
} from '@mui/material';

interface AutocompleteFieldProps {
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

export default function AutocompleteField({
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
}: AutocompleteFieldProps) {
  const normalizedOptions = options.map(option =>
    typeof option === 'string' ? { label: option, value: option } : option
  );

  const currentValue = normalizedOptions.find(option => option.value === value) || null;

  return (
    <FormControl fullWidth={fullWidth} error={error}>
      <Autocomplete
        id={name}
        options={normalizedOptions}
        getOptionLabel={(option) => option.label}
        value={currentValue}
        onChange={(_, newValue) => {
          onChange(name, newValue?.value || '');
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
        isOptionEqualToValue={(option, value) => option.value === value?.value}
      />
      {error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}