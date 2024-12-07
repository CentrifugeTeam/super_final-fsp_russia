import styles from "./profileeditchange.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="full_name" className="text-black font-bold text-lg">
						ФИО
					</Label>

					<Input className="w-[300px] h-[60px]" id="full_name" type="text" />
				</div>

				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label  className="text-black font-bold text-lg">
						Email
					</Label>

					<Input className="w-[300px] h-[50px]" id="picture" type="email" />
				</div>

        <Button className="h-[57px] bg-[#958BFF] text-[20px] mt-8">
          Подтвердить почту
        </Button>
      </div>

      <div className={styles.inputAboutUser}>
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="text" className="text-black font-bold text-lg">
						О Региональном ФСП
					</Label>

					<Input className="w-[360px] h-[50px]"  id="picture" type="text" />
				</div>
      </div>

      <div className={styles.saveButton}>
        <Button className="h-[50px] bg-[#958BFF] text-[20px] mt-7">
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
};
