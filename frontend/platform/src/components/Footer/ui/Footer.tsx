import styles from "./footer.module.scss";
import Logo from "@/assets/logo_fsp.svg";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <img src={Logo} alt="" />
      <div>
        <h1>Главное</h1>
        <h2>О нас</h2>
        <h2>Личный кабинет</h2>
        <h2>Статистика</h2>
      </div>
      <div>
        <h1>Cобытия</h1>
        <h2>Регионы</h2>
        <h2>Календарь</h2>
      </div>
      <div>
        <h1>Пресс-служба</h1>
        <h2>press@fsp-russia.com</h2>
      </div>
      <div>
        <img src="" alt="" />
        <img src="" alt="" />
      </div>
    </div>
  );
};

export default Footer;
