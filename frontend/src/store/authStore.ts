import { createStore, createEvent, createEffect, sample, combine } from 'effector';
import { authApi } from '../api/auth';
import { storage } from '../utils/storage';
import type { IAuthStore, ILoginRequest, IUser } from '../types/auth';

// Events
export const loginRequested = createEvent<ILoginRequest & { rememberMe: boolean }>();
export const logoutRequested = createEvent();
export const errorCleared = createEvent();
export const initializeAuth = createEvent();

initializeAuth.watch((payload) => {
  console.log('вызов initializeAuth: ', {
    payload,
  });
});

// Effects
const loginFx = createEffect(async (payload: ILoginRequest & { rememberMe: boolean }) => {
  const response = await authApi.login({
    username: payload.username,
    password: payload.password,
    expiresInMins: payload.expiresInMins,
  });

  // Сохраняем токены в зависимости от rememberMe
  storage.setAccessToken(response.accessToken, payload.rememberMe);
  storage.setRefreshToken(response.refreshToken, payload.rememberMe);
  storage.setRememberMe(payload.rememberMe);

  return {
    user: response,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
});

const refreshSessionFx = createEffect(async () => {
  const refreshToken = storage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');

  const response = await authApi.refreshToken(refreshToken);

  // Определяем, где хранить токены на основе rememberMe
  const rememberMe = storage.getRememberMe();
  storage.setAccessToken(response.accessToken, rememberMe);
  storage.setRefreshToken(response.refreshToken, rememberMe);

  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
});

const fetchUserFx = createEffect(async (accessToken: string | null) => {
  // TODO: проверить
  if (!accessToken) return;
  const user = await authApi.getCurrentUser(accessToken);
  // eslint-disable-next-line consistent-return
  return user;
});

// Stores
export const $user = createStore<IUser | null>(null);
export const $accessToken = createStore<string | null>(null);
export const $refreshToken = createStore<string | null>(null);
export const $isLoading = createStore<boolean>(false);
export const $error = createStore<string | null>(null);

// Computed store
export const $isAuthenticated = combine($accessToken, (accessToken) => accessToken !== null);

export const $authStore = combine<IAuthStore>({
  user: $user,
  accessToken: $accessToken,
  refreshToken: $refreshToken,
  isAuthenticated: $isAuthenticated,
  isLoading: $isLoading,
  error: $error,
});

// Sample handlers
sample({
  clock: loginRequested,
  target: loginFx,
});

sample({
  clock: loginFx.doneData,
  fn: (data) => data.user,
  target: $user,
});

sample({
  clock: loginFx.doneData,
  fn: (data) => {
    console.log('loginFx.doneData: ', {
      data,
    });

    return data.accessToken;
  },
  target: $accessToken,
});

sample({
  clock: loginFx.doneData,
  fn: (data) => data.refreshToken,
  target: $refreshToken,
});

sample({
  clock: loginFx.done,
  fn: () => null,
  target: $error,
});

sample({
  clock: loginFx.fail,
  fn: (error) => error.error.message,
  target: $error,
});

sample({
  clock: [loginFx, refreshSessionFx, fetchUserFx],
  fn: () => true,
  target: $isLoading,
});

sample({
  clock: [
    loginFx.done,
    loginFx.fail,
    refreshSessionFx.done,
    refreshSessionFx.fail,
    fetchUserFx.done,
    fetchUserFx.fail,
  ],
  fn: () => false,
  target: $isLoading,
});

sample({
  clock: errorCleared,
  fn: () => null,
  target: $error,
});

// Logout handler
sample({
  clock: logoutRequested,
  fn: () => {
    storage.clearAuthData();
    return null;
  },
  target: $user,
});

sample({
  clock: logoutRequested,
  fn: () => null,
  target: $accessToken,
});

sample({
  clock: logoutRequested,
  fn: () => null,
  target: $refreshToken,
});

// Initialize auth on app load
sample({
  clock: initializeAuth,
  fn: () => {
    storage.initializeStorage();
    const token = storage.getAccessToken();
    return token;
  },
  filter: (token) => {
    console.log({
      token,
    });

    return token !== null;
  },
  target: [fetchUserFx, $accessToken],
});

sample({
  clock: fetchUserFx.doneData,
  fn: (data) => data || null,
  target: $user,
});

// Refresh token if exists on init
sample({
  clock: initializeAuth,
  filter: () => !storage.getAccessToken() && storage.getRefreshToken() !== null,
  target: refreshSessionFx,
});

sample({
  clock: refreshSessionFx.doneData,
  fn: (data) => data.accessToken,
  target: $accessToken,
});

sample({
  clock: refreshSessionFx.doneData,
  fn: (data) => data.refreshToken,
  target: $refreshToken,
});

sample({
  clock: refreshSessionFx.doneData,
  filter: () => $user.getState() === null,
  fn: (data) => data.accessToken,
  target: fetchUserFx,
});
