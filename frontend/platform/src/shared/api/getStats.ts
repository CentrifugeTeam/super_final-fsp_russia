import { useQuery } from "@tanstack/react-query";
import { api } from "./base";

// Интерфейс для представления региона
interface Representation {
  name: string;
  photo_url: string;
  contacts: string;
  type: "region";
  id: number;
}

// Интерфейс для лидера региона
interface Leader {
  first_name: string;
  middle_name: string;
  last_name: string;
  username: string;
}

// Интерфейс для статистики по месяцам
interface MonthStatistics {
  date: string; // Дата в формате "YYYY-MM-DD"
  count_participants: number;
}

// Интерфейс для статистики событий
interface Statistics {
  total_events: number;
  completed_events: number;
  current_events: number;
  upcoming_events: number;
}

// Интерфейс для данных о событиях
interface Event {
  name: string;
  start_date: string; // Дата начала события в формате "YYYY-MM-DD"
  end_date: string; // Дата окончания события в формате "YYYY-MM-DD"
  participants_count: number;
  category: string;
  id: number;
  format: string;
  location: {
    country: string;
    region: string;
    city: string;
  };
}

// Основной интерфейс для получаемых данных
interface FederationStatisticsResponse {
  region: {
    users_count: number;
    team_count: number;
    representation: Representation;
    leader: Leader;
  };
  months: MonthStatistics[];
  statistics: Statistics;
  events: Event[];
}

const fetchFederationStatistics = async (
  federationId: number
): Promise<FederationStatisticsResponse> => {
  const response = await api.get(
    `/reps/statistics?federation_id=${federationId}`
  );
  return response.data;
};

// Хук для получения статистики по федерации
export const useFederationStatistics = (federationId: number) => {
  return useQuery<FederationStatisticsResponse>({
    queryKey: ["federationStatistics", federationId], // Уникальный ключ запроса
    queryFn: () => fetchFederationStatistics(federationId), // Функция для загрузки данных
    enabled: !!federationId, // Запрос не будет выполнен, если federationId не существует
  });
};
