import { useDispatch } from "react-redux";
import { logout } from "@/app/redux/slices/authSlice"; // Убедитесь, что путь к вашему authSlice правильный
import { useNavigate } from "react-router-dom";
import style from './profilepage.module.scss'

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout()); // Сбрасываем состояние аутентификации
    navigate("/login"); // Перенаправляем на страницу логина
  };

  return (
    <div className={style.profileContent}>
      <h1>Профиль</h1>
      <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}
      >
        Выйти
      </button>
    </div>
  );
};

export default ProfilePage;
