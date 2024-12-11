import style from "./personinfoprofilepanel.module.scss";
import baseAvatar from "../../assets/base_profile_avatar.png";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hooks";
import { fetchProfile } from "@/app/redux/slices/profileSlice";
import { logout } from "@/app/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const PersonInfoProfilePanel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { profile, isLoading, isError } = useAppSelector(
    (state) => state.profile
  );

  // Загружаем профиль при монтировании
  useEffect(() => {
    if (!profile) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  if (isLoading) return <p className="text-black">Загрузка...</p>;
  if (isError)
    return <p className="text-red-500">Ошибка при загрузке данных</p>;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Используем роутинг для редиректа
  };

  return (
    <div className={style.container}>
      <div className={style.avatar}>
        <img
          className={style.img}
          src={profile?.photo_url || baseAvatar}
          alt="Аватар"
        />
      </div>

      <div className={style.nameAndExit}>
        <h1 className={style.fio}>{profile?.last_name}</h1>
        <h1 className={style.fio}>{profile?.first_name}</h1>
        <h1 className={style.fio}>{profile?.middle_name}</h1>
        <p className={style.exit} onClick={handleLogout}>
          Выйти
        </p>
      </div>
    </div>
  );
};
