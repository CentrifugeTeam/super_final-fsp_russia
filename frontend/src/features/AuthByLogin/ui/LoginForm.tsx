import styles from "./loginform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoginMutation } from "@/features/AuthByLogin/model/authByLogin";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/slices/authSlice";

export const LoginForm = () => {
  const [loginInput, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, status, error, data } = useLoginMutation(); // data - это результат успешного запроса
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    mutate({ login: loginInput, password }); // Вызываем мутацию для авторизации с логином и паролем
  };

  // Проверяем, идет ли мутация
  const isLoading = status === "pending";

  // Перенаправляем на страницу профиля, если запрос успешен

  useEffect(() => {
    if (status === "success" && data) {
      // Диспатчим данные в Redux
      dispatch(
        login({
          accessToken: data.access_token, // Используем access_token
          refreshToken: data.refresh_token, // Используем refresh_token
        })
      );
      // Перенаправляем пользователя на страницу профиля
      nav("/profile");
    }
  }, [status, data, dispatch, nav]);

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
            onChange={(e) => setLogin(e.target.value)} // Обновляем состояние логина при изменении
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
            onChange={(e) => setPassword(e.target.value)} // Обновляем состояние пароля при изменении
          />
        </div>
        <Button
          size="auth"
          type="submit"
          className="bg-[#463ACB] hover:bg-[#3d33b0]"
          disabled={isLoading} // Отключаем кнопку, если идет загрузка
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
