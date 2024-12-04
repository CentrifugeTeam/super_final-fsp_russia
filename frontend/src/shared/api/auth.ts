import { api } from "./base";

export const fetchYandexAuth = async (code: string) => {
  const response = await api.post(`/oauth/yandex?code=${code}`);
  return response.data;
};

// TODO запрос на логин и на ВК
