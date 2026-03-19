import React from 'react';
import { CssBaseline } from '@mui/material';
import { LoginForm } from './components/login-form';
// TODO: alias-ы
import { ThemeProvider } from './providers/theme-provider';
// TODO: в теории, это уже не компоненты, а страницы
import { GoodsTable } from './components/goods';
import { AuthGuard } from './components/auth-guard';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthGuard fallback={<LoginForm />}>
        <GoodsTable />
      </AuthGuard>
    </ThemeProvider>
  );
};

export default App;
