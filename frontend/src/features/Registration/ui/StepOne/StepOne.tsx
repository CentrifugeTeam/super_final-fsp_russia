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
}

export const RegistrationStep1: React.FC<RegistrationStep1Props> = ({
  name,
  surname,
  patronymic,
  onNameChange,
  onSurnameChange,
  onPatronymicChange,
}) => {
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [patronymicError, setPatronymicError] = useState("");

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
    </div>
  );
};
