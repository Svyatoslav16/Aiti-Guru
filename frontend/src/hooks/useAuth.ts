import { useUnit } from 'effector-react';
import {
  $authStore,
  $user,
  $accessToken,
  $isAuthenticated,
  $isInitialized,
  $isLoading,
  $error,
  loginRequested,
  errorCleared,
  initializeAuth,
} from '../store/auth-store';
import { useCallback } from 'react';

export const useAuth = () => {
  const [authStore, user, accessToken, isAuthenticated, isInitialized, isLoading, error] = useUnit([
    $authStore,
    $user,
    $accessToken,
    $isAuthenticated,
    $isInitialized,
    $isLoading,
    $error,
  ]);

  const login = (username: string, password: string, rememberMe: boolean) => {
    loginRequested({ username, password, rememberMe });
  };

  const clearError = () => {
    errorCleared();
  };

  const init = useCallback(() => {
    initializeAuth();
  }, []);

  return {
    ...authStore,
    user,
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    login,
    clearError,
    init,
  };
};
