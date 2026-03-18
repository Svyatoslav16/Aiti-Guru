import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Typography, Box } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface FormPasswordFieldProps<T extends FieldValues> extends Omit<
  React.ComponentProps<typeof TextField>,
  'name' | 'type'
> {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  errorMessage?: string;
  isRequired?: boolean;
}

export function FormPasswordField<T extends FieldValues>({
  name,
  register,
  errorMessage,
  isRequired,
  label,
  error,
  helperText,
  ...textFieldProps
}: FormPasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    onChange,
    onBlur,
    ref,
    name: registeredName,
  } = register(name, {
    required: isRequired || textFieldProps.required ? 'Это поле обязательно' : false,
    minLength: {
      value: 6,
      message: 'Пароль должен содержать не менее 6 символов',
    },
  });

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
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
        type={showPassword ? 'text' : 'password'}
        inputRef={ref}
        onChange={onChange}
        onBlur={onBlur}
        error={error || !!errorMessage}
        helperText={helperText || errorMessage}
        required={isRequired || textFieldProps.required}
        InputProps={{
          ...textFieldProps.InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                tabIndex={-1}
                type="button"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
            mt: 1,
        }}
      />
    </Box>
  );
}
