import styles from "./registrationform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export const RegistrationForm = () => {
  const nav = useNavigate();

  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Регистрация</h1>
      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="login" className="mb-[mb-4]">
          Логин
        </Label>
        <Input type="text" id="login" placeholder="Логин" />
      </div>
      <div className="items-center gap-1.5">
        <Label size={"text-lg"} htmlFor="password">
          Пароль
        </Label>
        <Input type="password" id="password" placeholder="Пароль" />
      </div>
      <div className="items-center gap-1.5">
        <Label size={"text-lg"} htmlFor="password">
          Повторите пароль
        </Label>
        <Input type="password" id="repeat_password" placeholder="Пароль" />
      </div>
      <Button size="auth" className="bg-[#463ACB] hover:bg-[#3d33b0]">
        Зарегистрироваться
      </Button>

      <p className={styles.or}>или</p>

      <Button
        size="auth"
        className="bg-[#ffcc00] hover:bg-[#e1b400] text-black"
        onClick={handleYandexLogin}
      >
        Войти с Яндекс ID
      </Button>
      <Button size="auth" className="bg-[#0077FF] hover:bg-[#0067dd]">
        Войти через VK ID
      </Button>
      <p className={styles.loginText}>
        Уже есть аккаунта?
        <span className={styles.link} onClick={() => nav("/login")}>
          Войти
        </span>
      </p>
    </div>
  );
};

export default RegistrationForm;
