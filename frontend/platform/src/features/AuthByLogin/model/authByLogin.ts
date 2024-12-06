import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/app/redux/slices/authSlice";
import { loginRequest, AuthResponse } from "@/shared/api/auth";

// тип данных для входных параметров мутации
interface LoginInput {
  login: string;
  password: string;
}

// Хук для выполнения мутации логина
export const useLoginMutation = () => {
  const dispatch = useDispatch(); // Используем dispatch для отправки действий в Redux

  const mutation = useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: async ({ login, password }: LoginInput) => {
      const response = await loginRequest(login, password); // Отправляем запрос на логин
      return response;
    },
    onSuccess: (data: AuthResponse) => {
      dispatch(
        loginAction({
          accessToken: data.access_token, // Устанавливаем токен доступа
          refreshToken: data.refresh_token, // Устанавливаем токен обновления
        })
      );
    },
  });

  return mutation;
};
