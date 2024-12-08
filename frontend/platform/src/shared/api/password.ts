import { useMutation } from "@tanstack/react-query";
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

interface ResetPasswordRequest {
  token: string;
  password: string;
}

// Функция для отправки запроса на сброс пароля
const sendPasswordResetRequest = async (data: ResetPasswordRequest) => {
  const response = await api.post("/accounts/password/reset", data);
  return response.data;
};

// Кастомный хук для сброса пароля
export const useSendPasswordResetRequest = () => {
  return useMutation({
    mutationFn: sendPasswordResetRequest,
  });
};
