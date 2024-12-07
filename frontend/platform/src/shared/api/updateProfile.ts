import { useMutation } from "@tanstack/react-query";
import { api } from "./base"; // Ваш настроенный axios
import { useUserProfile } from "./getProfile";

// Функция для отправки PATCH запроса на сервер
const updateUserProfile = async (updatedData: FormData) => {
  const response = await api.patch("/users/me", updatedData, {
    headers: {
      "Content-Type": "multipart/form-data", // Указываем правильный тип контента для FormData
    },
  });
  return response.data;
};

export const useUpdateUserProfile = () => {
  const { refetch } = useUserProfile(); // Получаем refetch из useUserProfile

  return useMutation({
    mutationFn: updateUserProfile, // Функция для отправки PATCH запроса
    onSuccess: (data) => {
      console.log("Профиль успешно обновлен:", data);
      refetch();
      // Можете здесь обновить состояние или выполнить другие действия при успешном обновлении
    },
    onError: (error) => {
      console.error("Ошибка при обновлении профиля:", error);
      // Здесь можно обработать ошибки, например, уведомления или логи
    },
  });
};
