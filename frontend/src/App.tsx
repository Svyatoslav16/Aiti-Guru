import React, { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { LoginForm } from './components/login-form';
import { useAuth } from './hooks/useAuth';
// TODO: alias-ы
import { ThemeProvider } from './providers/theme-provider';
// TODO: в теории, это уже не компоненты, а страницы
import { GoodsTable } from './components/goods';

// TODO: вынести в отдельный файл


const App: React.FC = () => {
  const { init, isAuthenticated } = useAuth();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <ThemeProvider>
      <CssBaseline />
      {/* TODO: нет изначальной проверки, что пользователь уже авторизован */}
      {isAuthenticated ? <GoodsTable /> : <LoginForm />}
    </ThemeProvider>
  );
};

export default App;