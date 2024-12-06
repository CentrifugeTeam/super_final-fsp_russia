import styles from "./footer.module.scss";
import Logo from "@/assets/logo_fsp.svg";
import VkQr from "@/assets/qr_vk.svg";
import TgQr from "@/assets/tg_qr.svg";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <img className={styles.logo} src={Logo} alt="" />
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
      <div className={styles.press}>
        <h1>Пресс-служба</h1>
        <h2>press@fsp-russia.com</h2>
      </div>
      <div className={styles.qrs}>
        <img src={VkQr} alt="" />
        <img src={TgQr} alt="" />
      </div>
      <div>
        <h1>Контакты</h1>
        <h2>info@fsp-russia.com</h2>
        <h2>+7 (499) 678 03 05</h2>
        <h2>125047, г. Москва, 2-я Брестская, д.8, этаж 9</h2>
      </div>
    </div>
  );
};

export default Footer;
