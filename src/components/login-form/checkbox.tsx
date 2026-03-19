import { Checkbox, FormControlLabel, type FormControlLabelProps } from '@mui/material';
import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface FormCheckboxProps<T extends FieldValues> extends Omit<
  FormControlLabelProps,
  'control' | 'label'
> {
  name: Path<T>;
  register: UseFormRegister<T>;
  label: string;
  //   TODO: проверить необходимость
  errorMessage?: string;
}

export function FormCheckbox<T extends FieldValues>({
  name,
  register,
  label,
  errorMessage,
  ...formControlLabelProps
}: FormCheckboxProps<T>) {
  const {
    onChange,
    onBlur,
    ref,
    name: registeredName,
  } = register(name, {
    setValueAs: (value) => value === true,
  });

  return (
    <>
      <FormControlLabel
        {...formControlLabelProps}
        control={
          <Checkbox
            name={registeredName}
            inputRef={ref}
            onChange={onChange}
            onBlur={onBlur}
            color={errorMessage ? 'error' : 'primary'}
          />
        }
        label={label}
        sx={{
            mb: 1
        }}
      />
      {errorMessage && (
        <span
          style={{
            color: '#f44336',
            fontSize: '0.75rem',
            marginLeft: '14px',
            display: 'block',
            marginTop: '-8px',
            marginBottom: '8px',
          }}
        >
          {errorMessage}
        </span>
      )}
    </>
  );
}
