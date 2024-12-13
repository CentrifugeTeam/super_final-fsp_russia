import styles from "./loginform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/features/AuthByLogin/model/authByLogin";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { loginAndFetchProfile } from "@/app/redux/slices/authSlice";
import {
  validateLogin,
  validatePassword,
} from "@/features/Registration/utils/validators";

export const LoginForm = () => {
  const [loginInput, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, status, error, data } = useLoginMutation();
  const nav = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Состояния для ошибок
  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

  // Проверка, идет ли мутация
  const isLoading = status === "pending";

  // Функция для обработки отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация логина и пароля
    const loginError = validateLogin(loginInput);
    const passwordError = validatePassword(password);

    // Обновление состояния ошибок
    setErrors({
      login: loginError,
      password: passwordError,
    });

    // Если есть ошибки валидации, не продолжаем
    if (loginError || passwordError) return;

    // Если все поля валидны, отправляем запрос
    mutate({ login: loginInput, password });
  };

  // Перенаправление на страницу профиля после успешного входа
  useEffect(() => {
    if (status === "success" && data) {
      dispatch(
        loginAndFetchProfile({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        })
      );
      nav("/profile");
    }
  }, [status, data, dispatch, nav]);

  // Обработчик входа через Яндекс
  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://hackcentrifuge.ru/auth_loading";
  };

  // Проверка, валидны ли текущие входные данные
  const isInputValid =
    !validateLogin(loginInput) && !validatePassword(password);

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div className="items-center">
          <Label className="text-[#333333]" size="text-lg" htmlFor="login">
            Логин (английский) <span style={{ color: "#D82C20" }}>*</span>
          </Label>
          <Input
            className="rounded-[5px]"
            type="text"
            id="login"
            placeholder="Логин"
            value={loginInput}
            onChange={(e) => setLogin(e.target.value)}
            errorText={errors.login}
          />
          {errors.login && <p className={styles.errorText}>{errors.login}</p>}
        </div>
        <div className="items-center">
          <Label className="text-[#333333]" size="text-lg" htmlFor="password">
            Пароль <span style={{ color: "#D82C20" }}>*</span>
          </Label>
          <Input
            className="rounded-[5px]"
            type="password"
            id="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={errors.password}
          />
          {errors.password && (
            <p className={styles.errorText}>{errors.password}</p>
          )}
        </div>
        <Button
          size="auth"
          type="submit"
          className="bg-[#463ACB] hover:bg-[#3d33b0]"
          disabled={isLoading || !isInputValid}
        >
          {isLoading ? "Загрузка..." : "Войти"}
        </Button>
      </form>
      <Button
        className=" h-1 p-0 justify-end text-[#919191]"
        variant="link"
        onClick={() => nav("/send_email")}
      >
        Забыли пароль?
      </Button>
      {/* Если есть ошибка, отображаем сообщение об ошибке */}
      {error && (
        <p className="text-red-500">Ошибка авторизации. Попробуйте снова.</p>
      )}
      <p className={styles.or}>или</p>

      <Button
        size="auth"
        className="bg-[#FFCC02] text-[#333333] hover:bg-[#e1b400]"
        onClick={handleYandexLogin}
      >
        Войти с Яндекс ID
      </Button>

      <p className={styles.registerText}>
        Нет аккаунта?
        <span className={styles.link} onClick={() => nav("/registration")}>
          Зарегистрироваться
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
