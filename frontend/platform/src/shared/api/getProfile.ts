import { useQuery } from "@tanstack/react-query";
import { api } from "./base";

const fetchUserProfile = async () => {
  const response = await api.get("/users/me");
  return response.data;
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    // staleTime: 1000 * 60 * 5, // 5 минут данные считаются свежими
  });
};


// Функция для получения пользователя
const fetchTeamById = async (username: string) => {
  const response = await api.get(`/users/${username}`);
  return response.data;
};

// Хук для использования данных пользователя по username
export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ["user", username], // Уникальный ключ запроса, зависит от username
    queryFn: () => fetchTeamById(username), // Функция для загрузки данных
    staleTime: 1000 * 60 * 5, // Данные считаются свежими в течение 5 минут
    enabled: !!username, // Запрос не будет выполнен, если username не существует
  });
};
