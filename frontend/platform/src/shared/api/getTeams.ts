import { useQuery } from "@tanstack/react-query";
import { api } from "./base"; // Предполагается, что `api` настроен с базовым URL и заголовками

export interface TeamsRequestParams {
  federal_name: string;
  score?: number; // Сделано необязательным
  page: number;
  size: number;
}

// Ответ от API
interface TeamResponse {
  items: Array<{
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
  }>;
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Функция для получения данных
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
