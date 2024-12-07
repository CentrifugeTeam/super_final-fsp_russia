import { useQuery } from "@tanstack/react-query";
import { api } from "./base";
import { IData } from "@/interfaces";



// Функция для выполнения GET-запроса
const fetchReps = async (): Promise<IData> => {
  const response = await api.get<IData>("/reps/");
  return response.data;
};

// Хук для использования данных
export const useReps = () => {
  return useQuery({
    queryKey: ["reps"], // Уникальный ключ запроса
    queryFn: fetchReps, // Функция загрузки данных
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
  });
};
