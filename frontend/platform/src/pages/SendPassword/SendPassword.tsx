import { useState, useEffect } from "react";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";
import styles from "./sendpassword.module.scss";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { validatePassword } from "@/features/Registration/utils/validators"; // Ваша валидация пароля
import { resetPassword } from "@/shared/api/password"; // Обновленная функция для сброса пароля
import { useMutation } from "@tanstack/react-query";
import Success from "@/assets/success.svg";
import { useNavigate, useLocation } from "react-router-dom"; // Импортируем useLocation

export const SendPassword = () => {
  useBackgroundImage("./backgroundImg.svg");

  const navigate = useNavigate(); // Создаем объект navigate для перенаправления
  const [password, setPassword] = useState(""); // Состояние для пароля
  const [passwordError, setPasswordError] = useState(""); // Ошибка для пароля
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [token, setToken] = useState<string | null>(null); // Токен из URL

  // Получаем токен из URL, используя useLocation
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token"); // Получаем token из строки запроса
    if (tokenFromUrl) {
      setToken(tokenFromUrl); // Сохраняем токен
    }
  }, [location]);

  // Используем useMutation для сброса пароля
  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      setSuccessMessage("Пароль успешно сброшен.");
      setPassword(""); // Очистка поля пароля
    },
    onError: () => {
      setPasswordError("Что-то пошло не так.");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const validationError = validatePassword(value); // Валидация пароля
    setPasswordError(validationError);

    // Отключаем кнопку, если есть ошибка валидации или запрос в процессе
    setIsButtonDisabled(!!validationError || mutation.status === "pending");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordError && token) {
      mutation.mutate({ token, password }); // Отправляем токен и пароль
    }
  };

  const handleGoToLogin = () => {
    navigate("/login"); // Перенаправляем на страницу входа
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        {successMessage ? (
          // Если запрос прошел успешно, показываем это сообщение
          <div className={styles.success}>
            <h1 className={styles.title}>Успешно!</h1>
            <img
              className="w-[100px] h-[100px] self-center"
              src={Success}
              alt="Success"
            />
            <Button
              className="h-[58px] bg-[#463ACB] text-[16px] mt-5"
              onClick={handleGoToLogin} // Обработчик для перехода на страницу входа
            >
              Перейти на страницу входа
            </Button>
          </div>
        ) : (
          // Если запроса нет или произошла ошибка, показываем форму
          <form onSubmit={handleSubmit}>
            <h1 className={styles.title}>Сброс пароля</h1>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="text-[#333333]" htmlFor="password">
                Новый пароль <span style={{color: '#D82C20'}}>*</span>
              </Label>
              <Input
                type="password"
                id="password"
                placeholder="Новый пароль"
                value={password}
                onChange={handleInputChange}
              />
            </div>

            <Button
              type="submit"
              className="h-[58px] bg-[#463ACB] text-[16px] mt-5"
              disabled={isButtonDisabled}
            >
              {mutation.status === "pending" ? "Отправка..." : "Сбросить"}
            </Button>
            {mutation.isError && (
              <p className="text-red-500 text-sm">Что-то пошло не так.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default SendPassword;
