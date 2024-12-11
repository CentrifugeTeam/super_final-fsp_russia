import { useQuery } from "@tanstack/react-query";
import { api } from "./base"; // Предполагается, что `api` настроен с базовым URL и заголовками

export interface TeamsRequestParams {
  federal_name?: string;
  score?: number; // Сделано необязательным
  page: number;
  size: number;
}

// Ответ от API
export interface Team {
  name: string;
  created_at: string;
  about: string;
  users: Array<{
    username: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    about: string;
    id: number;
    photo_url: string;
    is_superuser: boolean;
    is_verified: boolean;
  }>;
  event_id: number;
  federal: {
    id: number;
    name: string;
  };
  solutions: Array<{
    team_repository: string;
    solution: string;
    score: number;
    id: number;
    team_id: number;
  }>;
}

// Теперь используем интерфейс Team в TeamResponse
interface TeamResponse {
  items: Array<Team>;
  total: number;
  page: number;
  size: number;
  pages: number;
};

interface TeamById {
  name: string;
  created_at: string;
  about: string;
  id: number;
  event_id: number;
  federal_representation_id: number;
}

// Функция для получения списка команд
const fetchTeams = async (
  params: TeamsRequestParams
): Promise<TeamResponse> => {
  const response = await api.get<TeamResponse>("/teams/", {
    params, // Передаем параметры через query string
  });
  return response.data;
};

// Хук для использования данных
export const useTeams = (params: TeamsRequestParams) => {
  return useQuery({
    queryKey: ["teams", params],
    queryFn: () => fetchTeams(params),
    staleTime: 5 * 60 * 1000, // Время устаревания данных
  });
};


// Функция для получения команды
const fetchTeamById = async (id: string): Promise<TeamById> => {
  const response = await api.get<TeamById>(`/teams/${id}`);
  return response.data;
};

// Хук для использования данных команды по ID
export const useSuggestionById = (id: string) => {
  return useQuery({
    queryKey: ["teams", id], // Уникальный ключ запроса, зависит от ID
    queryFn: () => fetchTeamById(id), // Функция для загрузки данных
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
    enabled: !!id, // Запрос не будет выполнен, если ID не существует
  });
};
