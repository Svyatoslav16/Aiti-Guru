import React, { type ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

import { theme } from '../theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
};