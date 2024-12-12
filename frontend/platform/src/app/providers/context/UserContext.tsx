import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Типы для данных пользователя
interface UserContextType {
  role: string | null;
  setRole: (role: string) => void;
}

// Создаем контекст с начальными значениями
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [role, setRole] = useState<string | null>(null);

  // Извлекаем роль пользователя из токена
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Декодируем payload токена
        if (payload.roles) {
          setRole(payload.roles[0]); // Предположим, что роль одна
        }
      } catch (error) {
        console.error('Ошибка при парсинге токена:', error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для получения данных из контекста
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
