import { useMutation } from "@tanstack/react-query";
import { api } from "./base";

// Тип данных для запроса
interface VerifyRequest {
  email: string;
}

// Тип данных для запроса с токеном
interface VerifyTokenRequest {
  token: string;
}

// Функция для отправки POST-запроса
const sendVerifyRequest = async (data: VerifyRequest) => {
  const response = await api.post("/accounts/verify/request", data);
  return response.data;
};

// Кастомный хук для отправки запроса
export const useSendVerifyRequest = () => {
  return useMutation({
    mutationFn: sendVerifyRequest,
  });
};

// Функция для отправки POST-запроса на верификацию с токеном
const sendVerifyTokenRequest = async (data: VerifyTokenRequest) => {
  const response = await api.post("/accounts/verify/", data);
  return response.data;
};

// Кастомный хук для отправки запроса на верификацию с токеном
export const useSendVerifyTokenRequest = () => {
  return useMutation({
    mutationFn: sendVerifyTokenRequest,
  });
};
