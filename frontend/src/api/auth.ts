import type { IAuthResponse, ILoginRequest, IRefreshResponse, IUser } from '../types/auth';

const API_BASE_URL = '/api/auth';

export const authApi = {
  login: async (credentials: ILoginRequest): Promise<IAuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });

    // TODO: тут, в теории, должна быть нормальная обработка ответа
    return response.json();
  },

  getCurrentUser: async (accessToken: string): Promise<IUser> => {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    return response.json();
  },

  refreshToken: async (
    refreshToken?: string,
    expiresInMins?: number,
  ): Promise<IRefreshResponse> => {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        refreshToken,
        expiresInMins,
      }),
    });

    return response.json();
  },
};
