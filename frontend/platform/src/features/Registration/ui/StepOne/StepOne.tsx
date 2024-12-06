import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateName } from "../../utils/validators";

interface RegistrationStep1Props {
  name: string;
  surname: string;
  patronymic: string;
  onNameChange: (value: string) => void;
  onSurnameChange: (value: string) => void;
  onPatronymicChange: (value: string) => void;
  onProfilePictureChange: (file: File | null) => void;
}

export const RegistrationStep1: React.FC<RegistrationStep1Props> = ({
  name,
  surname,
  patronymic,
  onNameChange,
  onSurnameChange,
  onPatronymicChange,
  onProfilePictureChange,
}) => {
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [patronymicError, setPatronymicError] = useState("");

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // Проверка на тип файла (только изображения)
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (validImageTypes.includes(file.type)) {
        onProfilePictureChange(file);
      } else {
        onProfilePictureChange(null);
        alert("Пожалуйста, выберите файл формата JPG, PNG или GIF.");
        // Сбрасываем выбранный файл в поле input
        e.target.value = ""; // Это сбросит выбранный файл в input
      }
    } else {
      onProfilePictureChange(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="name" className="mb-4">
          Имя
        </Label>
        <Input
          type="text"
          id="name"
          placeholder="Введите имя"
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value);
            setNameError(validateName(e.target.value));
          }}
        />
        {nameError && <div>{nameError}</div>}
      </div>

      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="surname">
          Фамилия
        </Label>
        <Input
          type="text"
          id="surname"
          placeholder="Введите фамилию"
          value={surname}
          onChange={(e) => {
            onSurnameChange(e.target.value);
            setSurnameError(validateName(e.target.value));
          }}
        />
        {surnameError && <div>{surnameError}</div>}
      </div>

      <div className="items-center gap-1.5">
        <Label size="text-lg" htmlFor="patronymic">
          Отчество
        </Label>
        <Input
          type="text"
          id="patronymic"
          placeholder="Введите отчество"
          value={patronymic}
          onChange={(e) => {
            onPatronymicChange(e.target.value);
            setPatronymicError(validateName(e.target.value));
          }}
        />
        {patronymicError && <div>{patronymicError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label size="text-lg" htmlFor="picture">
          Фото профиля
        </Label>
        <Input
          className="p-0 pl-10"
          id="picture"
          type="file"
          accept="image/jpeg,image/png,image/gif"
          onChange={handleProfilePictureChange}
        />
      </div>
    </div>
  );
};
