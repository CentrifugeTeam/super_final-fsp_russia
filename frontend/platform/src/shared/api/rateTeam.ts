import { useMutation } from "@tanstack/react-query";
import { api } from "./base"; // Ваш настроенный axios

// Определяем тип параметров
interface SubmitScoreParams {
  id: number; // ID, который передается в путь
  score: number; // Счет, который передается в запрос
}

// Функция для отправки POST запроса на сервер
const submitScore = async ({ id, score }: SubmitScoreParams) => {
  const response = await api.post(
    `/teams/solutions/${id}/score?score=${score}`,
    {},
    {
      headers: {
        "Content-Type": "application/json", // Указываем тип контента
      },
    }
  );
  return response.data;
};

export const useSubmitScore = () => {
  return useMutation({
    mutationFn: submitScore, // Функция для отправки POST запроса
    onSuccess: (data) => {
      console.log("Счет успешно отправлен:", data);
      // Выполните дополнительные действия после успешного запроса
    },
    onError: (error) => {
      console.error("Ошибка при отправке счета:", error);
      // Обработка ошибок, например уведомления или логирование
    },
  });
};
