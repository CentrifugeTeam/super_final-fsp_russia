import styles from "./contactspage.module.scss";
import contactsImg from "../../assets/contacts.png"
import vk from "../../assets/mobile_vk_qr_contact.png"
import tg from "../../assets/mobile_tg_qr_contact.png"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ContactsPage = () => {
	const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
			<div className={styles.content}>
				<h3 className={styles.nameOfPage}>Контакты</h3>

				<div className={styles.block}>
					<div className={styles.block2}>
						<div className={styles.mobileQr}>
							<img className={`${styles.vk} ${styles.img}`} src={vk} alt="" />

							<img className={`${styles.tg} ${styles.img}`} src={tg} alt="" />
						</div>

						<div className={styles.textInfo}>
							<div className={styles.contacts}>
								<h1 className={styles.mainText}>Контакты</h1>

								<p className={`${styles.email} ${styles.text}`}>info@fsp-russia.com</p>

								<p className={`${styles.phone} ${styles.text}`}>+7 (499) 678 03 05</p>

								<p className={styles.text}>125047, г. Москва,</p>
								<p className={styles.text}>2-я Брестская, д.8, этаж 9</p>
							</div>

							<div className={styles.pressService}>
								<h1 className={styles.mainText}>Пресс-служба</h1>
								<p className={styles.text}>press@fsp-russia.com</p>
							</div>
						</div>

						<div className={styles.desctopQr}>
							<img src={contactsImg} alt="" />
						</div>
					</div>
				</div>

				<div className={styles.button}>
					<Button onClick={(() => navigate("/about_us"))} className='bg-[#463ACB] hover:bg-[#5b4fd5] text-lg h-12 w-full'>
						Вернуться на главную страницу
					</Button>
				</div>
			</div>
    </div>
  );
};

export default ContactsPage;
