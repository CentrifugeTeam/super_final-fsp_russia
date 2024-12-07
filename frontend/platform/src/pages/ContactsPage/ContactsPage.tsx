import styles from "./contactspage.module.scss";
import contactsImg from "../../assets/contacts.png"
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
						<div className={styles.contacts}>
							<h1 className={styles.mainText}>Контакты</h1>

							<p className={styles.email}>info@fsp-russia.com</p>

							<p className={styles.phone}>+7 (499) 678 03 05</p>

							<p>125047, г. Москва,</p>
							<p>2-я Брестская, д.8, этаж 9</p>
						</div>

						<div className={styles.pressService}>
							<h1 className={styles.mainText}>Пресс-служба</h1>
							<p>press@fsp-russia.com</p>
						</div>

						<div>
							<img src={contactsImg} alt="" />
						</div>
					</div>
				</div>

				<Button onClick={(() => navigate("/about_us"))} className='bg-[#463ACB] hover:bg-[#5b4fd5] text-lg h-12 w-full'>
					Вернуться на главную страницу
				</Button>
			</div>
    </div>
  );
};

export default ContactsPage;
