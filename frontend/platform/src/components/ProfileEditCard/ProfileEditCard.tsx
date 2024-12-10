import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchProfile, setProfile } from "@/app/redux/slices/profileSlice";
import styles from "./profileeditcard.module.scss";
import { Button } from "../ui/button";

export const ProfileCard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, isLoading, isError } = useAppSelector(
    (state) => state.profile
  );

  // Загружаем профиль только если он не был загружен ранее
  useEffect(() => {
    if (!profile && !isLoading) {
      // Добавляем проверку, чтобы запрос не выполнялся, если данные уже загружены
      dispatch(fetchProfile());
    }
  }, [dispatch, profile, isLoading]); // Даем зависимости для отслеживания состояния

  if (isLoading) return <p className="text-black">Загрузка...</p>;
  if (isError)
    return <p className="text-red-500">Ошибка при загрузке данных профиля</p>;
  if (!profile)
    return <p className="text-red-500">Данные профиля не найдены</p>;

  const handleEdit = () => {
    dispatch(setProfile(profile)); // Передаем данные профиля в Redux
    navigate("/profile/me/edit"); // Редирект на страницу редактирования
  };

  return (
    <>
      <Button
        className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] self-end"
        onClick={handleEdit}
      >
        Редактировать профиль
      </Button>

      <div className={styles.card}>
        <div className={styles.imgContainer}>
          <img
            className={styles.img}
            src={profile.photo_url || "/default-photo.jpg"}
            alt="Profile"
          />
        </div>
        <div className={styles.personData}>
          <div className={styles.header}>
            <h1 className={styles.fio}>
              {profile.middle_name} {profile.first_name} {profile.last_name}
            </h1>
            {profile.is_superuser && (
              <p className={styles.personIfo}>Суперадминистратор</p>
            )}
          </div>

          <hr />

          <div>
            <h2 className={styles.info}>Контакты</h2>
            <p className={styles.personIfo}>{profile.email}</p>

            <h2 className={styles.info}>О ФСП</h2>
            <p className={styles.personIfo}>{profile.about}</p>
          </div>
        </div>
      </div>
    </>
  );
};
