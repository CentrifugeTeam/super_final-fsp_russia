import styles from "./registrationform.module.scss";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../model/registration";
import { RegistrationStep1 } from "../ui/StepOne";
import { RegistrationStep2 } from "../ui/StepTwo";
import {
  isStep1Valid,
  isStep2Valid,
} from "@/features/Registration/utils/validators";

// Интерфейс для компонента
export const RegistrationForm: React.FC = () => {
  const nav = useNavigate();
  const { mutate: registerUser, isError, error } = useRegisterUserMutation(); // Get error state from mutation

  // Состояния для хранения значений полей
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Добавили новое состояние

  // Состояние для отслеживания текущего шага
  const [step, setStep] = useState(1); // 1 - шаг с именем, фамилией и отчеством, 2 - шаг с логином и паролем

  // Обработчик для кнопки "Далее"
  const handleNextStep = () => {
    if (step === 1) {
      setStep(2); // Переходим ко второму шагу
    } else if (step === 2) {
      // Проверка совпадения пароля и подтверждения пароля
      if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return;
      }

      // Создаем объект для регистрации
      const registerData = {
        username: login,
        first_name: name,
        middle_name: patronymic,
        last_name: surname,
        email: email,
        password: password,
        // Передаем пустой файл, если фото не добавлено
        photo: new File([], ""),
      };

      // Отправляем данные на сервер
      registerUser(registerData);
    }
  };

  // Обработчик для Яндекс входа
  const handleYandexLogin = () => {
    window.location.href =
      "https://oauth.yandex.ru/authorize?force_confirm=1&client_id=91926807198745df874fea559c810a19&response_type=code&redirect_uri=https://centrifugo.tech/auth_loading";
  };

  const isCurrentStepValid =
    step === 1
      ? isStep1Valid(name, surname, patronymic)
      : isStep2Valid(login, email, password, confirmPassword);

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Регистрация</h1>

      {step === 1 ? (
        <RegistrationStep1
          name={name}
          surname={surname}
          patronymic={patronymic}
          onNameChange={setName}
          onSurnameChange={setSurname}
          onPatronymicChange={setPatronymic}
        />
      ) : (
        <RegistrationStep2
          login={login}
          email={email}
          password={password}
          confirmPassword={confirmPassword} // Передаем состояние для подтверждения пароля
          onLoginChange={setLogin}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword} // Обработчик изменения подтверждения пароля
        />
      )}

      <Button
        size="auth"
        className={`bg-[#463ACB] hover:bg-[#3d33b0] ${
          !isCurrentStepValid && "disabled:opacity-50"
        }`}
        onClick={handleNextStep}
        disabled={!isCurrentStepValid}
      >
        Далее
      </Button>

      {/* Show error message if registration fails */}
      {isError && error && (
        <p className={styles.errorMessage}>
          {error.response?.data?.message ||
            "Ошибка регистрации. Попробуйте снова."}
        </p>
      )}

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
