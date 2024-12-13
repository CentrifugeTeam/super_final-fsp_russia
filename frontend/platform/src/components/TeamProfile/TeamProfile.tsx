import styles from "./teamprofile.module.scss";
import { User } from "@/shared/api/getTeams";
import { useNavigate } from "react-router-dom";

interface TeamProfileProps {
  user: User;
}

export const TeamProfile: React.FC<TeamProfileProps> = ({ user }) => {
	const navigate = useNavigate();

  return (
    <div className={styles.content}>
      <img className={styles.img} src={user.photo_url || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4UmW5FE0dXoSm3h5meecSKpw0oX1Jk3bZvA&s"} alt={user.username} />
      <div className={styles.userInfo}>
        <h2 onClick={(() => navigate(`/profile/${user.username}`))} className={styles.personName}>{user.first_name}</h2>
      </div>
    </div>
  );
};

export default TeamProfile;
