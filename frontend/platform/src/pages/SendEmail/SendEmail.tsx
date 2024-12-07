import { useState } from "react";
import { useBackgroundImage } from "@/hooks/useBackgroundImage";
import styles from "./sendemail.module.scss";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { validateEmail } from "@/features/Registration/utils/validators";
import { sendForgotPasswordEmail } from "@/shared/api/password";
import { useMutation } from "@tanstack/react-query";
import Success from "@/assets/success.svg";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate

export const SendEmail = () => {
  useBackgroundImage("./backgroundImg.svg");

  const navigate = useNavigate(); // Создаем объект navigate для перенаправления

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const mutation = useMutation({
    mutationFn: sendForgotPasswordEmail,
    onSuccess: () => {
      setSuccessMessage("Инструкция по сбросу пароля отправлена на ваш email.");
      setEmail(""); // Очистка поля email
    },
    onError: () => {
      setError("Что-то пошло не так.");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const validationError = validateEmail(value);
    setError(validationError);
    setIsButtonDisabled(!!validationError); // Кнопка отключена, если есть ошибка
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!error) {
      mutation.mutate(email);
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
              <Label className="text-[#333333]" htmlFor="email">
                Email
              </Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleInputChange}
              />
              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
            </div>
            <Button
              type="submit"
              className="h-[58px] bg-[#463ACB] text-[16px]"
              disabled={isButtonDisabled || mutation.status === "pending"}
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

export default SendEmail;
