import { useQuery } from "@tanstack/react-query";
import { api } from "./base"; // Базовая настройка API

// Определите тип данных
interface Federation {
  id: string; // или number, в зависимости от структуры
  name: string;
}

// Функция для выполнения запроса
const fetchFederations = async () => {
  const response = await api.get("/reps/federations");
  return response.data;
};

// Кастомный хук
export const useFederations = () => {
  return useQuery<Federation[]>({
    queryKey: ["federations"],
    queryFn: fetchFederations,
    staleTime: 60 * 1000,
  });
};
