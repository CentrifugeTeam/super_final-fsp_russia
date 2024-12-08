import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/app/redux/store"; // Убедитесь, что этот путь верный
import styles from "./header.module.scss";
import Logo from "@/assets/logo_fsp.svg";
import MenuIcon from "@/assets/burger_button.svg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAuthRedirect = () => {
    if (isAuthenticated) {
      navigate("/profile/edit");
    } else {
      navigate("/login");
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
        <Link to="/about_us">О нас</Link>
        <Link to="/regions">Регионы</Link>
        <a href="https://centrifugo.tech/calendar/?type=FSP">Календарь</a>
        <a>Статистика</a>
        <Link to="/contacts">Контакты</Link>
        <a onClick={handleAuthRedirect}>
          {isAuthenticated ? "Личный кабинет" : "Войти"}
        </a>
      </div>
    </div>
  );
};

export default Header;
