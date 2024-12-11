import styles from "./teaminfocard.module.scss";
import { Team } from "@/shared/api/getTeams";
import baseTeamAvatar from "../../assets/base_profile_avatar.png";

export const TeamInfoCard = ({ name, about, users }: Team) => {
  return (
    <div className={styles.content}>
			<div className={styles.teamImg}>
				<img className={styles.img} src={baseTeamAvatar} alt="" />
			</div>

			<div className={styles.teamInfo}>
				<h1 className={styles.name}>{name}</h1>
				<hr />
				<h3 className={styles.titleOfInfo}>Описание команды</h3>
				<p className={styles.textInfo}>{about}</p>

				<h3 className={styles.titleOfInfo}>Пепозиторий</h3>
				<p className={styles.textInfo}>{about}</p>
			</div>
    </div>
  );
};

export default TeamInfoCard;
