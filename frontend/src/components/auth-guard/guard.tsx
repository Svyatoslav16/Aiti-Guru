import { Box, CircularProgress } from '@mui/material';
import { useEffect, type ReactNode } from 'react';
// TODO: alias
import { useAuth } from '../../hooks';

interface AuthGuardProps {
  children: ReactNode;
  fallback: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { init, isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    init();
  }, [init]);

  if (!isInitialized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};
