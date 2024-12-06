// import { useDispatch } from "react-redux";
// import { logout } from "@/app/redux/slices/authSlice"; // Убедитесь, что путь к вашему authSlice правильный
// import { useNavigate } from "react-router-dom";
import { ProfilePanel } from "@/features/ProfilePanel";
import style from './profilepage.module.scss'

export const ProfilePage = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   dispatch(logout()); // Сбрасываем состояние аутентификации
  //   navigate("/login"); // Перенаправляем на страницу логина
  // };

  return (
    <div className={style.profileContent}>
			<div>
				<ProfilePanel />
			</div>

			<div>

			</div>
    </div>
  );
};

export default ProfilePage;
