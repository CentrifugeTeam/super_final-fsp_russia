import { useState, useEffect } from "react";
import { useUserProfile } from "@/shared/api/getProfile"; // Хук для получения данных профиля
import { useUpdateUserProfile } from "@/shared/api/updateProfile"; // Хук для обновления профиля
import { useSendVerifyRequest } from "@/shared/api/acceptEmail"; // Хук для отправки email-подтверждения
import styles from "./profileeditchange.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import baseAvatar from "../../assets/base_profile_avatar.png";

export const ProfileEditChange = () => {
  const { data: userProfile, isLoading, isError } = useUserProfile();
  const { mutate: updateProfile, status } = useUpdateUserProfile(); // Получаем status
  const { mutate: sendVerificationEmail, status: verificationStatus } =
    useSendVerifyRequest(); // Хук для отправки email подтверждения

  // Локальное состояние для управления полями
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    about: "",
    photo_file: null as File | null, // Для хранения самого файла
    photo_url: "", // Для хранения URL, полученного от сервера
    photo_preview_url: "", // Для хранения временного URL изображения (для превью)
  });

  // Обновляем состояние при изменении userProfile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username || "",
        first_name: userProfile.first_name || "",
        middle_name: userProfile.middle_name || "",
        last_name: userProfile.last_name || "",
        email: userProfile.email || "",
        about: userProfile.about || "",
        photo_url: userProfile.photo_url || "", // Получаем URL фото, если он есть
        photo_file: null, // сбрасываем файл при загрузке данных
        photo_preview_url: userProfile.photo_url || "", // Сохраняем URL для отображения
      });
    }
  }, [userProfile]);

  // Обработчик изменений в полях формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Обработчик изменения фото
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file); // Создаем временный URL для отображения

      setFormData({
        ...formData,
        photo_file: file, // Сохраняем сам файл для отправки
        photo_preview_url: previewUrl, // Сохраняем URL для отображения
      });
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

    // Если файл присутствует, добавляем в FormData
    if (formData.photo_file) {
      updatedData.append("file", formData.photo_file); // Здесь "file" — это поле, ожидающее бинарный файл
    }

    // Логирование данных для отладки
    console.log("Sending data:", updatedData);

    // Вызов мутации для отправки данных
    updateProfile(updatedData, {
      onSuccess: (data) => {
        // При успешном обновлении профиля, получаем URL фотографии
        if (data && data.photo_url) {
          setFormData((prevData) => ({
            ...prevData,
            photo_url: data.photo_url, // Сохраняем URL изображения
          }));
        }
      },
    });
  };

  // Функция для отправки email-подтверждения
  const handleEmailConfirmation = () => {
    const emailData = { email: formData.email };
    sendVerificationEmail(emailData, {
      onSuccess: () => {
        console.log("Verification email sent!");
      },
      onError: (error) => {
        console.error("Error sending verification email:", error);
      },
    });
  };

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (isError) {
    return <p>Ошибка при загрузке данных.</p>;
  }

  return (
    <div className={styles.contet}>
      <h1 className={styles.headerText}>Контактные данные</h1>

      <div className={styles.inputAndCheckEmail}>
        <div>
          <div className={styles.changeAvatar}>
            {/* Отображаем превью выбранной картинки или фото из userProfile */}
            <img
              src={formData.photo_preview_url || baseAvatar}
              alt="Avatar"
              className="object-cover"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input
              className="p-0 pl-10 w-[246px] mt-5"
              id="picture"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePhotoChange} // Вызываем обработчик изменения фото
            />
          </div>
          <div className={styles.saveButton}>
            <Button
              className="h-[50px] bg-[#958BFF] text-[20px] mt-7"
              onClick={handleSave}
              disabled={status === "pending"} // Ожидание мутации
            >
              {status === "pending" ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>
          <Button
            className="h-[50px] w-[100%] bg-[#958BFF] text-[20px] mt-7"
            onClick={handleEmailConfirmation} // Отправляем запрос для подтверждения email
            disabled={verificationStatus === "pending"} // Ожидание мутации
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
              placeholder={formData.first_name || "Введите ваше имя"}
              onChange={handleChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="last_name" className="text-black font-bold text-lg">
              Фамилия
            </Label>

            <Input
              className="w-[360px] h-[60px]"
              id="last_name"
              name="last_name"
              type="text"
              placeholder={formData.last_name || "Введите вашу фамилию"}
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
              placeholder={formData.middle_name || "Введите ваше отчество"}
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
              placeholder={formData.email || "Введите ваш email"}
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
              placeholder={formData.about || "Введите информацию о себе"}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
