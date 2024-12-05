import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { registerRequest, RegisterInput } from "@/shared/api/registration";

export const useRegisterUserMutation = () => {
  const mutation = useMutation<number, AxiosError, RegisterInput>({
    mutationFn: registerRequest,
    onError: (error: AxiosError) => {
      console.error(
        "Registration error:",
        error.response?.status,
        error.response?.data
      );
      // Здесь можно добавить логику обработки ошибок, например, уведомления
    },
    onSuccess: (status: number) => {
      console.log("User registered successfully with status:", status);
      // Здесь можно выполнить действия после успешной регистрации
    },
  });

  return mutation;
};
