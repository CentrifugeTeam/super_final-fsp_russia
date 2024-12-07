import styles from "./profileeditchange.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import baseAvatar from "../../assets/base_profile_avatar.png";

export const ProfileEditChange = () => {
  return (
    <div className={styles.contet}>
      <h1 className={styles.headerText}>Контактные данные</h1>

      <div className={styles.changeAvatar}>
        <img src={baseAvatar} alt="" />

        <div className={styles.imgInfo}>
          <h1 className={styles.mainTextImg}>Обновить фотографию</h1>
          <p className={styles.infoAboutImg}>Не больше 5 Мб</p>
          <p className={styles.infoAboutImg}>
            Допустимый формат файла - .png .jpg
          </p>
        </div>
      </div>

      <div className={styles.inputAndCheckEmail}>
        <Input />
        <Input />
        <Button className="h-[57px] bg-[#958BFF] text-[25px]">
          Подтвердить почту
        </Button>
      </div>

      <div className={styles.inputAboutUser}>
        <Input />
      </div>

      <div className={styles.saveButton}>
        <Button className="h-[50px] bg-[#958BFF] text-[25px] mt-7">
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};
