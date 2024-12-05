import { BeatLoader } from "react-spinners";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Импортируем useNavigate
import { useMutation } from "@tanstack/react-query";
import styles from "./sendcode.module.scss";
import { fetchYandexAuth } from "@/shared/api/auth";

export const SendCode = () => {
  const location = useLocation(); // Получаем объект location
  const navigate = useNavigate(); // Получаем функцию для навигации

  // Извлекаем параметр code из строки запроса
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code"); // Получаем значение параметра code

  const mutation = useMutation({
    mutationFn: fetchYandexAuth,
    onSuccess: (data) => {
      console.log("Successfully authenticated:", data);
      // После успешной аутентификации перенаправляем на защищенную страницу
      navigate("/profile"); // Перенаправление на страницу профиля
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
  }, [code]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {mutation.status === "pending" && (
          <BeatLoader color="#ffffff" margin={10} size={39} />
        )}
        {mutation.status === "success" && (
          <p className={styles.title}> Successfully authenticated</p>
        )}
        {mutation.status === "error" && (
          <p className={styles.title}>Error occurred during authentication</p>
        )}
      </div>
    </div>
  );
};

export default SendCode;
