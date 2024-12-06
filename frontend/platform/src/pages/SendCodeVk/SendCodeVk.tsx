import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../SendCode/sendcode.module.scss";
import { api } from "@/shared/api/base";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/slices/authSlice";

export const SendCodeVk = () => {
  const location = useLocation(); // Получаем объект location
  const navigate = useNavigate(); // Для перенаправления
  const dispatch = useDispatch(); // Для работы с Redux

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code"); // Получаем значение параметра code
  const state = searchParams.get("state"); // Получаем значение параметра state

  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  useEffect(() => {
    const fetchVkAuth = async () => {
      if (!code || !state) {
        console.error("Code or state not found in URL");
        setStatus("error");
        return;
      }

      setStatus("pending");
      try {
        // Отправляем запрос на сервер с кодом и другими параметрами
        const response = await api.post("/oauth/vk/callback", {
          code,
          state,
          device_id: "some_device_id", // Укажите идентификатор устройства
          code_verifier: "some_code_verifier", // Укажите значение code_verifier
        });

        const { access_token, refresh_token } = response.data;

        // Сохраняем токены в Redux
        dispatch(
          login({
            accessToken: access_token,
            refreshToken: refresh_token,
          })
        );

        setStatus("success");

        // Перенаправляем пользователя на страницу профиля
        navigate("/profile");
      } catch (error) {
        console.error("Error during VK authentication:", error);
        setStatus("error");
      }
    };

    fetchVkAuth();
  }, [code, state, dispatch, navigate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {status === "pending" && (
          <BeatLoader color="#ffffff" margin={10} size={39} />
        )}
        {status === "success" && (
          <p className={styles.title}>Успешная авторизация через VK</p>
        )}
        {status === "error" && (
          <p className={styles.title}>Ошибка при авторизации через VK</p>
        )}
      </div>
    </div>
  );
};

export default SendCodeVk;
