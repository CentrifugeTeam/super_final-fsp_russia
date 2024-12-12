import { useQuery } from "@tanstack/react-query";
import { api } from "./base";
import { IFederalDistrictData } from "@/interfaces";

export interface ContactInfo {
  name: string;
  photo_url: string;
  contacts: string;
  id: number;
}

// Функция для выполнения GET-запроса
const fetchReps = async (): Promise<IFederalDistrictData[]> => {
  const response = await api.get<IFederalDistrictData[]>("/reps/");
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


// Функция для выполнения GET-запроса
const fetchRepsAreas = async () => {
  const response = await api.get<ContactInfo>("/reps/areas");
  return response.data;
};

// Хук для использования данных
export const useRepsAreas = () => {
  return useQuery({
    queryKey: ["repsAreas"], // Уникальный ключ запроса
    queryFn: fetchRepsAreas, // Функция загрузки данных
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
  });
};
