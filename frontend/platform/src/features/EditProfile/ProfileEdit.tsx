import styles from "./profileedit.module.scss";
import { Button } from "@/components/ui/button";
import { ProfileEditCard } from "@/components/ProfileEditCard";
import { ProfileEditChange } from "../ProfileEditChange";

export const ProfileEdit = () => {
<<<<<<< HEAD
	const isEdit = true

	return (
		<div className={styles.contet}>
			<div className={styles.header}>
				<h1 className={styles.headerText}>Мой профиль</h1>

				<Button
					className="h-[50px] bg-[#463ACB] text-[20px] mt-4"
				>
					Редактировать профиль
				</Button>
			</div>

			<div className={styles.profileEditComponenst}>
				{
					isEdit ?
						<ProfileEditChange />
					:
						<ProfileEditCard />
				}
			</div>
		</div>
	);
=======
  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Мой профиль</h1>

        <Button className="h-[50px] bg-[#463ACB] text-[20px] mt-5">
          Редактировать профиль
        </Button>
      </div>

      <div className={styles.profileEditComponenst}>
        <ProfileEditCard />
      </div>
    </div>
  );
>>>>>>> d11f0a40ebed821ec4ab9707c74a22a6cdab4eec
};
