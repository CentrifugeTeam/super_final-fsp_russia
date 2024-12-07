import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "./base";

// тип данных, которые ожидает запрос
interface SuggestionRequest {
  competition: string;
  location: string;
  start_date: string;
  end_date: string;
  format: string;
  count_participants: number;
  age: string;
  name: string;
}
export interface Suggestion {
  competition: string;
  location: string;
  start_date: string;
  end_date: string;
  format: string;
  count_participants: number;
  age: string;
  name: string;
  id: number;
  status: string;
}

// Функция для отправки POST-запроса с типизированными данными
const sendReq = async (data: SuggestionRequest) => {
  const response = await api.post("/suggestions/", data);
  return response.data;
};

// Кастомный хук для отправки POST-запроса
export const useSendReq = () => {
  return useMutation({
    mutationFn: sendReq,
  });
};

// Функция для получения списка заявок
const fetchSuggestions = async (): Promise<Suggestion[]> => {
  const response = await api.get("/suggestions/");
  return response.data;
};

// Кастомный хук для получения списка заявок
export const useSuggestions = () => {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: fetchSuggestions,
  });
};
