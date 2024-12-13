import { useQuery } from "@tanstack/react-query";
import { api } from "./base";

// Функция для получения статистики федерации по id
const fetchFederationStatistics = async (id: number) => {
  const response = await api.get(`/reps/federations/${id}/export/statistics`);
  return response.data;
};

// Хук для использования данных статистики федерации
export const useFederationStatistics = (id: number) => {
  return useQuery({
    queryKey: ["federationStatistics", id], // Уникальный ключ запроса, включает id
    queryFn: () => fetchFederationStatistics(id), // Функция для загрузки данных
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
    enabled: !!id, // Запрос не будет выполнен, если id не существует или равно 0
  });
};
