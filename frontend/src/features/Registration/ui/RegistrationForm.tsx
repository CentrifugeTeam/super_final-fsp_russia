import styles from "./registrationform.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Интерфейс для компонента
interface IRegistrationForm {
  onNextStep: () => void;
}

export const RegistrationForm: React.FC<IRegistrationForm> = ({ onNextStep }) => {
  const nav = useNavigate();

  // Состояния для хранения значений полей и ошибок
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    surname: "",
    patronymic: ""
  });

  // Функция для валидации длины строк
  const validateFieldLength = (fieldValue: string, minLength: number): boolean => {
    return fieldValue.length >= minLength;
  };

  // Обработчик для кнопки "Далее"
  const handleNextStep = () => {
    // Проверка всех полей
    const nameValid = validateFieldLength(name, 1);
    const surnameValid = validateFieldLength(surname, 1);
    const patronymicValid = validateFieldLength(patronymic, 1);

    // Обновление состояния ошибок
    setErrors({
      name: nameValid ? "" : "Имя менее 1 символа",
      surname: surnameValid ? "" : "Фамилия менее 1 символа",
      patronymic: patronymicValid ? "" : "Отчество менее 1 символа"
    });

    // Если все поля валидны, переходим к следующему шагу
    if (nameValid && surnameValid && patronymicValid) {
      onNextStep();
    }
  };

  // Обработчик для Яндекс входа
  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Регистрация</h1>

      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="name" className="mb-[mb-4]">Имя</Label>
        <Input
          type="text"
          id="name"
          placeholder="Введите имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          errorText={errors.name}
        />
      </div>

      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="surname">Фамилия</Label>
        <Input
          type="text"
          id="surname"
          placeholder="Введите фамилию"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          errorText={errors.surname}
        />
      </div>

      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="patronymic">Отчество</Label>
        <Input
          type="text"
          id="patronymic"
          placeholder="Введите отчество"
          value={patronymic}
          onChange={(e) => setPatronymic(e.target.value)}
          errorText={errors.patronymic}
        />
      </div>

      {/* Кнопка "Далее", которая будет вызывать валидацию */}
      <Button
        size="auth"
        className="bg-[#463ACB] hover:bg-[#3d33b0]"
        onClick={handleNextStep}
      >
        Далее
      </Button>

      <p className={styles.or}>или</p>

      <Button
        size="auth"
        className="bg-[#ffcc00] hover:bg-[#e1b400] text-black"
        onClick={handleYandexLogin}
      >
        Войти с Яндекс ID
      </Button>
      <Button
        size="auth"
        className="bg-[#0077FF] hover:bg-[#0067dd]"
      >
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
