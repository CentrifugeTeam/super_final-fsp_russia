import { useQuery } from "@tanstack/react-query";
import { api } from "./base";
import { useParams } from "react-router-dom";

// Интерфейс для представления региона
interface IRegionRepresentation {
  id: number;
  representation: {
    name: string;
    photo_url: string;
    contacts: string;
    type: string;
    id: number;
  };
  leader: {
    username: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    about: string | null; // Может быть строкой или null
    id: number;
    photo_url: string;
    is_superuser: boolean;
    is_verified: boolean;
  };
}

// Главный интерфейс для всего ответа
export interface IRegionResponse {
  RegionRepresentation: IRegionRepresentation; // Представление региона
  team_count: number; // Количество команд в регионе
  users_count: number; // Количество пользователей в регионе
	federal_name: string;
}

// Функция для выполнения GET-запроса с использованием идентификатора региона
const fetchRepsById = async (id: string): Promise<IRegionResponse> => {
  const response = await api.get<IRegionResponse>(`/reps/${Number(id)-1}`);
  return response.data;
};

// Хук для использования данных региона
export const useRepss = () => {
  const { id } = useParams<{ id: string }>(); // Извлекаем id из URL и указываем его тип

  return useQuery<IRegionResponse, Error>({
    queryKey: ["fetchRegionById", id], // Уникальный ключ запроса включает id
    queryFn: () => fetchRepsById(id!), // Передаем id в функцию загрузки данных
    enabled: !!id, // Запрос осуществляется только если id существует
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
  });
};
