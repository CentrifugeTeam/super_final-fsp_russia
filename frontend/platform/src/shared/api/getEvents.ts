import { useQuery } from "@tanstack/react-query";
import { apiCalendary } from "./baseCalendary";
import { api } from "./base";

// Интерфейс для событий
interface TypeEvent {
  sport: string;
  id: number;
}

interface Event {
  name: string;
  start_date: string;
  end_date: string;
  participants_count: number;
  category: string;
  id: number;
  type_event: TypeEvent;
}

interface EventsResponse {
  items: Event[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Хук для получения списка событий
const fetchEvents = async (page: number, size: number): Promise<EventsResponse> => {
  const response = await apiCalendary.get<EventsResponse>(`/events/small?event_type=%D0%A1%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D0%B5%20%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5&page=${page}&size=${size}`);
  return response.data;
};

export const useEvents = (page: number, size: number) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(page, size),
    staleTime: 5 * 60 * 1000,
  });
};

// Интерфейс для команд
interface Team {
  name: string;
  id: number;
}

interface TeamsResponse {
  items: Team[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Функция для получения команд по id соревнования
const fetchTeamsByEventId = async (id: number, page: number, size: number): Promise<TeamsResponse> => {
  const response = await api.get<TeamsResponse>(`/teams/sports?sport_id=${id}&page=${page}&size=${size}`);
  return response.data;
};

// Хук для получения команд по id соревнования
export const useTeamsByEventId = (id: number, page: number, size: number) => {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => fetchTeamsByEventId(id, page, size),
    staleTime: 5 * 60 * 1000,
  });
};
