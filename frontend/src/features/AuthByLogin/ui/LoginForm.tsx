import styles from "./loginform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const LoginForm = () => {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Авторизация</h1>
      <div className="items-center gap-1.5">
        <Label htmlFor="login">Логин</Label>
        <Input type="text" id="login" placeholder="Логин" />
      </div>
      <div className="items-center gap-1.5">
        <Label htmlFor="password">Пароль</Label>
        <Input type="password" id="password" placeholder="Пароль" />
      </div>
      <Button>Войти</Button>
    </div>
  );
};

export default LoginForm;
