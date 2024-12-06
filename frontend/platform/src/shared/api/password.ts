import { api } from "./base";

interface ForgotPasswordResponse {
  message: string;
}
interface ResetPasswordRequest {
  token: string;
  password: string;
}

export const sendForgotPasswordEmail = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    "/accounts/password/forgot",
    { email }
  );
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const response = await api.post<ForgotPasswordResponse>(
    "/accounts/password/reset", // Обновите эндпоинт на нужный
    data // Отправляем объект с token и password
  );
  return response.data;
};
