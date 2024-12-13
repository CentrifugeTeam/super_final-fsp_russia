import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Хук для извлечения параметров URL
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import styles from "./changepassword.module.scss";
import { Button } from "@/components/ui/button";
import { useSendPasswordResetRequest } from "@/shared/api/password";

// Хук для извлечения параметров URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const ChangePassword = () => {
  const query = useQuery();
  const token = query.get("token"); // Извлекаем токен из URL
  const { mutate, isPending, isSuccess, isError, error } =
    useSendPasswordResetRequest();

  const [password, setPassword] = useState<string>(""); // Состояние для пароля
  const [message, setMessage] = useState<string>("");

  // Отправка запроса на сброс пароля
  const handleSubmit = () => {
    if (token && password) {
      mutate({ token, password }); // Отправляем запрос с токеном и паролем
    }
  };

  // Отображение сообщений в зависимости от статуса запроса
  useEffect(() => {
    if (isPending) {
      setMessage("Сброс пароля...");
    } else if (isSuccess) {
      setMessage("Пароль успешно сброшен!");
    } else if (isError) {
      setMessage("Ошибка при сбросе пароля");
    }
  }, [isPending, isSuccess, isError, error]);

  return (
    <div className={styles.content}>
      <form
        className={styles.form}
        onSubmit={(e) => e.preventDefault()} // Отключаем стандартное поведение формы
      >
        <h1>Введите новый пароль</h1>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="text-black text-base mt-[30px]" htmlFor="password">
            Введите новый пароль <span style={{color: '#D82C20'}}>*</span>
          </Label>
          <Input
            type="password"
            id="password"
            placeholder="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Обновляем пароль
          />
          <Button
            type="button" // Используем type="button", чтобы форма не отправлялась при клике
            onClick={handleSubmit} // Вызываем handleSubmit при клике на кнопку
            disabled={isPending}
          >
            {isPending ? "Сброс пароля..." : "Отправить"}
          </Button>
        </div>

        {message && (
          <div className="text-red-500 text-base self-start ml-5 mt-3">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
