import { Button } from "../ui/button";
import styles from "./profileeditcard.module.scss";
import { useUserProfile } from "@/shared/api/getProfile";

export const ProfileCard = () => {
  const { data: profile, isLoading, isError } = useUserProfile();

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) return <p className="text-black">Загрузка...</p>;

  // Если произошла ошибка, показываем сообщение об ошибке
  if (isError)
    return <p className="text-red-500">Ошибка при загрузке данных профиля</p>;

  // Проверка на наличие profile
  if (!profile)
    return <p className="text-red-500">Данные профиля не найдены</p>;

  return (
    <>
      <Button className="h-[50px] bg-[#463ACB] hover:bg-[#3d33b0] text-[20px] self-end">
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
