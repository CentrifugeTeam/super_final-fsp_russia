import { BeatLoader } from "react-spinners";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styles from "./sendcode.module.scss";
import { fetchYandexAuth } from "@/shared/api/auth";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/slices/authSlice";

export const SendCode = () => {
  const location = useLocation(); // Получаем объект location
  const navigate = useNavigate(); // Для перенаправления
  const dispatch = useDispatch(); // Для работы с Redux

  // Извлекаем параметр code из строки запроса
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code"); // Получаем значение параметра code

  // Мутация для получения токенов
  const mutation = useMutation({
    mutationFn: fetchYandexAuth,
    onSuccess: (data) => {
      // Сохраняем токены в Redux
      dispatch(
        login({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })
      );

      // Перенаправляем пользователя на страницу профиля
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Error during authentication:", error);
    },
  });

  useEffect(() => {
    if (code) {
      mutation.mutate(code); // Мутируем код, если он есть
    } else {
      console.error("Code not found in URL");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]); // Убираем mutation из зависимостей

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {mutation.status === "pending" && (
          <BeatLoader color="#ffffff" margin={10} size={39} />
        )}
        {mutation.status === "success" && (
          <p className={styles.title}>Успешная авторизация</p>
        )}
        {mutation.status === "error" && (
          <p className={styles.title}>Ошибка при авторизации</p>
        )}
      </div>
    </div>
  );
};

export default SendCode;
