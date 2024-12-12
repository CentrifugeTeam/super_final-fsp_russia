import { useQuery } from "@tanstack/react-query";
import { api } from "./baseCalendary";

interface TypeEvent {
  sport: string;
  id: number;
}

interface Event {
  name: string;
  start_date: string; // Можно заменить на Date, если хотите работать с объектами Date
  end_date: string;   // То же для end_date
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

// Функция для получения списка команд
const fetchEvents = async () => {
  const response = await api.get<EventsResponse>("/events/small?event_type=%D0%A1%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D0%BE%D0%B5%20%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5&page=1&size=50");
  return response.data;
};

// Хук для использования данных
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(),
    staleTime: 5 * 60 * 1000,
  });
};
