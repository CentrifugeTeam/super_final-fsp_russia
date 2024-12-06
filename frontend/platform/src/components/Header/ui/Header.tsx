import { useState } from "react";
import styles from "./header.module.scss";
import Logo from "@/assets/logo_fsp.svg";
import MenuIcon from "@/assets/burger_button.svg"; // Импорт SVG для кнопки

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        <a>Личный кабинет</a>
      </div>
    </div>
  );
};

export default Header;
