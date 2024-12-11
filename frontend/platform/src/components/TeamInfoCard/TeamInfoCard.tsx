import styles from "./teaminfocard.module.scss";
import { Team } from "@/shared/api/getTeams";
import baseTeamAvatar from "../../assets/base_profile_avatar.png";
import { TeamProfile } from "../TeamProfile";

// Define the props interface for TeamInfoCard
interface TeamInfoCardProps {
  name: string;
  about: string;
  users: Team['users']; // Use the users type from the Team interface
}

export const TeamInfoCard: React.FC<TeamInfoCardProps> = ({ name, about, users }) => {
  return (
    <div className={styles.content}>
			<div className={styles.team}>

				<div className={styles.teamImg}>
					<img className={styles.img} src={baseTeamAvatar} alt="Team Avatar" />
				</div>

				<div className={styles.teamInfo}>
					<h1 className={styles.name}>{name}</h1>
					<hr className={styles.hr} />
					<h3 className={styles.titleOfInfo}>Описание команды</h3>
					<p className={styles.textInfo}>{about}</p>

					<h3 className={styles.titleOfInfo}>Репозитории</h3>
					<p className={styles.textInfo}>{about}</p>
				</div>
			</div>

      <div className={styles.teamUsers}>
        {users.map((user) => (
          <TeamProfile key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default TeamInfoCard;
