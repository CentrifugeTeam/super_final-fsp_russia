import style from "./personinfoprofilepanel.module.scss";
import baseAvatar from "../../assets/base_profile_avatar.png";
import { useUserProfile } from "@/shared/api/getProfile";
import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const PersonInfoProfilePanel = () => {
  const { data: profile, isLoading, isError } = useUserProfile();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <p className="text-black">Загрузка...</p>;
  if (isError)
    return <p className="text-red-500">Ошибка при загрузке данных</p>;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Используем роутинг для редиректа
  };

  return (
    <div className={style.container}>
      <img
        className={style.avatar}
        src={profile.photo_url || baseAvatar}
        alt="Аватар"
      />
      <div className={style.nameAndExit}>
        <h1 className={style.fio}>
          {`${profile.last_name} ${profile.first_name} ${profile.middle_name}`}
        </h1>
        <p className={style.exit} onClick={handleLogout}>
          Выйти
        </p>
      </div>
    </div>
  );
};
