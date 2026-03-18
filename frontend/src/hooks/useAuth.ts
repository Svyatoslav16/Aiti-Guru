import { useUnit } from 'effector-react';
import {
  $authStore,
  $user,
  $accessToken,
  $isAuthenticated,
  $isLoading,
  $error,
  loginRequested,
  logoutRequested,
  errorCleared,
  initializeAuth,
} from '../store/authStore';
import { useCallback } from 'react';

export const useAuth = () => {
  const [authStore, user, accessToken, isAuthenticated, isLoading, error] = useUnit([
    $authStore,
    $user,
    $accessToken,
    $isAuthenticated,
    $isLoading,
    $error,
  ]);

  const login = (username: string, password: string, rememberMe: boolean) => {
    loginRequested({ username, password, rememberMe });
  };

  const logout = () => {
    logoutRequested();
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
    isLoading,
    error,
    login,
    logout,
    clearError,
    init,
  };
};
