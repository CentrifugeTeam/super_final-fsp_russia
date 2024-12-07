import styles from "./profileedit.module.scss";
import { Button } from "@/components/ui/button";
import { ProfileEditCard } from "@/components/ProfileEditCard";
// import { ProfileEditChange } from "../ProfileEditChange";

export const ProfileEdit = () => {
  // const isEdit = true;

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Мой профиль</h1>

        <Button className="h-[50px] bg-[#463ACB] text-[20px] mt-4">
          Редактировать профиль
        </Button>
      </div>

      <div className={styles.profileEditComponenst}>
        <ProfileEditCard />
      </div>
    </div>
  );
};
