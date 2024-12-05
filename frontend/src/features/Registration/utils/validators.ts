// Функция для проверки, совпадают ли пароли
export const validatePasswordsMatch = (password: string, repeatPassword: string): boolean => {
  return password === repeatPassword;
};

// Функция для проверки, что логин больше 1 символа
export const validateLoginLength = (login: string): boolean => {
  return login.length >= 1;
};

// Функция для проверки минимальной длины пароля
export const validatePasswordLength = (password: string): boolean => {
  return password.length >= 6;
};
