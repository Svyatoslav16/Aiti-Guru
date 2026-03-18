import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  type TextFieldProps,
} from '@mui/material';
import type { UseFormRegister, FieldValues, Path, UseFormSetValue } from 'react-hook-form';

import { Close as CloseIcon } from '@mui/icons-material';

interface FormTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  name: Path<T>;
  register: UseFormRegister<T>;
  setValue?: UseFormSetValue<T>;
  errorMessage?: string;
  icon?: React.ReactNode;
  showClearButton?: boolean;
  isRequired?: boolean;
}

export function FormTextField<T extends FieldValues>({
  name,
  label,
  register,
  errorMessage,
  icon,
  showClearButton = false,
  isRequired,
  error,
  helperText,
  setValue,
  ...textFieldProps
}: FormTextFieldProps<T>) {
  const {
    onChange,
    onBlur,
    ref,
    name: registeredName,
  } = register(name, {
    required: isRequired || textFieldProps.required ? 'Это поле обязательно' : false,
  });

  const handleClear = () => {
    if (setValue) {
      setValue(name, '' as T[Path<T>], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <Box>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          fontSize: '1rem',
        }}
      >
        {label}
      </Typography>
      <TextField
        {...textFieldProps}
        name={registeredName}
        inputRef={ref}
        onChange={onChange}
        onBlur={onBlur}
        error={error || !!errorMessage}
        helperText={helperText || errorMessage}
        required={isRequired || textFieldProps.required}
        InputProps={{
          ...textFieldProps.InputProps,
          startAdornment: icon ? (
            <InputAdornment position="start">{icon}</InputAdornment>
          ) : undefined,
          endAdornment: showClearButton ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear"
                onClick={handleClear}
                edge="end"
                size="small"
                tabIndex={-1}
                type="button"
              >
                <CloseIcon color="action" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
        sx={{
          mt: 1,
        }}
      />
    </Box>
  );
}
