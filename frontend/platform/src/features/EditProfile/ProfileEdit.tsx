import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileEditCard } from "@/components/ProfileEditCard";
import { ProfileEditChange } from "../ProfileEditChange";
import styles from "./profileedit.module.scss";

export const ProfileEdit = () => {
  const [isEdit, setIsEdit] = useState(false);

  const toggleEdit = () => {
    setIsEdit(!isEdit); // Переключаем состояние редактирования
  };

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Мой профиль</h1>

        <Button className="h-[50px] bg-[#463ACB] text-[20px] mt-4" onClick={toggleEdit}>
          {isEdit ? "Вернуться назад" : "Редактировать профиль"}</Button>
      </div>

      <div className={styles.profileEditComponenst}>
        {isEdit ? <ProfileEditChange /> : <ProfileEditCard />}
      </div>
    </div>
  );
};
