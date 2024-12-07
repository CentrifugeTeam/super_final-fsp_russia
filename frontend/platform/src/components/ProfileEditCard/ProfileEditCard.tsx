import styles from "./profileeditcard.module.scss";
import baseAvatar from "../../assets/base_profile_avatar.png";

export const ProfileEditCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.imgContainer}>
        <img className={styles.img} src={baseAvatar} alt="" />
      </div>
      <div className={styles.personData}>
        <div className={styles.header}>
          <h1 className={styles.fio}>Артур Михайлович Лукавин</h1>
          <p className={styles.personIfo}>Суперадминистратор</p>
        </div>
        <hr />

        <div>
          <h2 className={styles.info}>Контакты</h2>
          <p className={styles.personIfo}>belgorod@fsp-russia.com</p>

          <h2 className={styles.info}>О себе</h2>
          <p className={styles.personIfo}>Руководитель и представитель</p>
        </div>
      </div>
    </div>
  );
};
