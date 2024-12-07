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

export const RegistrationForm: React.FC = () => {
  const nav = useNavigate();
  const { mutate: registerUser, isError, error } = useRegisterUserMutation(); // Убрали isSuccess

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (password !== confirmPassword) {
        alert("Пароли не совпадают");
        return;
      }

      const registerData = {
        username: login,
        first_name: name,
        middle_name: patronymic,
        last_name: surname,
        email: email,
        password: password,
        photo: profilePicture || new File([], ""),
      };

      registerUser(registerData, {
        onSuccess: () => {
          setRegistrationSuccess(true);
        },
      });
    }
  };

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

      {registrationSuccess ? (
        <p className="text-green-500">
          Пользователь успешно зарегистрирован! <br />
          <span
            className="text-black self-center"
            onClick={() => nav("/login")}
          >
            Перейти к логину
          </span>
        </p>
      ) : (
        <>
          {step === 1 ? (
            <RegistrationStep1
              name={name}
              surname={surname}
              patronymic={patronymic}
              onNameChange={setName}
              onSurnameChange={setSurname}
              onPatronymicChange={setPatronymic}
              onProfilePictureChange={setProfilePicture}
            />
          ) : (
            <RegistrationStep2
              login={login}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              onLoginChange={setLogin}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
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

          {isError && error && (
            <p className="text-red-500">
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
        </>
      )}
    </div>
  );
};
