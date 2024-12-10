import style from "./roleprofilepanel.module.scss";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { fetchProfile } from "@/app/redux/slices/profileSlice";

export const RoleProfilePanel = () => {
  const dispatch = useAppDispatch();
  const { profile, isLoading, isError } = useAppSelector(
    (state) => state.profile
  );

  // Загружаем профиль при монтировании компонента
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) return <p>Загрузка...</p>;

  // Если произошла ошибка, показываем сообщение об ошибке
  if (isError) return <p>Ошибка при загрузке данных профиля</p>;

  // Проверяем, существует ли representation
  const representation = profile?.representation;

  // Определяем текст в зависимости от типа представительства
  let roleText = "Представитель не указан";
  if (representation?.type === "region") {
    roleText = "Региональный представитель";
  } else if (representation?.type === "federal") {
    roleText = "Федеральный представитель";
  }

  // Добавляем условие для отображения информации о регионе
  const regionInfo = representation?.name || "Информация о регионе отсутствует";

  return (
    <div className={style.content}>
      <h3 className={style.text}>{roleText}</h3>
      <h3>{regionInfo}</h3>
    </div>
  );
};
