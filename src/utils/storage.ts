import type { IUser, IUserAuthError } from '../types/auth';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const REMEMBER_ME_KEY = 'auth_remember_me';

export const storage = {
  // Access Token
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string, rememberMe: boolean): void => {
    if (rememberMe) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
  },

  removeAccessToken: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string, rememberMe: boolean): void => {
    if (rememberMe) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Remember Me
  setRememberMe: (value: boolean): void => {
    localStorage.setItem(REMEMBER_ME_KEY, value.toString());
  },

  getRememberMe: (): boolean => {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  },

  clearAuthData: (): void => {
    storage.removeAccessToken();
    storage.removeRefreshToken();
  },

  initializeStorage: (): void => {
    const rememberMe = storage.getRememberMe();
    const accessToken = storage.getAccessToken();
    const refreshToken = storage.getRefreshToken();

    if (!rememberMe && (accessToken || refreshToken)) {
      // Если rememberMe не установлен, переносим токены в sessionStorage
      if (accessToken) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      }
      if (refreshToken) {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  },
};

export const isUser = (obj: IUser | IUserAuthError | undefined): obj is IUser => {
  if (!obj || 'message' in obj || !obj.id) {
    return false;
  }

  return true;
};
