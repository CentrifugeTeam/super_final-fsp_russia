import styles from "./profilepanel.module.scss";
import { RoleProfilePanel } from "@/components/RoleProfilePanel";
import { PersonInfoProfilePanel } from "@/components/PersonInfoProfilePanel";

export const ProfilePanel = () => {
	return (
		<div className={styles.profilePanel}>
			<div className={styles.role}>
				<RoleProfilePanel />
			</div>

			<div className={styles.personInfo}>
				<PersonInfoProfilePanel />
			</div>
			<hr className={styles.hr} />

			<div className={styles.actives}>
				<h3 className={styles.active}>Мой профиль</h3>
				<h3 className={styles.active}>Заявки</h3>
			</div>
		</div>
	);
};

export default ProfilePanel;
