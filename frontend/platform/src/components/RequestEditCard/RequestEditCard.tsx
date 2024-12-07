import styles from "./requesteditcard.module.scss";

const RequestEditCard = () => {
  return (
    <div className={styles.content}>
      <div className={styles.card}>
        <div className={styles.left}>
          <h1>Чемпионат России</h1>
          <h2>Продуктовое программирование</h2>
          <h2 className="mt-12">Студенты от 16 лет, 150 участников</h2>
          <h3>Россия, Московская область, Москва</h3>
        </div>
        <div className={styles.right}>
          <h1>14.12.24 по 17.12.24</h1>
          <h2>Оффлайн</h2>
          <div className={styles.status}>Активно</div>
        </div>
      </div>
    </div>
  );
};

export default RequestEditCard;
