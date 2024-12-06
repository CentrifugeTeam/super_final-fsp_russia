import { api } from "@/shared/api/base";

export interface RegisterInput {
  username: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  password: string;
  photo: File;
}

/**
 * Функция для выполнения запроса регистрации пользователя.
 * @param input Входные данные для регистрации.
 * @returns HTTP статус ответа.
 */
export const registerRequest = async (
  input: RegisterInput
): Promise<number> => {
  const formData = new FormData();
  formData.append("username", input.username);
  formData.append("first_name", input.first_name);
  formData.append("middle_name", input.middle_name);
  formData.append("last_name", input.last_name);
  formData.append("email", input.email);
  formData.append("password", input.password);
  formData.append("photo", input.photo);

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.status; // Возвращаем статус
};
