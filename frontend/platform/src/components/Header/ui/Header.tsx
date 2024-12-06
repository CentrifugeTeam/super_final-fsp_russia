import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/app/redux/store"; // Ensure this path is correct
import styles from "./header.module.scss";
import Logo from "@/assets/logo_fsp.svg";
import MenuIcon from "@/assets/burger_button.svg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  ); // Check if the user is authenticated
  const navigate = useNavigate(); // Use navigate to redirect to login or profile page

  // Toggle the menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle redirect to the appropriate page based on authentication
  const handleAuthRedirect = () => {
    if (isAuthenticated) {
      navigate("/profile"); // Navigate to profile if authenticated
    } else {
      navigate("/login"); // Navigate to login if not authenticated
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.logoMenu}>
        <img src={Logo} alt="Логотип" className={styles.logo} />
        <img
          src={MenuIcon}
          alt="Меню"
          className={styles.menuIcon}
          onClick={toggleMenu}
        />
      </div>
      <div className={`${styles.links} ${isMenuOpen ? styles.open : ""}`}>
        <a>О нас</a>
        <Link to="/regions">Регионы</Link>
        <a>Календарь</a>
        <a>Статистика</a>
        <a>Контакты</a>
        <a onClick={handleAuthRedirect}>
          {isAuthenticated ? "Личный кабинет" : "Войти"}
        </a>
      </div>
    </div>
  );
};

export default Header;
