import styles from "./footer.module.scss";
import Logo from "@/assets/logo_fsp.svg";
import VkQr from "@/assets/qr_vk.svg";
import TgQr from "@/assets/tg_qr.svg";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const nav = useNavigate();

  return (
    <footer className={styles.footer}>
      <img className={styles.logoDesctop} src={Logo} alt="Логотип" />
      <div>
        <h1>Главное</h1>
        <h2
          onClick={() => {
            nav("/about_us");
          }}
        >
          О нас
        </h2>
        <h2
          onClick={() => {
            nav("/profile/me");
          }}
        >
          Личный кабинет
        </h2>
        <h2>Статистика</h2>
      </div>
      <div className={styles.links}>
        <h1>События</h1>
        <h2
          onClick={() => {
            nav("/regions");
          }}
        >
          Регионы
        </h2>
        <h2
          onClick={() => {
            window.location.href =
              "https://hackcentrifuge.ru/calendar/?type=%D0%A1%D0%9F%D0%9E%D0%A0%D0%A2%D0%98%D0%92%D0%9D%D0%9E%D0%95%20%D0%9F%D0%A0%D0%9E%D0%93%D0%A0%D0%90%D0%9C%D0%9C%D0%98%D0%A0%D0%9E%D0%92%D0%90%D0%9D%D0%98%D0%95";
          }}
        >
          Календарь
        </h2>
      </div>
      <div className={styles.press}>
        <h1>Пресс-служба</h1>
        <h2>press@fsp-russia.com</h2>
      </div>
      <div className={styles.qrs}>
        <img src={VkQr} alt="QR VK" />
        <img className={styles.tgQr} src={TgQr} alt="QR Telegram" />
      </div>
      <div className={styles.contacts}>
        <h1>Контакты</h1>
        <h2>info@fsp-russia.com</h2>
        <h2 className={styles.phone}>+7 (499) 678 03 05</h2>
        <h2
          onClick={() => {
            window.location.href = "https://yandex.ru/maps/-/CHEFZMOA";
          }}
        >
          125047, г. Москва, 2-я Брестская, д.8, этаж 9
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
