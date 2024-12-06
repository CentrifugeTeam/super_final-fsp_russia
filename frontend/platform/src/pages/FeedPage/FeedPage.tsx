import styles from "./feedpage.module.scss";
import { RegiosnData } from "@/features/RegionsData/ui";

export const FeedPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <RegiosnData />
      </div>
    </div>
  );
};

export default FeedPage;
