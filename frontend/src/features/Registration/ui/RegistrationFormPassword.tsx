import styles from "./registrationform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePasswordsMatch, validateLoginLength, validatePasswordLength } from "../utils/validators";

export const RegistrationFormPassword = () => {
  const nav = useNavigate();
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");

  const [errors, setErrors] = useState({
    login: "",
    password: "",
    repeatPassword: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Проверки
    const loginValid = validateLoginLength(login);
    const passwordValid = validatePasswordLength(password);
    const passwordsMatch = validatePasswordsMatch(password, repeatPassword);

		if (!loginValid || !passwordValid || !passwordsMatch) {
      if (!loginValid) setLogin("");
      if (!passwordValid) setPassword("");
      if (!passwordsMatch) setRepeatPassword("");
    }

    // Обновляем ошибки в зависимости от проверок
    setErrors({
      login: loginValid ? "" : "Логин менее 1 символа",
      password: passwordValid ? "" : "Пароль менее 6 символов",
      repeatPassword: passwordsMatch ? "" : "Пароли не совпадают"
    });

    // Если все проверки прошли, выполняем переход или другие действия
    if (loginValid && passwordValid && passwordsMatch) {
      nav("/login");
    }
  };

  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Регистрация</h1>
			<form onSubmit={handleSubmit} className="self-center max-w-[400px] w-full h-full flex flex-col gap-[1.1rem]">
        <div className="items-center gap-1.5">
          <Label size="text-lg" htmlFor="username" className="mb-4">Логин</Label>
          <Input
            type="text"
            id="username"
            placeholder="Придумайте логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            errorText={errors.login}
          />
        </div>

        <div className="items-center gap-1.5">
          <Label size="text-lg" htmlFor="password">Пароль</Label>
          <Input
            type="password"
            id="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorText={errors.password}
          />
        </div>

        <div className="items-center gap-1.5">
          <Label size="text-lg" htmlFor="repeat_password">Повторите пароль</Label>
          <Input
            type="password"
            id="repeat_password"
            placeholder="Пароль"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            errorText={errors.repeatPassword}
          />
        </div>

        <Button
          size="auth"
          className="bg-[#463ACB] hover:bg-[#3d33b0]"
          type="submit"
        >
          Зарегистрироваться
        </Button>

        <p className={styles.or}>или</p>

        <Button size="auth" className="bg-[#ffcc00] hover:bg-[#e1b400] text-black" onClick={handleYandexLogin}>
          Войти с Яндекс ID
        </Button>
        <Button size="auth" className="bg-[#0077FF] hover:bg-[#0067dd]">Войти через VK ID</Button>

        <p className={styles.loginText}>
          Уже есть аккаунта?
          <span className={styles.link} onClick={() => nav("/login")}>
            Войти
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegistrationFormPassword;
