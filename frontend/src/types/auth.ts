export interface IUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface IAuthResponse extends IUser {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface IRefreshRequest {
  refreshToken?: string;
  expiresInMins?: number;
}

export interface IRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthStore {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
