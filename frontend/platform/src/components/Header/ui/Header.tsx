import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/app/redux/store";
import styles from "./header.module.scss";
import Logo from "@/assets/logo_fsp.svg";
import MenuIcon from "@/assets/burger_button.svg";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Перенаправление на страницу логина
    }
  }, [isAuthenticated, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <a>Регионы</a>
        <a>Календарь</a>
        <a>Статистика</a>
        <a>Контакты</a>
        <a>{isAuthenticated ? "Личный кабинет" : "Войти"}</a>
      </div>
    </div>
  );
};

export default Header;
