import { createStore, createEvent, createEffect, sample, combine } from 'effector';
import { authApi } from '../api/auth';
import { isUser, storage } from '../utils/storage';
import type { IAuthStore, ILoginRequest, IUser } from '../types/auth';

export const loginRequested = createEvent<ILoginRequest & { rememberMe: boolean }>();
export const errorCleared = createEvent();
export const initializeAuth = createEvent();

initializeAuth.watch((payload) => {
  console.log('вызов initializeAuth: ', {
    payload,
  });
});

const loginFx = createEffect(async (payload: ILoginRequest & { rememberMe: boolean }) => {
  const response = await authApi.login({
    username: payload.username,
    password: payload.password,
    expiresInMins: payload.expiresInMins,
  });

  storage.setAccessToken(response.accessToken, payload.rememberMe);
  storage.setRefreshToken(response.refreshToken, payload.rememberMe);
  storage.setRememberMe(payload.rememberMe);

  return {
    user: response,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
});

const fetchUserFx = createEffect(async (accessToken: string | null) => {
  if (!accessToken) return;
  const user = await authApi.getCurrentUser(accessToken);
  return user;
});

export const $user = createStore<IUser | null>(null);
// TODO: посмотреть, как истекает токен
export const $accessToken = createStore<string | null>(null);
export const $refreshToken = createStore<string | null>(null);
export const $isLoading = createStore<boolean>(false);
export const $error = createStore<string | null>(null);
export const $isInitialized = createStore<boolean>(false);

export const $isAuthenticated = combine({ accessToken: $accessToken, user: $user }, ({ accessToken, user }) => {
    return accessToken !== null && !!user
});

export const $authStore = combine<IAuthStore>({
  user: $user,
  accessToken: $accessToken,
  refreshToken: $refreshToken,
  isAuthenticated: $isAuthenticated,
  isLoading: $isLoading,
  error: $error,
});

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
  clock: [loginFx, fetchUserFx],
  fn: () => true,
  target: $isLoading,
});

sample({
  clock: [loginFx.done, loginFx.fail, fetchUserFx.done, fetchUserFx.fail],
  fn: () => false,
  target: $isLoading,
});

sample({
  clock: errorCleared,
  fn: () => null,
  target: $error,
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
    return token !== null;
  },
  target: [fetchUserFx, $accessToken],
});

sample({
  clock: fetchUserFx.doneData,
  filter: isUser,
  fn: (data) => data || null,
  target: $user,
});

sample({
  clock: fetchUserFx.done,
  fn: () => true,
  target: $isInitialized,
});

sample({
  clock: $accessToken,
  filter: (token) => token === null || token === '',
  fn: () => true,
  target: $isInitialized,
});
