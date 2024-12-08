import { useQuery } from "@tanstack/react-query";
import { api } from "./base"; // Базовая настройка API

// Функция для выполнения запроса
const fetchFederations = async () => {
  const response = await api.get("/reps/federations");
  return response.data;
};

// Кастомный хук для получения данных
export const useFederations = () => {
  return useQuery({
    queryKey: ["federations"], // Ключ для кэширования
    queryFn: fetchFederations, // Функция запроса
    staleTime: 60 * 1000, // Время устаревания данных
  });
};
