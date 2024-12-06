import { useQuery } from "@tanstack/react-query";
import { api } from "./base";

export interface Leader {
  fio: string;
  username: string;
}

export interface Region {
  region_name: string;
  leader: Leader;
  contacts: string;
  id: number;
}

export interface Rep {
  region: Region;
  name: string;
}

// Функция для выполнения GET-запроса
const fetchReps = async (): Promise<Rep[]> => {
  const response = await api.get<Rep[]>("/reps/");
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
