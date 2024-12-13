import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/base";

// Функция для получения данных о пользователе по username
const fetchUserByUsername = async (username: string) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};

// Функция для обновления данных пользователя
const updateUser = async (
  username: string,
  data: {
    first_name: string;
    last_name: string;
    email: string;
    middle_name: string;
  }
) => {
  const response = await api.patch(`/users/${username}`, data);
  return response.data;
};

// Хук для получения данных о пользователе по username
export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ["user", username], // Уникальный ключ запроса, зависит от username
    queryFn: () => fetchUserByUsername(username), // Функция для загрузки данных
    enabled: !!username, // Запрос не будет выполнен, если username не существует
  });
};

// Хук для обновления данных пользователя
export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (params: {
      username: string;
      data: {
        first_name: string;
        last_name: string;
        email: string;
        middle_name: string;
      };
    }) => updateUser(params.username, params.data), // Отправка PATCH-запроса с нужными данными
    onSuccess: (data) => {
      // Логика на успешное обновление (например, уведомление или обновление UI)
      console.log("User data updated:", data);
    },
    onError: (error) => {
      // Логика на ошибку
      console.error("Error updating user:", error);
    },
  });
};
