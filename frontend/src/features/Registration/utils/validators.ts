// src/validation.ts

// Validation for names (no symbols)
export const validateName = (value: string): string => {
  const regex = /^[A-Za-zА-Яа-яёЁ]+$/;
  if (!value.trim()) {
    return "Поле обязательно";
  }
  if (!regex.test(value)) {
    return "Имя должно содержать только буквы";
  }
  return "";
};

// Validation for login (no Russian characters)
export const validateLogin = (value: string): string => {
  const regex = /^[A-Za-z0-9]+$/;
  if (!value.trim()) {
    return "Логин обязателен";
  }
  if (!regex.test(value)) {
    return "Логин должен содержать только латинские буквы и цифры";
  }
  return "";
};

// Validation for email (standard email format and no Russian characters)
export const validateEmail = (value: string): string => {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!value.trim()) {
    return "Email обязателен";
  }
  if (!regex.test(value)) {
    return "Введите валидный email";
  }
  return "";
};

// Validation for password (simple non-empty check)
export const validatePassword = (value: string): string => {
  if (!value.trim()) {
    return "Пароль обязателен";
  }
  return "";
};

// Validation for confirm password (matches password)
export const validateConfirmPassword = (
  value: string,
  password: string
): string => {
  if (!value.trim()) {
    return "Подтверждение пароля обязательно";
  }
  if (value !== password) {
    return "Пароли должны совпадать";
  }
  return "";
};

// Check if Step 1 is valid
export const isStep1Valid = (
  name: string,
  surname: string,
  patronymic: string
): boolean => {
  return (
    !validateName(name) && !validateName(surname) && !validateName(patronymic)
  );
};

// Check if Step 2 is valid
export const isStep2Valid = (
  login: string,
  email: string,
  password: string,
  confirmPassword: string
): boolean => {
  return (
    !validateLogin(login) &&
    !validateEmail(email) &&
    !validatePassword(password) &&
    !validateConfirmPassword(confirmPassword, password)
  );
};
