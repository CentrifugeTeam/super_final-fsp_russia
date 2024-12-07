import style from "./roleprofilepanel.module.scss";
import { useUserProfile } from "@/shared/api/getProfile"; // Импортируем хук

export const RoleProfilePanel = () => {
  // Используем хук для получения данных профиля
  const { data: profile, isLoading, isError } = useUserProfile();

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) return <p>Загрузка...</p>;

  // Если произошла ошибка, показываем сообщение об ошибке
  if (isError) return <p>Ошибка при загрузке данных профиля</p>;

  // Проверяем, существует ли representation
  const representation = profile.representation || {};

  // Определяем текст в зависимости от типа представительства
  let roleText = "Представитель не указан";
  if (representation.type === "region") {
    roleText = "Региональный представитель";
  } else if (representation.type === "federal") {
    roleText = "Федеральный представитель";
  }

  // Добавляем условие для отображения информации о регионе
  const regionInfo = representation.name || "Информация о регионе отсутствует";

  return (
    <div className={style.content}>
      <h3 className={style.text}>{roleText}</h3>
      <h3> {regionInfo}</h3>
    </div>
  );
};
