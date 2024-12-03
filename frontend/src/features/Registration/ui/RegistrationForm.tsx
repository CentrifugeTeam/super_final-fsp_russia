import styles from "./registrationform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RegistrationForm = () => {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Регистрация</h1>
      <div className="items-center gap-1.5">
        <Label htmlFor="login">Логин</Label>
        <Input type="text" id="login" placeholder="Логин" />
      </div>
      <div className="items-center gap-1.5">
        <Label htmlFor="password">Пароль</Label>
        <Input type="password" id="password" placeholder="Пароль" />
      </div>
      <div className="items-center gap-1.5">
        <Label htmlFor="password">Повторите пароль</Label>
        <Input type="password" id="repeat_password" placeholder="Пароль" />
      </div>
      <Button>Зарегистрироваться</Button>
      <p className="text-center text-s">или</p>
      <Button className="bg-[#ffcc00] text-black">Войти с Яндекс ID</Button>
      <Button className="bg-[#0077FF]">Войти через VK ID</Button>
    </div>
  );
};

export default RegistrationForm;
