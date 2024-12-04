import styles from "./loginform.module.scss"; // Импорт стилей для формы
import { Button } from "@/components/ui/button"; // Импорт кнопки
import { Input } from "@/components/ui/input"; // Импорт поля ввода
import { Label } from "@/components/ui/label"; // Импорт метки для полей
import { useNavigate } from "react-router-dom"; // Импорт хука для навигации
import { useState } from "react"; // Импорт хука состояния
import { useLoginMutation } from "@/features/AuthByLogin/model/authByLogin"; // Импорт хука для мутации авторизации

export const LoginForm = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, status, error } = useLoginMutation();
  const nav = useNavigate();

  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    mutate({ login, password }); // Вызываем мутацию для авторизации с логином и паролем
  };

  // Проверяем, идет ли мутация
  const isLoading = status === "pending";

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
            value={login}
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
          {isLoading ? "Загрузка..." : "Войти"} {/* Текст на кнопке */}
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
