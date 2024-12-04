import styles from "./loginform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const nav = useNavigate();

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Авторизация</h1>
      <div className="items-center">
        <Label htmlFor="login">Логин</Label>
        <Input
          className="rounded-[5px]"
          type="text"
          id="login"
          placeholder="Логин"
        />
      </div>
      <div className="items-center">
        <Label htmlFor="password">Пароль</Label>
        <Input
          className="rounded-[5px]"
          type="password"
          id="password"
          placeholder="Пароль"
        />
      </div>
      <Button className="bg-[#463ACB] rounded-[5px]">Войти</Button>

      <p className={styles.or}>или</p>
      <Button className="bg-[#FFCC02] rounded-[5px]">Войти с Яндекс ID</Button>
      <Button className="bg-[#0277FF] rounded-[5px]">Войти через VK ID</Button>
      <p className={styles.registerText}>
        Нет аккаунта?
        <span className={styles.link} onClick={() => nav("/login")}>
          Зарегистрироваться
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
