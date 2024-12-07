import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./base";
// import { ISuggestion } from "@/interfaces";

// Интерфейс для заявки
export interface ISuggestion {
  id: string; // Уникальный идентификатор заявки
  name: string; // Имя заявки
  competition: string; // Название соревнования
  location: string; // Место проведения
  start_date: string; // Дата начала
  end_date: string; // Дата окончания
  format: "online" | "offline" | "both"; // Формат (онлайн, офлайн или оба)
  age: string; // Возрастное ограничение
  count_participants: number; // Количество участников
  created_at: string; // Дата создания заявки
  updated_at: string; // Дата последнего обновления заявки
}

// Функция для выполнения GET-запроса по ID заявки
const fetchSuggestionById = async (id: string): Promise<ISuggestion> => {
  const response = await api.get<ISuggestion>(`/suggestions/${id}`);
  return response.data;
};

// Хук для использования данных заявки по ID
export const useSuggestionById = (id: string) => {
  return useQuery({
    queryKey: ["suggestion", id], // Уникальный ключ запроса, зависит от ID
    queryFn: () => fetchSuggestionById(id), // Функция для загрузки данных
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
    enabled: !!id, // Запрос не будет выполнен, если ID не существует
  });
};

const updateSuggestionById = async (
  id: string,
  data: Partial<ISuggestion>
): Promise<ISuggestion> => {
  const response = await api.patch<ISuggestion>(`/suggestions/${id}`, data);
  return response.data;
};

// Хук для обновления данных заявки
export const useUpdateSuggestionById = () => {
  return useMutation<
    ISuggestion,
    Error,
    { id: string; data: Partial<ISuggestion> }
  >({
    mutationFn: ({ id, data }) => updateSuggestionById(id, data),
  });
};
