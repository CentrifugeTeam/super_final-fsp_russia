import { RatingEditCard } from "@/components/RatingEditCard";
import styles from "./ratingedit.module.scss";

export const RatingEdit = () => {
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Рейтинг</h1>
      </div>

      <div className={styles.profileEditComponenst}>
        <RatingEditCard />
      </div>
    </div>
  );
};

export default RatingEdit;
