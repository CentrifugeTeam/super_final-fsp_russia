import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Импортируем хук useLocation
import { useSendVerifyTokenRequest } from "@/shared/api/acceptEmail"; // Путь к хукe
import styles from "./emailverified.module.scss";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const EmailVerified = () => {
  const query = useQuery();
  const token = query.get("token"); // Извлекаем токен из параметров URL
  const { mutate, isPending, isSuccess, isError, error } =
    useSendVerifyTokenRequest();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (token) {
      mutate({ token });
    }
  }, [mutate, token]);

  useEffect(() => {
    if (isPending) {
      setMessage("Выполняется верификация...");
    } else if (isSuccess) {
      setMessage("Ваша почта успешно подтверждена");
    } else if (isError) {
      setMessage("Очень грустно, но ничего не вышло");
    }
  }, [isPending, isSuccess, isError, error]);

  return <div className={styles.content}>{message}</div>;
};

export default EmailVerified;
