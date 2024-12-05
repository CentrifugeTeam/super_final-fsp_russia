import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "@/app/redux/slices/authSlice";
import { api } from "@/shared/api/base";

export const useVkAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Функция для начала авторизации
  const startAuth = () => {
    const clientId = 52798361; // Замените на ваш client_id
    const redirectUri = "https://centrifugo.tech/api/oauth/vk/callback"; // Ваш redirect URI

    const state = "<случайно сгенерированная строка>";
    const codeVerifier = "<ваш сгенерированный code_verifier>";

    // URL для авторизации
    const authUrl = `https://id.vk.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${codeVerifier}&code_challenge_method=S256&scope=email phone`;

    // Перенаправляем пользователя на страницу авторизации
    window.location.href = authUrl;
  };

  // Функция для обработки callback с VK ID после авторизации
  const handleVkCallback = async (
    code: string,
    state: string,
    deviceId: string,
    codeVerifier: string
  ) => {
    try {
      const response = await api.post("/oauth/vk/callback", {
        code,
        state,
        device_id: deviceId,
        code_verifier: codeVerifier,
      });

      // Если авторизация прошла успешно
      const { access_token, refresh_token } = response.data;

      // Сохраняем токены в Redux
      dispatch(
        login({
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      );

      // Перенаправляем пользователя в профиль
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка авторизации через VK:", error);
    }
  };

  return { startAuth, handleVkCallback };
};
