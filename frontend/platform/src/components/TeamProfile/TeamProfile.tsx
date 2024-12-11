import styles from "./teamprofile.module.scss";
import baseTeamAvatar from "../../assets/base_profile_avatar.png";
import { User } from "@/shared/api/getTeams";

interface TeamProfileProps {
  user: User;
}

export const TeamProfile: React.FC<TeamProfileProps> = ({ user }) => {
  return (
    <div className={styles.content}>
      <img className={styles.img} src={user.photo_url || baseTeamAvatar} alt={user.username} />
      <div className={styles.userInfo}>
        <h2 className={styles.personName}>{user.first_name}</h2>
      </div>
    </div>
  );
};

export default TeamProfile;
