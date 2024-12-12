import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchProfile } from "@/app/redux/slices/profileSlice";
import { useUserByUsername } from "@/shared/api/getProfile"; // Хук для получения данных пользователя по username
import styles from "./profileeditcard.module.scss";
import { Button } from "../ui/button";

export const ProfileCard = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const username = pathname.split("/").pop(); // Получаем последний сегмент URL как username

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state for the current user's profile
  const {
    profile: reduxProfile,
    isLoading: reduxLoading,
    isError: reduxError,
  } = useAppSelector((state) => state.profile);

  // Call `useUserByUsername` unconditionally
  const {
    data: userProfile,
    isLoading: userLoading,
    isError: userError,
  } = useUserByUsername(username || "");

  // Fetch current user's profile if not already loaded
  useEffect(() => {
    if (!reduxProfile && !reduxLoading && !username) {
      dispatch(fetchProfile());
    }
  }, [dispatch, reduxProfile, reduxLoading, username]);

  // Determine which data to use
  const profile = username ? userProfile : reduxProfile;
  const isLoadingProfile = username ? userLoading : reduxLoading;
  const isErrorProfile = username ? userError : reduxError;

  // Handle loading, error, or missing data states
  if (isLoadingProfile) return <p className="text-black">Загрузка...</p>;
  if (isErrorProfile)
    return <p className="text-red-500">Ошибка при загрузке данных профиля</p>;
  if (!profile)
    return <p className="text-red-500">Данные профиля не найдены</p>;

  // Edit button handler
  const handleEdit = () => {
    navigate("/profile/me/edit");
  };

  const showEditButton = pathname.endsWith("/me");

  return (
    <>
      {showEditButton && (
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
