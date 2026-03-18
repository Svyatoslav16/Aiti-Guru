import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Login as LoginIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../hooks/useAuth';
// TODO: path alias-ы
import { loginSchema, type TLoginFormData } from '../../schemas/auth.schema';
import { FormCheckbox } from './checkbox';
import { FormPasswordField } from './password-field';
import { FormTextField } from './text-field';

import LogoIcon from '../../assets/logo.svg?react';

const DEFAULT_FORM_STATE: TLoginFormData = {
  username: '',
  password: '',
  rememberMe: false,
}

export const LoginForm = () => {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  const formMethods: UseFormReturn<TLoginFormData> = useForm<TLoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_FORM_STATE,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = formMethods;

  useEffect(() => {
    if (error && (errors.username || errors.password)) {
      clearError();
    }
  }, [errors.username, errors.password, error, clearError]);

  const onSubmit = async (data: TLoginFormData) => {
    try {
      const rememberMe = Boolean(data.rememberMe ?? false);
      await login(data.username, data.password, rememberMe);
      reset({ username: '', password: '', rememberMe: false });
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: 'Произошла ошибка при авторизации',
      });
      console.error(err)
    }
  };

  if (isAuthenticated) {
    return (
      <Container maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Alert severity="success">Вы успешно авторизовались!</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '520px',
            borderRadius: 3,
            minWidth: '520px'
          }}
        >
          <LogoIcon />
          <Typography
            component="h2"
            variant="h3"
            sx={{
              mb: 1.5,
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '2rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            Добро пожаловать!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              opacity: 0.7,
            }}
          >
            Пожалуйста, авторизуйтесь
          </Typography>

          {error && !errors.root && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: 3,
              }}
              onClose={() => clearError()}
            >
              {error}
            </Alert>
          )}

{/* TODO: возможно убрать */}
          {errors.root && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: 3,
              }}
            >
              {errors.root.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }} noValidate>
            <FormTextField
              name="username"
              register={register}
              label="Логин"
              autoFocus
              isRequired
              errorMessage={errors.username?.message}
              showClearButton
              setValue={setValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <CloseIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
              fullWidth
              margin="normal"
              sx={{ mb: 2 }}
            />

            {/* Поле Password */}
            <FormPasswordField
              name="password"
              register={register}
              label="Пароль"
              isRequired
              errorMessage={errors.password?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
              fullWidth
              margin="normal"
              sx={{ mb: 2 }}
            />

            <FormCheckbox
              name="rememberMe"
              register={register}
              label="Запомнить меня"
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
              }}
            >
              {isLoading ? 'Вход...' : 'Войти'}
            </Button>

            {/* FIXME: убрать */}
            <Typography
              variant="body2"
              align="center"
              sx={{
                mt: 3,
                color: 'text.secondary',
                opacity: 0.6,
                fontSize: '0.75rem',
              }}
            >
              Тестовые данные: emilys / emilyspass
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
