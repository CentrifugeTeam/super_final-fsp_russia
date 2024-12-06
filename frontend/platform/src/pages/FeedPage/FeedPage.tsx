import styles from "./feedpage.module.scss";
import { RegiosnData } from "@/features/RegionsData/ui";

export const FeedPage = () => {
  return (
    <div className={styles.wrapper}>
      <RegiosnData />
    </div>
  );
};

export default FeedPage;
