import styles from "./profilebyusername.module.scss";
import { ProfileCard } from "@/components/ProfileEditCard";

export const ProfileByUsername = () => {

  return (
    <div className={styles.content}>
			<ProfileCard />
    </div>
  );
};
