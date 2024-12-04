import styles from "./registrationform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const RegistrationForm = () => {
  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Регистрация</h1>
      <div className="items-center gap-1.5">
        <Label size={"text-lg"} htmlFor="login">Логин</Label>
        <Input type="text" id="login" placeholder="Логин" />
      </div>
      <div className="items-center gap-1.5">
        <Label size={"text-lg"} htmlFor="password">Пароль</Label>
        <Input type="password" id="password" placeholder="Пароль" />
      </div>
      <div className="items-center gap-1.5">
        <Label size={"text-lg"} htmlFor="password">Повторите пароль</Label>
        <Input type="password" id="repeat_password" placeholder="Пароль" />
      </div>
      <Button>Зарегистрироваться</Button>


			<p className={styles.or}>или</p>

      <Button className="bg-[#ffcc00] text-black" onClick={handleYandexLogin}>
        Войти с Яндекс ID
      </Button>
      <Button className="bg-[#0077FF]">Войти через VK ID</Button>
    </div>
  );
};

export default RegistrationForm;
