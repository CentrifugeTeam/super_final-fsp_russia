import styles from "./header.module.scss";
import Logo from "@/assets/logo_fsp.svg";

export const Header = () => {
  return (
    <div className={styles.header}>
      <div>
        <img src={Logo} alt="" />
      </div>
      <div className={styles.links}>
        <a>О нас</a>
        <a>Регионы</a>
        <a> Календарь</a>
        <a>Статистика</a>
        <a>Контакты</a>
        <a>Личный кабинет</a>
      </div>
    </div>
  );
};

export default Header;
