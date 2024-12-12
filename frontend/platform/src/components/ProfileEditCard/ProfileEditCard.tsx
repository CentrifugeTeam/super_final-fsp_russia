import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchProfile } from "@/app/redux/slices/profileSlice";
import { useUserByUsername } from "@/shared/api/getProfile"; // Хук для получения данных пользователя по username
import styles from "./profileeditcard.module.scss";
import { Button } from "../ui/button";

export const ProfileCard = () => {
  // Получаем username из URL, если это профиль другого пользователя
  const location = useLocation();
  const pathname = location.pathname;
  const username = pathname.split('/').pop(); // Получаем последний сегмент URL как username

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Данные профиля из Redux (для текущего пользователя)
  const { profile: reduxProfile, isLoading: reduxLoading, isError: reduxError } = useAppSelector(
    (state) => state.profile
  );

  // Хук для получения данных пользователя по username из API
	const { data: userProfile, isLoading, isError } = username
	? useUserByUsername(username)
	: { data: reduxProfile, isLoading: reduxLoading, isError: reduxError };

  // Логика для загрузки данных профиля
  useEffect(() => {
    if (!reduxProfile && !reduxLoading && !username) {
      dispatch(fetchProfile()); // Если нет username в URL, загружаем профиль текущего пользователя
    }
  }, [dispatch, reduxProfile, reduxLoading, username]);

  // Определяем, какие данные показывать
  const profile = username ? userProfile : reduxProfile;
  const isLoadingProfile = username ? isLoading : reduxLoading;
  const isErrorProfile = username ? isError : reduxError;

  // Обрабатываем состояния загрузки, ошибки и отсутствия данных
  if (isLoadingProfile) return <p className="text-black">Загрузка...</p>;
  if (isErrorProfile) return <p className="text-red-500">Ошибка при загрузке данных профиля</p>;
  if (!profile) return <p className="text-red-500">Данные профиля не найдены</p>;

  // Обработчик редактирования
  const handleEdit = () => {
    navigate("/profile/me/edit"); // Редирект на страницу редактирования
  };

  return (
    <>
      {!username && (
        <Button
          className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] self-end"
          onClick={handleEdit}
        >
          Редактировать профиль
        </Button>
      )}

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
