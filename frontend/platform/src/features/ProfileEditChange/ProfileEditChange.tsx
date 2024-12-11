import { useEffect, useState } from "react";
import { useUpdateUserProfile } from "@/shared/api/updateProfile"; // Хук для обновления профиля
import { useSendVerifyRequest } from "@/shared/api/acceptEmail"; // Хук для отправки email-подтверждения
import { useDispatch, useSelector } from "react-redux"; // Для использования Redux
import { RootState } from "@/app/redux/store"; // Тип для состояния Redux
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import baseAvatar from "../../assets/base_profile_avatar.png";
import { setProfile } from "@/app/redux/slices/profileSlice"; // Мутатор для обновления профиля в Redux

import styles from "./profileeditchange.module.scss";
import { useNavigate } from "react-router-dom";

export const ProfileEditChange = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state: RootState) => state.profile); // Получаем профиль из Redux
  const { mutate: updateProfile, status } = useUpdateUserProfile(); // Получаем статус обновления
  const navigate = useNavigate();

  const { mutate: sendVerificationEmail, status: verificationStatus } =
    useSendVerifyRequest(); // Хук для отправки email подтверждения

  // Локальное состояние для управления полями
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    first_name: profile?.first_name || "",
    middle_name: profile?.middle_name || "",
    last_name: profile?.last_name || "",
    email: profile?.email || "",
    about: profile?.about || "",
    photo_file: null as File | null, // Для хранения файла
    photo_preview_url: profile?.photo_url || baseAvatar, // Для отображения превью
  });

  // Используем useEffect для обновления формы, если данные в Redux изменятся
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        first_name: profile.first_name,
        middle_name: profile.middle_name,
        last_name: profile.last_name,
        email: profile.email,
        about: profile.about,
        photo_file: null,
        photo_preview_url: profile.photo_url || baseAvatar,
      });
    }
  }, [profile]);

  // Обработчик изменений в полях формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Обработчик изменения фото
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file); // Создаем временный URL для отображения

      setFormData((prevData) => ({
        ...prevData,
        photo_file: file, // Сохраняем файл для отправки
        photo_preview_url: previewUrl, // Сохраняем URL для отображения
      }));
    }
  };

  // Функция для отправки данных на сервер
  const handleSave = () => {
    const updatedData = new FormData();
    updatedData.append("username", formData.username);
    updatedData.append("first_name", formData.first_name);
    updatedData.append("middle_name", formData.middle_name);
    updatedData.append("last_name", formData.last_name);
    updatedData.append("email", formData.email);
    updatedData.append("about", formData.about);

    if (formData.photo_file) {
      updatedData.append("file", formData.photo_file); // Добавляем файл, если он есть
    }

    updateProfile(updatedData, {
      onSuccess: (data) => {
        if (data && data.photo_url) {
          setFormData((prevData) => ({
            ...prevData,
            photo_preview_url: data.photo_url, // Обновляем URL после успешного сохранения
          }));
          // Обновляем данные профиля в Redux
          dispatch(setProfile(data));
        }
      },
    });
  };

  // Функция для отправки email-подтверждения
  const handleEmailConfirmation = () => {
    const emailData = { email: formData.email };
    sendVerificationEmail(emailData);
  };

  return (
    <>
      <Button
        className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] self-end"
        onClick={() => {
          navigate("/profile/me");
        }}
      >
        Вернуться в профиль
      </Button>
      <div className={styles.contet}>
        <h1 className={styles.headerText}>Контактные данные</h1>

        <div className={styles.inputAndCheckEmail}>
          <div className="flex flex-col max-w-[350px] h-full">
            <div className={styles.changeAvatar}>
              <img
                src={formData.photo_preview_url || baseAvatar}
                alt="Avatar"
                className="object-cover"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                className="p-0 pl-10 w-full mt-5"
                id="picture"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handlePhotoChange} // Вызываем обработчик изменения фото
              />
            </div>
            <div className={styles.saveButton}>
              <Button
                className="h-[50px] w-[100%] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] mt-7"
                onClick={handleSave}
                disabled={status === "pending"} // Ожидание мутации
              >
                {status === "pending" ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
            <Button
              className="h-[50px] w-[100%] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] mt-7"
              onClick={handleEmailConfirmation}
              disabled={verificationStatus === "pending"} // Ожидание
            >
              {verificationStatus === "pending"
                ? "Отправка..."
                : "Подтвердить почту"}
            </Button>
          </div>
          <div className="gap-3 flex flex-col">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label
                htmlFor="first_name"
                className="text-black font-bold text-lg"
              >
                Имя
              </Label>
              <Input
                className="w-[360px] h-[60px]"
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label
                htmlFor="last_name"
                className="text-black font-bold text-lg"
              >
                Фамилия
              </Label>
              <Input
                className="w-[360px] h-[60px]"
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label
                htmlFor="middle_name"
                className="text-black font-bold text-lg"
              >
                Отчество
              </Label>
              <Input
                className="w-[360px] h-[60px]"
                id="middle_name"
                name="middle_name"
                type="text"
                value={formData.middle_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label className="text-black font-bold text-lg">Email</Label>
              <Input
                className="w-[360px] h-[50px]"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="about" className="text-black font-bold text-lg">
                О себе
              </Label>
              <Input
                className="w-[360px] h-[50px]"
                id="about"
                name="about"
                type="text"
                value={formData.about}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
