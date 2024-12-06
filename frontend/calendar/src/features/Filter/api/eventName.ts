import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../../../shared/api/base";

export interface IEvent {
  name: string;
}

export interface IEventResponse {
  items: IEvent[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export const fetchEvents = async (
  page: number | undefined,
  size: number | undefined,
  name?: string
): Promise<IEventResponse> => {
  const params: { page?: number; size?: number; name?: string } = {};
  if (name) {
    params.name = name;
  } else {
    params.page = page;
    params.size = size;
  }

  const response = await api.get(`/events/search`, { params });

  return {
    items: response.data.items.map((item: any) => ({
      name: item.name,
    })),
    total: response.data.total,
    page: response.data.page,
    size: response.data.size,
    pages: response.data.pages,
  };
};

export const useEvents = (
  initialPage: number = 1,
  size: number = 10,
  name?: string
) => {
  return useInfiniteQuery<IEventResponse>({
    queryKey: ["events", name],
    queryFn: ({ pageParam = initialPage }) =>
      fetchEvents(
        name ? undefined : (pageParam as number),
        name ? undefined : size,
        name
      ), // Передаем undefined для page и size если есть name
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: initialPage,
    staleTime: 60 * 1000,
  });
};
