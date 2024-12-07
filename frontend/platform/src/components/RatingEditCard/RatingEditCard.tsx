import styles from "./ratingeditcard.module.scss";

export const RatingEditCard = () => {
  return (
    <div className={styles.content}>
      <div className={styles.table}>
        <h1>Команды</h1>
        <h1>Регион</h1>
        <h1>Рейтинг</h1>
      </div>

      <div className={styles.table2}>
        <h1>Команды</h1>
        <h1>Регион</h1>
        <h1>Рейтинг</h1>
      </div>
    </div>
  );
};

export default RatingEditCard;
