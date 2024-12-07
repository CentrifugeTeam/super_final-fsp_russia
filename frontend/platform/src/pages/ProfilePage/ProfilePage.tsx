// import { useDispatch } from "react-redux";
// import { logout } from "@/app/redux/slices/authSlice"; // Убедитесь, что путь к вашему authSlice правильный
// import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"
import { ProfileEdit } from "@/features/EditProfile";
import { ProfilePanel } from "@/features/ProfilePanel";
import style from "./profilepage.module.scss";

export const ProfilePage = () => {
	const location = useLocation();
	const activeComponent = location.pathname.split('/').pop();
	console.log(activeComponent)

  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   dispatch(logout()); // Сбрасываем состояние аутентификации
  //   navigate("/login"); // Перенаправляем на страницу логина
  // };

  return (
    <div className={style.profileContent}>
      <div className={style.panel}>
        <ProfilePanel />
      </div>

			<div className={style.content}>
        {/* Условный рендеринг на основе последнего сегмента пути */}
        {activeComponent === 'edit' ? (
          <ProfileEdit />
        ) : (
          <p>Добро пожаловать в ваш профиль!</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
