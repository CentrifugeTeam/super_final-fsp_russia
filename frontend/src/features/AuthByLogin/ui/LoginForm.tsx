import styles from "./loginform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/features/AuthByLogin/model/authByLogin";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/slices/authSlice";
import { validateLoginLength, validatePasswordLength } from "../../Registration/utils/validators";

export const LoginForm = () => {
  const [loginInput, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, status, error, data } = useLoginMutation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  // Состояния для ошибок
  const [errors, setErrors] = useState({
    login: "",
    password: ""
  });

  // Проверяем, идет ли мутация
  const isLoading = status === "pending";

  // Функция для обработки отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверка длины логина и пароля
    const loginValid = validateLoginLength(loginInput);
    const passwordValid = validatePasswordLength(password);

		if (!loginValid || !passwordValid) {
      if (!loginValid) setLogin("");
      if (!passwordValid) setPassword("");
    }

    // Обновляем ошибки
    setErrors({
      login: loginValid ? "" : "Логин менее 1 символ",
      password: passwordValid ? "" : "Пароль менее 6 символов"
    });

    // Если есть ошибки, не отправляем форму
    if (!loginValid || !passwordValid) {
      return;
    }

    // Если всё валидно, отправляем запрос
    mutate({ login: loginInput, password });
  };

  // Перенаправляем на страницу профиля, если запрос успешен
  useEffect(() => {
    if (status === "success" && data) {
      dispatch(
        login({
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
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div className="items-center">
          <Label size="text-lg" htmlFor="login">
            Логин
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
        </div>
        <div className="items-center">
          <Label size="text-lg" htmlFor="password">
            Пароль
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
        </div>
        <Button
          size="auth"
          type="submit"
          className="bg-[#463ACB] hover:bg-[#3d33b0]"
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Войти"}
        </Button>
      </form>
      {/* Если есть ошибка, отображаем сообщение об ошибке */}
      {error && (
        <p className={styles.errorText}>
          Ошибка авторизации. Попробуйте снова.
        </p>
      )}
      <p className={styles.or}>или</p>

      <Button
        size="auth"
        className="bg-[#FFCC02] text-[#333333] hover:bg-[#e1b400]"
        onClick={handleYandexLogin}
      >
        Войти с Яндекс ID
      </Button>
      <Button size="auth" className="bg-[#0277FF] hover:bg-[#0067dd]">
        Войти через VK ID
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
