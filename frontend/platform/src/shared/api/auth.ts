import { api } from "./base";

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export const fetchYandexAuth = async (code: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`/oauth/yandex?code=${code}`);
  return response.data;
};

export const loginRequest = async (
  login: string,
  password: string
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", {
    login,
    password,
  });
  return response.data;
};

// TODO запрос на ВК
